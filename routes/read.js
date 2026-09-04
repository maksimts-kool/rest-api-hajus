// ЗОНА РАЗРАБОТЧИКА A — чтение (GET).
// Разработчик B этот файл не трогает.
const express = require('express')
const router = express.Router()
const widgets = require('../data/widgets')

// GET /widgets — весь массив, 200
router.get('/widgets', (req, res) => {
    res.send(widgets)
})

// GET /widgets/:id — один виджет по id, 200 / 404
// Поиск идёт по полю id, а не по индексу массива: после DELETE у соседа
// индексы съезжают и widgets[id - 1] вернул бы чужой виджет.
router.get('/widgets/:id', (req, res) => {
    const widget = widgets.find(w => w.id === Number(req.params.id))
    if (!widget) {
        return res.status(404).send({ error: "Widget not found" })
    }
    res.send(widget)
})

module.exports = router
