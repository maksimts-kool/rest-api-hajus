# GET-эндпоинты (разработчик A)

Ветка: `feature/setup-and-get` · файл реализации: [`routes/read.js`](../routes/read.js)

Сервер: `npm install && npm start` → `http://localhost:8080`

Данные (`data/widgets.js`) хранятся в памяти, поэтому после перезапуска сервера
коллекция возвращается к трём стартовым виджетам.

> Запросы ниже записаны в форме `xh`, как в задании. На машине, где прогонялась
> проверка, `xh` не установлен, поэтому фактические ответы снимались через
> `curl -i` — статусы, заголовки и тела в примерах настоящие, тела JSON
> отформатированы для читаемости. Сюда же вставляются скриншоты терминала.

---

## `GET /widgets`

Возвращает всю коллекцию.

| | |
|---|---|
| Параметры | нет |
| Успех | `200 OK` + массив объектов |
| Ошибки | нет |

```console
$ xh -v localhost:8080/widgets

GET /widgets HTTP/1.1
Host: localhost:8080
Accept: */*

HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 122

[
    { "id": 1, "name": "Cizzbor",    "price": 29.99 },
    { "id": 2, "name": "Woowo",      "price": 26.99 },
    { "id": 3, "name": "Crazlinger", "price": 59.99 }
]
```

Пустая коллекция — это не ошибка: вернётся `200` и `[]`.

---

## `GET /widgets/:id`

Возвращает один виджет по его `id`.

| | |
|---|---|
| Параметры | `id` в пути — число |
| Успех | `200 OK` + объект виджета |
| Ошибка | `404 Not Found` + `{ "error": "Widget not found" }` |

### Виджет найден

```console
$ xh -v localhost:8080/widgets/1

GET /widgets/1 HTTP/1.1
Host: localhost:8080
Accept: */*

HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 39

{ "id": 1, "name": "Cizzbor", "price": 29.99 }
```

### Виджет не найден

```console
$ xh -v localhost:8080/widgets/999

GET /widgets/999 HTTP/1.1
Host: localhost:8080
Accept: */*

HTTP/1.1 404 Not Found
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 28

{ "error": "Widget not found" }
```

Нечисловой `id` (`/widgets/abc`) обрабатывается так же — `404`, потому что
`Number("abc")` даёт `NaN` и ни один виджет не совпадает.

---

## Исправленный баг: поиск по индексу

Было — виджет искали по позиции в массиве:

```js
widgets[req.params.id - 1]
```

Это работает, только пока `id` совпадает с индексом. Как только разработчик B
удаляет виджет через `DELETE`, массив сдвигается и связь `id ↔ индекс` рвётся.

Стало — поиск по самому полю `id`:

```js
const widget = widgets.find(w => w.id === Number(req.params.id))
```

### Проверка

После `DELETE /widgets/1` в коллекции остаются виджеты с `id` 2 и 3:

| Запрос | Старый код (по индексу) | Новый код (по `id`) |
|---|---|---|
| `GET /widgets/1` | `200` → Woowo (чужой виджет) | `404` Widget not found ✅ |
| `GET /widgets/2` | `200` → Crazlinger (чужой виджет) | `200` → Woowo ✅ |
| `GET /widgets/3` | `404` (виджет существует!) | `200` → Crazlinger ✅ |

Фактический вывод после удаления:

```console
GET /widgets/1 -> 404 { "error": "Widget not found" }
GET /widgets/2 -> 200 { "id": 2, "name": "Woowo",      "price": 26.99 }
GET /widgets/3 -> 200 { "id": 3, "name": "Crazlinger", "price": 59.99 }
```

---

## Чек-лист разработчика A

- [x] `GET /widgets` → `200` + массив
- [x] `GET /widgets/:id` → `200` + объект
- [x] `GET /widgets/:id` для несуществующего id → `404` + `{ "error": "Widget not found" }`
- [x] Баг с поиском по индексу исправлен, поведение после `DELETE` проверено
