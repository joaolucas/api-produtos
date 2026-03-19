const { test, describe } = require('node:test')
const assert = require('node:assert')
const Produto = require('../domain/Produto')

describe('Produto — entidade', () => {

  test('deve criar um produto corretamente', () => {
    const p = new Produto({ id: 1, nome: 'Teclado', preco: 299.90 })
    assert.strictEqual(p.nome, 'Teclado')
    assert.strictEqual(p.preco, 299.90)
    assert.strictEqual(p.estoque, 0)
  })

  test('deve informar se tem estoque', () => {
    const p = new Produto({ id: 1, nome: 'Mouse', preco: 99, estoque: 5 })
    assert.strictEqual(p.temEstoque(), true)
  })

  test('deve informar que não tem estoque', () => {
    const p = new Produto({ id: 1, nome: 'Mouse', preco: 99, estoque: 0 })
    assert.strictEqual(p.temEstoque(), false)
  })

  test('deve aplicar desconto corretamente', () => {
    const p = new Produto({ id: 1, nome: 'Monitor', preco: 1000 })
    p.aplicarDesconto(10)
    assert.strictEqual(p.preco, 900)
  })

  test('deve lançar erro para desconto inválido', () => {
    const p = new Produto({ id: 1, nome: 'Monitor', preco: 1000 })
    assert.throws(
      () => p.aplicarDesconto(0),
      { message: 'Desconto deve ser entre 1 e 99%' }
    )
  })

  test('deve lançar erro para desconto acima de 99%', () => {
    const p = new Produto({ id: 1, nome: 'Monitor', preco: 1000 })
    assert.throws(
      () => p.aplicarDesconto(100),
      { message: 'Desconto deve ser entre 1 e 99%' }
    )
  })

})