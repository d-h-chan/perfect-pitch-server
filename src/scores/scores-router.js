const express = require('express')
const path = require('path')
const ScoresService = require('./scores-service')
const scoresRouter = express.Router()
const jsonBodyParser = express.json()

scoresRouter
  .route('/')
  .get((req, res, next) => {
    ScoresService.getAllScores(req.app.get('db'))
      .then(things => {
        res.json(ScoresService.serializeScores(things))
      })
      .catch(next)
  })

module.exports = scoresRouter
