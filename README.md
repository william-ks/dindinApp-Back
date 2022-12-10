# Dindin App


- Cadastrar Usuário
- Fazer Login 
- Detalhar Perfil do Usuário Logado 
- Editar Perfil do Usuário Logado 
- Listar categorias 
- Listar transações 
- Detalhar transação 
- Cadastrar transação 
- Editar transação 
- Remover transação 
- Obter extrato de transações 
- [Extra] Filtrar transações por categoria 

## **Banco de dados**

Você precisa criar um Banco de Dados PostgreSQL chamado `dindin` contendo as seguintes tabelas e colunas:  

**ATENÇÃO! Os nomes das tabelas e das colunas a serem criados devem seguir exatamente os nomes listados abaixo.**

- users
  - id
  - name
  - email (campo único)
  - password
- categorias
  - id
  - name
- transacoes
  - id
  - description
  - value
  - date
  - category_id
  - user_id
  - type

**IMPORTANTE: em src/database/schema.sql existe um arquivo que faz toda a criação dessas tabelas**


## **Categorias**

- Alimentação
- Assinaturas e Serviços
- Casa
- Mercado
- Cuidados Pessoais
- Educação
- Família
- Lazer
- Pets
- Presentes
- Roupas
- Saúde
- Transporte
- Salário
- Vendas
- Outras receitas
- Outras despesas

## **Status Codes**

Abaixo, listamos os possíveis **_status codes_** esperados como resposta da API.

```javascript
// 200 (OK) = requisição bem sucedida
// 201 (Created) = requisição bem sucedida e algo foi criado
// 204 (No Content) = requisição bem sucedida, sem conteúdo no corpo da resposta
// 400 (Bad Request) = o servidor não entendeu a requisição pois está com uma sintaxe/formato inválido
// 401 (Unauthorized) = o usuário não está autenticado (logado)
// 403 (Forbidden) = o usuário não tem permissão de acessar o recurso solicitado
// 404 (Not Found) = o servidor não pode encontrar o recurso solicitado
```

## **Endpoints**
---
### **Cadastrar usuário**
#### `POST` `/user`

Essa é a rota que será utilizada para cadastrar um novo usuario no sistema.

- **Requisição**  
    Sem parâmetros de rota ou de query.  
    O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

  - name
  - email
  - password

- **Resposta**  
    Em caso de **sucesso**, retornaremos o codigo **201** sem body de resposta.
    Em caso de **falha na validação**, a resposta deverá possuir **_status code_** apropriado, e em seu corpo (body) possuirá um objeto com uma propriedade **message** que deverá possuir como valor um texto explicando o motivo da falha.

- **REQUISITOS OBRIGATÓRIOS**
  - Validar os campos obrigatórios:
    - name
    - email
    - password
  - Validar se o e-mail informado já existe
  - Criptografar a senha antes de persistir no banco de dados
  - Cadastrar o usuário no banco de dados

#### **Exemplo de requisição**

```javascript
// POST /user
{
    "nome": "José",
    "email": "jose@email.com",
    "senha": "123456"
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 201
// Sem body de resposta
```

```javascript
// HTTP Status 400
{
    "mensagem": "Já existe usuário cadastrado com o e-mail informado."
}
```

---
### **Login do usuário**

#### `POST` `/login`

Essa é a rota que permite o usuario cadastrado realizar o login no sistema.

- **Requisição**  
    Sem parâmetros de rota ou de query.  
    O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

  - email
  - password

- **Resposta**  
    Em caso de **sucesso**, o corpo (body) da resposta deverá possuir um objeto com a propriedade **token** que deverá possuir como valor o token de autenticação gerado e uma propriedade **usuario** que deverá possuir as informações do usuário autenticado, exceto a senha do usuário.  
    Em caso de **falha na validação**, a resposta deverá possuir **_status code_** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **mensagem** que deverá possuir como valor um texto explicando o motivo da falha.

- **REQUISITOS OBRIGATÓRIOS**

  - Validar os campos obrigatórios:
    - email
    - password
  - Verificar se o e-mail existe
  - Validar e-mail e senha
  - Criar token de autenticação com id do usuário

#### **Exemplo de requisição**

```javascript
// POST /login
{
    "email": "jose@email.com",
    "password": "123456"
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200
{
    "usuario": {
        "id": 1,
        "nome": "José",
        "email": "jose@email.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjIzMjQ5NjIxLCJleHAiOjE2MjMyNzg0MjF9.KLR9t7m_JQJfpuRv9_8H2-XJ92TSjKhGPxJXVfX6wBI"
}
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Usuário e/ou senha inválido(s)."
}
```

---

## **ATENÇÃO**: Todas as funcionalidades (endpoints) a seguir, a partir desse ponto, será exigido a autenticação do usuário.

---

### **Validações do token**

- **REQUISITOS OBRIGATÓRIOS**
  - Validar se o token foi enviado no header da requisição (Bearer Token)
  - Verificar se o token é válido
  - Consultar usuário no banco de dados pelo id contido no token informado

---
### **Detalhar usuário**

#### `GET` `/user`

Essa é a rota que será chamada quando o usuario quiser obter os dados do seu próprio perfil.  
**Atenção!:** O usuário será identificado através do ID presente no token de autenticação.

- **Requisição**  
    Sem parâmetros de rota ou de query.  
    Não deverá possuir conteúdo no corpo da requisição.

- **Resposta**  
    Em caso de **sucesso**, o corpo (body) da resposta deverá possuir um objeto que representa o usuário encontrado, com todas as suas propriedades (exceto a senha), conforme exemplo abaixo, acompanhado de **_status code_** apropriado.  
    Em caso de **falha na validação**, a resposta deverá possuir **_status code_** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **mensagem** que deverá possuir como valor um texto explicando o motivo da falha.  
    **Dica:** neste endpoint podemos fazer uso do status code 401 (Unauthorized).

#### **Exemplo de requisição**

```javascript
// GET /user
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
{
    "id": 1,
    "name": "José",
    "email": "jose@email.com"
}
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Para acessar este recurso um token de autenticação válido deve ser enviado."
}
```
---
### **Atualizar usuário**

#### `PUT` `/user`

Essa é a rota que será chamada quando o usuário quiser realizar alterações no seu próprio usuário.  
**Atenção!:** O usuário deverá ser identificado através do ID presente no token de autenticação.

- **Requisição**  
    Sem parâmetros de rota ou de query.  
    O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

  - name
  - email
  - password

- **Resposta**  
    Em caso de **sucesso**, não deveremos enviar conteúdo no corpo (body) da resposta.  
    Em caso de **falha na validação**, a resposta deverá possuir **_status code_** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **mensagem** que deverá possuir como valor um texto explicando o motivo da falha.

- **REQUISITOS OBRIGATÓRIOS**
  - Validar os campos obrigatórios:
    - name
    - email
    - password
  - Caso já exista o novo e-mail fornecido para outro usuário no banco de dados, a alteração não será permitida.

#### **Exemplo de requisição**

```javascript
// PUT /user
{
    "name": "José de Abreu",
    "email": "jose_abreu@email.com",
    "password": "j4321"
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 204
// Sem conteúdo no corpo (body) da resposta
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "O e-mail informado já está sendo utilizado por outro usuário."
}
```
---
# Pessoa B
### **Listar categorias**

#### `GET` `/categories`

Essa é a rota que será chamada quando o usuario logado quiser listar todas as categorias cadastradas.

- **Requisição**  
    Sem parâmetros de rota ou de query.  
    Não deverá possuir conteúdo no corpo (body) da requisição.

- **Resposta**  
    Em caso de **sucesso**, o corpo (body) da resposta deverá possuir um array dos objetos (categorias) encontrados.  
    Em caso de **falha na validação**, a resposta deverá possuir **_status code_** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **mensagem** que deverá possuir como valor um texto explicando o motivo da falha.


#### **Exemplo de requisição**

```javascript
// GET /categories
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
[
    {
        id: 1,
        descricao: "Roupas",
    },
    {
        id: 2,
        descricao: "Mercado",
    },
]
```

```javascript
// HTTP Status 200 / 201 / 204
[]
```
---
### **Listar transações do usuário logado**

#### `GET` `/transactions`

Essa é a rota que será chamada quando o usuario logado quiser listar todas as suas transações cadastradas.  
**Lembre-se:** Serão retornadas **apenas** transações associadas ao usuário logado, que deverá ser identificado através do ID presente no token de validação.

- **Requisição**  
    Sem parâmetros de rota ou de query.  
    Não deverá possuir conteúdo no corpo (body) da requisição.

- **Resposta**  
    Em caso de **sucesso**, o corpo (body) da resposta deverá possuir um array dos objetos (transações) encontrados.  
    Em caso de **falha na validação**, a resposta deverá possuir **_status code_** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **mensagem** que deverá possuir como valor um texto explicando o motivo da falha.

#### **Exemplo de requisição**

```javascript
// GET /transactions
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
[
    balance: {
        entradas: 2500,
        saidas: 7500
    },
    result:{
        id: 1,
        type: "saida",
        description: "Sapato amarelo",
        value: 15800,
        date: "2022-03-23T15:35:00.000Z",
        user_id: 5,
        category_id: 4,
        category_name: "Roupas",
    },
    {
        id: 3,
        type: "entrada",
        description: "Salário",
        value: 300000,
        date: "2022-03-24T15:30:00.000Z",
        user_id: 5,
        category_id: 6,
        category_name: "Salários",
    },
]
```

```javascript
// HTTP Status 200 / 201 / 204
[]
```
---
### **Detalhar uma transação do usuário logado**

#### `GET` `/transactions/:id`

Essa é a rota que será chamada quando o usuario logado quiser obter uma das suas transações cadastradas.  

- **Requisição**  
    Deverá ser enviado o ID da transação no parâmetro de rota do endpoint.  
    O corpo (body) da requisição não deverá possuir nenhum conteúdo.

- **Resposta**  
    Em caso de **sucesso**, o corpo (body) da resposta deverá possuir um objeto que representa a transação encontrada, com todas as suas propriedades, conforme exemplo abaixo, acompanhado de **_status code_** apropriado.  
    Em caso de **falha na validação**, a resposta deverá possuir **_status code_** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **mensagem** que deverá possuir como valor um texto explicando o motivo da falha.


#### **Exemplo de requisição**

```javascript
// GET /transactions/2
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
{
    "id": 2,
    "type": "entrada",
    "description": "Salário",
    "value": 300000,
    "date": "2022-03-24T15:30:00.000Z",
    "user_id": 5,
    "category_id": 6,
    "category_name": "Salários",
}
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Transação não encontrada."
}
```
---
### **Cadastrar transação para o usuário logado**

#### `POST` `/transactions`

Essa é a rota que será utilizada para cadastrar uma transação associada ao usuário logado.  .

- **Requisição**  
    Sem parâmetros de rota ou de query.  
    O corpo (body) da requisição deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

  - desciption
  - value
  - date
  - category_id
  - type (campo que será informado se a transação corresponde a uma saída ou entrada de valores)

- **Resposta**
    Em caso de **falha na validação**, a resposta deverá possuir **_status code_** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **mensagem** que deverá possuir como valor um texto explicando o motivo da falha.


#### **Exemplo de requisição**

```javascript
// POST /transactions
{
    "type": "entrada",
    "description": "Salário",
    "value": 300000,
    "date": "2022-03-24T15:30:00.000Z",
    "category_id": 6
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
// Sem conteudo (body) na resposta
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Todos os campos obrigatórios devem ser informados."
}
```
---
### **Atualizar transação do usuário logado**

#### `PUT` `/transacitons/:id`

Essa é a rota que será chamada quando o usuario logado quiser atualizar uma das suas transações cadastradas.  

- **Requisição**  
    Deverá ser enviado o ID da transação no parâmetro de rota do endpoint.  
    O corpo (body) da requisição deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

  - description
  - value
  - date
  - category_id
  - type (campo que será informado se a transação corresponde a uma saída ou entrada de valores)

- **Resposta**  
    Em caso de **sucesso**, não deveremos enviar conteúdo no corpo (body) da resposta.  
    Em caso de **falha na validação**, a resposta deverá possuir **_status code_** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **mensagem** que deverá possuir como valor um texto explicando o motivo da falha.

#### **Exemplo de requisição**

```javascript
// PUT /transactions/2
{
    "type": "entrada",
    "description": "Salário",
    "value": 300000,
    "date": "2022-03-24T15:30:00.000Z",
    "category_id": 6
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
// Sem conteúdo no corpo (body) da resposta
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Todos os campos obrigatórios devem ser informados."
}
```
---
### **Excluir transação do usuário logado**

#### `DELETE` `/transactions/:id`

Essa é a rota que será chamada quando o usuario logado quiser excluir uma das suas transações cadastradas.  

- **Requisição**  
    Deverá ser enviado o ID da transação no parâmetro de rota do endpoint.  
    O corpo (body) da requisição não deverá possuir nenhum conteúdo.

- **Resposta**  
    Em caso de **sucesso**, não deveremos enviar conteúdo no corpo (body) da resposta.  
    Em caso de **falha na validação**, a resposta deverá possuir **_status code_** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **mensagem** que deverá possuir como valor um texto explicando o motivo da falha.


#### **Exemplo de requisição**

```javascript
// DELETE /transactions/2
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
// Sem conteúdo no corpo (body) da resposta
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Transação não encontrada."
}
```
---

Link Fron-End: https://github.com/william-ks/dindinApp-front


###### tags: `back-end` `express` `nodeJS` `PostgreSQL` `API REST`
