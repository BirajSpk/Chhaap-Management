$ErrorActionPreference = "Stop"

$root = "E:\Chhaap\Management Software"
$deployDir = "$root\deploy"
$zipPath = "$root\chhaap-deploy.zip"

Write-Host "=== Building frontend ==="
Set-Location "$root\chhaap-frontend"
cmd /c "node_modules\.bin\vite build 2>&1"
if (-not $?) { Write-Host "Build failed!"; exit 1 }

Write-Host "=== Preparing deploy folder ==="
if (Test-Path $deployDir) { Remove-Item -Recurse -Force $deployDir }
New-Item -ItemType Directory -Path $deployDir | Out-Null

Write-Host "=== Copying dist files ==="
Copy-Item -Recurse "$root\chhaap-frontend\dist\*" $deployDir

Write-Host "=== Copying API folder ==="
Copy-Item -Recurse "$root\api" "$deployDir\api"

Write-Host "=== Copying public images ==="
Copy-Item "$root\chhaap-frontend\public\Chhaap-Logo.png" $deployDir
Copy-Item "$root\chhaap-frontend\public\Chhaap-Fav.png" $deployDir

Write-Host "=== Copying root .htaccess ==="
Copy-Item "$root\.htaccess" $deployDir

Write-Host "=== Creating api/.env for deployment (UPDATE WITH HOSTINGER CREDS) ==="
$envContent = @"
DB_HOST=localhost
DB_PORT=3306
DB_NAME=chhaap_management
DB_USER=root
DB_PASS=root123
JWT_SECRET=chhaap_mgmt_secret_key_2026!@#$
"@
Set-Content "$deployDir\api\.env" $envContent

Write-Host "=== Exporting database ==="
$mysql = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe"
& $mysql -u root -proot123 -h 127.0.0.1 chhaap_management | Out-File -FilePath "$deployDir\database.sql" -Encoding utf8

Write-Host "=== Creating zip archive ==="
if (Test-Path $zipPath) { Remove-Item -Force $zipPath }
Compress-Archive -Path "$deployDir\*" -DestinationPath $zipPath -Force

Write-Host ""
Write-Host "============================================"
Write-Host "  DEPLOYMENT PACKAGE READY!"
Write-Host "  $zipPath"
Write-Host "============================================"
Write-Host ""
Write-Host "Files in package:"
Get-ChildItem -Recurse $deployDir | Select-Object -ExpandProperty FullName | ForEach-Object { $_.Replace($deployDir, "") }
