import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import PostEdit from '../pages/PostEdit';
import { postsApi } from '../services/api';
import { AuthProvider } from '../contexts/AuthContext';

// Mock do postsApi
jest.mock('../services/api');
const mockedPostsApi = postsApi as jest.Mocked<typeof postsApi>;

// Mock do useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
  useNavigate: () => jest.fn(),
}));

// Mock do react-hot-toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockUser = {
  id: '1',
  name: 'Test Teacher',
  email: 'teacher@example.com',
  role: 'teacher' as const
};

const mockPost = {
  id: '1',
  title: 'Original Post Title',
  author: 'Test Teacher',
  content: 'Original post content with more than 10 characters',
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
};

const mockUpdatedPost = {
  ...mockPost,
  title: 'Updated Post Title',
  content: 'Updated post content with more than 10 characters',
  updatedAt: '2023-01-02T00:00:00Z',
};

// Helper para renderizar com Router e AuthProvider
const renderWithProviders = (component: React.ReactElement, user = mockUser) => {
  // Mock do localStorage para simular usuário logado
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('PostEdit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockedPostsApi.getPostById.mockResolvedValue(mockPost);
    mockedPostsApi.updatePost.mockResolvedValue(mockUpdatedPost);
  });

  it('deve renderizar o formulário de edição corretamente', async () => {
    renderWithProviders(<PostEdit />);

    await waitFor(() => {
      expect(screen.getByText('Editar Post')).toBeInTheDocument();
      expect(screen.getByLabelText('Título do Post *')).toBeInTheDocument();
      expect(screen.getByLabelText('Conteúdo do Post *')).toBeInTheDocument();
      expect(screen.getByText('Salvar Alterações')).toBeInTheDocument();
      expect(screen.getByText('Cancelar')).toBeInTheDocument();
    });
  });

  it('deve carregar dados do post no formulário', async () => {
    renderWithProviders(<PostEdit />);

    await waitFor(() => {
      const titleInput = screen.getByLabelText('Título do Post *') as HTMLInputElement;
      const contentInput = screen.getByLabelText('Conteúdo do Post *') as HTMLTextAreaElement;
      
      expect(titleInput.value).toBe('Original Post Title');
      expect(contentInput.value).toBe('Original post content with more than 10 characters');
    });
  });

  it('deve exibir informações do post original', async () => {
    renderWithProviders(<PostEdit />);

    await waitFor(() => {
      expect(screen.getByText('Test Teacher')).toBeInTheDocument();
      expect(screen.getByText('Criado em:')).toBeInTheDocument();
      expect(screen.getByText('Última atualização:')).toBeInTheDocument();
    });
  });

  it('deve exibir breadcrumb', async () => {
    renderWithProviders(<PostEdit />);

    await waitFor(() => {
      expect(screen.getByText('Posts')).toBeInTheDocument();
      expect(screen.getByText('Original Post Title')).toBeInTheDocument();
      expect(screen.getByText('Editar')).toBeInTheDocument();
    });
  });

  it('deve exibir estado de loading', () => {
    mockedPostsApi.getPostById.mockImplementation(() => new Promise(() => {}));
    
    renderWithProviders(<PostEdit />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('deve exibir erro quando post não é encontrado', async () => {
    const error = new Error('Not found');
    (error as any).response = { status: 404 };
    mockedPostsApi.getPostById.mockRejectedValue(error);

    renderWithProviders(<PostEdit />);

    await waitFor(() => {
      expect(screen.getByText('Post não encontrado')).toBeInTheDocument();
    });
  });

  it('deve exibir erro quando usuário não tem permissão', async () => {
    const otherUser = {
      id: '2',
      name: 'Other Teacher',
      email: 'other@example.com',
      role: 'teacher' as const
    };

    renderWithProviders(<PostEdit />, otherUser);

    await waitFor(() => {
      expect(screen.getByText('Você não tem permissão para editar este post')).toBeInTheDocument();
    });
  });

  it('deve validar campos obrigatórios', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PostEdit />);

    await waitFor(() => {
      const titleInput = screen.getByLabelText('Título do Post *');
      const contentInput = screen.getByLabelText('Conteúdo do Post *');
      
      // Limpar campos
      user.clear(titleInput);
      user.clear(contentInput);
    });

    const submitButton = screen.getByText('Salvar Alterações');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('O título é obrigatório')).toBeInTheDocument();
      expect(screen.getByText('O conteúdo é obrigatório')).toBeInTheDocument();
    });

    expect(mockedPostsApi.updatePost).not.toHaveBeenCalled();
  });

  it('deve validar tamanho mínimo do título', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PostEdit />);

    await waitFor(() => {
      const titleInput = screen.getByLabelText('Título do Post *');
      const submitButton = screen.getByText('Salvar Alterações');
      
      user.clear(titleInput);
      user.type(titleInput, 'ab');
      user.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText('O título deve ter pelo menos 3 caracteres')).toBeInTheDocument();
    });

    expect(mockedPostsApi.updatePost).not.toHaveBeenCalled();
  });

  it('deve validar tamanho mínimo do conteúdo', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PostEdit />);

    await waitFor(() => {
      const contentInput = screen.getByLabelText('Conteúdo do Post *');
      const submitButton = screen.getByText('Salvar Alterações');
      
      user.clear(contentInput);
      user.type(contentInput, 'Short');
      user.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText('O conteúdo deve ter pelo menos 10 caracteres')).toBeInTheDocument();
    });

    expect(mockedPostsApi.updatePost).not.toHaveBeenCalled();
  });

  it('deve atualizar post com sucesso', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PostEdit />);

    await waitFor(() => {
      const titleInput = screen.getByLabelText('Título do Post *');
      const contentInput = screen.getByLabelText('Conteúdo do Post *');
      const submitButton = screen.getByText('Salvar Alterações');
      
      user.clear(titleInput);
      user.type(titleInput, 'Updated Post Title');
      user.clear(contentInput);
      user.type(contentInput, 'Updated post content with more than 10 characters');
      user.click(submitButton);
    });

    await waitFor(() => {
      expect(mockedPostsApi.updatePost).toHaveBeenCalledWith({
        id: '1',
        title: 'Updated Post Title',
        content: 'Updated post content with more than 10 characters'
      });
    });
  });

  it('deve exibir loading durante envio', async () => {
    const user = userEvent.setup();
    // Mock de promise que não resolve imediatamente
    mockedPostsApi.updatePost.mockImplementation(() => new Promise(() => {}));
    
    renderWithProviders(<PostEdit />);

    await waitFor(() => {
      const submitButton = screen.getByText('Salvar Alterações');
      user.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Salvando...')).toBeInTheDocument();
    });
  });

  it('deve tratar erro de validação do servidor', async () => {
    const user = userEvent.setup();
    const error = new Error('Validation failed');
    (error as any).response = {
      status: 400,
      data: {
        errors: {
          title: 'Título já existe',
          content: 'Conteúdo muito curto'
        }
      }
    };
    mockedPostsApi.updatePost.mockRejectedValue(error);

    renderWithProviders(<PostEdit />);

    await waitFor(() => {
      const submitButton = screen.getByText('Salvar Alterações');
      user.click(submitButton);
    });

    await waitFor(() => {
      expect(mockedPostsApi.updatePost).toHaveBeenCalled();
    });
  });

  it('deve tratar erro 401 (não autenticado)', async () => {
    const user = userEvent.setup();
    const error = new Error('Unauthorized');
    (error as any).response = { status: 401 };
    mockedPostsApi.updatePost.mockRejectedValue(error);

    renderWithProviders(<PostEdit />);

    await waitFor(() => {
      const submitButton = screen.getByText('Salvar Alterações');
      user.click(submitButton);
    });

    await waitFor(() => {
      expect(mockedPostsApi.updatePost).toHaveBeenCalled();
    });
  });

  it('deve tratar erro 403 (sem permissão)', async () => {
    const user = userEvent.setup();
    const error = new Error('Forbidden');
    (error as any).response = { status: 403 };
    mockedPostsApi.updatePost.mockRejectedValue(error);

    renderWithProviders(<PostEdit />);

    await waitFor(() => {
      const submitButton = screen.getByText('Salvar Alterações');
      user.click(submitButton);
    });

    await waitFor(() => {
      expect(mockedPostsApi.updatePost).toHaveBeenCalled();
    });
  });

  it('deve tratar erro 404 (post não encontrado)', async () => {
    const user = userEvent.setup();
    const error = new Error('Not found');
    (error as any).response = { status: 404 };
    mockedPostsApi.updatePost.mockRejectedValue(error);

    renderWithProviders(<PostEdit />);

    await waitFor(() => {
      const submitButton = screen.getByText('Salvar Alterações');
      user.click(submitButton);
    });

    await waitFor(() => {
      expect(mockedPostsApi.updatePost).toHaveBeenCalled();
    });
  });

  it('deve cancelar edição quando botão cancelar é clicado', async () => {
    const user = userEvent.setup();
    // Mock do window.confirm
    window.confirm = jest.fn(() => true);
    
    renderWithProviders(<PostEdit />);

    await waitFor(() => {
      const cancelButton = screen.getByText('Cancelar');
      user.click(cancelButton);
    });

    expect(window.confirm).toHaveBeenCalledWith('Tem certeza que deseja cancelar? As alterações serão perdidas.');
  });

  it('não deve cancelar se usuário não confirmar', async () => {
    const user = userEvent.setup();
    // Mock do window.confirm retornando false
    window.confirm = jest.fn(() => false);
    
    renderWithProviders(<PostEdit />);

    await waitFor(() => {
      const cancelButton = screen.getByText('Cancelar');
      user.click(cancelButton);
    });

    expect(window.confirm).toHaveBeenCalled();
  });

  it('deve exibir dicas de formatação', async () => {
    renderWithProviders(<PostEdit />);

    await waitFor(() => {
      expect(screen.getByText('Dicas de Formatação')).toBeInTheDocument();
      expect(screen.getByText('Negrito:')).toBeInTheDocument();
      expect(screen.getByText('Itálico:')).toBeInTheDocument();
      expect(screen.getByText('Sublinhado:')).toBeInTheDocument();
    });
  });

  it('deve ter acessibilidade correta', async () => {
    renderWithProviders(<PostEdit />);

    await waitFor(() => {
      const titleInput = screen.getByLabelText('Título do Post *');
      const contentInput = screen.getByLabelText('Conteúdo do Post *');

      expect(titleInput).toHaveAttribute('aria-invalid', 'false');
      expect(contentInput).toHaveAttribute('aria-invalid', 'false');
    });
  });
});
