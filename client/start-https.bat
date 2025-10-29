@echo off
REM Serve CRA dev server over HTTPS using mkcert output
SET HTTPS=true
SET HOST=0.0.0.0
SET SSL_CRT_FILE=certs\devcert.pem
SET SSL_KEY_FILE=certs\devkey.pem
npm start
