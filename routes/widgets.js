const express = require('express')
const router = express.Router()
const widgets = require('../data/widgets')

const parseNumberParam = (value) => {
    if (value === undefined) return undefined
    if (typeof value !== 'string' || value.trim() === '') return NaN
    return Number(value)
}

router.get('/widgets', (req, res) => {
    const { name, sort } = req.query
    const order = req.query.order === undefined ? 'asc' : req.query.order

    const minPrice = parseNumberParam(req.query.minPrice)
    const maxPrice = parseNumberParam(req.query.maxPrice)
    if (Number.isNaN(minPrice) || Number.isNaN(maxPrice)) {
        return res.status(400).send({ error: 'minPrice and maxPrice must be numbers' })
    }
    if (sort !== undefined && sort !== 'price' && sort !== 'name') {
        return res.status(400).send({ error: 'sort must be "price" or "name"' })
    }
    if (order !== 'asc' && order !== 'desc') {
        return res.status(400).send({ error: 'order must be "asc" or "desc"' })
    }

    let result = widgets.slice()

    if (typeof name === 'string') {
        const needle = name.toLowerCase()
        result = result.filter(w => w.name.toLowerCase().includes(needle))
    }
    if (minPrice !== undefined) {
        result = result.filter(w => w.price >= minPrice)
    }
    if (maxPrice !== undefined) {
        result = result.filter(w => w.price <= maxPrice)
    }

    if (sort !== undefined) {
        const direction = order === 'desc' ? -1 : 1
        result.sort((a, b) => {
            const diff = sort === 'price'
                ? a.price - b.price
                : a.name.localeCompare(b.name)
            return diff * direction
        })
    }

    res.send(result)
})

router.get('/widgets/:id', (req, res) => {
    const widget = widgets.find(w => w.id === Number(req.params.id))
    if (!widget) {
        return res.status(404).send({ error: "Widget not found" })
    }
    res.send(widget)
})

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

// DELETE /widgets/:id
router.delete('/widgets/:id', (req, res) => {
    const id = Number(req.params.id)
    const idx = widgets.findIndex(w => w.id === id)
    if (idx === -1) {
        return res.status(404).send({ error: 'Widget not found' })
    }
    widgets.splice(idx, 1)
    res.status(204).send()
})

// POST /widgets/:id
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
