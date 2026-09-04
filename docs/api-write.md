# POST/DELETE-эндпоинты (разработчик B)

Описание реализованных эндпоинтов и примеры запросов с результатами (скриншоты ниже).

POST /widgets
- тело: `name`, `price` (оба обязательны)
- успех: `201 Created` + заголовок `Location: /widgets/:id` + тело созданного виджета
- ошибка: `400` + `{ "error": "One or all params are missing" }`

Примеры (используется `xh`):

```
xh -v localhost:8080/widgets name=Fozzockle price=39.99
```

Ожидаемый результат: `201` + тело нового объекта и заголовок `Location`.

![POST 201 response](screenshots/post-201.svg)

```
xh -v localhost:8080/widgets name=Fozzockle
```

Ожидаемый результат: `400` + тело с ошибкой.

![POST 400 response](screenshots/post-400.svg)

---

DELETE /widgets/:id
- успех: `204 No Content` (без тела)
- ошибка: `404` + `{ "error": "Widget not found" }`

Примеры:

```
xh -v DELETE localhost:8080/widgets/2
```

Ожидаемый результат: `204` (пустой ответ).

![DELETE 204 response](screenshots/delete-204.svg)

```
xh -v DELETE localhost:8080/widgets/2
```

Повторный запрос к уже удалённому id — `404`.

![DELETE 404 response](screenshots/delete-404.svg)

---

Файлы с тестовыми скриншотами находятся в `docs/screenshots/`.
