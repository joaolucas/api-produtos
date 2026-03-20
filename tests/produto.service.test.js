const { test, describe } = require('node:test')
const assert = require('node:assert')
const criarProdutoService = require('../src/services/produtoService')
const Produto = require('../src/domain/Produto')

const mockRepo = {
  findAll:  () => ({ dados: [], total: 0, pagina: 1, limite: 20 }),
  findById: () => null,
  create:   (nome, preco, estoque) => new Produto({ id: 1, nome, preco, estoque }),
  update:   (id, nome, preco, estoque) => new Produto({ id, nome, preco, estoque }),
  remove:   () => {}
}

const mockRepoComProduto = {
  ...mockRepo,
  findById: () => new Produto({ id: 1, nome: 'Teclado', preco: 299, estoque: 5 })
}

describe('ProdutoService', () => {

  test('deve listar todos os produtos', () => {
    const service = criarProdutoService(mockRepo)
    const resultado = service.listarTodos()
    assert.deepStrictEqual(resultado.dados, [])
    assert.strictEqual(resultado.total, 0)
  })

  test('deve lançar erro ao buscar produto inexistente', () => {
    const service = criarProdutoService(mockRepo)
    assert.throws(
      () => service.buscarPorId(99),
      { message: 'Produto não encontrado' }
    )
  })

  test('deve buscar produto existente', () => {
    const service = criarProdutoService(mockRepoComProduto)
    const produto = service.buscarPorId(1)
    assert.strictEqual(produto.nome, 'Teclado')
  })

  test('deve criar um produto', () => {
    const service = criarProdutoService(mockRepo)
    const produto = service.criar('Teclado', 299, 0)
    assert.strictEqual(produto.nome, 'Teclado')
    assert.strictEqual(produto.preco, 299)
  })

  test('deve lançar erro ao atualizar produto inexistente', () => {
    const service = criarProdutoService(mockRepo)
    assert.throws(
      () => service.atualizar(99, 'Novo', 100, 0),
      { message: 'Produto não encontrado' }
    )
  })

  test('deve atualizar produto existente', () => {
    const service = criarProdutoService(mockRepoComProduto)
    const produto = service.atualizar(1, 'Teclado Pro', 399, 5)
    assert.strictEqual(produto.nome, 'Teclado Pro')
    assert.strictEqual(produto.preco, 399)
  })

  test('deve lançar erro ao remover produto inexistente', () => {
    const service = criarProdutoService(mockRepo)
    assert.throws(
      () => service.remover(99),
      { message: 'Produto não encontrado' }
    )
  })

  test('deve remover produto existente sem erros', () => {
    const service = criarProdutoService(mockRepoComProduto)
    assert.doesNotThrow(() => service.remover(1))
  })

  test('deve aplicar desconto em produto existente', () => {
    const service = criarProdutoService(mockRepoComProduto)
    const produto = service.aplicarDesconto(1, 10)
    assert.strictEqual(produto.preco, 269.10)
  })

  test('deve lançar erro ao aplicar desconto em produto inexistente', () => {
    const service = criarProdutoService(mockRepo)
    assert.throws(
      () => service.aplicarDesconto(99, 10),
      { message: 'Produto não encontrado' }
    )
  })

})
