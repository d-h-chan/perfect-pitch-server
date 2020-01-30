function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      scores
      RESTART IDENTITY CASCADE`
  )
}

module.exports = { 
  cleanTables,
}