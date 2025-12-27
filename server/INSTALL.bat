@echo off
echo 正在切换到 server 目录...
cd /d F:\code\witchcoding\server
echo 当前目录: %CD%
echo.
echo 正在安装依赖...
call npm install
echo.
echo 安装完成！
pause

