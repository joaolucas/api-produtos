process.env.DATABASE_PATH = ':memory:'

const { test, describe, before } = require('node:test')
const assert = require('node:assert')
const request = require('supertest')
const app = require('../app')

describe('GET /produtos', () => {
  test('deve retornar lista paginada vazia', async () => {
    const res = await request(app).get('/produtos')
    assert.strictEqual(res.status, 200)
    assert.ok(Array.isArray(res.body.dados))
    assert.strictEqual(typeof res.body.total, 'number')
    assert.ok('pagina' in res.body)
    assert.ok('limite' in res.body)
  })

  test('deve aceitar parâmetros de paginação', async () => {
    const res = await request(app).get('/produtos?pagina=2&limite=5')
    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.pagina, 2)
    assert.strictEqual(res.body.limite, 5)
  })
})

describe('POST /produtos', () => {
  test('deve criar produto com dados válidos', async () => {
    const res = await request(app)
      .post('/produtos')
      .send({ nome: 'Monitor', preco: 1500, estoque: 3 })
    assert.strictEqual(res.status, 201)
    assert.strictEqual(res.body.nome, 'Monitor')
    assert.strictEqual(res.body.preco, 1500)
    assert.strictEqual(res.body.estoque, 3)
  })

  test('deve criar produto sem estoque (default 0)', async () => {
    const res = await request(app)
      .post('/produtos')
      .send({ nome: 'Webcam', preco: 350 })
    assert.strictEqual(res.status, 201)
    assert.strictEqual(res.body.estoque, 0)
  })

  test('deve rejeitar produto sem nome', async () => {
    const res = await request(app)
      .post('/produtos')
      .send({ preco: 100 })
    assert.strictEqual(res.status, 400)
    assert.ok(res.body.erros)
  })

  test('deve rejeitar produto com preço negativo', async () => {
    const res = await request(app)
      .post('/produtos')
      .send({ nome: 'Produto', preco: -10 })
    assert.strictEqual(res.status, 400)
  })

  test('deve rejeitar produto com nome muito curto', async () => {
    const res = await request(app)
      .post('/produtos')
      .send({ nome: 'Ab', preco: 100 })
    assert.strictEqual(res.status, 400)
  })
})

describe('GET /produtos/:id', () => {
  let produtoId

  before(async () => {
    const res = await request(app)
      .post('/produtos')
      .send({ nome: 'Teclado', preco: 299, estoque: 5 })
    produtoId = res.body.id
  })

  test('deve retornar produto existente', async () => {
    const res = await request(app).get(`/produtos/${produtoId}`)
    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.nome, 'Teclado')
    assert.strictEqual(res.body.estoque, 5)
  })

  test('deve retornar 404 para produto inexistente', async () => {
    const res = await request(app).get('/produtos/9999')
    assert.strictEqual(res.status, 404)
    assert.ok(res.body.erro)
  })
})

describe('PUT /produtos/:id', () => {
  let produtoId

  before(async () => {
    const res = await request(app)
      .post('/produtos')
      .send({ nome: 'Mouse', preco: 150, estoque: 10 })
    produtoId = res.body.id
  })

  test('deve atualizar produto existente incluindo estoque', async () => {
    const res = await request(app)
      .put(`/produtos/${produtoId}`)
      .send({ nome: 'Mouse Gamer', preco: 250, estoque: 8 })
    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.nome, 'Mouse Gamer')
    assert.strictEqual(res.body.preco, 250)
    assert.strictEqual(res.body.estoque, 8)
  })

  test('deve retornar 404 para produto inexistente', async () => {
    const res = await request(app)
      .put('/produtos/9999')
      .send({ nome: 'Teste' })
    assert.strictEqual(res.status, 404)
  })
})

describe('DELETE /produtos/:id', () => {
  let produtoId

  before(async () => {
    const res = await request(app)
      .post('/produtos')
      .send({ nome: 'Produto Para Deletar', preco: 50 })
    produtoId = res.body.id
  })

  test('deve remover produto existente', async () => {
    const res = await request(app).delete(`/produtos/${produtoId}`)
    assert.strictEqual(res.status, 200)
    assert.ok(res.body.mensagem)
  })

  test('deve retornar 404 após remover', async () => {
    const res = await request(app).get(`/produtos/${produtoId}`)
    assert.strictEqual(res.status, 404)
  })

  test('deve retornar 404 para produto inexistente', async () => {
    const res = await request(app).delete('/produtos/9999')
    assert.strictEqual(res.status, 404)
  })
})

describe('PATCH /produtos/:id/desconto', () => {
  let produtoId

  before(async () => {
    const res = await request(app)
      .post('/produtos')
      .send({ nome: 'Notebook', preco: 3000, estoque: 2 })
    produtoId = res.body.id
  })

  test('deve aplicar desconto válido', async () => {
    const res = await request(app)
      .patch(`/produtos/${produtoId}/desconto`)
      .send({ percentual: 10 })
    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.preco, 2700)
  })

  test('deve rejeitar percentual acima de 99', async () => {
    const res = await request(app)
      .patch(`/produtos/${produtoId}/desconto`)
      .send({ percentual: 150 })
    assert.strictEqual(res.status, 400)
    assert.ok(res.body.erros)
  })

  test('deve rejeitar percentual zero', async () => {
    const res = await request(app)
      .patch(`/produtos/${produtoId}/desconto`)
      .send({ percentual: 0 })
    assert.strictEqual(res.status, 400)
  })

  test('deve rejeitar sem percentual', async () => {
    const res = await request(app)
      .patch(`/produtos/${produtoId}/desconto`)
      .send({})
    assert.strictEqual(res.status, 400)
  })

  test('deve retornar 404 para produto inexistente', async () => {
    const res = await request(app)
      .patch('/produtos/9999/desconto')
      .send({ percentual: 10 })
    assert.strictEqual(res.status, 404)
  })
})
