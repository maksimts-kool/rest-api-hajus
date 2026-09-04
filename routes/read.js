// ЗОНА РАЗРАБОТЧИКА A — чтение (GET).
// Разработчик B этот файл не трогает.
const express = require('express')
const router = express.Router()
const widgets = require('../data/widgets')

router.get('/widgets', (req, res) => {
    res.send(widgets)
})

// TODO(A): поиск по индексу ломается после DELETE — заменить на поиск по id:
//          widgets.find(w => w.id === Number(req.params.id))
router.get('/widgets/:id', (req, res) => {
    if (typeof widgets[req.params.id - 1] === 'undefined') {
        return res.status(404).send({ error: "Widget not found" })
    }
    res.send(widgets[req.params.id - 1])
})

module.exports = router
