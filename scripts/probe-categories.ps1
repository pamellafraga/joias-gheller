$ErrorActionPreference = "Continue"
$outDir = "c:\Users\Administrador\Documents\xpress-leads-1\demos\joias-gheller\scripts\data"
$cats = @(
  "https://www.joiasgheller.com.br/categoria/correntes/0001",
  "https://www.joiasgheller.com.br/categoria/pulseiras/0002",
  "https://www.joiasgheller.com.br/categoria/brincos/0004",
  "https://www.joiasgheller.com.br/categoria/pingentes/0005",
  "https://www.joiasgheller.com.br/categoria/aneis/0009",
  "https://www.joiasgheller.com.br/categoria/prata/0010",
  "https://www.joiasgheller.com.br/categoria/conjuntos/0011",
  "https://www.joiasgheller.com.br/categoria/tornozeleiras/0012",
  "https://www.joiasgheller.com.br/categoria/lancamentos/0013",
  "https://www.joiasgheller.com.br/categoria/promocao/0014"
)

# Discover all top-level cats from hierarchy sitemap
$hx = Get-Content "$outDir\sitemap-hierarquias.xml" -Raw
$allCats = [regex]::Matches($hx, "<loc>(https://www.joiasgheller.com.br/categoria/[^<]+)</loc>") | ForEach-Object { $_.Groups[1].Value }
# Prefer top-level (no dot in id)
$top = $allCats | Where-Object { $_ -match '/categoria/[^/]+/\d+$' }
Write-Host "top cats: $($top.Count)"
$top

foreach ($u in $top) {
  $name = ($u -split '/')[-2]
  $out = Join-Path $outDir "cat-$name.html"
  $code = & curl.exe -sL -A "Mozilla/5.0" -e "https://www.joiasgheller.com.br/" --max-time 40 -o $out -w "%{http_code}" $u
  $size = (Get-Item $out).Length
  $raw = Get-Content $out -Raw
  $prices = ([regex]::Matches($raw, '"preco_original":\d+')).Count
  $urls = ([regex]::Matches($raw, '"url":"(produto/[^"]+)"')).Count
  Write-Host "$name => $code size=$size prices=$prices urls=$urls"
}
