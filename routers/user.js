var express = require('express')
var router = express.Router()
var db = require('../db');
const _ = require('lodash')

function checkField(fields) {
  return _.isUndefined(fields) || _.isEmpty(fields)
}

function checkMissing(listOfFields = []) {
  let json = {
      result: false,
      errors: {
        messages: 'some fields missing',
        fields: {
        }
      }
  }
  listOfFields.forEach((field)=>{
      if (checkField(_.values(field)[0])) {
          json.errors.fields = {
            ...json.errors.fields,
            [_.keys(field)[0]]: 'required'
          }
      }
  })
  return json
}

function getUsers(req, res) {
    var sql = `SELECT id, email, name, createdAt FROM users`
    db.query(sql, function (err, result) {
      if (err) throw err;
      if (!_.isEmpty(result)){
        res.json({
          result: true,
          payload: result
        });
      }
      else{
        res.json({
          result: false,
          errors: {
            messages: 'no user found'
          }
        });
      }
    });
}

function getUser(req, res) {
  const { id } = req.params
  var sql = `SELECT id, email, name, createdAt FROM users WHERE id = '${id}'`
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
  const { newPassword, email, password } = req.body
  if (checkField(newPassword) || checkField(email) || checkField(password)){
      const json = checkMissing([
          {newPassword},
          {email},
          {password}
      ])
      res.json(json);
  }
  else {
    var sql = `SELECT id from users WHERE id = '${id}' AND email = '${email}' AND password = '${password}'`
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
  const { email, password } = req.body
  if (checkField(email) || checkField(password)){
      const json = checkMissing([
          {email},
          {password}
      ])
      res.json(json);
  }
  else {
    var sql = `SELECT id from users WHERE id = '${id}' AND email = '${email}' AND password = '${password}'`
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
}

function register(req, res) {
  const { email, password, name } = req.body
  if (_.isUndefined(email) || _.isEmpty(email) || _.isUndefined(password) || _.isEmpty(password) || _.isUndefined(name) || _.isEmpty(name)){
    let json = {
      result: false,
      errors: {
        messages: 'some fields missing',
        fields: {
        }
      }
    }
    if (_.isUndefined(email) || _.isEmpty(email)) {
      json.errors.fields = {
        ...json.errors.fields,
        email: 'required'
      }
    }
    if (_.isUndefined(password) || _.isEmpty(password)) {
      json.errors.fields = {
        ...json.errors.fields,
        password: 'required'
      }
    }
    if (_.isUndefined(name) || _.isEmpty(name)) {
      json.errors.fields = {
        ...json.errors.fields,
        name: 'required'
      }
    }
    res.json(json);
  }
  else {
    var sql = `SELECT id from users WHERE email = '${email}'`
    db.query(sql, function (err, result) {
      if (err) throw err;
      if (_.isEmpty(result)){
        sql = `INSERT INTO users (email, password, name) VALUES ('${email}', '${password}', '${name}')`
        db.query(sql, function (err, result) {
          if (err) throw err;
          sql = `SELECT id from users WHERE email = '${email}' AND password = '${password}' AND name = '${name}'`
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
            messages: 'email already exist'
          }
        });
      }
    });
  }
}

function login(req, res) {
  const { email, password } = req.body
  if (_.isUndefined(email) || _.isUndefined(password) || _.isEmpty(email) || _.isEmpty(password)){
    let json = {
      result: false,
      errors: {
        messages: 'some fields missing',
        fields: {
        }
      }
    }
    if (_.isUndefined(email) || _.isEmpty(email)) {
      json.errors.fields = {
        ...json.errors.fields,
        email: 'required'
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
    var sql = `SELECT id, name, base64 from users WHERE email = '${email}' AND password = '${password}'`
    db.query(sql, function (err, result) {
      if (err) throw err;
      if (!_.isEmpty(result)){
        res.json({
          result: true,
          payload: {
            id : result[0].id,
            name: result[0].name,
            base64: result[0].base64
          }
        });
      }
      else {
        res.json({result: false});
      }
    });
  }
}

function updatePicture(req, res) {
  const { id } = req.params
  const { base64, email, password } = req.body
  if (checkField(base64) || checkField(email) || checkField(password)){
      const json = checkMissing([
          {base64},
          {email},
          {password}
      ])
      res.json(json);
  }
  else {
    var sql = `SELECT id from users WHERE id = '${id}' AND email = '${email}' AND password = '${password}'`
    db.query(sql, function (err, result) {
      if (err) throw err;
      if (!_.isEmpty(result)){
        sql = `UPDATE users SET base64 = '${base64}' WHERE id = '${id}'`;
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

//export all the functions
module.exports = { getUsers, getUser, register, login, updateUser, deleteUser, updatePicture };