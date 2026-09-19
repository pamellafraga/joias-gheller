const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");
const { promisify } = require("util");
const execFileAsync = promisify(execFile);

const root = path.resolve(__dirname, "..");
const catalogPath = path.join(root, "src", "data", "catalog.json");
const allUrls = fs
  .readFileSync(path.join(__dirname, "data", "product-urls.txt"), "utf8")
  .split(/\r?\n/)
  .map((s) => s.trim())
  .filter(Boolean);
const tmpDir = path.join(__dirname, "data", "pages");
fs.mkdirSync(tmpDir, { recursive: true });

function fixText(s) {
  if (!s) return s;
  let t = String(s);
  try {
    const via = Buffer.from(t, "latin1").toString("utf8");
    if ((via.match(/[áàâãéêíóôõúçÁÉÍÓÚÇ]/g) || []).length > (t.match(/[áàâãéêíóôõúç]/g) || []).length) {
      t = via;
    }
  } catch {}
  return t
    .replace(/Zircã["”]?nias/gi, "Zircônias")
    .replace(/Zircãƒnias/gi, "Zircônias")
    .replace(/Corã§ã£o/gi, "Coração")
    .replace(/Pã©rola/gi, "Pérola")
    .replace(/Rã³dio/gi, "Ródio")
    .replace(/Anã©is/gi, "Anéis")
    .replace(/Promoã§ã£o/gi, "Promoção")
    .replace(/Lanã§amentos/gi, "Lançamentos")
    .replace(/\s+/g, " ")
    .trim();
}

function titleCase(s) {
  return fixText(s)
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function tagFromUrl(url) {
  const u = url.toLowerCase();
  if (/\/produto\/[^/]*prata/.test(u) || /prata-/.test(u)) {
    if (/brinco|argola/.test(u)) return "Prata";
    if (/anel/.test(u)) return "Prata";
    if (/pulseira/.test(u)) return "Prata";
    if (/pingente/.test(u)) return "Prata";
    if (/corrente|gargantilha/.test(u)) return "Prata";
    if (/conjunto/.test(u)) return "Prata";
    return "Prata";
  }
  if (/brinco|argola|piercing/.test(u)) return "Brincos";
  if (/anel/.test(u)) return "Anéis";
  if (/pulseira|bracelete/.test(u)) return "Pulseiras";
  if (/corrente|gargantilha|chocker|colar|escapulario/.test(u)) return "Correntes";
  if (/pingente|berloque|mosqueta/.test(u)) return "Pingentes";
  if (/conjunto/.test(u)) return "Conjuntos";
  if (/tornozeleira/.test(u)) return "Tornozeleiras";
  return "Catálogo";
}

function parseHtml(html, url) {
  if (!html || html.length < 3000) return null;
  if (/nÃ£o encontrado|nao encontrado|404/i.test(html) && html.length < 120000) {
    // soft check
  }
  let title = (html.match(/<h1[^>]*>\s*([^<]+?)\s*<\/h1>/i) || [])[1];
  if (!title) {
    const slug = url.split("/").slice(-2, -1)[0] || "produto";
    title = slug.replace(/-/g, " ");
  }
  let img = (html.match(/property="og:image" content="([^"]+)"/i) || [])[1];
  if (!img) {
    img = (html.match(/https:\/\/lojagheller\.bwimg\.com\.br\/lojagheller\/produtos\/[^"\s>]+\.jpg/) || [])[0];
  }
  const pm = html.match(/R\$\s*([\d.]+),(\d{2})/);
  if (!pm || !img) return null;
  return {
    title: titleCase(title),
    price: `R$ ${pm[1]},${pm[2]}`,
    priceValue: parseInt(pm[1].replace(/\./g, ""), 10),
    tag: tagFromUrl(url),
    href: url,
    src: img,
  };
}

async function fetchOne(url) {
  const id = url.split("/").pop().replace(/[^0-9a-zA-Z-]/g, "_");
  const out = path.join(tmpDir, `${id}.html`);
  try {
    await execFileAsync("curl.exe", ["-sL", "-A", "Mozilla/5.0", "--max-time", "25", "-o", out, url], {
      windowsHide: true,
    });
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

(async () => {
  let list = JSON.parse(fs.readFileSync(catalogPath, "utf8").replace(/^\uFEFF/, ""));
  const have = new Set(list.map((p) => p.href.toLowerCase()));
  const retry = allUrls.filter((u) => !have.has(u.toLowerCase()));
  console.log(`cleanup existing=${list.length} retry=${retry.length}`);

  let i = 0;
  let ok = 0;
  const concurrency = 12;
  const workers = Array.from({ length: concurrency }, async () => {
    while (i < retry.length) {
      const idx = i++;
      const parsed = await fetchOne(retry[idx]);
      if (parsed) {
        list.push(parsed);
        ok++;
      }
      if ((idx + 1) % 50 === 0 || idx + 1 === retry.length) {
        console.log(`retry ${idx + 1}/${retry.length} ok=${ok}`);
      }
    }
  });
  await Promise.all(workers);

  // normalize all
  const map = new Map();
  for (const p of list) {
    const href = p.href;
    const clean = {
      title: titleCase(p.title),
      price: p.price,
      priceValue: p.priceValue,
      tag: tagFromUrl(href),
      href,
      src: p.src,
    };
    map.set(href.toLowerCase(), clean);
  }
  list = [...map.values()].sort((a, b) => {
    const t = a.tag.localeCompare(b.tag, "pt-BR");
    if (t) return t;
    return a.title.localeCompare(b.title, "pt-BR");
  });

  fs.writeFileSync(catalogPath, JSON.stringify(list, null, 2), "utf8");
  const tags = {};
  for (const p of list) tags[p.tag] = (tags[p.tag] || 0) + 1;
  console.log(`FINAL ${list.length}`);
  console.log(tags);
  try {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  } catch {}
})();
