import uuid
import json
from datetime import datetime
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import select

from backend.app.db.models import TaskModel, TaskStepModel, SystemState, Contact
from backend.app.services.ai_brain import AIBrainService
from backend.app.services.whatsapp_service import WhatsAppZeroTokenService
from backend.app.services.calling_service import CallingZeroTokenService
from backend.app.services.email_service import EmailZeroTokenService
from backend.app.services.device_manager import device_manager

class TaskOrchestrator:
    """
    Orchestrates natural language commands into structured multi-device tasks
    using the Generative AI Brain (Ollama / LLM / Dynamic Composer).
    """

    @classmethod
    async def process_prompt(cls, db: Session, user_id: int, prompt: str) -> Dict[str, Any]:
        # 1. Verify Master Agent State (must be ON)
        state_result = db.execute(select(SystemState).where(SystemState.id == 1))
        system_state = state_result.scalar_one_or_none()
        current_state = system_state.agent_state if system_state else "ON"

        if current_state != "ON":
            return {
                "success": False,
                "agent_state": "OFF",
                "message": "ROBO is currently turned OFF. Please turn Jarvis ON from the dashboard to execute tasks.",
                "spoken_response": "રોબો હાલમાં બંધ છે. કૃપા કરીને ડેશબોર્ડ પરથી ચાલુ કરો."
            }

        # 2. Retrieve user contacts
        contacts_result = db.execute(select(Contact).where(Contact.user_id == user_id))
        contacts_records = contacts_result.scalars().all()
        contacts_list = [
            {"name": c.name, "aliases": c.aliases or "", "phone_number": c.phone_number, "email": c.email}
            for c in contacts_records
        ]

        # 3. Use Generative AI Brain to decide and craft content dynamically!
        parsed = await AIBrainService.decide_and_generate(prompt, contacts_list)
        task_id = f"task_{uuid.uuid4().hex[:8]}"
        step_id = f"step_{uuid.uuid4().hex[:8]}"

        action = parsed.get("action", "voice_speak")
        target_device = parsed.get("target_device", "server")
        params = parsed.get("parameters", {})
        requires_approval = parsed.get("requires_approval", False)

        # 4. Enrich action with Zero-Token services
        if action == "send_email":
            recipient = params.get("recipient", "thakkarkrina157@gmail.com")
            subject = params.get("subject", "Message from ROBO")
            body = params.get("body", "Hello")
            email_payload = EmailZeroTokenService.prepare_email_action(recipient, subject, body)
            params.update(email_payload)

            # Dispatch web compose URL to laptop
            dispatch_message = {
                "type": "execute_task",
                "task_id": task_id,
                "step_id": step_id,
                "action": "browser_open",
                "parameters": {"url": email_payload["web_gmail_url"]}
            }
            await device_manager.send_to_device_type("laptop", dispatch_message)

        elif action == "whatsapp_draft":
            phone = params.get("phone_number", "+919876543210")
            msg = params.get("message", "Hello from ROBO!")
            wp_payload = WhatsAppZeroTokenService.generate_whatsapp_payload(phone, msg)
            params.update(wp_payload)

        elif action == "dial_phone":
            phone = params.get("phone_number", "+919876543210")
            name = params.get("contact_name", "Contact")
            call_payload = CallingZeroTokenService.generate_call_payload(name, phone)
            params.update(call_payload)

        elif action == "gmail_summarize":
            summary = EmailZeroTokenService.summarize_unread()
            params["summary"] = summary["summary"]
            params["emails"] = summary["emails"]

        # 5. Create Task and TaskStep in DB
        initial_status = "pending_approval" if requires_approval else "completed"
        task_record = TaskModel(
            task_id=task_id,
            user_id=user_id,
            original_prompt=prompt,
            detected_language=parsed.get("detected_language", "en"),
            priority="normal",
            status=initial_status,
            requires_approval=requires_approval,
            result_summary=parsed.get("spoken_response", "Task dispatched"),
            execution_log=json.dumps([f"[{datetime.utcnow().strftime('%H:%M:%S')}] AIBrain: {parsed.get('thought', 'Action selected: ' + action)}"])
        )
        db.add(task_record)

        step_record = TaskStepModel(
            step_id=step_id,
            task_id=task_id,
            target_device=target_device,
            action=action,
            parameters_json=json.dumps(params),
            status=initial_status,
            requires_approval=requires_approval
        )
        db.add(step_record)
        db.commit()

        # 6. Dispatch command to target devices
        dispatched_count = 0
        if not requires_approval:
            dispatch_message = {
                "type": "execute_task",
                "task_id": task_id,
                "step_id": step_id,
                "action": action,
                "target_device": target_device,
                "parameters": params,
                "timestamp": datetime.utcnow().isoformat()
            }
            if target_device in ["android", "laptop"]:
                dispatched_count = await device_manager.send_to_device_type(target_device, dispatch_message)

        # 7. Broadcast task creation to website dashboards
        await device_manager.broadcast_to_websites({
            "type": "task_updated",
            "task_id": task_id,
            "status": task_record.status,
            "prompt": prompt,
            "spoken_response": parsed.get("spoken_response", "Task dispatched"),
            "target_device": target_device,
            "action": action,
            "parameters": params
        })

        return {
            "success": True,
            "task_id": task_id,
            "status": task_record.status,
            "target_device": target_device,
            "action": action,
            "parameters": params,
            "detected_language": parsed.get("detected_language", "en"),
            "spoken_response": parsed.get("spoken_response", "Task dispatched"),
            "dispatched_to_device_count": dispatched_count
        }

    @classmethod
    async def approve_task(cls, db: Session, task_id: str) -> Dict[str, Any]:
        task_result = db.execute(select(TaskModel).where(TaskModel.task_id == task_id))
        task = task_result.scalar_one_or_none()
        if not task:
            return {"success": False, "error": "Task not found"}

        task.status = "completed"
        task.add_log("Approved by user. Executing action.")
        
        steps_result = db.execute(select(TaskStepModel).where(TaskStepModel.task_id == task_id))
        steps = steps_result.scalars().all()
        for step in steps:
            step.status = "completed"
            await device_manager.send_to_device_type(step.target_device, {
                "type": "execute_task",
                "task_id": task.task_id,
                "step_id": step.step_id,
                "action": step.action,
                "parameters": step.get_parameters(),
                "status": "approved"
            })

        db.commit()
        await device_manager.broadcast_to_websites({
            "type": "task_updated",
            "task_id": task.task_id,
            "status": "completed"
        })
        return {"success": True, "task_id": task_id, "status": "completed"}
