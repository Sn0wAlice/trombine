import { themes } from '@trombine/core';

/** Self-contained playground page. Every image is a real call to this server, so the URLs shown are the API. */
export function explorerPage(): string {
  // Theme keys come from code, not from the request: safe to inline.
  const list = Object.entries(themes).map(([key, t]) => ({ key, alias: t.name === key ? null : t.name }));

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>trombine explorer</title>
<style>
  :root { --fg: #111; --muted: #666; --line: #e3e3e3; --bg: #fafafa; --card: #fff; --accent: #111; }
  * { box-sizing: border-box; }
  body { margin: 0; font: 15px/1.5 system-ui, sans-serif; color: var(--fg); background: var(--bg); }
  main { max-width: 1040px; margin: 0 auto; padding: 32px 16px 64px; }
  h1 { font-size: 28px; margin: 0 0 4px; }
  h2 { font-size: 18px; margin: 40px 0 12px; }
  p.lead { color: var(--muted); margin: 0 0 24px; }
  .card { background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 20px; }
  .play { display: grid; grid-template-columns: 280px minmax(0, 1fr); gap: 24px; align-items: start; }
  @media (max-width: 720px) { .play { grid-template-columns: 1fr; } }
  .preview { width: 100%; aspect-ratio: 1; border: 1px solid var(--line); border-radius: 8px; display: grid; place-items: center;
    background: repeating-conic-gradient(#f2f2f2 0 25%, #fff 0 50%) 0 0 / 16px 16px; }
  .preview img { max-width: 100%; max-height: 100%; }
  label { display: block; font-size: 13px; color: var(--muted); margin-bottom: 4px; }
  .row { display: flex; gap: 8px; align-items: center; margin-bottom: 14px; }
  .field { margin-bottom: 14px; }
  input[type=text], select { width: 100%; padding: 8px 10px; border: 1px solid var(--line); border-radius: 8px; font: inherit; background: #fff; }
  input[type=range] { flex: 1; }
  input[type=color] { width: 44px; height: 34px; padding: 2px; border: 1px solid var(--line); border-radius: 8px; background: #fff; }
  button, a.btn { padding: 8px 12px; border: 1px solid var(--accent); border-radius: 8px; background: var(--accent); color: #fff;
    font: inherit; cursor: pointer; text-decoration: none; white-space: nowrap; }
  button.ghost, a.btn.ghost { background: #fff; color: var(--fg); border-color: var(--line); }
  button:focus-visible, a:focus-visible, input:focus-visible, select:focus-visible { outline: 2px solid #4a7dff; outline-offset: 2px; }
  .urls { display: grid; grid-template-columns: minmax(0, 1fr); gap: 8px; margin-top: 8px; }
  .url { display: flex; gap: 8px; align-items: center; }
  .url code { flex: 1; min-width: 0; overflow-x: auto; white-space: nowrap; padding: 8px 10px; background: var(--bg);
    border: 1px solid var(--line); border-radius: 8px; font-size: 13px; }
  .url .tag { width: 44px; font-size: 12px; color: var(--muted); }
  .themes { display: grid; gap: 16px; }
  .theme-head { display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 12px; }
  .theme-head h3 { margin: 0; font-size: 16px; }
  .theme-head small { color: var(--muted); font-weight: normal; margin-left: 6px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(96px, 1fr)); gap: 10px; }
  .grid button { padding: 0; background: none; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; color: var(--muted); }
  .grid button:hover { border-color: var(--fg); }
  .grid img { display: block; width: 100%; aspect-ratio: 1; }
  .grid span { display: block; font: 11px ui-monospace, monospace; padding: 2px 0 4px; }
</style>
</head>
<body>
<main>
  <h1>trombine explorer</h1>
  <p class="lead">Same seed, same face. Tweak the parameters, copy the URL.</p>

  <section class="card play" aria-label="Playground">
    <div class="preview"><img id="img" alt="Generated avatar"></div>
    <div>
      <div class="field">
        <label for="seed">Seed</label>
        <div class="row" style="margin:0">
          <input type="text" id="seed" value="alice" maxlength="256" autocomplete="off">
          <button type="button" id="random" title="Random seed">Random</button>
        </div>
      </div>
      <div class="field">
        <label for="theme">Theme</label>
        <select id="theme"></select>
      </div>
      <div class="field">
        <label for="size">Size: <span id="sizeOut"></span> px</label>
        <div class="row" style="margin:0"><input type="range" id="size" min="16" max="1024" step="16" value="256"></div>
      </div>
      <div class="field">
        <label for="bg">Background</label>
        <div class="row" style="margin:0">
          <input type="checkbox" id="bgOn" aria-label="Use a custom background">
          <input type="color" id="bg" value="#ffcc00">
          <code id="bgOut" style="color:var(--muted)">theme default</code>
        </div>
      </div>
      <div class="urls">
        <div class="url"><span class="tag">SVG</span><code id="svgUrl"></code>
          <button type="button" class="ghost" data-copy="svgUrl">Copy</button><a class="btn ghost" id="svgOpen" target="_blank" rel="noopener">Open</a></div>
        <div class="url"><span class="tag">PNG</span><code id="pngUrl"></code>
          <button type="button" class="ghost" data-copy="pngUrl">Copy</button><a class="btn ghost" id="pngOpen" target="_blank" rel="noopener">Open</a></div>
        <div class="url"><span class="tag">CLI</span><code id="cli"></code>
          <button type="button" class="ghost" data-copy="cli">Copy</button></div>
      </div>
    </div>
  </section>

  <h2>Themes</h2>
  <div class="themes" id="themes"></div>
</main>

<script>
const THEMES = ${JSON.stringify(list)};
const $ = (id) => document.getElementById(id);
const rand = () => Math.random().toString(36).slice(2, 10);
const DEMO = 12;

function query(theme, size, bg) {
  const q = new URLSearchParams({ theme, size: String(size) });
  if (bg) q.set('bg', bg);
  return q.toString();
}
const url = (seed, ext, q) => location.origin + '/' + encodeURIComponent(seed) + '.' + ext + '?' + q;

for (const t of THEMES) $('theme').add(new Option(t.alias ? t.key + ' (alias of ' + t.alias + ')' : t.key, t.key));

function update() {
  const seed = $('seed').value;
  const theme = $('theme').value;
  const size = Number($('size').value);
  const bg = $('bgOn').checked ? $('bg').value.slice(1) : '';
  $('sizeOut').textContent = size;
  $('bgOut').textContent = bg ? 'bg=' + bg : 'theme default';
  const q = query(theme, size, bg);
  const svg = url(seed, 'svg', q);
  const png = url(seed, 'png', q);
  $('img').src = svg;
  $('svgUrl').textContent = $('svgOpen').href = svg;
  $('pngUrl').textContent = $('pngOpen').href = png;
  $('cli').textContent = 'npx trombine ' + JSON.stringify(seed) + ' --theme ' + theme + ' --size ' + size + (bg ? ' --bg ' + bg : '') + ' > avatar.svg';
  history.replaceState(null, '', '?' + new URLSearchParams({ seed, ...Object.fromEntries(new URLSearchParams(q)) }));
}

function load(seed, theme) {
  $('seed').value = seed;
  $('theme').value = theme;
  update();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderDemo(card, theme) {
  const grid = card.querySelector('.grid');
  grid.replaceChildren();
  for (let i = 0; i < DEMO; i++) {
    const seed = rand();
    const b = document.createElement('button');
    b.type = 'button';
    b.title = 'Load ' + seed + ' in the playground';
    const img = new Image();
    img.src = url(seed, 'svg', query(theme, 128));
    img.alt = 'Avatar for seed ' + seed;
    const label = document.createElement('span');
    label.textContent = seed;
    b.append(img, label);
    b.onclick = () => load(seed, theme);
    grid.append(b);
  }
}

for (const t of THEMES) {
  const card = document.createElement('section');
  card.className = 'card';
  card.innerHTML = '<div class="theme-head"><h3></h3><button type="button" class="ghost">Reroll</button></div><div class="grid"></div>';
  card.querySelector('h3').textContent = t.key;
  if (t.alias) card.querySelector('h3').insertAdjacentHTML('beforeend', '<small>alias of ' + t.alias + '</small>');
  card.querySelector('button').onclick = () => renderDemo(card, t.key);
  $('themes').append(card);
  renderDemo(card, t.key);
}

// Restore state from the page URL so a playground link can be shared.
const init = new URLSearchParams(location.search);
if (init.has('seed')) $('seed').value = init.get('seed');
if (THEMES.some((t) => t.key === init.get('theme'))) $('theme').value = init.get('theme');
if (init.has('size')) $('size').value = init.get('size');
if (/^[0-9a-f]{6}$/i.test(init.get('bg') || '')) { $('bgOn').checked = true; $('bg').value = '#' + init.get('bg'); }

for (const id of ['seed', 'theme', 'size', 'bg']) $(id).addEventListener('input', update);
$('bg').addEventListener('input', () => { $('bgOn').checked = true; update(); });
$('bgOn').addEventListener('change', update);
$('random').onclick = () => { $('seed').value = rand(); update(); };
document.querySelectorAll('[data-copy]').forEach((b) => b.onclick = async () => {
  await navigator.clipboard.writeText($(b.dataset.copy).textContent);
  b.textContent = 'Copied';
  setTimeout(() => (b.textContent = 'Copy'), 1200);
});
update();
</script>
</body>
</html>`;
}
