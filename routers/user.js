var express = require('express')
var router = express.Router()
var db = require('../db');

/*
 * GET /user route to retrieve all the users.
 */
function getUsers(req, res) {
    var sql = `SELECT id, username, createdAt FROM users`
    db.query(sql, function (err, result) {
      if (err) throw err;
      res.json(result);
    });
}

function register(req, res) {
    const { username, password } = req.body
    var sql = `INSERT INTO users (username, password) VALUES ('${username}', '${password}')`;
    db.query(sql, function (err, result) {
      if (err) throw err;
      res.json({result: true});
    });
}


//export all the functions
module.exports = { getUsers, register };