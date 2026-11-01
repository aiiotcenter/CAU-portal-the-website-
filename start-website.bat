@echo off
title CAU University Website Server
cd /d "%~dp0"

echo ========================================================
echo   Cyprus Aydin University (CAU) — Official Website
echo ========================================================
echo.
echo [1/3] Preparing environment...

:: Launch browser automatically once server starts responding on port 3000
start "" powershell -NoProfile -WindowStyle Hidden -Command "$url = 'http://localhost:3000/'; $ready = $false; for ($i=0; $i -lt 30; $i++) { Start-Sleep -Milliseconds 500; try { $r = [System.Net.WebRequest]::Create($url); $r.Timeout = 1000; $resp = $r.GetResponse(); if ($resp) { $resp.Close(); $ready = $true; break; } } catch {} }; if ($ready) { Start-Process $url }"

echo [2/3] Starting server on http://localhost:3000 ...
echo [3/3] The website will automatically open in your default browser once ready!
echo.
echo Keep this terminal window open while viewing the website.
echo To stop the server, press Ctrl+C or close this window.
echo ========================================================
echo.

:: Try pnpm first, fall back to npx tsx, then production node dist/index.js
where pnpm >nul 2>nul
if %ERRORLEVEL% EQU 0 (
  call pnpm exec cross-env NODE_ENV=development tsx server/_core/index.ts
) else (
  where npx >nul 2>nul
  if %ERRORLEVEL% EQU 0 (
    call npx cross-env NODE_ENV=development tsx server/_core/index.ts
  ) else (
    call node dist/index.js
  )
)

pause
