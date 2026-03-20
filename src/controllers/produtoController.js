const criarProdutoService = require('../services/produtoService')
const service = criarProdutoService()

const listarTodos = (req, res, next) => {
  try {
    const pagina = parseInt(req.query.pagina) || 1
    const limite = Math.min(parseInt(req.query.limite) || 20, 100)
    res.json(service.listarTodos(pagina, limite))
  } catch (erro) {
    next(erro)
  }
}

const buscarPorId = (req, res, next) => {
  try {
    res.json(service.buscarPorId(Number(req.params.id)))
  } catch (erro) {
    next(erro)
  }
}

const criar = (req, res, next) => {
  try {
    const { nome, preco, estoque } = req.body
    res.status(201).json(service.criar(nome, preco, estoque))
  } catch (erro) {
    next(erro)
  }
}

const atualizar = (req, res, next) => {
  try {
    const { nome, preco, estoque } = req.body
    res.json(service.atualizar(Number(req.params.id), nome, preco, estoque))
  } catch (erro) {
    next(erro)
  }
}

const remover = (req, res, next) => {
  try {
    service.remover(Number(req.params.id))
    res.json({ mensagem: 'Produto removido com sucesso' })
  } catch (erro) {
    next(erro)
  }
}

const aplicarDesconto = (req, res, next) => {
  try {
    const { percentual } = req.body
    res.json(service.aplicarDesconto(Number(req.params.id), percentual))
  } catch (erro) {
    next(erro)
  }
}

module.exports = { listarTodos, buscarPorId, criar, atualizar, remover, aplicarDesconto }
