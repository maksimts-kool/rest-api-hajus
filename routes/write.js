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
        id: Math.max(...widgets.map(w => w.id), 0) + 1,
        price: req.body.price,
        name: req.body.name
    }
    widgets.push(newWidget)
    res.status(201)
        .location('/widgets/' + newWidget.id)
        .send(newWidget)
})

// DELETE /widgets/:id — удаляет виджет по id
router.delete('/widgets/:id', (req, res) => {
    const id = Number(req.params.id)
    const idx = widgets.findIndex(w => w.id === id)
    if (idx === -1) {
        return res.status(404).send({ error: 'Widget not found' })
    }
    widgets.splice(idx, 1)
    res.status(204).send()
})

module.exports = router
