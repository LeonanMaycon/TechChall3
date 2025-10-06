# Contrato de API - Tech Challenge Posts

Este documento define o contrato completo da API REST para o sistema de posts do Tech Challenge.

## 📋 Visão Geral

**Base URL:** `http://localhost:3001/api`  
**Content-Type:** `application/json`  
**Autenticação:** Bearer Token (JWT)

## 🔐 Autenticação

### POST /auth/login
Autentica um usuário no sistema.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response 200 - Sucesso:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-123",
    "name": "João Silva",
    "email": "joao@email.com",
    "role": "teacher"
  }
}
```

**Response 401 - Credenciais Inválidas:**
```json
{
  "message": "Credenciais inválidas",
  "errors": ["Usuário ou senha incorretos"]
}
```

**Response 400 - Dados Inválidos:**
```json
{
  "message": "Dados de entrada inválidos",
  "errors": [
    "Username é obrigatório",
    "Password deve ter pelo menos 6 caracteres"
  ]
}
```

### POST /auth/refresh
Renova o token de acesso usando o refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200 - Sucesso:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 401 - Token Inválido:**
```json
{
  "message": "Refresh token inválido ou expirado"
}
```

### POST /auth/logout
Realiza logout do usuário.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response 200 - Sucesso:**
```json
{
  "message": "Logout realizado com sucesso"
}
```

## 📝 Posts

### GET /posts
Lista posts com paginação e busca.

**Query Parameters:**
- `search` (opcional): Termo de busca
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 10)

**Exemplo de Request:**
```
GET /posts?search=react&page=1&limit=10
```

**Response 200 - Sucesso:**
```json
{
  "posts": [
    {
      "id": "post-123",
      "title": "Introdução ao React",
      "content": "<p>React é uma biblioteca JavaScript...</p>",
      "authorId": "user-123",
      "authorName": "João Silva",
      "excerpt": "React é uma biblioteca JavaScript para construir interfaces de usuário...",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10,
  "totalPages": 3
}
```

**Response 400 - Parâmetros Inválidos:**
```json
{
  "message": "Parâmetros de query inválidos",
  "errors": [
    "Page deve ser um número positivo",
    "Limit deve estar entre 1 e 100"
  ]
}
```

### GET /posts/:id
Obtém um post específico por ID.

**Path Parameters:**
- `id` (obrigatório): ID do post

**Exemplo de Request:**
```
GET /posts/post-123
```

**Response 200 - Sucesso:**
```json
{
  "id": "post-123",
  "title": "Introdução ao React",
  "content": "<p>React é uma biblioteca JavaScript para construir interfaces de usuário...</p>",
  "authorId": "user-123",
  "authorName": "João Silva",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Response 404 - Post Não Encontrado:**
```json
{
  "message": "Post não encontrado",
  "errors": ["Post com ID 'post-123' não existe"]
}
```

### POST /posts
Cria um novo post.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "title": "Meu Novo Post",
  "content": "<p>Conteúdo do post em HTML...</p>",
  "authorId": "user-123"
}
```

**Response 201 - Criado com Sucesso:**
```json
{
  "id": "post-456",
  "title": "Meu Novo Post",
  "content": "<p>Conteúdo do post em HTML...</p>",
  "authorId": "user-123",
  "authorName": "João Silva",
  "createdAt": "2024-01-15T11:00:00Z",
  "updatedAt": "2024-01-15T11:00:00Z"
}
```

**Response 400 - Dados Inválidos:**
```json
{
  "message": "Dados de entrada inválidos",
  "errors": [
    "Title é obrigatório",
    "Title deve ter pelo menos 3 caracteres",
    "Content é obrigatório",
    "Content deve ter pelo menos 10 caracteres",
    "AuthorId é obrigatório"
  ]
}
```

**Response 401 - Não Autenticado:**
```json
{
  "message": "Token de acesso inválido ou expirado"
}
```

**Response 403 - Sem Permissão:**
```json
{
  "message": "Apenas professores podem criar posts",
  "errors": ["Role 'student' não tem permissão para criar posts"]
}
```

### PUT /posts/:id
Atualiza um post existente.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Path Parameters:**
- `id` (obrigatório): ID do post

**Request Body:**
```json
{
  "title": "Título Atualizado",
  "content": "<p>Conteúdo atualizado em HTML...</p>"
}
```

**Response 200 - Atualizado com Sucesso:**
```json
{
  "id": "post-123",
  "title": "Título Atualizado",
  "content": "<p>Conteúdo atualizado em HTML...</p>",
  "authorId": "user-123",
  "authorName": "João Silva",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T12:00:00Z"
}
```

**Response 400 - Dados Inválidos:**
```json
{
  "message": "Dados de entrada inválidos",
  "errors": [
    "Title é obrigatório",
    "Title deve ter pelo menos 3 caracteres",
    "Content é obrigatório",
    "Content deve ter pelo menos 10 caracteres"
  ]
}
```

**Response 401 - Não Autenticado:**
```json
{
  "message": "Token de acesso inválido ou expirado"
}
```

**Response 403 - Sem Permissão:**
```json
{
  "message": "Apenas o autor ou professores podem editar este post",
  "errors": ["Usuário não tem permissão para editar este post"]
}
```

**Response 404 - Post Não Encontrado:**
```json
{
  "message": "Post não encontrado",
  "errors": ["Post com ID 'post-123' não existe"]
}
```

### DELETE /posts/:id
Exclui um post.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Path Parameters:**
- `id` (obrigatório): ID do post

**Exemplo de Request:**
```
DELETE /posts/post-123
```

**Response 204 - Excluído com Sucesso:**
```
(No Content - sem body)
```

**Response 401 - Não Autenticado:**
```json
{
  "message": "Token de acesso inválido ou expirado"
}
```

**Response 403 - Sem Permissão:**
```json
{
  "message": "Apenas o autor ou professores podem excluir este post",
  "errors": ["Usuário não tem permissão para excluir este post"]
}
```

**Response 404 - Post Não Encontrado:**
```json
{
  "message": "Post não encontrado",
  "errors": ["Post com ID 'post-123' não existe"]
}
```

## 💬 Comentários

### GET /posts/:id/comments
Lista comentários de um post específico.

**Path Parameters:**
- `id` (obrigatório): ID do post

**Exemplo de Request:**
```
GET /posts/post-123/comments
```

**Response 200 - Sucesso:**
```json
[
  {
    "id": "comment-123",
    "postId": "post-123",
    "author": "Maria Santos",
    "content": "Excelente post! Muito esclarecedor.",
    "createdAt": "2024-01-15T14:30:00Z",
    "updatedAt": "2024-01-15T14:30:00Z"
  },
  {
    "id": "comment-124",
    "postId": "post-123",
    "author": "Pedro Costa",
    "content": "Obrigado por compartilhar essas informações.",
    "createdAt": "2024-01-15T15:45:00Z",
    "updatedAt": "2024-01-15T15:45:00Z"
  }
]
```

**Response 404 - Post Não Encontrado:**
```json
{
  "message": "Post não encontrado",
  "errors": ["Post com ID 'post-123' não existe"]
}
```

### POST /posts/:id/comments
Adiciona um novo comentário a um post.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Path Parameters:**
- `id` (obrigatório): ID do post

**Request Body:**
```json
{
  "content": "Muito interessante este post!",
  "author": "Ana Oliveira"
}
```

**Response 201 - Comentário Criado:**
```json
{
  "id": "comment-125",
  "postId": "post-123",
  "author": "Ana Oliveira",
  "content": "Muito interessante este post!",
  "createdAt": "2024-01-15T16:00:00Z",
  "updatedAt": "2024-01-15T16:00:00Z"
}
```

**Response 400 - Dados Inválidos:**
```json
{
  "message": "Dados de entrada inválidos",
  "errors": [
    "Content é obrigatório",
    "Content deve ter pelo menos 3 caracteres",
    "Author é obrigatório"
  ]
}
```

**Response 401 - Não Autenticado:**
```json
{
  "message": "Token de acesso inválido ou expirado"
}
```

**Response 404 - Post Não Encontrado:**
```json
{
  "message": "Post não encontrado",
  "errors": ["Post com ID 'post-123' não existe"]
}
```

## 🔧 Estrutura de Erros

### Formato Padrão de Erro

Todos os erros seguem o formato:

```json
{
  "message": "Descrição geral do erro",
  "errors": [
    "Detalhamento específico do erro 1",
    "Detalhamento específico do erro 2"
  ]
}
```

### Códigos de Status HTTP

| Código | Descrição | Uso |
|--------|-----------|-----|
| 200 | OK | Requisição bem-sucedida |
| 201 | Created | Recurso criado com sucesso |
| 204 | No Content | Recurso excluído com sucesso |
| 400 | Bad Request | Dados de entrada inválidos |
| 401 | Unauthorized | Token inválido ou expirado |
| 403 | Forbidden | Usuário sem permissão |
| 404 | Not Found | Recurso não encontrado |
| 500 | Internal Server Error | Erro interno do servidor |

### Tipos de Erro Comuns

#### Erro de Validação (400)
```json
{
  "message": "Dados de entrada inválidos",
  "errors": [
    "Campo 'title' é obrigatório",
    "Campo 'content' deve ter pelo menos 10 caracteres"
  ]
}
```

#### Erro de Autenticação (401)
```json
{
  "message": "Token de acesso inválido ou expirado"
}
```

#### Erro de Autorização (403)
```json
{
  "message": "Apenas professores podem realizar esta ação",
  "errors": ["Role 'student' não tem permissão para criar posts"]
}
```

#### Erro de Recurso Não Encontrado (404)
```json
{
  "message": "Post não encontrado",
  "errors": ["Post com ID 'post-123' não existe"]
}
```

## 📊 Tipos de Dados

### Post
```typescript
interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

### Comment
```typescript
interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
}
```

### PostsResponse
```typescript
interface PostsResponse {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

## 🔒 Segurança

### Autenticação
- Todos os endpoints (exceto login) requerem token JWT no header `Authorization`
- Token deve ser enviado no formato: `Bearer <token>`
- Tokens expiram em 1 hora (configurável)
- Refresh tokens expiram em 7 dias (configurável)

### Autorização
- **Students**: Podem visualizar posts e comentários, adicionar comentários
- **Teachers**: Todas as permissões de students + criar, editar e excluir posts
- **Admins**: Todas as permissões de teachers + gerenciar usuários

### Validação
- Todos os inputs são validados no servidor
- Sanitização de HTML para prevenir XSS
- Validação de tipos e tamanhos de campos
- Rate limiting para prevenir abuso

## 📝 Notas de Implementação

### Paginação
- Padrão: 10 itens por página
- Máximo: 100 itens por página
- Parâmetros: `page` (número) e `limit` (número)

### Busca
- Busca por título e conteúdo do post
- Case-insensitive
- Suporte a busca parcial

### Timestamps
- Todos os timestamps são em formato ISO 8601 (UTC)
- Exemplo: `2024-01-15T10:30:00Z`

### Content-Type
- Todas as requisições e respostas usam `application/json`
- Charset: UTF-8

---

**Versão da API:** 1.0.0  
**Última atualização:** Janeiro 2024
