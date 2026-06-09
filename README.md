# study-docs

<br>

**Автор:** Kulikov Serhii <br>
**Скачать:** https://github.com/KulSerHub/study-docs

<br>

Skill для Claude Code: скачивает онлайн-документацию, извлекает чистый текст статьи (через Mozilla Readability) и читает его дословно — чтобы Claude отвечал строго по документации, без выдумок.

<br>

## Требования

- **Node.js** (вместе с ним ставится `npm`) — для запуска скрипта очистки и установки зависимостей. <br>
Скачать: https://nodejs.org/en/download

- **Git** — для скачивания репозитория командой `git clone` <br>
Скачать: https://git-scm.com/install

<br>

## Установка

В **вашем** проекте создайте папку скиллов и склонируйте в неё репозиторий, затем установите зависимости, выполнив команды:

```bash
cd ВАШ-ПРОЕКТ
mkdir -p .claude/skills
git clone https://github.com/KulSerHub/study-docs.git .claude/skills/study-docs
npm install --prefix .claude/skills/study-docs
```

> [!NOTE]
> Если Claude Code уже был запущен во время установки — перезапустите его.

> `npm install` установит зависимости для работы скрипта очистки:
> - `jsdom` — превращает HTML-страницу в DOM, как в браузере.
> - `@mozilla/readability` — выделяет из страницы тело статьи (как «режим чтения»).
> - `turndown` — переводит результат в Markdown.

<br>

## Использование

В чате Claude Code вызовите skill и передайте ссылку на документацию или тему:

`/study-docs https://ссылка_на/документацию`

или

`/study-docs изучи раздел про роутинг в документации React Router`

Claude скачает страницы, очистит в Markdown (с сохранением ссылок и картинок),
прочитает их и дальше будет отвечать строго по этому тексту.

<br>

## Что внутри

- `SKILL.md` — инструкция для Claude (главный файл).
- `clean-html.cjs` — скрипт очистки HTML → Markdown.
- `package.json` — список зависимостей.
- `package-lock.json` — зафиксированные версии зависимостей (появляется после `npm install`).
- `README.md` — этот файл.
- `.gitignore` — что не попадает в репозиторий (`node_modules/`, `docs-cache/`).
