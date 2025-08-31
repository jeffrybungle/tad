@echo off
REM === Start Flask Backend ===
start cmd /k "cd backend && python app.py"

REM === Start Vue Frontend ===
start cmd /k "cd frontend && npm run serve"

REM === Open frontend in default browser ===
timeout /t 5 >nul
start http://localhost:8080

echo Both servers launched and browser opened.
