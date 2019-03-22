const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');
const config = require('config');
const morgan = require('morgan');
var cors = require('cors');
const crypto = require('crypto')
var fs = require('fs');
var http = require('http');
var https = require('https');

// db
const db = require('./db');

if(config.util.getEnv('NODE_ENV') !== 'test') {
    //use morgan to log at command line
    app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}

app.use(cors());

app.use(bodyParser.json());                                     
app.use(bodyParser.urlencoded({extended: true}));               
app.use(bodyParser.text());                                    
app.use(bodyParser.json({ type: 'application/json'}));  

// routers
var user = require('./routers/user')

app.get("/", (req, res) => res.json({message: "Welcome to EventApp!"}));

app.route("/user")
    .get(user.getUsers);

app.route("/user/register")
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

if(config.util.getEnv('NODE_ENV') !== 'test') {
    var privateKey = fs.readFileSync('/etc/letsencrypt/live/www.ftfung.com/privkey.pem').toString();
    var certificate = fs.readFileSync('/etc/letsencrypt/live/www.ftfung.com/cert.pem').toString();

    var credentials = {key: privateKey, cert: certificate};
    var httpsServer = https.createServer(credentials, app);
    
    httpsServer.listen(3000);
}
else {
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}

module.exports = app;