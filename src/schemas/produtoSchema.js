const { z } = require('zod')

const criarProdutoSchema = z.object({
  nome:  z.string({ required_error: 'Nome é obrigatório' })
          .min(3, 'Nome deve ter no mínimo 3 caracteres')
          .max(100, 'Nome deve ter no máximo 100 caracteres'),

  preco: z.number({ required_error: 'Preço é obrigatório',
                    invalid_type_error: 'Preço deve ser um número' })
          .positive('Preço deve ser maior que zero')
          .max(99999, 'Preço muito alto'),

  estoque: z.number().int().min(0).optional()
})

const atualizarProdutoSchema = z.object({
  nome:  z.string()
          .min(3, 'Nome deve ter no mínimo 3 caracteres')
          .max(100, 'Nome deve ter no máximo 100 caracteres')
          .optional(),

  preco: z.number({ invalid_type_error: 'Preço deve ser um número' })
          .positive('Preço deve ser maior que zero')
          .max(99999, 'Preço muito alto')
          .optional(),

  estoque: z.number().int().min(0).optional()
})

const descontoSchema = z.object({
  percentual: z.number({
    required_error: 'Percentual é obrigatório',
    invalid_type_error: 'Percentual deve ser um número'
  })
  .min(1, 'Desconto mínimo é 1%')
  .max(99, 'Desconto máximo é 99%')
})

module.exports = { criarProdutoSchema, atualizarProdutoSchema, descontoSchema }
