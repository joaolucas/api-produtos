const validar = (schema) => (req, res, next) => {
  const resultado = schema.safeParse(req.body)

  if (!resultado.success) {
    const erros = resultado.error.issues.map(e => ({
      campo: e.path.join('.'),
      mensagem: e.message
    }))
    return res.status(400).json({ erros })
  }

  req.body = resultado.data
  next()
}

module.exports = validar