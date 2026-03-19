const swaggerJsdoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Produtos',
      version: '1.0.0',
      description: 'API REST para gerenciamento de produtos com controle de estoque e descontos.',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Servidor local' }
    ],
    components: {
      schemas: {
        Produto: {
          type: 'object',
          properties: {
            id:      { type: 'integer', example: 1 },
            nome:    { type: 'string',  example: 'Teclado Mecânico' },
            preco:   { type: 'number',  example: 299.90 },
            estoque: { type: 'integer', example: 10 }
          }
        },
        ProdutoListagem: {
          type: 'object',
          properties: {
            dados:  { type: 'array', items: { $ref: '#/components/schemas/Produto' } },
            total:  { type: 'integer', example: 42 },
            pagina: { type: 'integer', example: 1 },
            limite: { type: 'integer', example: 20 }
          }
        },
        CriarProduto: {
          type: 'object',
          required: ['nome', 'preco'],
          properties: {
            nome:    { type: 'string',  minLength: 3, maxLength: 100, example: 'Teclado Mecânico' },
            preco:   { type: 'number',  minimum: 0.01, maximum: 99999, example: 299.90 },
            estoque: { type: 'integer', minimum: 0, example: 10 }
          }
        },
        AtualizarProduto: {
          type: 'object',
          properties: {
            nome:    { type: 'string',  minLength: 3, maxLength: 100, example: 'Teclado Mecânico Pro' },
            preco:   { type: 'number',  minimum: 0.01, maximum: 99999, example: 349.90 },
            estoque: { type: 'integer', minimum: 0, example: 5 }
          }
        },
        Desconto: {
          type: 'object',
          required: ['percentual'],
          properties: {
            percentual: { type: 'number', minimum: 1, maximum: 99, example: 10 }
          }
        },
        Erro: {
          type: 'object',
          properties: {
            erro: { type: 'string', example: 'Produto não encontrado' }
          }
        },
        ErroValidacao: {
          type: 'object',
          properties: {
            erros: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  campo:     { type: 'string',  example: 'preco' },
                  mensagem:  { type: 'string',  example: 'Preço deve ser maior que zero' }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./docs/routes/*.js']
}

module.exports = swaggerJsdoc(options)
