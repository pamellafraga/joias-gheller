const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");
const { promisify } = require("util");
const execFileAsync = promisify(execFile);

const root = path.resolve(__dirname, "..");
const dataDir = path.join(__dirname, "data");
const catalogPath = path.join(root, "src", "data", "catalog.json");
const missingPath = path.join(dataDir, "missing-urls.txt");
const tmpDir = path.join(dataDir, "pages");

fs.mkdirSync(tmpDir, { recursive: true });

const existing = JSON.parse(
  fs.readFileSync(catalogPath, "utf8").replace(/^\uFEFF/, ""),
);
const map = new Map();
for (const p of existing) map.set(String(p.href).toLowerCase(), p);

const missing = fs
  .readFileSync(missingPath, "utf8")
  .split(/\r?\n/)
  .map((s) => s.trim())
  .filter(Boolean);

console.log(`existing=${map.size} missing=${missing.length}`);

function titleCase(s) {
  return s
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function decodeHtml(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/Ã©/g, "é")
    .replace(/Ã¡/g, "á")
    .replace(/Ã¢/g, "â")
    .replace(/Ã£/g, "ã")
    .replace(/Ã§/g, "ç")
    .replace(/Ã­/g, "í")
    .replace(/Ã³/g, "ó")
    .replace(/Ã´/g, "ô")
    .replace(/Ãº/g, "ú")
    .replace(/Ã‰/g, "É")
    .replace(/â€™/g, "'")
    .replace(/â€“/g, "–");
}

function tagFromUrl(url) {
  const u = url.toLowerCase();
  if (/brinco|argola|piercing/.test(u)) return "Brincos";
  if (/anel/.test(u)) return "Anéis";
  if (/pulseira|bracelete/.test(u)) return "Pulseiras";
  if (/corrente|gargantilha|chocker|colar|escapulario/.test(u)) return "Correntes";
  if (/pingente|berloque|mosqueta/.test(u)) return "Pingentes";
  if (/prata/.test(u)) return "Prata";
  if (/conjunto/.test(u)) return "Conjuntos";
  if (/tornozeleira/.test(u)) return "Tornozeleiras";
  return "Catálogo";
}

function parseHtml(html, url) {
  if (!html || html.length < 3000) return null;
  let title = (html.match(/<h1[^>]*>\s*([^<]+?)\s*<\/h1>/i) || [])[1];
  if (!title) {
    const slug = url.split("/").slice(-2, -1)[0] || "produto";
    title = slug.replace(/-/g, " ");
  }
  title = titleCase(decodeHtml(title.trim()));

  let img = (html.match(/property="og:image" content="([^"]+)"/i) || [])[1];
  if (!img) {
    img = (html.match(/https:\/\/lojagheller\.bwimg\.com\.br\/lojagheller\/produtos\/[^"\s>]+\.jpg/) || [])[0];
  }

  const pm = html.match(/R\$\s*([\d.]+),(\d{2})/);
  if (!pm || !img) return null;
  const priceLabel = `R$ ${pm[1]},${pm[2]}`;
  const priceValue = parseInt(pm[1].replace(/\./g, ""), 10);

  return {
    title,
    price: priceLabel,
    priceValue,
    tag: tagFromUrl(url),
    href: url,
    src: img,
  };
}

async function fetchOne(url) {
  const id = url.split("/").pop().replace(/[^0-9a-zA-Z-]/g, "_");
  const out = path.join(tmpDir, `${id}.html`);
  try {
    await execFileAsync(
      "curl.exe",
      ["-sL", "-A", "Mozilla/5.0", "--max-time", "22", "-o", out, url],
      { windowsHide: true },
    );
    const html = fs.readFileSync(out, "utf8");
    fs.unlinkSync(out);
    return parseHtml(html, url);
  } catch {
    try {
      fs.unlinkSync(out);
    } catch {}
    return null;
  }
}

async function mapPool(items, concurrency, fn) {
  let i = 0;
  let ok = 0;
  let fail = 0;
  const workers = Array.from({ length: concurrency }, async () => {
    while (i < items.length) {
      const idx = i++;
      const url = items[idx];
      const parsed = await fn(url);
      if (parsed) {
        map.set(url.toLowerCase(), parsed);
        ok++;
      } else {
        fail++;
      }
      if ((ok + fail) % 40 === 0 || ok + fail === items.length) {
        console.log(`progress ${ok + fail}/${items.length} ok=${ok} fail=${fail} total=${map.size}`);
      }
    }
  });
  await Promise.all(workers);
  return { ok, fail };
}

(async () => {
  await mapPool(missing, 16, fetchOne);
  const list = [...map.values()].sort((a, b) => {
    const t = String(a.tag).localeCompare(String(b.tag), "pt-BR");
    if (t) return t;
    return String(a.title).localeCompare(String(b.title), "pt-BR");
  });

  // Fix encoding on existing tags/titles
  for (const p of list) {
    p.title = titleCase(decodeHtml(String(p.title)));
    p.tag = decodeHtml(String(p.tag))
      .replace(/AnÃ©is/g, "Anéis")
      .replace(/PromoÃ§Ã£o/g, "Promoção")
      .replace(/LanÃ§amentos/g, "Lançamentos");
    if (p.tag === "AnÃ©is" || p.tag.includes("An")) {
      if (/anel/i.test(p.href) || /anel/i.test(p.title)) p.tag = "Anéis";
    }
  }

  fs.writeFileSync(catalogPath, JSON.stringify(list, null, 2), "utf8");
  console.log(`FINAL ${list.length}`);
  try {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  } catch {}
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
