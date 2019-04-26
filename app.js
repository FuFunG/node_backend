const express = require('express')
const app = express()
const http_port = 3000
const https_port = 3001
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
var router = express.Router();

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
router.route("/user")
    .get(user.getUsers);

router.route("/user/register")
    .post(user.register);

router.route("/user/login")
    .post(user.login);
    
router.route("/user/:id")
    .get(user.getUser)
    .put(user.updateUser)
    .delete(user.deleteUser);

router.route("/user/photo/:id")
    .put(user.updatePicture);

// Event API
router.route("/event")
    .get(event.getEvents)
    .post(event.postEvent);

router.route("/event/:id")
    .get(event.getEvent)
    .put(event.updateEvent)
    .delete(event.deleteEvent);

// Event User API
router.route("/event_user")
    .get(event_user.getEventUsers)
    .post(event_user.postEventUser);

router.route("/event_user/:id")
   .get(event_user.getEventUser);

router.route("/event_user/event/:id")
    .get(event_user.getEventUserByEventId);

router.route("/event_user/user/:id")
    .get(event_user.getEventUserByUserId);

router.route("/event_user/event/:eventId/user/:userId")
    .delete(event_user.deleteEventUser)
    .get(event_user.checkUserJoined);

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(404).send('Not Found')
  })

app.use('/api/v1', router);

var server = http.createServer(app)

if(config.util.getEnv('NODE_ENV') !== 'test') {
    var privateKey = fs.readFileSync('/etc/letsencrypt/live/www.ftfung.com/privkey.pem').toString();
    var certificate = fs.readFileSync('/etc/letsencrypt/live/www.ftfung.com/cert.pem').toString();

    var credentials = {key: privateKey, cert: certificate};
    var httpsServer = https.createServer(credentials, app);
    
    httpsServer.listen(https_port);
    console.log(`HTTPS listening on port ${https_port}!`)
    
    server.listen(http_port);
    console.log(`HTTP listening on port ${http_port}!`);
    // app.listen(http_port, () => console.log(`HTTP listening on port ${http_port}!`))
}
else {
    server.listen(http_port);
    console.log(`HTTP listening on port ${http_port}!`);
    // app.listen(http_port, () => console.log(`HTTP listening on port ${http_port}!`))
}

module.exports = app;