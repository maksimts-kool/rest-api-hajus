# GET-эндпоинты (разработчик A)

Ветка: `feature/setup-and-get` · файл реализации: [`routes/widgets.js`](../routes/widgets.js)

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

## Новая функция: фильтрация и сортировка `GET /widgets`

`GET /widgets` принимает необязательные query-параметры. Без них поведение
прежнее — возвращается вся коллекция, так что старые запросы не ломаются.

| Параметр | Значение | Что делает |
|---|---|---|
| `name` | строка | оставляет виджеты, в названии которых есть эта подстрока; регистр не важен |
| `minPrice` | число | цена `>=` значения |
| `maxPrice` | число | цена `<=` значения |
| `sort` | `price` или `name` | сортирует результат |
| `order` | `asc` (по умолчанию) или `desc` | направление сортировки, работает вместе с `sort` |

| | |
|---|---|
| Успех | `200 OK` + массив (возможно пустой) |
| Ошибки | `400 Bad Request` при нечисловых `minPrice`/`maxPrice` или неизвестных `sort`/`order` |

Параметры комбинируются: сначала применяются все фильтры, потом сортировка.

### Фильтр по названию

```console
$ xh -v 'localhost:8080/widgets?name=woo'

GET /widgets?name=woo HTTP/1.1
Host: localhost:8080
Accept: */*

HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 39

[
    { "id": 2, "name": "Woowo", "price": 26.99 }
]
```

Регистр не важен — `?name=WOO` даёт тот же ответ.

### Фильтр по цене

```console
$ xh -v 'localhost:8080/widgets?minPrice=30'

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 44

[
    { "id": 3, "name": "Crazlinger", "price": 59.99 }
]
```

Границы включаются, `minPrice` и `maxPrice` можно задавать вместе:

```console
$ xh -v 'localhost:8080/widgets?minPrice=27&maxPrice=30'

HTTP/1.1 200 OK
Content-Length: 41

[
    { "id": 1, "name": "Cizzbor", "price": 29.99 }
]
```

### Сортировка

```console
$ xh -v 'localhost:8080/widgets?sort=price&order=desc'

HTTP/1.1 200 OK
Content-Length: 122

[
    { "id": 3, "name": "Crazlinger", "price": 59.99 },
    { "id": 1, "name": "Cizzbor",    "price": 29.99 },
    { "id": 2, "name": "Woowo",      "price": 26.99 }
]
```

`sort=name` сортирует по названию (`Cizzbor`, `Crazlinger`, `Woowo`).

### Комбинация фильтра и сортировки

```console
$ xh -v 'localhost:8080/widgets?name=z&sort=price'

HTTP/1.1 200 OK
Content-Length: 84

[
    { "id": 1, "name": "Cizzbor",    "price": 29.99 },
    { "id": 3, "name": "Crazlinger", "price": 59.99 }
]
```

### Ничего не найдено — это `200`, а не `404`

Пустой результат фильтра — нормальный ответ, ошибки тут нет:

```console
$ xh -v 'localhost:8080/widgets?name=zzz'

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 2

[]
```

`404` остаётся только у `GET /widgets/:id`, где запрашивается конкретный ресурс.

### Ошибки в параметрах

Некорректные параметры не игнорируются молча — иначе клиент получил бы
«не тот» список и не понял, почему:

```console
$ xh -v 'localhost:8080/widgets?minPrice=abc'

HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8
Content-Length: 49

{ "error": "minPrice and maxPrice must be numbers" }
```

```console
$ xh -v 'localhost:8080/widgets?sort=id'

HTTP/1.1 400 Bad Request
Content-Length: 46

{ "error": "sort must be \"price\" or \"name\"" }
```

```console
$ xh -v 'localhost:8080/widgets?sort=price&order=up'

HTTP/1.1 400 Bad Request
Content-Length: 45

{ "error": "order must be \"asc\" or \"desc\"" }
```

Пустое значение (`?minPrice=`) и повторённый параметр (`?minPrice=1&minPrice=2`,
Express кладёт в `req.query.minPrice` массив) тоже дают `400`.

### Почему сортировка идёт по копии массива

`Array.prototype.sort()` сортирует массив **на месте**, а `widgets` —
общее хранилище, из которого читает и разработчик B. Сортировка исходного
массива меняла бы порядок для всех последующих запросов, включая обычный
`GET /widgets` без параметров. Поэтому в роутере сначала делается копия:

```js
let result = widgets.slice()
```

Проверка: после `GET /widgets?sort=price&order=desc` обычный `GET /widgets`
по-прежнему отдаёт виджеты в исходном порядке `1, 2, 3`.

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
- [x] Фильтрация `GET /widgets` по `name`, `minPrice`, `maxPrice` → `200` + отфильтрованный массив
- [x] Сортировка `GET /widgets` по `sort`/`order` → `200`, исходный массив не мутируется
- [x] Некорректные query-параметры → `400` + `{ "error": ... }`
