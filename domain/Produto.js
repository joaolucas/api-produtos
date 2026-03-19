class Produto {
  constructor({ id, nome, preco, estoque = 0 }) {
    this.id      = id
    this.nome    = nome
    this.preco   = preco
    this.estoque = estoque
  }

  temEstoque() {
    return this.estoque > 0
  }

  aplicarDesconto(percentual) {
    if (percentual <= 0 || percentual >= 100)
      throw new Error('Desconto deve ser entre 1 e 99%')
    this.preco = parseFloat((this.preco * (1 - percentual / 100)).toFixed(2))
    return this
  }

  toJSON() {
    return {
      id:      this.id,
      nome:    this.nome,
      preco:   this.preco,
      estoque: this.estoque
    }
  }
}

module.exports = Produto