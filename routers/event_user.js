const db = require('../db');
const _ = require('lodash')
// const moment = require('moment');

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

function getEventUsers(req, res) {
    var sql = `SELECT * FROM Event_User`
    db.query(sql, function (err, result) {
      if (err) throw err;
      if (!_.isEmpty(result)) {
        res.json({
          result: true,
          payload: result
        });
      }
      else {
        res.json({result: false})
      }
    });
}

function getEventUser(req, res) {
    const { id } = req.params
    var sql = `SELECT * FROM Event_User WHERE id = '${id}'`
    db.query(sql, function (err, result) {
      if (err) throw err;
      if (!_.isEmpty(result)) {
        res.json({
          result: true,
          payload: result
        });
      }
      else {
        res.json({result: false})
      }
    });
}

function getEventUserByEventId(req, res) {
    const { id } = req.params
    var sql = `SELECT * FROM Event_User WHERE eventId = '${id}'`
    db.query(sql, function (err, result) {
      if (err) throw err;
      if (!_.isEmpty(result)) {
        res.json({
          result: true,
          payload: result
        });
      }
      else {
        res.json({result: false})
      }
    });
}

function getEventUserByUserId(req, res) {
    const { id } = req.params
    var sql = `SELECT 
      Event_User.*,
      Event.title,
      Event.startAt,
      Event.endAt,
      Event.description,
      Event.address
      FROM Event_User, Event WHERE Event_User.userId = '${id}' AND Event_User.eventId = Event.id`
    // var sql = `SELECT * FROM Event_User WHERE userId = '${id}'`
    mixed = []
    db.query(sql,async function (err, result) {
      if (err) throw err;
      if (!_.isEmpty(result)) {
        res.json({
          result: true,
          payload: result
        });
      }
      else {
        res.json({result: false})
      }
    });
}

function postEventUser(req, res) {
    const { eventId, userId } = req.body
    if (checkField(eventId) || checkField(userId)){
        const json = checkMissing([
            {eventId},
            {userId}
        ])
        res.json(json);
    }
    else {
        var sql = `SELECT id from Event WHERE id = '${eventId}'`
        db.query(sql, function (err, result) {
            if (err) throw err;
            if(_.isEmpty(result)) {
                res.json({
                    result: false,
                    errors: {
                        messages: 'Event or User not created'
                    }
                });
            }
            else {
                sql = `SELECT id from users WHERE id = '${userId}'`
                db.query(sql, function (err, result) {
                    if (err) throw err;
                    if(_.isEmpty(result)) {
                        res.json({
                            result: false,
                            errors: {
                                messages: 'Event or User not created'
                            }
                        });
                    }
                    else {
                        sql = `SELECT id from Event_User WHERE eventId = '${eventId}' and userId = '${userId}'`
                        db.query(sql, function (err, result) {
                            if (err) throw err;
                            if (_.isEmpty(result)){
                                sql = `INSERT INTO Event_User (eventId, userId) VALUES ('${eventId}', '${userId}')`
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
                            else {
                                res.json({
                                    result: false,
                                    errors: {
                                        messages: 'This user already join the event.'
                                    }
                                });
                            }
                        })
                    }
                })
            }
        })
        
    }
}

function deleteEventUser(req, res) {
    const { eventId, userId } = req.params
    if (checkField(eventId) || checkField(userId)){
        const json = checkMissing([
            {eventId},
            {userId}
        ])
        res.json(json);
    }
    else {
        var sql = `SELECT id from Event_User WHERE eventId = '${eventId}' and userId = '${userId}'`
        db.query(sql, function (err, result) {
            if (err) throw err;
            if (!_.isEmpty(result)){
                sql = `DELETE FROM Event_User WHERE eventId = '${eventId}' and userId = '${userId}'`;
                db.query(sql, function (err, result) {
                    if (err) throw err;
                    res.json({ result: true });
                });
            }
            else {
                res.json({
                  result: false,
                  errors: {
                    messages: 'This user have not join the event.'
                  }
                });
            }
        });
    }
}

function checkUserJoined(req, res) {
  const { eventId, userId } = req.params
  if (checkField(eventId) || checkField(userId)){
      const json = checkMissing([
          {eventId},
          {userId}
      ])
      res.json(json);
  }
  else {
      var sql = `SELECT * from Event_User WHERE eventId = '${eventId}' and userId = '${userId}'`
      db.query(sql, function (err, result) {
          if (err) throw err;
          if (!_.isEmpty(result)){
            res.json({
              result: true,
              payload: result
            });
          }
          else {
              res.json({
                result: false,
                errors: {
                  messages: 'This user have not join the event.'
                }
              });
          }
      });
  }
}

module.exports = { getEventUsers, getEventUser, getEventUserByEventId, getEventUserByUserId, postEventUser, deleteEventUser, checkUserJoined };