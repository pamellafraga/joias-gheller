$ErrorActionPreference = "Continue"
$headers = @{
  "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
  "Accept" = "text/html,application/xhtml+xml,*/*"
  "Accept-Language" = "pt-BR,pt;q=0.9"
  "Referer" = "https://www.joiasgheller.com.br/"
}

function Get-Html($url) {
  try {
    return (Invoke-WebRequest -Uri $url -Headers $headers -UseBasicParsing -TimeoutSec 35).Content
  } catch {
    Write-Host "FAIL $url :: $($_.Exception.Message)"
    return $null
  }
}

# sitemap via curl
$sitemapPath = Join-Path $env:TEMP "gheller-sitemap.xml"
& curl.exe -sL -A "Mozilla/5.0" --max-time 40 -o $sitemapPath -w "sitemap:%{http_code} %{size_download}`n" "https://www.joiasgheller.com.br/sitemap.xml"
if (Test-Path $sitemapPath) {
  $sx = Get-Content $sitemapPath -Raw
  $locs = [regex]::Matches($sx, "<loc>([^<]+)</loc>") | ForEach-Object { $_.Groups[1].Value }
  Write-Host "sitemap locs: $($locs.Count)"
  $locs | Select-Object -First 30
  $productLocs = $locs | Where-Object { $_ -match "produto/" }
  Write-Host "product locs: $($productLocs.Count)"
  $catLocs = $locs | Where-Object { $_ -notmatch "produto/" -and $_ -match "joiasgheller" }
  Write-Host "cat-ish: $($catLocs.Count)"
  $catLocs | Select-Object -First 40
}

# try categories with curl
$cats = @("aneis","brincos","correntes","pulseiras","pingentes","prata","conjuntos","tornozeleiras","lancamentos","promocao","busca?busca=*")
foreach ($c in $cats) {
  $out = Join-Path $env:TEMP ("gheller-" + ($c -replace '[^a-z]','_') + ".html")
  $code = & curl.exe -sL -A "Mozilla/5.0" -e "https://www.joiasgheller.com.br/" --max-time 30 -o $out -w "%{http_code}" "https://www.joiasgheller.com.br/$c"
  $size = if (Test-Path $out) { (Get-Item $out).Length } else { 0 }
  $prices = 0
  if ($size -gt 0) { $prices = ([regex]::Matches((Get-Content $out -Raw), '"preco_original":\d+')).Count }
  Write-Host "curl $c => $code size=$size prices=$prices"
}
