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

// POST /widgets/:id — create or replace a single widget at the given id
router.post('/widgets/:id', (req, res) => {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).send({ error: 'Invalid id' })
    }
    if (!req.body || !req.body.name || !req.body.price) {
        return res.status(400).send({ error: 'One or all params are missing' })
    }
    const idx = widgets.findIndex(w => w.id === id)
    const widget = { id: id, name: req.body.name, price: req.body.price }
    if (idx === -1) {
        // create
        widgets.push(widget)
        return res.status(201).location('/widgets/' + id).send(widget)
    }
    // replace
    widgets[idx] = widget
    return res.status(200).send(widget)
})

module.exports = router
