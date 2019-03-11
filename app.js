const express = require('express')
const app = express()
const port = 3000

// db
const db = require('./db');

// routers
var users = require('./routers/users')

app.get('/', (req, res) => res.send('Hello World!'))

app.use('/users', users)

// app.use(function (err, req, res, next) {
//     console.error(err.stack)
//     res.status(404).send('Not Found')
//   })

app.listen(port, () => console.log(`Example app listening on port ${port}!`))