const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');
const config = require('config');
const morgan = require('morgan');

// db
const db = require('./db');

if(config.util.getEnv('NODE_ENV') !== 'test') {
    //use morgan to log at command line
    app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}

app.use(bodyParser.json());                                     
app.use(bodyParser.urlencoded({extended: true}));               
app.use(bodyParser.text());                                    
app.use(bodyParser.json({ type: 'application/json'}));  

// routers
var user = require('./routers/user')

app.get("/", (req, res) => res.json({message: "Welcome to EventApp!"}));

app.route("/user")
    .get(user.getUsers)
    .post(user.register);

app.route("/user/login")
    .post(user.login);
    
app.route("/user/:id")
    .get(user.getUser)
    .put(user.updateUser)
    .delete(user.deleteUser);



// app.route("/book/:id")
//     .get(book.getBook)
//     .delete(book.deleteBook)
//     .put(book.updateBook);

// app.use(function (err, req, res, next) {
//     console.error(err.stack)
//     res.status(404).send('Not Found')
//   })

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app;