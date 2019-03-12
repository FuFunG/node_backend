var express = require('express')
var router = express.Router()
var db = require('../db');
const _ = require('lodash')

function getUsers(req, res) {
    var sql = `SELECT id, username, createdAt FROM users`
    db.query(sql, function (err, result) {
      if (err) throw err;
      res.json(result);
    });
}

function getUser(req, res) {
  const { id } = req.params
  var sql = `SELECT id, username, createdAt FROM users WHERE id = '${id}'`
  db.query(sql, function (err, result) {
    if (err) throw err;
    if (!_.isEmpty(result)) {
      res.json({
        result: true,
        payload: {
          ...result[0]
        }
      });
    }
    else {
      res.json({result: false})
    }
  });
}

function updateUser(req, res) {
  const { id } = req.params
  const { newPassword } = req.body
  let json = {
    result: false,
    errors: {
      messages: 'some fields missing',
      fields: {
      }
    }
  }
  if (_.isUndefined(newPassword) || _.isEmpty(newPassword)) {
    json.errors.fields = {
      ...json.errors.fields,
      newPassword: 'required'
    }
    res.json(json);
  }
  else {
    var sql = `SELECT id from users WHERE id = '${id}'`
    db.query(sql, function (err, result) {
      if (err) throw err;
      if (!_.isEmpty(result)){
        sql = `UPDATE users SET password = '${newPassword}' WHERE id = '${id}'`;
        db.query(sql, function (err, result) {
          if (err) throw err;
          res.json({ result: true });
        });
      }
      else {
        res.json({result: false});
      }
    });
  }
}

function deleteUser(req, res) {
  const { id } = req.params
  // console.log(id)
  var sql = `SELECT id from users WHERE id = '${id}'`
  db.query(sql, function (err, result) {
    if (err) throw err;
    if (!_.isEmpty(result)){
      sql = `DELETE FROM users WHERE id = '${id}'`;
      db.query(sql, function (err, result) {
        if (err) throw err;
        res.json({ result: true });
      });
    }
    else {
      res.json({result: false});
    }
  });
}

function register(req, res) {
  const { username, password } = req.body
  if (_.isUndefined(username) || _.isUndefined(password) || _.isEmpty(username) || _.isEmpty(password)){
    let json = {
      result: false,
      errors: {
        messages: 'some fields missing',
        fields: {
        }
      }
    }
    if (_.isUndefined(username) || _.isEmpty(username)) {
      json.errors.fields = {
        ...json.errors.fields,
        username: 'required'
      }
    }
    if (_.isUndefined(password) || _.isEmpty(password)) {
      json.errors.fields = {
        ...json.errors.fields,
        password: 'required'
      }
    }
    res.json(json);
  }
  else {
    var sql = `SELECT id from users WHERE username = '${username}'`
    db.query(sql, function (err, result) {
      if (err) throw err;
      if (_.isEmpty(result)){
        sql = `INSERT INTO users (username, password) VALUES ('${username}', '${password}')`
        db.query(sql, function (err, result) {
          if (err) throw err;
          sql = `SELECT id from users WHERE username = '${username}' AND password = '${password}'`
          db.query(sql, function (err, result) {
            if (err) throw err;
            res.json({
              result: true,
              payload: {
                id: result[0].id
              }
            });
          });
        });
      }
      else {
        res.json({
          result: false,
          errors: {
            messages: 'username already exist'
          }
        });
      }
    });
  }
}

function login(req, res) {
  const { username, password } = req.body
  if (_.isUndefined(username) || _.isUndefined(password) || _.isEmpty(username) || _.isEmpty(password)){
    let json = {
      result: false,
      errors: {
        messages: 'some fields missing',
        fields: {
        }
      }
    }
    if (_.isUndefined(username) || _.isEmpty(username)) {
      json.errors.fields = {
        ...json.errors.fields,
        username: 'required'
      }
    }
    if (_.isUndefined(password) || _.isEmpty(password)) {
      json.errors.fields = {
        ...json.errors.fields,
        password: 'required'
      }
    }
    res.json(json);
  }
  else {
    var sql = `SELECT id from users WHERE username = '${username}' AND password = '${password}'`
    db.query(sql, function (err, result) {
      if (err) throw err;
      if (!_.isEmpty(result)){
        res.json({
          result: true,
          payload: {
            id : result[0].id
          }
        });
      }
      else {
        res.json({result: false});
      }
    });
  }
}

//export all the functions
module.exports = { getUsers, getUser, register, login, updateUser, deleteUser };