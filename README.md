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
index.js           точка входа, подключает роутеры   (общий, не редактируется)
data/widgets.js    in-memory хранилище               (общий, не редактируется)
routes/read.js     GET-эндпоинты                     (разработчик A)
routes/write.js    POST/DELETE-эндпоинты             (разработчик B)
docs/api-read.md   документация GET                  (разработчик A)
docs/api-write.md  документация POST/DELETE          (разработчик B)
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
