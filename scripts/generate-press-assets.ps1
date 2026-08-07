Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$sourceDir = Join-Path $root "images"
$outputDir = Join-Path $sourceDir "press"
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

$wordmarkPath = Join-Path $sourceDir "PIXEL-FORGE-3-17-2026.png"
$markPath = Join-Path $sourceDir "New Piskel-2.png (9).png"
$monoPath = Join-Path $sourceDir "monochrome_version.png"

Copy-Item -LiteralPath $wordmarkPath -Destination (Join-Path $outputDir "logo-primary.png") -Force
Copy-Item -LiteralPath $wordmarkPath -Destination (Join-Path $outputDir "logo-on-dark.png") -Force
Copy-Item -LiteralPath $markPath -Destination (Join-Path $outputDir "logo-mark.png") -Force
Copy-Item -LiteralPath $monoPath -Destination (Join-Path $outputDir "logo-monochrome.png") -Force

function Convert-ToDataUri([string]$path) {
    $bytes = [System.IO.File]::ReadAllBytes($path)
    return "data:image/png;base64,$([Convert]::ToBase64String($bytes))"
}

function Write-LogoSvg([string]$pngPath, [string]$svgPath, [int]$width, [int]$height, [string]$background = "") {
    $backgroundRect = if ($background) { "<rect width=`"100%`" height=`"100%`" fill=`"$background`"/>" } else { "" }
    $svg = @"
<svg xmlns="http://www.w3.org/2000/svg" width="$width" height="$height" viewBox="0 0 $width $height">
  $backgroundRect
  <image width="$width" height="$height" href="$(Convert-ToDataUri $pngPath)" image-rendering="pixelated"/>
</svg>
"@
    [System.IO.File]::WriteAllText($svgPath, $svg, [System.Text.UTF8Encoding]::new($false))
}

Write-LogoSvg $wordmarkPath (Join-Path $outputDir "logo-primary.svg") 1024 215
Write-LogoSvg $wordmarkPath (Join-Path $outputDir "logo-on-dark.svg") 1024 215
Write-LogoSvg $markPath (Join-Path $outputDir "logo-mark.svg") 288 288
Write-LogoSvg $monoPath (Join-Path $outputDir "logo-monochrome.svg") 320 320

$wordmark = [System.Drawing.Bitmap]::FromFile($wordmarkPath)
$mark = [System.Drawing.Bitmap]::FromFile($markPath)

function Draw-ContainedImage(
    [System.Drawing.Graphics]$graphics,
    [System.Drawing.Image]$image,
    [System.Drawing.RectangleF]$bounds
) {
    $scale = [Math]::Min($bounds.Width / $image.Width, $bounds.Height / $image.Height)
    $width = [single]($image.Width * $scale)
    $height = [single]($image.Height * $scale)
    $x = [single]($bounds.X + (($bounds.Width - $width) / 2))
    $y = [single]($bounds.Y + (($bounds.Height - $height) / 2))
    $graphics.DrawImage($image, $x, $y, $width, $height)
}

function New-Banner([string]$name, [int]$width, [int]$height, [string]$layout) {
    $bitmap = [System.Drawing.Bitmap]::new($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.Clear([System.Drawing.Color]::FromArgb(5, 7, 13))
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half

    $cyan = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(36, 200, 255))
    $blue = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(5, 27, 255))
    $deepBlue = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(2, 11, 152))
    $gridPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(28, 36, 200, 255), [Math]::Max(1, [Math]::Round($width / 900)))

    $gridStep = [Math]::Max(32, [Math]::Round([Math]::Min($width, $height) / 12))
    for ($x = 0; $x -le $width; $x += $gridStep) { $graphics.DrawLine($gridPen, $x, 0, $x, $height) }
    for ($y = 0; $y -le $height; $y += $gridStep) { $graphics.DrawLine($gridPen, 0, $y, $width, $y) }

    $unit = [Math]::Max(12, [Math]::Round([Math]::Min($width, $height) / 32))
    $graphics.FillRectangle($deepBlue, 0, 0, $unit * 8, $unit * 2)
    $graphics.FillRectangle($blue, 0, $unit * 2, $unit * 5, $unit * 2)
    $graphics.FillRectangle($cyan, $width - ($unit * 6), $height - ($unit * 2), $unit * 6, $unit * 2)
    $graphics.FillRectangle($blue, $width - ($unit * 3), $height - ($unit * 5), $unit * 3, $unit * 3)

    if ($layout -eq "vertical") {
        Draw-ContainedImage $graphics $mark ([System.Drawing.RectangleF]::new($width * 0.25, $height * 0.16, $width * 0.5, $height * 0.28))
        Draw-ContainedImage $graphics $wordmark ([System.Drawing.RectangleF]::new($width * 0.08, $height * 0.48, $width * 0.84, $height * 0.2))
    } elseif ($layout -eq "square") {
        Draw-ContainedImage $graphics $mark ([System.Drawing.RectangleF]::new($width * 0.35, $height * 0.18, $width * 0.3, $height * 0.3))
        Draw-ContainedImage $graphics $wordmark ([System.Drawing.RectangleF]::new($width * 0.08, $height * 0.52, $width * 0.84, $height * 0.23))
    } else {
        Draw-ContainedImage $graphics $mark ([System.Drawing.RectangleF]::new($width * 0.07, $height * 0.2, $width * 0.24, $height * 0.6))
        Draw-ContainedImage $graphics $wordmark ([System.Drawing.RectangleF]::new($width * 0.32, $height * 0.28, $width * 0.61, $height * 0.44))
    }

    $pngPath = Join-Path $outputDir "$name.png"
    $bitmap.Save($pngPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
    $gridPen.Dispose()
    $cyan.Dispose()
    $blue.Dispose()
    $deepBlue.Dispose()

    $pngData = Convert-ToDataUri $pngPath
    $svg = @"
<svg xmlns="http://www.w3.org/2000/svg" width="$width" height="$height" viewBox="0 0 $width $height">
  <image width="$width" height="$height" href="$pngData"/>
</svg>
"@
    [System.IO.File]::WriteAllText((Join-Path $outputDir "$name.svg"), $svg, [System.Text.UTF8Encoding]::new($false))
}

New-Banner "banner-wide" 1920 1080 "wide"
New-Banner "banner-square" 1080 1080 "square"
New-Banner "banner-story" 1080 1920 "vertical"
New-Banner "banner-social-card" 1200 630 "wide"

$wordmark.Dispose()
$mark.Dispose()
