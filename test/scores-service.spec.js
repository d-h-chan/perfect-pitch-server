const knex = require('knex')
const helpers = require('./test-helpers')
const app = require('../src/app')

describe(`scores service object`, function () {

  let db

  let testScores = [
    {
      id: 1,
      user_name: 'test user 1',
      score: 20,
      difficulty: "easy"
    },
    {
      id: 2,
      user_name: 'test user 2',
      score: 15,
      difficulty: "medium"
    },
    {
      id: 3,
      user_name: 'test user 3',
      score: 10,
      difficulty: "hard"
    },
  ]
  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  before(() => {
    return db
      .into('scores')
      .insert(testScores)
  })

  afterEach('cleanup', () => helpers.cleanTables(db))

  after(() => db.destroy())

  describe(`Get /api/scores`, () => {
    context(`Given there are no scores`, () => {

      beforeEach('cleanup', () => helpers.cleanTables(db))

      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/scores')
          .expect(200, [])
      })
    })

    context(`Given there are scores`, () => {

      beforeEach(() => {
        return db
          .into('scores')
          .insert(testScores)
      })

      it(`responds with 200 and all of the scores`, () => {
        return supertest(app)
          .get('/api/scores')
          .expect(200, testScores)
      })
    })
  })

  describe(`Get /api/scores/:id`, () => {
    context(`Given there are no scores`, () => {

      beforeEach('cleanup', () => helpers.cleanTables(db))

      it(`responds with 404`, () => {
        const scoreId = 123456
        return supertest(app)
          .get(`/api/scores/${scoreId}`)
          .expect(404, { error: `Score doesn't exist` })
      })
    })

    context(`Given there are scores`, () => {

      beforeEach(() => {
        return db
          .into('scores')
          .insert(testScores)
      })

      it(`responds with 200 and the score`, () => {
        const scoreId = 1
        return supertest(app)
          .get(`/api/scores/${scoreId}`)
          .expect(200, testScores[0])
      })
    })
  })
})