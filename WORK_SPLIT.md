# Распределение работы: REST API (widgets)

Проект: Express.js REST API на порту `8080` с коллекцией `widgets`.
Ветка: `main`. Работаем через отдельные ветки + Pull Request.

## Текущее состояние

- [x] `index.js` — базовый сервер, `GET /widgets`, `GET /widgets/:id`, `POST /widgets`
- [ ] `package.json` (`npm init -y`) — **не создан**
- [ ] `.gitignore` (`node_modules`) — **не создан**
- [ ] `DELETE /widgets/:id` — **не реализован** (есть в задании, п. 10)
- [ ] `README.md` с документацией эндпоинтов
- [ ] Скриншоты проверки через `xh`

---

## Разработчик A — инфраструктура + чтение (GET)

**Ветка:** `feature/setup-and-get`

1. **Инициализация проекта**
   - `npm init -y` → `package.json`
   - `npm i express cors` → `package-lock.json`, `node_modules`
   - `.gitignore` с `node_modules/`
   - добавить скрипт `"start": "node ."` в `package.json`
2. **Эндпоинт `GET /widgets`**
   - возвращает весь массив, статус `200`
3. **Эндпоинт `GET /widgets/:id`**
   - возвращает один виджет по `id`
   - если не найден → `404` + `{ "error": "Widget not found" }`
   - заменить поиск по индексу (`widgets[id - 1]`) на `widgets.find(w => w.id === Number(req.params.id))`,
     иначе после `DELETE` индексы разъедутся
4. **Проверка через `xh`** (скриншоты в `docs/`)
   - `xh -v localhost:8080/widgets`
   - `xh -v localhost:8080/widgets/1`
   - `xh -v localhost:8080/widgets/999` → должен быть `404`
5. **README:** раздел «Установка и запуск» + описание GET-эндпоинтов

**Файлы:** `package.json`, `.gitignore`, `index.js` (строки 1–23), `README.md`

---

## Разработчик B — запись (POST / DELETE)

**Ветка:** `feature/post-and-delete`

1. **Эндпоинт `POST /widgets`**
   - валидация: `name` и `price` обязательны → иначе `400` + `{ "error": "One or all params are missing" }`
   - генерация `id` (надёжнее `Math.max(...widgets.map(w => w.id)) + 1`, а не `length + 1`)
   - ответ `201` + заголовок `Location` + тело нового виджета
2. **Эндпоинт `DELETE /widgets/:id`** *(новый код)*
   - удаление по `id` из массива (`findIndex` + `splice`)
   - успех → `204 No Content` (без тела)
   - не найден → `404` + `{ "error": "Widget not found" }`
3. **Проверка через `xh`** (скриншоты в `docs/`)
   - `xh -v localhost:8080/widgets name=Fozzockle price=39.99`
   - `xh -v localhost:8080/widgets name=Fozzockle` → должен быть `400`
   - `xh -v DELETE localhost:8080/widgets/2` → `204`
   - `xh -v DELETE localhost:8080/widgets/2` повторно → `404`
4. **README:** описание POST- и DELETE-эндпоинтов + таблица кодов ответов

**Файлы:** `index.js` (строки 25+), `README.md`

---

## Общая зона (делаем вместе, чтобы не поймать конфликт)

`index.js` один на двоих — правим **разные участки** файла:

| Строки | Кто |
|---|---|
| 1–12 (импорты, `widgets`) | A |
| 14–23 (GET) | A |
| 25+ (POST, DELETE) | B |
| последний `app.listen` | A (не трогать B) |

Порядок мержа: сначала PR разработчика A (он создаёт `package.json`), потом B — с `git rebase main`.

---

## Итоговая таблица эндпоинтов

| Метод | Путь | Тело запроса | Успех | Ошибка | Кто |
|---|---|---|---|---|---|
| `GET` | `/widgets` | — | `200` + массив | — | A |
| `GET` | `/widgets/:id` | — | `200` + объект | `404` | A |
| `POST` | `/widgets` | `name`, `price` | `201` + объект | `400` | B |
| `DELETE` | `/widgets/:id` | — | `204` | `404` | B |

---

## Чек-лист сдачи

- [ ] `npm i && node .` поднимает сервер на `http://localhost:8080`
- [ ] все 4 эндпоинта работают
- [ ] коды ответов: `200`, `201`, `204`, `400`, `404`
- [ ] `node_modules` не в git
- [ ] `README.md` заполнен
- [ ] скриншоты `xh` приложены
