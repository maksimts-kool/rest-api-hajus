# rest-api-hajus

Учебный REST API на Express.js. Коллекция `widgets`, порт `8080`.

## Запуск

```bash
npm install
npm start
```

API поднимется на `http://localhost:8080`.

## Структура

```
index.js           точка входа, подключает роутер
data/widgets.js    in-memory хранилище
routes/widgets.js  все эндпоинты /widgets (GET, POST, DELETE)
docs/api-read.md   документация GET
docs/api-write.md  документация POST/DELETE
```

Разделение задач — см. [WORK_SPLIT.md](WORK_SPLIT.md).

## Эндпоинты

| Метод | Путь | Успех | Ошибка |
|---|---|---|---|
| `GET` | `/widgets` | `200` + массив | `400` (плохие query-параметры) |
| `GET` | `/widgets/:id` | `200` + объект | `404` |
| `POST` | `/widgets` | `201` + объект | `400` |
| `DELETE` | `/widgets/:id` | `204` | `404` |

`GET /widgets` поддерживает фильтрацию и сортировку через query-параметры
(`name`, `minPrice`, `maxPrice`, `sort`, `order`) — см. [docs/api-read.md](docs/api-read.md).
