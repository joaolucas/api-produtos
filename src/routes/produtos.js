const express = require('express')
const router  = express.Router()
const controller = require('../controllers/produtoController')
const validar    = require('../middlewares/validar')
const { criarProdutoSchema, atualizarProdutoSchema, descontoSchema } = require('../schemas/produtoSchema')

router.get('/',                   controller.listarTodos)
router.get('/:id',                controller.buscarPorId)
router.post('/',                  validar(criarProdutoSchema),    controller.criar)
router.put('/:id',                validar(atualizarProdutoSchema), controller.atualizar)
router.delete('/:id',             controller.remover)
router.patch('/:id/desconto',     validar(descontoSchema),         controller.aplicarDesconto)

module.exports = router
