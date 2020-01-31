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
  .post(jsonBodyParser, (req, res, next) => {
    const { user_name, score, difficulty } = req.body
    const newScore = { user_name, score, difficulty }

    for (const [key, value] of Object.entries(newScore))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })

        //
    ScoresService.insertScore(
      req.app.get('db'),
      newScore
    )
      .then(score => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${score.id}`))
          .json(ScoresService.serializeScore(score))
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
