import React, { useState } from 'react';
import { Button, Input, Card, CardHeader, CardContent, CardFooter } from '../../ui';
import ResponsiveGrid from '../Layout/ResponsiveGrid';
import Container from '../Layout/Container';

/**
 * Exemplo prático de uso do Sistema de Design
 * 
 * Este componente demonstra como usar todos os componentes base
 * e seguir as guidelines do sistema de design.
 */
const UsageExample: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Mensagem é obrigatória';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Mensagem deve ter pelo menos 10 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simular envio
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    alert('Formulário enviado com sucesso!');
  };

  return (
    <Container maxWidth="2xl" padding="lg">
      <div className="space-y-8">
        {/* Header com exemplo de tipografia */}
        <header className="text-center">
          <h1 className="text-4xl font-bold text-primary-900 mb-4">
            Exemplo de Uso do Sistema de Design
          </h1>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Demonstração prática de como usar os componentes base, 
            seguir as guidelines de acessibilidade e criar layouts responsivos.
          </p>
        </header>

        {/* Formulário de exemplo */}
        <section>
          <Card variant="elevated" padding="lg">
            <CardHeader 
              title="Formulário de Contato" 
              subtitle="Exemplo de formulário com validação e acessibilidade"
            />
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <CardContent noPadding>
                <ResponsiveGrid desktopColumns={2} gap="lg">
                  <Input
                    label="Nome Completo"
                    placeholder="Digite seu nome"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    error={errors.name}
                    required
                    leftIcon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    }
                  />
                  
                  <Input
                    label="Email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    error={errors.email}
                    helperText="Usaremos este email para contato"
                    required
                    leftIcon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    }
                  />
                </ResponsiveGrid>
                
                <div className="mt-6">
                  <Input
                    label="Mensagem"
                    placeholder="Digite sua mensagem aqui..."
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    error={errors.message}
                    helperText="Mínimo de 10 caracteres"
                    required
                    multiline
                    rows={4}
                  />
                </div>
              </CardContent>
              
              <CardFooter align="between">
                <Button 
                  type="button" 
                  variant="ghost"
                  onClick={() => setFormData({ name: '', email: '', message: '' })}
                >
                  Limpar
                </Button>
                
                <Button 
                  type="submit" 
                  variant="primary"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </section>

        {/* Exemplo de cards em grid responsivo */}
        <section>
          <h2 className="text-2xl font-semibold text-secondary-900 mb-6">
            Cards Responsivos
          </h2>
          
          <ResponsiveGrid desktopColumns={3} gap="lg">
            {[
              {
                title: 'Recursos de Acessibilidade',
                description: 'Contraste AA, navegação por teclado, screen readers',
                icon: '♿',
                variant: 'default' as const,
              },
              {
                title: 'Design Responsivo',
                description: 'Mobile-first, breakpoints, layouts flexíveis',
                icon: '📱',
                variant: 'elevated' as const,
              },
              {
                title: 'Sistema de Cores',
                description: 'Paleta consistente, tokens de design, semântica',
                icon: '🎨',
                variant: 'filled' as const,
              },
            ].map((item, index) => (
              <Card 
                key={index}
                variant={item.variant}
                clickable
                hover
                className="text-center"
              >
                <CardContent>
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-secondary-600">
                    {item.description}
                  </p>
                </CardContent>
                
                <CardFooter align="center">
                  <Button size="sm" variant="outline">
                    Saiba Mais
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </ResponsiveGrid>
        </section>

        {/* Exemplo de botões com diferentes estados */}
        <section>
          <h2 className="text-2xl font-semibold text-secondary-900 mb-6">
            Estados dos Componentes
          </h2>
          
          <Card variant="outlined" padding="lg">
            <CardHeader title="Botões e Estados" />
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="primary" fullWidth>
                  Normal
                </Button>
                
                <Button variant="secondary" fullWidth disabled>
                  Desabilitado
                </Button>
                
                <Button variant="outline" fullWidth loading>
                  Carregando
                </Button>
                
                <Button variant="danger" fullWidth>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Com Ícone
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Exemplo de acessibilidade */}
        <section>
          <h2 className="text-2xl font-semibold text-secondary-900 mb-6">
            Recursos de Acessibilidade
          </h2>
          
          <ResponsiveGrid desktopColumns={2} gap="lg">
            <Card variant="outlined" padding="md">
              <CardHeader title="Navegação por Teclado" />
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-secondary-600">
                    Teste a navegação usando apenas o teclado:
                  </p>
                  <ul className="text-sm text-secondary-600 space-y-1 ml-4">
                    <li>• Pressione <kbd className="px-2 py-1 bg-neutral-100 rounded text-xs">Tab</kbd> para navegar</li>
                    <li>• Pressione <kbd className="px-2 py-1 bg-neutral-100 rounded text-xs">Enter</kbd> para ativar</li>
                    <li>• Pressione <kbd className="px-2 py-1 bg-neutral-100 rounded text-xs">Escape</kbd> para cancelar</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card variant="outlined" padding="md">
              <CardHeader title="Contraste e Legibilidade" />
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-secondary-600">
                    Cores com contraste adequado:
                  </p>
                  <div className="space-y-2">
                    <div className="p-3 bg-success-50 text-success-800 rounded-md">
                      ✅ Texto com contraste adequado
                    </div>
                    <div className="p-3 bg-error-50 text-error-800 rounded-md">
                      ❌ Texto com contraste adequado
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ResponsiveGrid>
        </section>
      </div>
    </Container>
  );
};

export default UsageExample;
