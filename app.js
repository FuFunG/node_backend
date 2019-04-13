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
var event = require('./routers/event')
var event_user = require('./routers/event_user')

app.get("/", (req, res) => res.json({message: "Welcome to EventApp!"}));

// User API
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

// Event API
app.route("/event")
    .get(event.getEvents)
    .post(event.postEvent);

app.route("/event/:id")
    .get(event.getEvent)
    .put(event.updateEvent)
    .delete(event.deleteEvent);

// Event User API
app.route("/event_user")
    .get(event_user.getEventUsers)
    .post(event_user.postEventUser)
    .delete(event_user.deleteEventUser);

app.route("/event_user/:id")
   .get(event_user.getEventUser);

app.route("/event_user/event/:id")
    .get(event_user.getEventUserByEventId);

app.route("/event_user/user/:id")
    .get(event_user.getEventUserByUserId);

// app.use(function (err, req, res, next) {
//     console.error(err.stack)
//     res.status(404).send('Not Found')
//   })

if(config.util.getEnv('NODE_ENV') !== 'test') {
    var privateKey = fs.readFileSync('/etc/letsencrypt/live/www.ftfung.com/privkey.pem').toString();
    var certificate = fs.readFileSync('/etc/letsencrypt/live/www.ftfung.com/cert.pem').toString();

    var credentials = {key: privateKey, cert: certificate};
    var httpsServer = https.createServer(credentials, app);
    
    httpsServer.listen(port+1);
    console.log(`HTTPS listening on port ${port+1}!`)
    app.listen(port, () => console.log(`HTTP listening on port ${port}!`))
}
else {
    app.listen(port, () => console.log(`HTTP listening on port ${port}!`))
}

module.exports = app;