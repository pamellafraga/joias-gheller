$ErrorActionPreference = "Continue"
$root = "c:\Users\Administrador\Documents\xpress-leads-1\demos\joias-gheller"
$dataDir = Join-Path $root "scripts\data"
$tmpDir = Join-Path $dataDir "pages"
New-Item -ItemType Directory -Force -Path $tmpDir | Out-Null

$existing = Get-Content (Join-Path $root "src\data\catalog.json") -Raw | ConvertFrom-Json
$map = @{}
foreach ($p in $existing) { $map[$p.href.ToLower()] = $p }

$missing = Get-Content (Join-Path $dataDir "missing-urls.txt") | Where-Object { $_ }
Write-Host "existing=$($map.Count) missing=$($missing.Count)"

function Parse-Html($html, $url) {
  if (-not $html -or $html.Length -lt 3000) { return $null }
  $title = [regex]::Match($html, '<h1[^>]*>\s*([^<]+?)\s*</h1>').Groups[1].Value.Trim()
  if (-not $title) {
    $slug = ($url -split "/")[-2]
    $title = ($slug -replace "-", " ")
  }
  $title = [System.Net.WebUtility]::HtmlDecode($title)
  $img = [regex]::Match($html, 'property="og:image" content="([^"]+)"').Groups[1].Value
  if (-not $img) {
    $img = [regex]::Match($html, 'https://lojagheller\.bwimg\.com\.br/lojagheller/produtos/[^"\s>]+\.jpg').Value
  }
  $pm = [regex]::Match($html, 'R\$\s*([\d\.]+),(\d{2})')
  if (-not $pm.Success -or -not $img) { return $null }
  $priceLabel = "R$ $($pm.Groups[1].Value),$($pm.Groups[2].Value)"
  $priceNum = [int](($pm.Groups[1].Value -replace '\.', ''))
  $u = $url.ToLower()
  $tag = if ($u -match 'brinco|argola|piercing') { 'Brincos' }
    elseif ($u -match 'anel') { 'Anéis' }
    elseif ($u -match 'pulseira|bracelete') { 'Pulseiras' }
    elseif ($u -match 'corrente|gargantilha|chocker|colar|escapulario') { 'Correntes' }
    elseif ($u -match 'pingente|berloque|mosqueta') { 'Pingentes' }
    elseif ($u -match 'prata') { 'Prata' }
    elseif ($u -match 'conjunto') { 'Conjuntos' }
    elseif ($u -match 'tornozeleira') { 'Tornozeleiras' }
    else { 'Catálogo' }
  return [ordered]@{
    title = (Get-Culture).TextInfo.ToTitleCase($title.ToLower())
    price = $priceLabel
    priceValue = $priceNum
    tag = $tag
    href = $url
    src = $img
  }
}

$batch = 30
$ok = 0
$fail = 0
for ($i = 0; $i -lt $missing.Count; $i += $batch) {
  $slice = $missing[$i..([Math]::Min($i + $batch - 1, $missing.Count - 1))]
  $procs = @()
  foreach ($u in $slice) {
    $id = ($u -split "/")[-1] -replace '[^0-9a-zA-Z\-]', '_'
    $out = Join-Path $tmpDir "$id.html"
    $procs += Start-Process -FilePath "curl.exe" -ArgumentList @("-sL","-A","Mozilla/5.0","--max-time","22","-o",$out,$u) -PassThru -WindowStyle Hidden -NoNewWindow
  }
  $procs | Wait-Process -TimeoutSec 60 -ErrorAction SilentlyContinue
  Start-Sleep -Milliseconds 200

  foreach ($u in $slice) {
    $id = ($u -split "/")[-1] -replace '[^0-9a-zA-Z\-]', '_'
    $out = Join-Path $tmpDir "$id.html"
    if (-not (Test-Path $out)) { $fail++; continue }
    $html = [System.IO.File]::ReadAllText($out)
    $parsed = Parse-Html $html $u
    if ($parsed) {
      $map[$u.ToLower()] = $parsed
      $ok++
    } else {
      $fail++
    }
    Remove-Item $out -Force -ErrorAction SilentlyContinue
  }
  Write-Host ("batch {0}-{1} ok={2} fail={3} total={4}" -f $i, [Math]::Min($i+$batch-1,$missing.Count-1), $ok, $fail, $map.Count)
}

$list = @($map.Values | Sort-Object tag, title)
$path = Join-Path $root "src\data\catalog.json"
($list | ConvertTo-Json -Depth 5) | Set-Content $path -Encoding UTF8
Write-Host "FINAL $($list.Count) products"
Remove-Item $tmpDir -Recurse -Force -ErrorAction SilentlyContinue
