$ErrorActionPreference = "Continue"
$root = "c:\Users\Administrador\Documents\xpress-leads-1\demos\joias-gheller"
$dataDir = Join-Path $root "scripts\data"
$tmpDir = Join-Path $dataDir "product-pages"
New-Item -ItemType Directory -Force -Path $tmpDir | Out-Null

$urls = Get-Content (Join-Path $dataDir "product-urls.txt") | Where-Object { $_ -match "produto/" }
Write-Host "urls: $($urls.Count)"

function Parse-Product($html, $url) {
  if (-not $html) { return $null }
  $title = [regex]::Match($html, '<h1[^>]*>\s*([^<]+?)\s*</h1>').Groups[1].Value.Trim()
  if (-not $title) {
    $slug = ($url -split "/")[-2]
    $title = ($slug -replace "-", " ").ToUpper()
  }
  $title = [System.Net.WebUtility]::HtmlDecode($title)
  $img = [regex]::Match($html, 'property="og:image" content="([^"]+)"').Groups[1].Value
  if (-not $img) {
    $img = [regex]::Match($html, 'https://lojagheller\.bwimg\.com\.br/lojagheller/produtos/[^"\s>]+\.jpg').Value
  }
  $priceMatch = [regex]::Match($html, 'R\$\s*([\d\.]+),(\d{2})')
  if (-not $priceMatch.Success) { return $null }
  $intPart = $priceMatch.Groups[1].Value -replace '\.', ''
  $priceNum = [int]$intPart
  $priceLabel = "R$ $($priceMatch.Groups[1].Value),$($priceMatch.Groups[2].Value)"
  # category guess from breadcrumb or hierarchy text
  $cat = [regex]::Match($html, 'nome_hierarquia":"([^"]+)"').Groups[1].Value
  if (-not $cat) {
    $cat = [regex]::Match($html, 'categoria/([^/]+)/').Groups[1].Value
  }
  if ($cat -match '/') { $cat = ($cat -split '/')[0] }
  $tag = switch -Regex ($cat.ToUpper()) {
    'BRINCO' { 'Brincos' }
    'ANEL|ANEIS' { 'Anéis' }
    'PULSEIRA' { 'Pulseiras' }
    'CORRENTE|GARGANTILHA|COLARES|CHOCKER' { 'Correntes' }
    'PINGENTE' { 'Pingentes' }
    'PRATA' { 'Prata' }
    'CONJUNTO' { 'Conjuntos' }
    'TORNOZELEIRA' { 'Tornozeleiras' }
    'PROMO' { 'Promoção' }
    'LANCAMENTO|LANÇAMENTO' { 'Lançamentos' }
    default {
      $u = $url.ToLower()
      if ($u -match 'brinco|argola|piercing') { 'Brincos' }
      elseif ($u -match 'anel') { 'Anéis' }
      elseif ($u -match 'pulseira|bracelete') { 'Pulseiras' }
      elseif ($u -match 'corrente|gargantilha|chocker|colar|escapulario') { 'Correntes' }
      elseif ($u -match 'pingente|berloque|mosqueta') { 'Pingentes' }
      elseif ($u -match 'prata') { 'Prata' }
      elseif ($u -match 'conjunto') { 'Conjuntos' }
      elseif ($u -match 'tornozeleira') { 'Tornozeleiras' }
      else { 'Catálogo' }
    }
  }
  return [ordered]@{
    title = (Get-Culture).TextInfo.ToTitleCase($title.ToLower())
    price = $priceLabel
    priceValue = $priceNum
    tag = $tag
    href = $url
    src = $img
  }
}

$products = [System.Collections.Concurrent.ConcurrentBag]::new()
$batchSize = 40
$total = $urls.Count
$done = 0
$ok = 0
$fail = 0

for ($i = 0; $i -lt $total; $i += $batchSize) {
  $batch = $urls[$i..([Math]::Min($i + $batchSize - 1, $total - 1))]
  $jobs = @()
  foreach ($u in $batch) {
    $id = ($u -split "/")[-1]
    $out = Join-Path $tmpDir "$id.html"
    $jobs += Start-Job -ScriptBlock {
      param($url, $outFile)
      & curl.exe -sL -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36" --max-time 25 -o $outFile $url | Out-Null
      if ((Test-Path $outFile) -and ((Get-Item $outFile).Length -gt 5000)) { return $true }
      return $false
    } -ArgumentList $u, $out
  }
  Wait-Job $jobs | Out-Null
  foreach ($j in $jobs) { Receive-Job $j | Out-Null; Remove-Job $j }

  foreach ($u in $batch) {
    $id = ($u -split "/")[-1]
    $out = Join-Path $tmpDir "$id.html"
    $done++
    if (-not (Test-Path $out)) { $fail++; continue }
    $html = Get-Content $out -Raw -ErrorAction SilentlyContinue
    $parsed = Parse-Product $html $u
    if ($parsed -and $parsed.src) {
      $products.Add($parsed) | Out-Null
      $ok++
    } else {
      $fail++
    }
  }
  Write-Host ("progress {0}/{1} ok={2} fail={3}" -f $done, $total, $ok, $fail)
}

$list = @($products.ToArray() | Sort-Object priceValue, title)
$jsonPath = Join-Path $root "src\data\catalog.json"
$list | ConvertTo-Json -Depth 4 -Compress:$false | Set-Content $jsonPath -Encoding UTF8
Write-Host "wrote $($list.Count) products to $jsonPath"

# cleanup pages to save disk (optional keep)
Remove-Item $tmpDir -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "done"
