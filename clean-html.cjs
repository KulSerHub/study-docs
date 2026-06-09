// Раскладывает скачанные .html по папкам и делает рядом чистый .md.
//
// Запуск:
//   node clean-html.cjs <папка> [base_url]
//
// Для каждого найденного <имя>.html создаётся подпапка <папка>/<имя>/, куда
// кладётся сам .html и сгенерированный <имя>.md. Так каждая страница лежит в
// своей папке «по смыслу».
//
// Текст извлекается через Mozilla Readability (движок «режима чтения» Firefox):
// он находит тело статьи и отбрасывает меню/шапку/подвал, корректно работая
// даже когда header/footer/aside встречаются ВНУТРИ статьи. Turndown переводит
// результат в Markdown, сохраняя ссылки [текст](url) и картинки ![alt](url).
// base_url нужен, чтобы относительные ссылки/картинки стали абсолютными.

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');
const TurndownService = require('turndown');

const dir = process.argv[2];
const base = process.argv[3] || 'https://example.com/';
if (!dir) {
  console.error('использование: node clean-html.cjs <папка> [base_url]');
  process.exit(1);
}

const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });

// собрать все .html рекурсивно (чтобы работало и при повторном запуске)
function listHtml(root) {
  return fs.readdirSync(root, { recursive: true })
    .map((p) => path.join(root, p))
    .filter((p) => p.endsWith('.html') && fs.statSync(p).isFile());
}

for (const html of listHtml(dir)) {
  const name = path.basename(html, '.html');
  const curDir = path.dirname(html);
  // целевая папка — <dir>/<имя>/ ; если файл уже в ней, оставляем как есть
  const targetDir = path.basename(curDir) === name ? curDir : path.join(dir, name);

  let htmlPath = html;
  if (targetDir !== curDir) {
    fs.mkdirSync(targetDir, { recursive: true });
    htmlPath = path.join(targetDir, name + '.html');
    fs.renameSync(html, htmlPath);              // переносим .html в свою папку
  }

  const src = fs.readFileSync(htmlPath, 'utf8');
  const dom = new JSDOM(src, { url: base });    // url -> Readability делает ссылки абсолютными
  const article = new Readability(dom.window.document).parse();

  let contentHtml, title = '';
  if (article && article.content) {
    contentHtml = article.content;              // только тело статьи
    title = article.title || '';
  } else {
    const body = dom.window.document.body;       // запасной путь
    contentHtml = body ? body.innerHTML : src;
  }

  let md = td.turndown(contentHtml);
  if (title) md = '# ' + title + '\n\n' + md;

  const mdPath = path.join(targetDir, name + '.md');
  fs.writeFileSync(mdPath, md);
  console.log(path.relative(dir, mdPath).padEnd(48), md.split('\n').length, 'строк');
}
