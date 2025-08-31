@echo off
REM === Flask Backend ===
start cmd /k "cd backend && python app.py"

REM === Vue Frontend ===
start cmd /k "cd frontend && npm run serve"

echo Servers launching...
