# Sistema de Design - Tech Challenge Posts

## 📋 Resumo da Implementação

Este documento descreve o sistema de design completo implementado para o projeto Tech Challenge Posts, seguindo as melhores práticas de acessibilidade, responsividade e consistência visual.

## ✅ O que foi implementado

### 1. Sistema de Tema (`src/styles/theme.js`)
- **Cores**: Paleta completa com 50+ tons organizados por categoria
- **Espaçamentos**: Escala consistente de 4px a 256px
- **Tipografia**: Família Inter com tamanhos e pesos padronizados
- **Breakpoints**: Mobile-first (320px, 640px, 768px, 1024px, 1280px, 1536px)
- **Sombras**: Sistema de elevação com 6 níveis
- **Bordas**: Raio de borda consistente de 2px a 24px
- **Transições**: Durações e timing functions padronizados
- **Z-Index**: Sistema de camadas organizado

### 2. Componentes Base (`src/ui/`)

#### Button Component
- **5 variantes**: primary, secondary, outline, ghost, danger
- **3 tamanhos**: sm, md, lg
- **Estados**: normal, loading, disabled
- **Ícones**: leftIcon, rightIcon, iconOnly
- **Acessibilidade**: ARIA labels, foco visível, navegação por teclado

#### Input Component
- **3 variantes**: default, filled, outlined
- **3 tamanhos**: sm, md, lg
- **Recursos**: label, helperText, error, leftIcon, rightIcon
- **Validação**: Estados de erro com mensagens descritivas
- **Acessibilidade**: ARIA attributes, foco visível, screen readers

#### Card Component
- **4 variantes**: default, elevated, outlined, filled
- **Subcomponentes**: CardHeader, CardContent, CardFooter
- **Estados**: clickable, hover, focused, loading
- **Flexibilidade**: Padding customizável, alinhamentos

### 3. Componentes de Layout (`src/components/Layout/`)

#### ResponsiveGrid
- **Mobile-first**: 1 coluna em mobile, configurável em desktop
- **Breakpoints**: Adaptação automática para tablet e desktop
- **Gap**: Espaçamento consistente entre itens
- **Flexibilidade**: Número de colunas configurável

#### Container
- **Max-width**: Controle de largura máxima
- **Padding**: Espaçamento interno responsivo
- **Centralização**: Opção de centralizar conteúdo
- **Responsividade**: Adaptação automática

### 4. Sistema de Acessibilidade

#### Contraste WCAG 2.1 AA
- **Texto normal**: Contraste mínimo 4.5:1
- **Texto grande**: Contraste mínimo 3:1
- **Cores semânticas**: Success, warning, error com contraste adequado

#### Navegação por Teclado
- **Tab**: Navegação sequencial entre elementos
- **Enter/Space**: Ativação de botões e links
- **Escape**: Cancelamento de modais e dropdowns
- **Setas**: Navegação em listas e grids

#### Screen Readers
- **ARIA labels**: Descrições para elementos interativos
- **ARIA states**: Estados de loading, disabled, error
- **Semantic HTML**: Estrutura semântica correta
- **Focus management**: Gerenciamento de foco programático

#### Preferências do Usuário
- **Reduced motion**: Respeita `prefers-reduced-motion`
- **High contrast**: Suporte para `prefers-contrast: high`
- **Dark mode**: Suporte para `prefers-color-scheme: dark`

### 5. Responsividade Mobile-First

#### Breakpoints
- **xs**: 320px (Mobile pequeno)
- **sm**: 640px (Mobile grande)
- **md**: 768px (Tablet)
- **lg**: 1024px (Desktop pequeno)
- **xl**: 1280px (Desktop)
- **2xl**: 1536px (Desktop grande)

#### Layout Patterns
- **Mobile**: Layout em coluna única
- **Tablet**: Layout em 2 colunas
- **Desktop**: Layout em 3+ colunas
- **Espaçamento**: Adaptação automática de gaps

### 6. Utilitários e Helpers

#### `cn` Utility (`src/utils/cn.ts`)
- **Combinação inteligente**: clsx + tailwind-merge
- **Resolução de conflitos**: Classes do Tailwind CSS
- **Lógica condicional**: Classes baseadas em props
- **TypeScript**: Tipagem completa

#### Classes Utilitárias (`src/index.css`)
- **Acessibilidade**: `.focus-ring`, `.sr-only`, `.not-sr-only`
- **Estados**: `.interactive`, `.clickable`, `.disabled`
- **Semântica**: `.text-error`, `.text-success`, `.text-warning`
- **Responsividade**: `.container-responsive`, `.grid-responsive`

## 🎯 Como Usar

### Importar Componentes
```tsx
import { Button, Input, Card, CardHeader, CardContent, CardFooter } from './src/ui';
import ResponsiveGrid from './src/components/Layout/ResponsiveGrid';
import Container from './src/components/Layout/Container';
```

### Usar Tokens de Design
```tsx
// Cores
<div className="bg-primary-500 text-white">

// Espaçamentos
<div className="p-6 m-4">

// Tipografia
<h1 className="text-4xl font-bold text-secondary-900">

// Breakpoints
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

### Criar Novos Componentes
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

## 📁 Estrutura de Arquivos

```
src/
├── styles/
│   └── theme.js                 # Tokens de design
├── ui/
│   ├── Button.tsx              # Componente Button
│   ├── Input.tsx               # Componente Input
│   ├── Card.tsx                # Componente Card + subcomponentes
│   └── index.ts                # Exports
├── utils/
│   └── cn.ts                   # Utilitário para classes CSS
├── components/
│   ├── Layout/
│   │   ├── ResponsiveGrid.tsx  # Grid responsivo
│   │   ├── Container.tsx       # Container responsivo
│   │   └── index.ts
│   └── Examples/
│       ├── DesignSystemExample.tsx  # Exemplo completo
│       ├── UsageExample.tsx         # Exemplo de uso
│       └── index.ts
└── index.css                   # Estilos globais + utilitários
```

## 🔧 Configuração

### Tailwind CSS
O arquivo `tailwind.config.js` foi configurado para usar todos os tokens do sistema de tema:

```js
const { theme } = require('./src/styles/theme.js');

module.exports = {
  theme: {
    extend: {
      colors: theme.colors,
      spacing: theme.spacing,
      fontFamily: theme.typography.fontFamily,
      // ... outros tokens
    },
  },
};
```

### Dependências
```json
{
  "clsx": "^2.0.0",
  "tailwind-merge": "^2.0.0"
}
```

## 🎨 Exemplos Práticos

### Formulário com Validação
```tsx
<Input
  label="Email"
  type="email"
  error={errors.email?.message}
  helperText="Digite seu email válido"
  required
/>
```

### Layout Responsivo
```tsx
<ResponsiveGrid desktopColumns={3} gap="lg">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</ResponsiveGrid>
```

### Botão com Estados
```tsx
<Button 
  variant="primary" 
  size="md" 
  loading={isLoading}
  leftIcon={<Icon />}
>
  Enviar
</Button>
```

## ✅ Checklist de Implementação

- [x] Sistema de tema com tokens de design
- [x] Componentes base (Button, Input, Card)
- [x] Layout responsivo mobile-first
- [x] Acessibilidade WCAG 2.1 AA
- [x] Contraste mínimo garantido
- [x] Navegação por teclado
- [x] Screen readers support
- [x] Preferências do usuário
- [x] Utilitários CSS
- [x] Documentação completa
- [x] Exemplos práticos
- [x] Guidelines de uso

## 🚀 Próximos Passos

1. **Testes**: Implementar testes unitários para os componentes
2. **Storybook**: Criar documentação interativa
3. **Temas**: Implementar temas customizáveis
4. **Animações**: Adicionar micro-interações
5. **Componentes**: Expandir biblioteca com mais componentes

---

**Sistema de Design implementado com ❤️ seguindo as melhores práticas de acessibilidade e responsividade.**
