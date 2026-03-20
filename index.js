require('dotenv').config()

if (!process.env.DATABASE_PATH) {
  console.warn('⚠️  DATABASE_PATH não definida, usando produtos.db')
}

const app = require('./src/app')

const PORT = process.env.PORT ?? 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})
