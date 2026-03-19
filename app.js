const express = require('express')
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./docs/swagger')
const app = express()

app.use(express.json())

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

const produtosRouter = require('./routes/produtos')
app.use('/produtos', produtosRouter)

const errorHandler = require('./middlewares/errorHandler')
app.use(errorHandler)

module.exports = app
