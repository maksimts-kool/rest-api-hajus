// Точка входа. БАЗОВЫЙ ФАЙЛ — не редактируется в feature-ветках.
// Оба роутера подключены заранее, чтобы разработчики не трогали общий файл.
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());        // Avoid CORS errors in browsers
app.use(express.json()) // Populate req.body

app.use(require('./routes/read'))   // разработчик A
app.use(require('./routes/write'))  // разработчик B

app.listen(8080, () => {
    console.log(`API up at: http://localhost:8080`)
})
