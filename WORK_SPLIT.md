# Распределение работы: REST API (widgets)

Проект: Express REST API на порту `8080`, коллекция `widgets`.

**Главный принцип: разработчики независимы.** Весь общий каркас (`package.json`,
зависимости, `index.js`, `data/widgets.js`, `README.md`) уже лежит в `main` —
никто его не создаёт и не редактирует. Каждый работает **только в своих файлах**,
поэтому конфликтов нет и ветки можно мержить **в любом порядке**.

## Что уже готово в `main`

- [x] `package.json` + зависимости `express`, `cors`, скрипт `npm start`
- [x] `.gitignore` (`node_modules/`)
- [x] `index.js` — подключает оба роутера заранее
- [x] `data/widgets.js` — общий массив данных
- [x] `README.md` — установка, структура, таблица эндпоинтов
- [x] `routes/read.js`, `routes/write.js` — заготовки с текущим кодом

Сервер запускается и отвечает уже сейчас: `npm install && npm start`.

---

## Разработчик A — чтение (GET)

**Ветка:** `feature/setup-and-get`
**Свои файлы:** `routes/read.js`, `docs/api-read.md`

1. `GET /widgets` — вернуть весь массив, статус `200` *(уже работает, проверить)*
2. `GET /widgets/:id` — вернуть один виджет
   - **исправить баг:** сейчас поиск по индексу `widgets[req.params.id - 1]`;
     после `DELETE` у соседа индексы разъедутся и вернётся не тот виджет.
     Заменить на `widgets.find(w => w.id === Number(req.params.id))`
   - не найден → `404` + `{ "error": "Widget not found" }`
3. Проверка через `xh`, скриншоты в `docs/api-read.md`:
   - `xh -v localhost:8080/widgets`
   - `xh -v localhost:8080/widgets/1`
   - `xh -v localhost:8080/widgets/999` → `404`
4. Заполнить `docs/api-read.md`

---

## Разработчик B — запись (POST, DELETE)

**Ветка:** `feature/post-and-delete`
**Свои файлы:** `routes/write.js`, `docs/api-write.md`

1. `POST /widgets` *(уже работает, доработать)*
   - валидация: `name` и `price` обязательны → `400` + `{ "error": "One or all params are missing" }`
   - **исправить баг:** `id: widgets.length + 1` после `DELETE` выдаст дубликат id.
     Заменить на `Math.max(...widgets.map(w => w.id), 0) + 1`
   - ответ `201` + заголовок `Location` + тело нового виджета
2. `DELETE /widgets/:id` — **новый код**
   - `findIndex` по `id` + `splice`
   - успех → `204 No Content` (без тела)
   - не найден → `404` + `{ "error": "Widget not found" }`
3. Проверка через `xh`, скриншоты в `docs/api-write.md`:
   - `xh -v localhost:8080/widgets name=Fozzockle price=39.99` → `201`
   - `xh -v localhost:8080/widgets name=Fozzockle` → `400`
   - `xh -v DELETE localhost:8080/widgets/2` → `204`
   - повторный `xh -v DELETE localhost:8080/widgets/2` → `404`
4. Заполнить `docs/api-write.md`

---

## Почему нет пересечений

| Файл | Владелец | Правится в ветках? |
|---|---|---|
| `package.json`, `.gitignore` | — | нет, готово в `main` |
| `index.js` | — | нет, роутеры подключены заранее |
| `data/widgets.js` | — | нет, только импортируется |
| `README.md` | — | нет, у каждого свой файл в `docs/` |
| `routes/read.js` | **A** | только A |
| `routes/write.js` | **B** | только B |
| `docs/api-read.md` | **A** | только A |
| `docs/api-write.md` | **B** | только B |

Общих редактируемых файлов нет → `git merge` в любом порядке проходит без конфликтов.

---

## Итоговые эндпоинты

| Метод | Путь | Тело | Успех | Ошибка | Кто |
|---|---|---|---|---|---|
| `GET` | `/widgets` | — | `200` + массив | — | A |
| `GET` | `/widgets/:id` | — | `200` + объект | `404` | A |
| `POST` | `/widgets` | `name`, `price` | `201` + объект | `400` | B |
| `DELETE` | `/widgets/:id` | — | `204` | `404` | B |

## Чек-лист сдачи

- [ ] `npm install && npm start` поднимает сервер на `http://localhost:8080`
- [ ] все 4 эндпоинта работают
- [ ] коды ответов: `200`, `201`, `204`, `400`, `404`
- [ ] после `DELETE` соседние `GET /widgets/:id` и `POST` остаются корректными
- [ ] `node_modules` не в git
- [ ] `docs/api-read.md` и `docs/api-write.md` заполнены со скриншотами
