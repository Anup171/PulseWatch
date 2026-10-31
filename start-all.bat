@echo off
echo Starting PulseWatch...
echo.
echo [1/3] Starting backend on http://localhost:8000
start "PulseWatch Backend" cmd /k "cd /d backend && .venv\Scripts\uvicorn.exe main:app --reload --host 0.0.0.0 --port 8000"
timeout /t 3 /nobreak >nul
echo [2/3] Serving docs-site on http://localhost:3000
start "PulseWatch Docs" cmd /k "cd /d docs-site && npm run start"
timeout /t 3 /nobreak >nul
echo [3/3] Starting frontend on http://localhost:5173
start "PulseWatch Frontend" cmd /k "cd /d frontend && npm run dev"
echo.
echo All three services are starting in separate windows.
