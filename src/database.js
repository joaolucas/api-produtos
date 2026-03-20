const { DatabaseSync } = require('node:sqlite')

const db = new DatabaseSync(process.env.DATABASE_PATH ?? 'produtos.db')

db.exec(`
  CREATE TABLE IF NOT EXISTS produtos (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    nome    TEXT    NOT NULL,
    preco   REAL    NOT NULL,
    estoque INTEGER NOT NULL DEFAULT 0
  )
`)

module.exports = db