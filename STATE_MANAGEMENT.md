# Gerenciamento de Estado - Context API vs Redux

## 📋 Visão Geral

Este documento descreve a implementação atual do gerenciamento de estado usando Context API e fornece diretrizes sobre quando migrar para Redux em caso de escalabilidade.

## 🎯 Implementação Atual: Context API

### Estrutura Implementada

#### PostsContext (`src/contexts/PostsContext.tsx`)
- **Estado centralizado** para posts e operações CRUD
- **Cache inteligente** com TTL de 5 minutos
- **Hooks customizados** para facilitar o uso
- **Otimistic updates** para melhor UX
- **Tratamento de erros** centralizado

#### Hooks Disponíveis

```tsx
// Hook principal para acessar todas as funcionalidades
const { posts, currentPost, loading, error, fetchPosts, createPost, updatePost, deletePost } = usePosts();

// Hook para listar posts com parâmetros
const { posts, loading, error, refetch } = usePostsList({ search, page, limit });

// Hook para buscar post individual
const { post, loading, error, refetch } = usePost(id);
```

### Vantagens da Implementação Atual

✅ **Simplicidade**: Fácil de entender e implementar  
✅ **Performance**: Cache inteligente reduz chamadas desnecessárias  
✅ **TypeScript**: Tipagem completa e type-safe  
✅ **Flexibilidade**: Hooks customizados para diferentes casos de uso  
✅ **Manutenibilidade**: Código organizado e bem estruturado  
✅ **Otimistic UI**: Atualizações imediatas para melhor UX  

## 🚀 Quando Migrar para Redux

### Indicadores de Escalabilidade

#### 1. **Complexidade do Estado**
```tsx
// ❌ Context API - Estado complexo demais
const AppContext = {
  posts: Post[],
  users: User[],
  comments: Comment[],
  notifications: Notification[],
  settings: Settings,
  ui: UIState,
  // ... muitos outros estados
};

// ✅ Redux - Melhor para estado complexo
const rootReducer = combineReducers({
  posts: postsReducer,
  users: usersReducer,
  comments: commentsReducer,
  notifications: notificationsReducer,
  settings: settingsReducer,
  ui: uiReducer,
});
```

#### 2. **Múltiplos Contextos Aninhados**
```tsx
// ❌ Context API - Muitos providers aninhados
<AuthProvider>
  <PostsProvider>
    <CommentsProvider>
      <NotificationsProvider>
        <SettingsProvider>
          <App />
        </SettingsProvider>
      </NotificationsProvider>
    </CommentsProvider>
  </PostsProvider>
</AuthProvider>

// ✅ Redux - Provider único
<Provider store={store}>
  <App />
</Provider>
```

#### 3. **Lógica de Estado Complexa**
```tsx
// ❌ Context API - Lógica complexa no reducer
function postsReducer(state, action) {
  switch (action.type) {
    case 'FETCH_POSTS_SUCCESS':
      return {
        ...state,
        posts: action.payload,
        // 50+ linhas de lógica complexa
        // Dificulta manutenção e testes
      };
  }
}

// ✅ Redux - Middleware e selectors
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    fetchPostsSuccess: (state, action) => {
      // Lógica simples e focada
    },
  },
  extraReducers: (builder) => {
    // Lógica assíncrona com createAsyncThunk
  },
});
```

#### 4. **Performance Issues**
```tsx
// ❌ Context API - Re-renders desnecessários
const PostsContext = createContext();
// Qualquer mudança no estado causa re-render de todos os consumidores

// ✅ Redux - Re-renders otimizados
const selectPosts = (state) => state.posts.items;
const selectLoading = (state) => state.posts.loading;
// Componentes só re-renderizam quando dados específicos mudam
```

### Critérios de Decisão

#### Migrar para Redux quando:

1. **Estado Global Complexo**
   - Mais de 5-7 contextos diferentes
   - Estado compartilhado entre muitos componentes
   - Lógica de estado complexa e interdependente

2. **Performance Issues**
   - Re-renders excessivos
   - Componentes lentos devido ao estado
   - Necessidade de memoização avançada

3. **Time Travel Debugging**
   - Necessidade de debug avançado
   - Histórico de ações
   - Redux DevTools

4. **Middleware Complexo**
   - Lógica de side effects complexa
   - Múltiplas APIs para sincronizar
   - Cache avançado e sincronização

5. **Equipe Grande**
   - Múltiplos desenvolvedores
   - Padrões de estado bem definidos
   - Necessidade de consistência

#### Manter Context API quando:

1. **Estado Simples**
   - Poucos contextos (1-3)
   - Estado local na maioria dos casos
   - Lógica de estado simples

2. **Projeto Pequeno/Médio**
   - Equipe pequena (1-3 devs)
   - Escopo limitado
   - Prototipagem rápida

3. **Performance Adequada**
   - Sem problemas de performance
   - Re-renders controlados
   - UX satisfatória

## 🔄 Plano de Migração para Redux

### Fase 1: Preparação
```bash
# Instalar dependências
npm install @reduxjs/toolkit react-redux
npm install --save-dev redux-devtools-extension
```

### Fase 2: Estrutura Base
```tsx
// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './slices/postsSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Fase 3: Slices Redux
```tsx
// store/slices/postsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postsApi } from '../../services/api';

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (params: PostsParams) => {
    const response = await postsApi.getPosts(params);
    return response;
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    items: [],
    currentPost: null,
    loading: false,
    error: null,
    lastFetch: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.posts;
        state.lastFetch = Date.now();
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError, clearCurrentPost } = postsSlice.actions;
export default postsSlice.reducer;
```

### Fase 4: Hooks Customizados
```tsx
// hooks/useAppDispatch.ts
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';

export const useAppDispatch = () => useDispatch<AppDispatch>();

// hooks/useAppSelector.ts
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

export const useAppSelector = <T>(selector: (state: RootState) => T) => 
  useSelector(selector);
```

### Fase 5: Migração Gradual
```tsx
// Componente migrado
import { useAppSelector, useAppDispatch } from '../hooks';
import { fetchPosts, createPost } from '../store/slices/postsSlice';

const PostsList = () => {
  const dispatch = useAppDispatch();
  const { posts, loading, error } = useAppSelector(state => state.posts);
  
  useEffect(() => {
    dispatch(fetchPosts({ page: 1, limit: 10 }));
  }, [dispatch]);
  
  // ... resto do componente
};
```

## 📊 Comparação: Context API vs Redux

| Aspecto | Context API | Redux Toolkit |
|---------|-------------|---------------|
| **Curva de Aprendizado** | Baixa | Média |
| **Boilerplate** | Baixo | Médio |
| **Performance** | Boa | Excelente |
| **Debugging** | Básico | Avançado |
| **DevTools** | Limitado | Completo |
| **Middleware** | Limitado | Poderoso |
| **Time Travel** | Não | Sim |
| **Testes** | Médio | Excelente |
| **Bundle Size** | Pequeno | Médio |
| **Flexibilidade** | Alta | Muito Alta |

## 🎯 Recomendações

### Para o Projeto Atual
**Manter Context API** pelos seguintes motivos:
- Estado relativamente simples
- Poucos contextos necessários
- Performance adequada
- Equipe pequena
- Desenvolvimento ágil

### Sinais para Migração
Monitorar os seguintes indicadores:
1. **Número de contextos** > 5
2. **Re-renders** excessivos
3. **Complexidade** do estado
4. **Tamanho da equipe** > 5 devs
5. **Necessidade** de debugging avançado

### Estratégia de Migração
1. **Migração gradual** por feature
2. **Manter ambos** durante transição
3. **Testes** abrangentes
4. **Documentação** atualizada
5. **Treinamento** da equipe

## 🔧 Ferramentas Recomendadas

### Context API
- **React DevTools** para debugging
- **useMemo/useCallback** para otimização
- **Custom hooks** para reutilização

### Redux
- **Redux DevTools** para debugging
- **RTK Query** para cache de API
- **Reselect** para selectors otimizados
- **Redux Persist** para persistência

## 📝 Conclusão

A implementação atual com Context API é adequada para o escopo do projeto. A migração para Redux deve ser considerada apenas quando os indicadores de escalabilidade forem atingidos, garantindo que a complexidade adicional seja justificada pelos benefícios obtidos.

---

**Implementação atual: Context API com cache inteligente e hooks customizados**  
**Próxima revisão: Quando o projeto atingir 5+ contextos ou problemas de performance**
