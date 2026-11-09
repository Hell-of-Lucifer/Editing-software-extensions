Add-Type -AssemblyName System.Drawing
$imagePath = Join-Path $PSScriptRoot "Ransom note pro.png"
$bmp = [System.Drawing.Bitmap]::FromFile($imagePath)

$outDir = Join-Path $PSScriptRoot "extension\client\assets\presets"
if (!(Test-Path $outDir)) {
    New-Item -ItemType Directory -Force -Path $outDir | Out-Null
}

$items = @(
    @{ Name = "vintage_newspaper.png";  X = 780;  Y = 257; W = 96; H = 57 },
    @{ Name = "magazine_glossy.png";     X = 1022; Y = 257; W = 96; H = 57 },
    @{ Name = "grunge_craft.png";       X = 780;  Y = 348; W = 96; H = 57 },
    @{ Name = "torn_cardboard.png";     X = 1022; Y = 348; W = 96; H = 57 },
    @{ Name = "stencil_spray.png";      X = 780;  Y = 443; W = 96; H = 57 },
    @{ Name = "pop_art_retro.png";      X = 1022; Y = 443; W = 96; H = 57 },
    @{ Name = "typewriter_classic.png";  X = 780;  Y = 533; W = 96; H = 57 },
    @{ Name = "random_ransom.png";       X = 1022; Y = 533; W = 96; H = 57 }
)

foreach ($item in $items) {
    $crop = New-Object System.Drawing.Bitmap($item.W, $item.H)
    $g = [System.Drawing.Graphics]::FromImage($crop)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $srcRect = New-Object System.Drawing.Rectangle($item.X, $item.Y, $item.W, $item.H)
    $destRect = New-Object System.Drawing.Rectangle(0, 0, $item.W, $item.H)
    $g.DrawImage($bmp, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    $crop.Save((Join-Path $outDir $item.Name), [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $crop.Dispose()
}

$bmp.Dispose()
Write-Output "Thumbnails refined."
