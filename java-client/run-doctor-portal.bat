@echo off
title Rishi Health Clinician Console
cd /d "%~dp0"
set "PATH=%PATH%;C:\Program Files\Java\jdk-21\bin;C:\Program Files\Java\jdk-17\bin;C:\Program Files (x86)\Common Files\Oracle\Java\javapath"
java -cp ".;mysql-connector-j-8.4.0.jar" DoctorPortal
pause
