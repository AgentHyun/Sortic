@echo off
set BASH_PATH=%ProgramFiles%\Git\bin\bash.exe

if exist "%BASH_PATH%" (
    "%BASH_PATH%" setup/setup.sh
) else (
    echo ❗ Git Bash가 설치되어 있지 않거나 bash.exe를 찾을 수 없습니다.
)
pause
