$ErrorActionPreference = "Continue"
$outDir = "c:\Users\Administrador\Documents\xpress-leads-1\demos\joias-gheller\scripts\data"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

& curl.exe -sL -A "Mozilla/5.0" --max-time 60 -o "$outDir\sitemap-produtos.xml" -w "produtos:%{http_code} %{size_download}`n" "https://www.joiasgheller.com.br/sitemap-produtos.xml"
& curl.exe -sL -A "Mozilla/5.0" --max-time 60 -o "$outDir\sitemap-hierarquias.xml" -w "hier:%{http_code} %{size_download}`n" "https://www.joiasgheller.com.br/sitemap-hierarquias.xml"

$sx = Get-Content "$outDir\sitemap-produtos.xml" -Raw
$locs = [regex]::Matches($sx, "<loc>([^<]+)</loc>") | ForEach-Object { $_.Groups[1].Value }
Write-Host "product urls: $($locs.Count)"
$locs | Select-Object -First 15
$locs | Set-Content "$outDir\product-urls.txt"

$hx = Get-Content "$outDir\sitemap-hierarquias.xml" -Raw
$hcats = [regex]::Matches($hx, "<loc>([^<]+)</loc>") | ForEach-Object { $_.Groups[1].Value }
Write-Host "hierarchy urls: $($hcats.Count)"
$hcats | Select-Object -First 40
