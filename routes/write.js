// ЗОНА РАЗРАБОТЧИКА B — запись (POST, DELETE).
// Разработчик A этот файл не трогает.
const express = require('express')
const router = express.Router()
const widgets = require('../data/widgets')

// TODO(B): id через widgets.length + 1 даст дубликаты после DELETE —
//          заменить на Math.max(...widgets.map(w => w.id), 0) + 1
router.post('/widgets', (req, res) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).send({ error: 'One or all params are missing' })
    }
    let newWidget = {
        id: widgets.length + 1,
        price: req.body.price,
        name: req.body.name
    }
    widgets.push(newWidget)
    res.status(201).location('localhost:8080/widgets/' + newWidget.id).send(
        newWidget
    )
})

// TODO(B): реализовать DELETE /widgets/:id — 204 при успехе, 404 если не найден.

module.exports = router
