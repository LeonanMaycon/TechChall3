import React, { useState } from 'react';
import { Button, Input, Card, CardHeader, CardContent, CardFooter } from '../../ui';
import ResponsiveGrid from '../Layout/ResponsiveGrid';
import Container from '../Layout/Container';

const DesignSystemExample: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleButtonClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <Container maxWidth="2xl" padding="lg">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary-900 mb-4">
            Sistema de Design
          </h1>
          <p className="text-lg text-secondary-600">
            Componentes base com TailwindCSS, responsividade e acessibilidade
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-semibold text-secondary-900 mb-6">
            Botões
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card variant="outlined" padding="md">
              <CardHeader title="Variantes" />
              <CardContent>
                <div className="space-y-3">
                  <Button variant="primary" fullWidth>
                    Primary
                  </Button>
                  <Button variant="secondary" fullWidth>
                    Secondary
                  </Button>
                  <Button variant="outline" fullWidth>
                    Outline
                  </Button>
                  <Button variant="ghost" fullWidth>
                    Ghost
                  </Button>
                  <Button variant="danger" fullWidth>
                    Danger
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card variant="outlined" padding="md">
              <CardHeader title="Tamanhos" />
              <CardContent>
                <div className="space-y-3">
                  <Button size="sm" fullWidth>
                    Small
                  </Button>
                  <Button size="md" fullWidth>
                    Medium
                  </Button>
                  <Button size="lg" fullWidth>
                    Large
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card variant="outlined" padding="md">
              <CardHeader title="Estados" />
              <CardContent>
                <div className="space-y-3">
                  <Button loading={loading} onClick={handleButtonClick} fullWidth>
                    {loading ? 'Carregando...' : 'Clique para carregar'}
                  </Button>
                  <Button disabled fullWidth>
                    Desabilitado
                  </Button>
                  <Button 
                    leftIcon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    }
                    fullWidth
                  >
                    Com Ícone
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-secondary-900 mb-6">
            Campos de Entrada
          </h2>
          
          <ResponsiveGrid desktopColumns={2} gap="lg">
            <Card variant="outlined" padding="md">
              <CardHeader title="Estados do Input" />
              <CardContent>
                <div className="space-y-4">
                  <Input
                    label="Campo Normal"
                    placeholder="Digite algo..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  
                  <Input
                    label="Campo com Erro"
                    placeholder="Este campo tem erro"
                    error="Este campo é obrigatório"
                  />
                  
                  <Input
                    label="Campo Desabilitado"
                    placeholder="Campo desabilitado"
                    disabled
                  />
                  
                  <Input
                    label="Campo com Ícone"
                    placeholder="Buscar..."
                    leftIcon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card variant="outlined" padding="md">
              <CardHeader title="Tamanhos e Variantes" />
              <CardContent>
                <div className="space-y-4">
                  <Input
                    label="Small"
                    size="sm"
                    placeholder="Input pequeno"
                  />
                  
                  <Input
                    label="Medium"
                    size="md"
                    placeholder="Input médio"
                  />
                  
                  <Input
                    label="Large"
                    size="lg"
                    placeholder="Input grande"
                  />
                  
                  <Input
                    label="Filled Variant"
                    variant="filled"
                    placeholder="Estilo preenchido"
                  />
                </div>
              </CardContent>
            </Card>
          </ResponsiveGrid>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-secondary-900 mb-6">
            Cards
          </h2>
          
          <ResponsiveGrid desktopColumns={3} gap="lg">
            <Card variant="default" clickable hover>
              <CardHeader 
                title="Card Padrão" 
                subtitle="Com hover e click"
              />
              <CardContent>
                <p className="text-secondary-600">
                  Este é um card padrão com efeitos de hover e é clicável.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="sm">Ação</Button>
              </CardFooter>
            </Card>

            <Card variant="elevated" padding="lg">
              <CardHeader title="Card Elevado" />
              <CardContent>
                <p className="text-secondary-600">
                  Card com sombra mais pronunciada e padding maior.
                </p>
              </CardContent>
            </Card>

            <Card variant="filled" loading={loading}>
              <CardHeader title="Card com Loading" />
              <CardContent>
                <p className="text-secondary-600">
                  Este card está em estado de carregamento.
                </p>
              </CardContent>
            </Card>
          </ResponsiveGrid>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-secondary-900 mb-6">
            Layout Responsivo
          </h2>
          
          <Card variant="outlined" padding="lg">
            <CardHeader 
              title="Grid Responsivo" 
              subtitle="Mobile: 1 coluna | Tablet: 2 colunas | Desktop: 3 colunas"
            />
            <CardContent>
              <ResponsiveGrid desktopColumns={3} gap="md">
                {Array.from({ length: 6 }, (_, i) => (
                  <Card key={i} variant="filled" padding="sm">
                    <CardContent>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-primary-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                          <span className="text-primary-600 font-semibold">{i + 1}</span>
                        </div>
                        <h3 className="font-medium text-secondary-900">Item {i + 1}</h3>
                        <p className="text-sm text-secondary-600 mt-1">
                          Descrição do item
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </ResponsiveGrid>
            </CardContent>
          </Card>
        </section>

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
                    Todos os componentes suportam navegação por teclado:
                  </p>
                  <ul className="text-sm text-secondary-600 space-y-1 ml-4">
                    <li>• Tab para navegar entre elementos</li>
                    <li>• Enter/Space para ativar botões</li>
                    <li>• Escape para fechar modais</li>
                    <li>• Setas para navegar em listas</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card variant="outlined" padding="md">
              <CardHeader title="Contraste e Foco" />
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-secondary-600">
                    Contraste mínimo AA garantido:
                  </p>
                  <ul className="text-sm text-secondary-600 space-y-1 ml-4">
                    <li>• Contraste 4.5:1 para texto normal</li>
                    <li>• Contraste 3:1 para texto grande</li>
                    <li>• Indicadores de foco visíveis</li>
                    <li>• Estados de erro claramente identificados</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </ResponsiveGrid>
        </section>
      </div>
    </Container>
  );
};

export default DesignSystemExample;
