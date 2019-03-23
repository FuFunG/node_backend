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

function getEvents(req, res) {
    var sql = `SELECT * FROM event`
    db.query(sql, function (err, result) {
      if (err) throw err;
      res.json(result);
    });
}

function getEvent(req, res) {
    const { id } = req.params
    var sql = `SELECT * FROM users WHERE id = '${id}'`
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

function postEvent(req, res) {
    const { userId, title, description, startAt, endAt, address } = req.body
    if (checkField(userId) || checkField(title) || checkField(description) || checkField(startAt) || checkField(endAt) || checkField(address)){
        const json = checkMissing([
            {userId},
            {title},
            {description},
            {startAt},
            {endAt},
            {address}
        ])
        res.json(json);
    }
    else {
        sql = `INSERT INTO Event (userId, title, description, startAt, endAt, address) VALUES ('${userId}', '${title}', '${description}', '${startAt}', '${endAt}', '${address}')`
        db.query(sql, function (err, result) {
            if (err) throw err;
            res.json({
              result: true,
              payload: {
                  id: result.insertId
              }
            });
        });
    }
}

module.exports = { getEvents, getEvent, postEvent };