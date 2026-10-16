@echo off
title ROBO Laptop Agent
color 0b
echo ===================================================
echo             ROBO LAPTOP AGENT
echo      Personal AI Assistant for Windows
echo ===================================================
echo.
echo Starting ROBO desktop connection to backend...
python "%~dp0agent.py"
pause
