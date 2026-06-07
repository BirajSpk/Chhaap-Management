$env:PHPRC = "C:\Users\sapko\AppData\Local\Microsoft\WinGet\Packages\PHP.PHP.8.3_Microsoft.Winget.Source_8wekyb3d8bbwe\php.ini"
$php = "C:\Users\sapko\AppData\Local\Microsoft\WinGet\Packages\PHP.PHP.8.3_Microsoft.Winget.Source_8wekyb3d8bbwe\php.exe"

Write-Host "Starting PHP backend on localhost:8000..."
Start-Process -NoNewWindow -FilePath $php -ArgumentList "-S localhost:8000 -t `"E:\Chhaap\Management Software\api`" `"E:\Chhaap\Management Software\api\index.php`""

Start-Sleep -Seconds 3

Write-Host "Starting Vite frontend on localhost:5173..."
Start-Process -NoNewWindow -FilePath "cmd.exe" -ArgumentList "/c cd /d `"E:\Chhaap\Management Software\chhaap-frontend`" && node_modules\.bin\vite"

Write-Host ""
Write-Host "===================================="
Write-Host "  Both servers started!"
Write-Host "  Frontend: http://localhost:5173"
Write-Host "  Backend:  http://localhost:8000"
Write-Host "===================================="
Write-Host "  Login: contact.chhaapcreatives@gmail.com"
Write-Host "  Pass:  Chh@@p#4321"
Write-Host "===================================="
Write-Host ""
Write-Host "Press any key to stop all servers..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Get-Process -Name php, node -ErrorAction SilentlyContinue | Stop-Process -Force
