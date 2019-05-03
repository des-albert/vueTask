/**
 *  task.route.js
 *
 *  Receives a get request at path /task
 *
 *  Establishes connection to Salesforce using session cookie containing accessToken
 *
 *  Queries Salesforce for a list of Tasks assigned to the logged on user
 *
 *
 *  Sends json reply to client
 */

const jsforce = require ('jsforce');
const express = require('express');
const taskRoute = express.Router();
const moment = require('moment');

let cacheProvider = require('../cache-provider');

taskRoute.route('/').get((req, res) => {
  if (req.session.userId ) {
    const connection = new jsforce.Connection({
      sessionId: req.session.accessToken,
      instanceUrl: req.session.instanceUrl
    });
    connection.query (
      'SELECT Id, Exception_Agile_ECO_MCO__c, Status, Subject, WhatId ' +
      'FROM Task WHERE (Subject LIKE \'%Preliminary\' OR Subject LIKE \'%FA\' OR Subject LIKE \'%Revision%\' )' +
      'AND Status <> \'Completed\' AND OwnerId = \'' + req.session.userId + '\'',
      (err, result) => {
        if (err)
          return console.error(err);
        else {
          cacheProvider.instance().set('taskKey', result.records, (err) => {
            if (err) {
              res.status(400).send('Tasks save error');
            } else {
              res.status(200).send('Tasks saved');
            }
          });
        }
      });
  }
  else
    res.status(400).send('Error: Not Logged in');
});

taskRoute.route('/progress/:id').post( (req, res) => {
  if (req.session.userId ) {
    const connection = new jsforce.Connection({
      sessionId: req.session.accessToken,
      instanceUrl: req.session.instanceUrl
    });
    connection.sobject('Task').update({
      Id: req.params.id,
      Status: 'In Progress',
      Description: 'Task In Progress - ' + moment().format('MMM Do YYYY hh:mm')
    }, (err, ret) => {
      if( err || ! ret.success) {
        return console.error(err, ret);
      }
      else {
        res.status(200).send('update success');
      }
    });
  }
  else
    res.status(400).send('Error: Not Logged in');
});

taskRoute.route('/complete/:id').post( (req, res) => {
  if (req.session.userId ) {
    const connection = new jsforce.Connection({
      sessionId: req.session.accessToken,
      instanceUrl: req.session.instanceUrl
    });
    connection.sobject('Task').update({
      Id: req.params.id,
      Status: 'Completed',
      Description: 'Task Complete - ' + moment().format('MMM Do YYYY hh:mm')
    }, (err, ret) => {
      if( err || ! ret.success) {
        return console.error(err, ret);
      }
      else {
        res.status(200).send('update success');
      }
    });
  }
  else
    res.status(400).send('Error: Not Logged in');
});

module.exports = taskRoute;
