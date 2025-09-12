Param(
  [string]$HostsPath = "$Env:SystemRoot\System32\drivers\etc\hosts"
)

Write-Host "Setting up local subdomains (Windows hosts file)" -ForegroundColor Cyan

if (-not (Test-Path $HostsPath)) {
  Write-Error "Hosts file not found at $HostsPath"
  exit 1
}

$hostsContent = Get-Content -Path $HostsPath -ErrorAction Stop

function Ensure-HostEntry($entry) {
  if ($hostsContent -notcontains $entry) {
    Add-Content -Path $HostsPath -Value $entry
    Write-Host "Added: $entry" -ForegroundColor Green
  } else {
    Write-Host "Exists: $entry" -ForegroundColor Yellow
  }
}

Ensure-HostEntry ""
Ensure-HostEntry "# Local subdomains for development"
Ensure-HostEntry "127.0.0.1 photo.localhost"
Ensure-HostEntry "127.0.0.1 video.localhost"
Ensure-HostEntry "127.0.0.1 tech.localhost"
Ensure-HostEntry "127.0.0.1 furry.localhost"

Write-Host "Done. You can visit: http://furry.localhost:3000" -ForegroundColor Cyan

