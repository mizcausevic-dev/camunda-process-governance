# SPDX-License-Identifier: AGPL-3.0-or-later

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$screenshots = Join-Path $root "screenshots"
New-Item -ItemType Directory -Force -Path $screenshots | Out-Null

function New-ProofImage {
    param(
        [string]$Path,
        [string]$Title,
        [string]$Subtitle,
        [string[]]$Bullets
    )

    $bitmap = New-Object System.Drawing.Bitmap 1440, 900
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

    $background = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        ([System.Drawing.Point]::new(0, 0)),
        ([System.Drawing.Point]::new(1440, 900)),
        ([System.Drawing.Color]::FromArgb(255, 5, 7, 12)),
        ([System.Drawing.Color]::FromArgb(255, 7, 10, 15))
    )
    $graphics.FillRectangle($background, 0, 0, 1440, 900)

    $panelBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(220, 11, 18, 32))
    $panelRect = [System.Drawing.Rectangle]::new(70, 70, 1300, 760)
    $graphics.FillRectangle($panelBrush, $panelRect)

    $outlinePen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(140, 55, 255, 139), 2)
    $graphics.DrawRectangle($outlinePen, $panelRect)

    $titleFont = New-Object System.Drawing.Font("Segoe UI", 34, [System.Drawing.FontStyle]::Bold)
    $eyebrowFont = New-Object System.Drawing.Font("Consolas", 16, [System.Drawing.FontStyle]::Regular)
    $bodyFont = New-Object System.Drawing.Font("Segoe UI", 18, [System.Drawing.FontStyle]::Regular)

    $textBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 233, 243, 255))
    $mutedBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(200, 233, 243, 255))
    $accentBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 25, 199, 255))

    $graphics.DrawString("CAMUNDA PROCESS GOVERNANCE", $eyebrowFont, $accentBrush, 92, 92)
    $graphics.DrawString($Title, $titleFont, $textBrush, 92, 138)
    $graphics.DrawString($Subtitle, $bodyFont, $mutedBrush, [System.Drawing.RectangleF]::new(92, 220, 1120, 90))

    $y = 340
    foreach ($bullet in $Bullets) {
        $graphics.DrawString("• " + $bullet, $bodyFont, $mutedBrush, [System.Drawing.RectangleF]::new(110, $y, 1120, 44))
        $y += 56
    }

    $bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
}

New-ProofImage -Path (Join-Path $screenshots "01-overview-proof.png") `
    -Title "Process governance checkpoint posture" `
    -Subtitle "Operator-readable proof for approvals, task handoffs, timer evidence, and compensating-action routing." `
    -Bullets @(
        "Surface the same packets workflow owners, release leads, and auditors argue over.",
        "Keep checkpoint debt visible before it becomes a production or audit problem.",
        "Show recruiter-readable Camunda and BPM governance depth."
    )

New-ProofImage -Path (Join-Path $screenshots "02-process-lane-proof.png") `
    -Title "Lane ownership and packet routing" `
    -Subtitle "Each lane maps to a real process-governance responsibility instead of generic workflow copy." `
    -Bullets @(
        "Approval, routing, timer, and fallback lanes stay separated and accountable.",
        "Owner mapping keeps workflow governance, task routing, and reliability teams explicit.",
        "Findings roll up into checkpoint-safe next actions."
    )

New-ProofImage -Path (Join-Path $screenshots "03-execution-posture-proof.png") `
    -Title "Execution posture before checkpoint" `
    -Subtitle "Decision packets show which processes can move forward and which should stop." `
    -Bullets @(
        "Completeness score, blocker, and checkpoint window stay in one view.",
        "High-severity packet debt is visible before BPM launches go live.",
        "The same primitive can ladder into paid templates, hosted preview, or embedded delivery."
    )
