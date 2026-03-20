const db      = require('../database')
const Produto = require('../domain/Produto')

const findAll = (pagina = 1, limite = 20) => {
  const offset = (pagina - 1) * limite
  const dados  = db.prepare('SELECT * FROM produtos LIMIT ? OFFSET ?')
    .all(limite, offset)
    .map(p => new Produto(p))
  const { total } = db.prepare('SELECT COUNT(*) as total FROM produtos').get()
  return { dados, total, pagina, limite }
}

const findById = (id) => {
  const row = db.prepare('SELECT * FROM produtos WHERE id = ?').get(id)
  return row ? new Produto(row) : null
}

const create = (nome, preco, estoque = 0) => {
  const res = db.prepare(
    'INSERT INTO produtos (nome, preco, estoque) VALUES (?, ?, ?)'
  ).run(nome, preco, estoque)
  return findById(res.lastInsertRowid)
}

const update = (id, nome, preco, estoque) => {
  db.prepare(
    'UPDATE produtos SET nome = ?, preco = ?, estoque = ? WHERE id = ?'
  ).run(nome, preco, estoque, id)
  return findById(id)
}

const remove = (id) => {
  db.prepare('DELETE FROM produtos WHERE id = ?').run(id)
}

module.exports = { findAll, findById, create, update, remove }
