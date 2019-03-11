var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'www.ftfung.com',
    user     : 'phpmyadmin',
    password : 'some_pass',
    database : 'eventApp'
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;