const express = require('express')
const path = require('path')
const ScoresService = require('./scores-service')
const scoresRouter = express.Router()
const jsonBodyParser = express.json()

scoresRouter
  .route('/')
  .get((req, res, next) => {
    ScoresService.getAllScores(req.app.get('db'))
      .then(scores => {
        res.json(ScoresService.serializeScores(scores))
      })
      .catch(next)
  })

scoresRouter
  .route('/:score_id')
  .all(checkScoreExists)
  .get((req, res) => {
    res.json(ScoresService.serializeScore(res.score))
  })

async function checkScoreExists(req, res, next) {
  try {
    const score = await ScoresService.getById(
      req.app.get('db'),
      req.params.score_id
    )

    if (!score)
      return res.status(404).json({
        error: `Score doesn't exist`
      })

    res.score = score
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = scoresRouter
