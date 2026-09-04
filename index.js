const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());        // Avoid CORS errors in browsers
app.use(express.json()) // Populate req.body

app.use(require('./routes/widgets'))

app.listen(8080, () => {
    console.log(`API up at: http://localhost:8080`)
})
