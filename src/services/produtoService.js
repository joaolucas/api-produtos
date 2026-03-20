const defaultRepo = require('../repositories/produtoRepository')
const NotFoundError = require('../errors/NotFoundError')

const criarProdutoService = (repo = defaultRepo) => ({
  listarTodos: (pagina, limite) => repo.findAll(pagina, limite),

  buscarPorId: (id) => {
    const produto = repo.findById(id)
    if (!produto) throw new NotFoundError('Produto não encontrado')
    return produto
  },

  criar: (nome, preco, estoque) => repo.create(nome, preco, estoque),

  atualizar: (id, nome, preco, estoque) => {
    const produto = repo.findById(id)
    if (!produto) throw new NotFoundError('Produto não encontrado')
    return repo.update(
      id,
      nome    ?? produto.nome,
      preco   ?? produto.preco,
      estoque ?? produto.estoque
    )
  },

  remover: (id) => {
    const produto = repo.findById(id)
    if (!produto) throw new NotFoundError('Produto não encontrado')
    repo.remove(id)
  },

  aplicarDesconto: (id, percentual) => {
    const produto = repo.findById(id)
    if (!produto) throw new NotFoundError('Produto não encontrado')
    produto.aplicarDesconto(percentual)
    return repo.update(id, produto.nome, produto.preco, produto.estoque)
  }
})

module.exports = criarProdutoService
