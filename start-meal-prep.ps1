$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Root

$Port = 4173
$Url = "http://127.0.0.1:$Port/index.html"
$BundledPython = "C:\Users\sdriy\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"

function Get-PythonCommand {
  if (Test-Path $BundledPython) {
    return @($BundledPython)
  }

  $pyLauncher = Get-Command py -ErrorAction SilentlyContinue
  if ($pyLauncher) {
    return @($pyLauncher.Source, "-3")
  }

  $python = Get-Command python -ErrorAction SilentlyContinue
  if ($python) {
    return @($python.Source)
  }

  throw "Could not find Python. Install Python or open index.html directly."
}

$ExistingServer = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue

if (-not $ExistingServer) {
  $PythonCommand = Get-PythonCommand
  $PythonExe = $PythonCommand[0]
  $PythonArgs = @()
  if ($PythonCommand.Count -gt 1) {
    $PythonArgs += $PythonCommand[1..($PythonCommand.Count - 1)]
  }
  $PythonArgs += @("-m", "http.server", "$Port", "--bind", "127.0.0.1")

  Start-Process -FilePath $PythonExe -ArgumentList $PythonArgs -WorkingDirectory $Root -WindowStyle Minimized
  Start-Sleep -Seconds 2
}

Start-Process $Url

Write-Host ""
Write-Host "Apartment Meal Prep is open at:"
Write-Host $Url
Write-Host ""
Write-Host "You can close this window. The local server runs in a separate minimized window."
