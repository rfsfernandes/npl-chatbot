const express = require('express')
const app = express()

app.get('/api/', (req, res) => res.send('Hello Everyione'))

app.listen(3000, () => console.log("Connected to 3000"))