# API de Produtos

API REST para gerenciamento de produtos com controle de estoque e aplicação de descontos.

## Tecnologias

| Tecnologia | Uso |
|---|---|
| Node.js | Runtime (CommonJS) |
| Express 5 | Framework HTTP |
| SQLite (`node:sqlite`) | Banco de dados local |
| Zod | Validação de entrada |
| dotenv | Variáveis de ambiente |
| swagger-ui-express | Documentação interativa |
| node:test | Testes unitários e de integração |
| supertest | Testes HTTP |

---

## Instalação e execução

```bash
# 1. Clone o repositório
git clone <url-do-repo>
cd api-produtos

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env

# 4. Inicie o servidor
npm start
```

O servidor sobe em `http://localhost:3000`.

---

## Variáveis de ambiente

Crie um arquivo `.env` na raiz com base no `.env.example`:

| Variável | Padrão | Descrição |
|---|---|---|
| `PORT` | `3000` | Porta do servidor HTTP |
| `DATABASE_PATH` | `produtos.db` | Caminho do arquivo SQLite. Use `:memory:` para banco em memória (testes) |

---

## Documentação interativa

Com o servidor rodando, acesse:

```
http://localhost:3000/docs
```

A interface Swagger UI lista todos os endpoints, schemas de request/response e permite testar as rotas diretamente pelo browser.

---

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/produtos` | Lista produtos (paginado) |
| `GET` | `/produtos/:id` | Busca produto por ID |
| `POST` | `/produtos` | Cria um produto |
| `PUT` | `/produtos/:id` | Atualiza um produto |
| `DELETE` | `/produtos/:id` | Remove um produto |
| `PATCH` | `/produtos/:id/desconto` | Aplica desconto percentual ao preço |

### Paginação

`GET /produtos` aceita os query params `pagina` e `limite`:

```
GET /produtos?pagina=2&limite=10
```

Resposta:

```json
{
  "dados": [ ... ],
  "total": 42,
  "pagina": 2,
  "limite": 10
}
```

### Exemplos de request

**Criar produto**
```bash
curl -X POST http://localhost:3000/produtos \
  -H "Content-Type: application/json" \
  -d '{"nome": "Teclado Mecânico", "preco": 299.90, "estoque": 10}'
```

**Aplicar desconto de 15%**
```bash
curl -X PATCH http://localhost:3000/produtos/1/desconto \
  -H "Content-Type: application/json" \
  -d '{"percentual": 15}'
```

---

## Testes

```bash
npm test
```

Executa dois arquivos de teste:

| Arquivo | Tipo | Cobertura |
|---|---|---|
| `tests/produto.domain.test.js` | Unitário | Lógica da entidade `Produto` |
| `tests/produto.service.test.js` | Unitário | Camada de serviço com mock do repositório |
| `tests/produto.controller.test.js` | Integração | Endpoints HTTP com SQLite in-memory |

---

## Arquitetura

O projeto segue uma arquitetura em camadas com separação clara de responsabilidades:

```
Requisição HTTP
     │
     ▼
 [ Route ]          — define o caminho e aplica middlewares
     │
     ▼
 [ Middleware ]      — valida o body com Zod antes de chegar no controller
     │
     ▼
 [ Controller ]      — recebe req/res, chama o service, devolve a resposta HTTP
     │
     ▼
 [ Service ]         — orquestra as regras de negócio
     │
     ▼
 [ Repository ]      — acesso ao banco de dados (SQLite)
     │
     ▼
 [ Domain ]          — entidade Produto com lógica de negócio (desconto, estoque)
```

### Descrição de cada camada

#### `domain/Produto.js`
Entidade central do sistema. Encapsula os atributos do produto e contém regras de negócio puras (sem dependência de banco ou framework):
- `temEstoque()` — retorna `true` se `estoque > 0`
- `aplicarDesconto(percentual)` — recalcula o preço; lança erro se o percentual for inválido

#### `repositories/produtoRepository.js`
Responsável exclusivamente pelo acesso ao banco. Executa SQL diretamente via `node:sqlite` e retorna objetos da classe `Produto`. Não contém regras de negócio.

Funções: `findAll(pagina, limite)`, `findById(id)`, `create(...)`, `update(...)`, `remove(id)`

#### `services/produtoService.js`
Camada de orquestração. Criado via factory `criarProdutoService(repo)`, o que permite injetar um repositório falso nos testes sem precisar tocar no banco.

Garante consistência: verifica se o produto existe antes de atualizar, remover ou aplicar desconto. Lança `NotFoundError` quando o recurso não é encontrado.

#### `controllers/produtoController.js`
Faz a ponte entre HTTP e o service. Lê parâmetros da requisição (`req.params`, `req.query`, `req.body`), chama o service e devolve a resposta com o status code correto. Em caso de erro, passa para o middleware global via `next(err)`.

#### `middlewares/validar.js`
Middleware genérico de validação. Recebe um schema Zod, valida `req.body` e retorna `400` com lista de erros caso a validação falhe. Se válido, substitui `req.body` pelos dados já tipados/transformados pelo Zod.

#### `middlewares/errorHandler.js`
Middleware global de tratamento de erros (registrado por último no `app.js`). Diferencia tipos de erro:
- `NotFoundError` → `404`
- Qualquer outro → `500`

#### `errors/NotFoundError.js`
Classe de erro customizada que carrega `statusCode = 404`. Permite que o `errorHandler` identifique o tipo de erro sem verificar a mensagem.

#### `schemas/produtoSchema.js`
Schemas Zod que definem as regras de validação de entrada para cada operação (`criar`, `atualizar`, `desconto`). Mensagens de erro em português.

---

## Estrutura de arquivos

```
api-produtos/
├── app.js                          # Configuração do Express (sem listen)
├── index.js                        # Entry point — inicia o servidor
├── database.js                     # Conexão com o SQLite
├── .env                            # Variáveis de ambiente (não versionado)
├── .env.example                    # Modelo de variáveis de ambiente
│
├── domain/
│   └── Produto.js                  # Entidade com regras de negócio
│
├── repositories/
│   └── produtoRepository.js        # Acesso ao banco de dados
│
├── services/
│   └── produtoService.js           # Lógica de negócio (factory)
│
├── controllers/
│   └── produtoController.js        # Handlers HTTP
│
├── routes/
│   └── produtos.js                 # Definição das rotas
│
├── middlewares/
│   ├── validar.js                  # Validação com Zod
│   └── errorHandler.js             # Tratamento global de erros
│
├── schemas/
│   └── produtoSchema.js            # Schemas de validação
│
├── errors/
│   └── NotFoundError.js            # Erro customizado 404
│
├── docs/
│   ├── swagger.js                  # Configuração do OpenAPI spec
│   └── routes/
│       └── produtos.js             # Anotações JSDoc dos endpoints
│
└── tests/
    ├── produto.domain.test.js      # Testes da entidade
    ├── produto.service.test.js     # Testes do service
    └── produto.controller.test.js  # Testes de integração HTTP
```
