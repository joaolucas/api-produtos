const NotFoundError = require('../errors/NotFoundError')

const errorHandler = (err, req, res, next) => {
  if (err instanceof NotFoundError) {
    return res.status(404).json({ erro: err.message })
  }

  console.error(err)
  res.status(500).json({ erro: 'Erro interno do servidor' })
}

module.exports = errorHandler
