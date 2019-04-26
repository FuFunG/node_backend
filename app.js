const express = require('express')
const app = express()
const http_port = 80
const https_port = 443
const bodyParser = require('body-parser');
const config = require('config');
const morgan = require('morgan');
var cors = require('cors');
const crypto = require('crypto')
var fs = require('fs');
var http = require('http');
var https = require('https');
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger/doc.json')

// db
const db = require('./db');

if(config.util.getEnv('NODE_ENV') !== 'test') {
    //use morgan to log at command line
    app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}

app.use(cors());

app.use(bodyParser.json());                                     
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));               
app.use(bodyParser.text());                                    
app.use(bodyParser.json({ type: 'application/json'}));  
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

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

app.route("/user/photo/:id")
    .put(user.updatePicture);

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
    .post(event_user.postEventUser);

app.route("/event_user/:id")
   .get(event_user.getEventUser);

app.route("/event_user/event/:id")
    .get(event_user.getEventUserByEventId);

app.route("/event_user/user/:id")
    .get(event_user.getEventUserByUserId);

app.route("/event_user/event/:eventId/user/:userId")
    .delete(event_user.deleteEventUser)
    .get(event_user.checkUserJoined);

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(404).send('Not Found')
  })

if(config.util.getEnv('NODE_ENV') !== 'test') {
    var privateKey = fs.readFileSync('/etc/letsencrypt/live/www.ftfung.com/privkey.pem').toString();
    var certificate = fs.readFileSync('/etc/letsencrypt/live/www.ftfung.com/cert.pem').toString();

    var credentials = {key: privateKey, cert: certificate};
    var httpsServer = https.createServer(credentials, app);
    
    httpsServer.listen(https_port);
    console.log(`HTTPS listening on port ${https_port}!`)
    app.listen(http_port, () => console.log(`HTTP listening on port ${http_port}!`))
}
else {
    app.listen(http_port, () => console.log(`HTTP listening on port ${http_port}!`))
}

module.exports = app;