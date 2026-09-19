$ErrorActionPreference = "Continue"
$root = "c:\Users\Administrador\Documents\xpress-leads-1\demos\joias-gheller"
$dataDir = Join-Path $root "scripts\data"
$hx = Get-Content (Join-Path $dataDir "sitemap-hierarquias.xml") -Raw
$cats = [regex]::Matches($hx, "<loc>(https://www.joiasgheller.com.br/categoria/[^<]+)</loc>") | ForEach-Object { $_.Groups[1].Value } | Select-Object -Unique
Write-Host "categories: $($cats.Count)"

$map = @{}
function Add-Card($url, $img, $title, $price, $tag) {
  if (-not $url) { return }
  $href = if ($url -match '^https?://') { $url } else { "https://www.joiasgheller.com.br/$url" }
  $key = $href.ToLower()
  if ($map.ContainsKey($key)) { return }
  $title = [System.Net.WebUtility]::HtmlDecode($title).Trim()
  if ($title -match '\\u([0-9a-fA-F]{4})') {
    $title = [regex]::Replace($title, '\\u([0-9a-fA-F]{4})', { param($m) [char][Convert]::ToInt32($m.Groups[1].Value, 16) })
  }
  $priceClean = ($price -replace '\s+', ' ').Trim()
  $num = 0
  if ($priceClean -match 'R\$\s*([\d\.]+),(\d{2})') {
    $num = [int](($Matches[1] -replace '\.', ''))
  }
  $map[$key] = [ordered]@{
    title = (Get-Culture).TextInfo.ToTitleCase($title.ToLower())
    price = $priceClean
    priceValue = $num
    tag = $tag
    href = $href
    src = $img
  }
}

$rx = '(?s)href="(produto/[^"]+)"[^>]*>\s*<figure[^>]*>\s*<img[^>]+src="(https://lojagheller\.bwimg\.com\.br[^"]+)"[^>]*alt="([^"]*)"[\s\S]*?<h2 class="h2 item-descricao">([^<]+)</h2>\s*</a>\s*<h4 class="item-preco\s*">\s*(R\$\s*[\d\.,]+)'

$i = 0
foreach ($cat in $cats) {
  $i++
  $slug = ($cat -split '/')[-2]
  $tag = switch -Regex ($slug) {
    'brinco' { 'Brincos' }
    'anel|aneis' { 'Anéis' }
    'pulseira' { 'Pulseiras' }
    'corrente|gargantilha|chocker|colar|escapulario' { 'Correntes' }
    'pingente|berloque|mosqueta' { 'Pingentes' }
    'prata' { 'Prata' }
    'conjunto' { 'Conjuntos' }
    'tornozeleira' { 'Tornozeleiras' }
    'promocao' { 'Promoção' }
    'lancamento' { 'Lançamentos' }
    default { 'Catálogo' }
  }
  $out = Join-Path $dataDir ("catpage-$i.html")
  & curl.exe -sL -A "Mozilla/5.0" -e "https://www.joiasgheller.com.br/" --max-time 35 -o $out $cat | Out-Null
  if (-not (Test-Path $out)) { Write-Host "fail $cat"; continue }
  $html = Get-Content $out -Raw
  $cards = [regex]::Matches($html, $rx)
  foreach ($c in $cards) {
    Add-Card $c.Groups[1].Value $c.Groups[2].Value $c.Groups[4].Value $c.Groups[5].Value $tag
  }
  Write-Host ("[{0}/{1}] {2} cards={3} unique={4}" -f $i, $cats.Count, $slug, $cards.Count, $map.Count)
  Remove-Item $out -Force -ErrorAction SilentlyContinue
}

# Also homepage
& curl.exe -sL -A "Mozilla/5.0" --max-time 35 -o (Join-Path $dataDir "home.html") "https://www.joiasgheller.com.br/" | Out-Null
$home = Get-Content (Join-Path $dataDir "home.html") -Raw
foreach ($c in [regex]::Matches($home, $rx)) {
  Add-Card $c.Groups[1].Value $c.Groups[2].Value $c.Groups[4].Value $c.Groups[5].Value 'Destaque'
}
Write-Host "after home unique=$($map.Count)"

$list = @($map.Values | Sort-Object { $_.tag }, { $_.title })
$jsonPath = Join-Path $root "src\data\catalog.json"
($list | ConvertTo-Json -Depth 5) | Set-Content $jsonPath -Encoding UTF8
Write-Host "WROTE $($list.Count) to catalog.json"

# compare with sitemap
$allUrls = Get-Content (Join-Path $dataDir "product-urls.txt")
$have = [System.Collections.Generic.HashSet[string]]::new([string[]]($list | ForEach-Object { $_.href.ToLower() }))
$missing = @($allUrls | Where-Object { -not $have.Contains($_.ToLower()) })
Write-Host "sitemap=$($allUrls.Count) have=$($list.Count) missing=$($missing.Count)"
$missing | Set-Content (Join-Path $dataDir "missing-urls.txt")
