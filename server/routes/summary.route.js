/**
 *  summary.route.js
 *
 *  Receives a get request at path /summary
 *
 *  Establishes connection to Salesforce using session cookie containing accessToken
 *
 *  Responds with Task, Exception and Opportunity data
 *
 *        Id:
 *        Exception_Agile_ECO_MCO__c:
 *        Status:
 *        Subject:
 *        WhatId:
 *        ECO_MCO_status:
 *        ExceptionId:
 *        ExceptionNumber:
 *        Name:
 *
 */

const express = require('express');
const summaryRoute = express.Router();

let cacheProvider = require('../cache-provider');

summaryRoute.route('/').get((req, res) => {
  if (req.session.userId ) {

    let exceptions = cacheProvider.instance().get('exceptionKey');

    cacheProvider.instance().get('taskKey', (err, tasks) => {
      if (err)
        console.error(err);
      else {
        for (let i = 0; i < tasks.length; i++) {
          delete tasks[i].attributes;
          let ex = exceptions.find(exception => (exception.Id === tasks[i].WhatId));
          tasks[i].ExceptionId = ex.Id;
          if (tasks[i].Exception_Agile_ECO_MCO__c == null)
            tasks[i].Exception_Agile_ECO_MCO__c = '';
          if (tasks[i].ECO_MCO_status == null)
            tasks[i].ECO_MCO_status = '';
          tasks[i].ExceptionNumber = ex.Exception_Number__c;
          tasks[i].Name = ex.Name;
        }
        res.json(tasks);
      }
    });
  }
  else
    res.status(400).send('Error: Not Logged in');

});

module.exports = summaryRoute;
