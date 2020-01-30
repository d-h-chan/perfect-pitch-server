const Treeize = require('treeize')

const ScoresService = {
  getAllScores(db) {
    return db
      .from('scores AS scr')
      .select(
        'scr.id',
        'scr.user_name',
        'scr.score',
        'scr.difficulty',
      )
  },

  serializeScores(scores) {
    return scores.map(this.serializeScore)
  },

  serializeScore(score) {
    const scoreTree = new Treeize()

    // Some light hackiness to allow for the fact that `treeize`
    // only accepts arrays of objects, and we want to use a single
    // object.
    const scoreData = scoreTree.grow([ score ]).getData()[0]
    return {
      id: scoreData.id,
      user_name: scoreData.user_name,
      score: scoreData.score,
      difficulty: scoreData.difficulty,
    }
  },
}

module.exports = ScoresService