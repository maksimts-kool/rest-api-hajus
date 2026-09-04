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

module.exports = router
