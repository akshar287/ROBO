export enum AgentState {
  ON = "ON",
  OFF = "OFF",
}

export enum DeviceType {
  LAPTOP = "laptop",
  ANDROID = "android",
  WEBSITE = "website",
  SERVER = "server",
}

export enum TaskStatus {
  PENDING_APPROVAL = "pending_approval",
  APPROVED = "approved",
  REJECTED = "rejected",
  QUEUED = "queued",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

export enum TaskPriority {
  LOW = "low",
  NORMAL = "normal",
  HIGH = "high",
  CRITICAL = "critical",
}

export enum ActionType {
  // Laptop actions
  LAUNCH_APP = "launch_app",
  CLOSE_APP = "close_app",
  BROWSER_OPEN = "browser_open",
  BROWSER_SEARCH = "browser_search",
  BROWSER_SCRAPE = "browser_scrape",
  FILE_READ = "file_read",
  FILE_WRITE = "file_write",
  FILE_LIST = "file_list",
  DESKTOP_NOTIFY = "desktop_notify",

  // Android actions
  OPEN_APP = "open_app",
  PLAY_STORE_SEARCH = "play_store_search",
  DIAL_PHONE = "dial_phone",
  SEND_SMS_DRAFT = "send_sms_draft",
  WHATSAPP_DRAFT = "whatsapp_draft",
  ANDROID_NOTIFY = "android_notify",

  // Server / AI actions
  GMAIL_LIST_UNREAD = "gmail_list_unread",
  GMAIL_SUMMARIZE = "gmail_summarize",
  GMAIL_DRAFT_REPLY = "gmail_draft_reply",
  GMAIL_SEND = "gmail_send",
  CALL_INITIATE_AI = "call_initiate_ai",
  VOICE_SPEAK = "voice_speak",
}

export interface TaskStep {
  step_id: string;
  target_device: DeviceType;
  action: ActionType;
  parameters: Record<string, any>;
  status: TaskStatus;
  result?: any;
  error?: string;
  requires_approval: boolean;
  started_at?: string;
  completed_at?: string;
}

export interface Task {
  task_id: string;
  user_id: string;
  original_prompt: string;
  detected_language: string;
  priority: TaskPriority;
  status: TaskStatus;
  steps: TaskStep[];
  requires_approval: boolean;
  approval_reason?: string;
  created_at: string;
  updated_at: string;
  execution_log: string[];
}

export interface DeviceInfo {
  device_id: string;
  device_name: string;
  device_type: DeviceType;
  os_version?: string;
  capabilities: string[];
  is_online: boolean;
  last_seen: string;
  battery_level?: number;
  is_charging?: boolean;
}

export interface WebSocketMessage {
  type: string;
  source: DeviceType;
  target?: DeviceType;
  payload: Record<string, any>;
  timestamp: string;
}
