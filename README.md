# Tech Challenge - Frontend React

## 📋 Visão Geral do Projeto

Este é o frontend de uma aplicação React moderna para gerenciamento de posts, desenvolvido como parte do Tech Challenge 3. A aplicação oferece funcionalidades completas de CRUD para posts, sistema de autenticação, comentários e painel administrativo, seguindo as melhores práticas de desenvolvimento React com TypeScript.

### 🎯 Funcionalidades Principais

- **Sistema de Posts**: Listagem, visualização, criação, edição e exclusão
- **Autenticação**: Login com diferentes roles (estudante, professor, admin)
- **Sistema de Comentários**: Adição e listagem de comentários
- **Painel Administrativo**: Gerenciamento completo de posts
- **Busca e Filtros**: Busca em tempo real com debounce
- **Responsividade**: Design mobile-first com TailwindCSS
- **Acessibilidade**: Conformidade WCAG 2.1 AA
- **Cache Inteligente**: Sistema de cache com TTL de 5 minutos
- **Sistema de Design**: Componentes base reutilizáveis

### 🛠️ Stack Tecnológica

- **React 18** com TypeScript
- **TailwindCSS** para estilização
- **Context API** para gerenciamento de estado
- **React Router DOM** para navegação
- **React Hook Form** para formulários
- **Axios** para requisições HTTP
- **DOMPurify** para sanitização de HTML
- **React Hot Toast** para notificações

## 📋 Pré-requisitos

### Requisitos de Sistema
- **Node.js**: versão 16 ou superior
- **npm**: versão 8 ou superior (ou yarn)
- **Git**: para controle de versão
- **Backend API**: rodando na URL configurada

### Requisitos de Desenvolvimento
- **Editor**: VS Code (recomendado)
- **Extensões**: ES7+ React/Redux/React-Native snippets, Tailwind CSS IntelliSense
- **Browser**: Chrome, Firefox, Safari ou Edge (versões recentes)

## ⚙️ Setup Local

### 1. Clone o Repositório
```bash
git clone <url-do-repositorio>
cd tech-challenge-posts
```

### 2. Instale as Dependências
```bash
# Usando npm
npm install

# Ou usando yarn
yarn install
```

### 3. Configure as Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
# .env
REACT_APP_API_BASE_URL=http://localhost:3001/api
```

**Arquivo .env.example:**
```env
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:3001/api

# Development
REACT_APP_DEBUG=true
REACT_APP_LOG_LEVEL=info

# Optional: Analytics
REACT_APP_GA_TRACKING_ID=your-tracking-id
```

### 4. Inicie o Servidor de Desenvolvimento
```bash
# Usando npm
npm start

# Ou usando yarn
yarn start
```

### 5. Acesse a Aplicação
Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📁 Estrutura de Pastas

```
src/
├── components/                 # Componentes reutilizáveis
│   ├── Layout/                # Componentes de layout
│   │   ├── Container.tsx      # Container responsivo
│   │   ├── ResponsiveGrid.tsx # Grid responsivo
│   │   └── index.ts
│   ├── Examples/              # Componentes de exemplo
│   │   ├── DesignSystemExample.tsx
│   │   ├── UsageExample.tsx
│   │   ├── PostsContextExample.tsx
│   │   └── index.ts
│   ├── ConfirmModal.tsx       # Modal de confirmação
│   ├── LoginButton.tsx        # Botão de login/logout
│   ├── ProtectedRoute.tsx     # Rota protegida
│   └── ToastProvider.tsx      # Provider de notificações
├── contexts/                   # Contextos React
│   ├── AuthContext.tsx        # Contexto de autenticação
│   └── PostsContext.tsx       # Contexto de posts (NOVO)
├── pages/                      # Páginas da aplicação
│   ├── PostsList.tsx          # Lista de posts
│   ├── PostView.tsx           # Visualização de post
│   ├── PostCreate.tsx         # Criação de post
│   ├── PostEdit.tsx           # Edição de post
│   ├── AdminPosts.tsx         # Painel administrativo
│   └── Login.tsx              # Página de login
├── services/                   # Serviços e APIs
│   └── api.ts                 # Configuração do Axios
├── styles/                     # Sistema de design
│   └── theme.js               # Tokens de design
├── ui/                         # Componentes base do sistema
│   ├── Button.tsx             # Componente Button
│   ├── Input.tsx              # Componente Input
│   ├── Card.tsx               # Componente Card
│   └── index.ts               # Exports
├── utils/                      # Utilitários
│   └── cn.ts                  # Utilitário para classes CSS
├── App.tsx                     # Componente raiz
├── index.tsx                   # Ponto de entrada
└── index.css                   # Estilos globais
```

## 🎨 Padrões de Código

### Hooks Personalizados

#### useDebounce
```tsx
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
```

#### usePosts (Context API)
```tsx
const { posts, loading, error, createPost, updatePost, deletePost } = usePosts();
```

### Styled Components (TailwindCSS)

#### Utilitário cn
```tsx
import { cn } from '../utils/cn';

const MyComponent = ({ className, variant = 'default' }) => (
  <div className={cn(
    'base-styles',
    variant === 'primary' && 'primary-styles',
    className
  )}>
    Conteúdo
  </div>
);
```

#### Sistema de Design
```tsx
// Usando tokens do tema
<div className="bg-primary-500 text-white p-6 rounded-lg">
  <h1 className="text-2xl font-bold">Título</h1>
</div>

// Responsividade mobile-first
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Conteúdo */}
</div>
```

### React Hook Form

#### Validação de Formulários
```tsx
import { useForm } from 'react-hook-form';

const PostCreate = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      content: ''
    }
  });

  const onSubmit = (data) => {
    // Lógica de envio
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Título"
        {...register('title', { 
          required: 'Título é obrigatório',
          minLength: { value: 3, message: 'Mínimo 3 caracteres' }
        })}
        error={errors.title?.message}
      />
    </form>
  );
};
```

## 📡 API Contract

### Base URL
```
http://localhost:3001/api
```

### Autenticação
Todos os endpoints (exceto login) requerem token JWT no header:
```
Authorization: Bearer <token>
```

### Endpoints

#### POST /auth/login
**Request:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response 200:**
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

#### GET /posts
**Query Parameters:**
- `search` (opcional): Termo de busca
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 10)

**Response 200:**
```json
{
  "posts": [
    {
      "id": "post-123",
      "title": "Introdução ao React",
      "content": "<p>React é uma biblioteca JavaScript...</p>",
      "authorId": "user-123",
      "authorName": "João Silva",
      "excerpt": "React é uma biblioteca JavaScript...",
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

#### GET /posts/:id
**Response 200:**
```json
{
  "id": "post-123",
  "title": "Introdução ao React",
  "content": "<p>React é uma biblioteca JavaScript...</p>",
  "authorId": "user-123",
  "authorName": "João Silva",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

#### POST /posts
**Request:**
```json
{
  "title": "Meu Novo Post",
  "content": "<p>Conteúdo do post...</p>",
  "authorId": "user-123"
}
```

**Response 201:**
```json
{
  "id": "post-456",
  "title": "Meu Novo Post",
  "content": "<p>Conteúdo do post...</p>",
  "authorId": "user-123",
  "authorName": "João Silva",
  "createdAt": "2024-01-15T11:00:00Z",
  "updatedAt": "2024-01-15T11:00:00Z"
}
```

#### PUT /posts/:id
**Request:**
```json
{
  "title": "Título Atualizado",
  "content": "<p>Conteúdo atualizado...</p>"
}
```

**Response 200:**
```json
{
  "id": "post-123",
  "title": "Título Atualizado",
  "content": "<p>Conteúdo atualizado...</p>",
  "authorId": "user-123",
  "authorName": "João Silva",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T12:00:00Z"
}
```

#### DELETE /posts/:id
**Response 204:** (No Content)

#### GET /posts/:id/comments
**Response 200:**
```json
[
  {
    "id": "comment-123",
    "postId": "post-123",
    "author": "Maria Santos",
    "content": "Excelente post!",
    "createdAt": "2024-01-15T14:30:00Z",
    "updatedAt": "2024-01-15T14:30:00Z"
  }
]
```

#### POST /posts/:id/comments
**Request:**
```json
{
  "content": "Muito interessante!",
  "author": "Ana Oliveira"
}
```

**Response 201:**
```json
{
  "id": "comment-125",
  "postId": "post-123",
  "author": "Ana Oliveira",
  "content": "Muito interessante!",
  "createdAt": "2024-01-15T16:00:00Z",
  "updatedAt": "2024-01-15T16:00:00Z"
}
```

### Códigos de Status HTTP
- **200**: OK
- **201**: Created
- **204**: No Content
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **500**: Internal Server Error

## 🔐 Autenticação

### Como Funciona

#### 1. Login
```tsx
const { login } = useAuth();

const handleLogin = async (credentials) => {
  try {
    await login(credentials);
    // Usuário logado com sucesso
  } catch (error) {
    // Tratar erro de login
  }
};
```

#### 2. Armazenamento de Tokens
- **Access Token**: Armazenado em `sessionStorage`
- **Refresh Token**: Armazenado em `localStorage`
- **User Data**: Armazenado em `localStorage`

#### 3. Renovação Automática
```tsx
// Interceptor do Axios renova tokens automaticamente
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Tentar renovar token
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        const newTokens = await authApi.refreshToken(refreshToken);
        // Atualizar tokens e repetir requisição
      }
    }
  }
);
```

#### 4. Roles e Permissões
```tsx
const { user, isAuthenticated } = useAuth();

// Verificar se usuário é professor
if (isAuthenticated && user?.role === 'teacher') {
  // Mostrar botões de edição/criação
}

// Proteger rotas
<ProtectedRoute requiredRole="teacher">
  <PostCreate />
</ProtectedRoute>
```

## 🚀 Deploy

### Build de Produção

```bash
# Criar build otimizado
npm run build

# Verificar build
npm run build && npx serve -s build
```

### Variáveis de Ambiente para Produção

```env
# .env.production
REACT_APP_API_BASE_URL=https://api.seudominio.com/api
REACT_APP_DEBUG=false
REACT_APP_LOG_LEVEL=error
```

### Deploy no Vercel

1. **Instalar Vercel CLI**
```bash
npm i -g vercel
```

2. **Configurar projeto**
```bash
vercel
```

3. **Configurar variáveis de ambiente**
```bash
vercel env add REACT_APP_API_BASE_URL
```

### Deploy no Netlify

1. **Build command**: `npm run build`
2. **Publish directory**: `build`
3. **Environment variables**: Configurar no painel

### Deploy no AWS S3 + CloudFront

1. **Build do projeto**
```bash
npm run build
```

2. **Upload para S3**
```bash
aws s3 sync build/ s3://seu-bucket
```

3. **Configurar CloudFront** para distribuição

## ✅ Checklist de Aceitação

### Funcionalidades Básicas
- [X] **Lista de Posts**: Exibe posts com título, autor e descrição
- [X] **Busca**: Filtra posts em tempo real com debounce
- [X] **Paginação**: Navegação entre páginas funcional
- [X] **Visualização**: Página de leitura com conteúdo sanitizado
- [X] **Comentários**: Sistema de comentários funcional

### Autenticação e Autorização
- [X] **Login**: Sistema de login funcional
- [X] **Roles**: Diferentes permissões por role
- [X] **Proteção de Rotas**: Rotas protegidas funcionando
- [X] **Renovação de Token**: Renovação automática de tokens

### CRUD de Posts
- [X] **Criar**: Formulário de criação com validação
- [X] **Editar**: Formulário de edição com dados existentes
- [X] **Excluir**: Exclusão com confirmação
- [X] **Validação**: Validação client-side e server-side

### Interface e UX
- [X] **Responsividade**: Funciona em mobile, tablet e desktop
- [X] **Acessibilidade**: Conformidade WCAG 2.1 AA
- [X] **Loading States**: Indicadores de carregamento
- [X] **Error Handling**: Tratamento de erros adequado
- [X] **Notificações**: Feedback visual para ações

### Performance
- [X] **Cache**: Sistema de cache funcionando
- [X] **Debounce**: Busca otimizada com debounce
- [X] **Lazy Loading**: Carregamento otimizado
- [X] **Bundle Size**: Tamanho otimizado do bundle

### Qualidade de Código
- [X] **TypeScript**: Tipagem completa
- [X] **ESLint**: Linting sem erros
- [X] **Prettier**: Formatação consistente
- [X] **Documentação**: Código bem documentado

### Deploy
- [X] **Build**: Build de produção funcionando
- [X] **Environment**: Variáveis de ambiente configuradas
- [X] **Deploy**: Deploy em ambiente de produção
- [X] **Monitoring**: Monitoramento básico configurado

## 🐛 Troubleshooting

### Problemas Comuns

#### 1. API não conecta
```bash
# Verificar se backend está rodando
curl http://localhost:3001/api/health

# Verificar variáveis de ambiente
echo $REACT_APP_API_BASE_URL
```

#### 3. Build falha
```bash
# Verificar erros de TypeScript
npx tsc --noEmit

# Verificar erros de ESLint
npm run lint
```

#### 4. Problemas de Cache
```bash
# Limpar cache do npm
npm cache clean --force

# Limpar node_modules
rm -rf node_modules package-lock.json
npm install
```

## 📚 Documentação Adicional

- [Sistema de Design](DESIGN_SYSTEM.md)
- [Context API Implementation](CONTEXT_API_IMPLEMENTATION.md)
- [State Management](STATE_MANAGEMENT.md)
- [API Contract](API_CONTRACT.md)

## 👥 Contribuição

### Como Contribuir
1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add: nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

### Padrões de Commit
```
feat: nova funcionalidade
fix: correção de bug
docs: atualização de documentação
style: mudanças de formatação
refactor: refatoração de código
test: adição de testes
chore: tarefas de manutenção
```

## 📄 Licença

Este projeto foi desenvolvido como parte do Tech Challenge 3.

---

**Desenvolvido com ❤️ usando React, TypeScript e TailwindCSS**