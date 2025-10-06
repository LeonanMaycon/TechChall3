import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import PostCreate from '../pages/PostCreate';
import { postsApi } from '../services/api';
import { AuthProvider } from '../contexts/AuthContext';

// Mock do postsApi
jest.mock('../services/api');
const mockedPostsApi = postsApi as jest.Mocked<typeof postsApi>;

// Mock do useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
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

const mockNewPost = {
  id: '2',
  title: 'New Post Title',
  author: 'Test Teacher',
  content: 'New post content',
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
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

describe('PostCreate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockedPostsApi.createPost.mockResolvedValue(mockNewPost);
  });

  it('deve renderizar o formulário corretamente', () => {
    renderWithProviders(<PostCreate />);

    expect(screen.getByText('Criar Novo Post')).toBeInTheDocument();
    expect(screen.getByLabelText('Título do Post *')).toBeInTheDocument();
    expect(screen.getByLabelText('Conteúdo do Post *')).toBeInTheDocument();
    expect(screen.getByText('Criar Post')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  it('deve exibir informações do autor', () => {
    renderWithProviders(<PostCreate />);

    expect(screen.getByText('Test Teacher')).toBeInTheDocument();
    expect(screen.getByText('teacher@example.com')).toBeInTheDocument();
    expect(screen.getByText('Professor')).toBeInTheDocument();
  });

  it('deve exibir breadcrumb', () => {
    renderWithProviders(<PostCreate />);

    expect(screen.getByText('Posts')).toBeInTheDocument();
    expect(screen.getByText('Criar Post')).toBeInTheDocument();
  });

  it('deve validar campos obrigatórios', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PostCreate />);

    const submitButton = screen.getByText('Criar Post');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('O título é obrigatório')).toBeInTheDocument();
      expect(screen.getByText('O conteúdo é obrigatório')).toBeInTheDocument();
    });

    expect(mockedPostsApi.createPost).not.toHaveBeenCalled();
  });

  it('deve validar tamanho mínimo do título', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PostCreate />);

    const titleInput = screen.getByLabelText('Título do Post *');
    const contentInput = screen.getByLabelText('Conteúdo do Post *');
    const submitButton = screen.getByText('Criar Post');

    await user.type(titleInput, 'ab');
    await user.type(contentInput, 'This is a valid content with more than 10 characters');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('O título deve ter pelo menos 3 caracteres')).toBeInTheDocument();
    });

    expect(mockedPostsApi.createPost).not.toHaveBeenCalled();
  });

  it('deve validar tamanho mínimo do conteúdo', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PostCreate />);

    const titleInput = screen.getByLabelText('Título do Post *');
    const contentInput = screen.getByLabelText('Conteúdo do Post *');
    const submitButton = screen.getByText('Criar Post');

    await user.type(titleInput, 'Valid Title');
    await user.type(contentInput, 'Short');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('O conteúdo deve ter pelo menos 10 caracteres')).toBeInTheDocument();
    });

    expect(mockedPostsApi.createPost).not.toHaveBeenCalled();
  });

  it('deve criar post com sucesso', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PostCreate />);

    const titleInput = screen.getByLabelText('Título do Post *');
    const contentInput = screen.getByLabelText('Conteúdo do Post *');
    const submitButton = screen.getByText('Criar Post');

    await user.type(titleInput, 'Test Post Title');
    await user.type(contentInput, 'This is a test post content with more than 10 characters');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockedPostsApi.createPost).toHaveBeenCalledWith({
        title: 'Test Post Title',
        content: 'This is a test post content with more than 10 characters',
        authorId: '1'
      });
    });

    expect(mockNavigate).toHaveBeenCalledWith('/posts/2');
  });

  it('deve exibir loading durante envio', async () => {
    const user = userEvent.setup();
    // Mock de promise que não resolve imediatamente
    mockedPostsApi.createPost.mockImplementation(() => new Promise(() => {}));
    
    renderWithProviders(<PostCreate />);

    const titleInput = screen.getByLabelText('Título do Post *');
    const contentInput = screen.getByLabelText('Conteúdo do Post *');
    const submitButton = screen.getByText('Criar Post');

    await user.type(titleInput, 'Test Post Title');
    await user.type(contentInput, 'This is a test post content with more than 10 characters');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Criando...')).toBeInTheDocument();
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
    mockedPostsApi.createPost.mockRejectedValue(error);

    renderWithProviders(<PostCreate />);

    const titleInput = screen.getByLabelText('Título do Post *');
    const contentInput = screen.getByLabelText('Conteúdo do Post *');
    const submitButton = screen.getByText('Criar Post');

    await user.type(titleInput, 'Test Post Title');
    await user.type(contentInput, 'This is a test post content with more than 10 characters');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockedPostsApi.createPost).toHaveBeenCalled();
    });
  });

  it('deve tratar erro 401 (não autenticado)', async () => {
    const user = userEvent.setup();
    const error = new Error('Unauthorized');
    (error as any).response = { status: 401 };
    mockedPostsApi.createPost.mockRejectedValue(error);

    renderWithProviders(<PostCreate />);

    const titleInput = screen.getByLabelText('Título do Post *');
    const contentInput = screen.getByLabelText('Conteúdo do Post *');
    const submitButton = screen.getByText('Criar Post');

    await user.type(titleInput, 'Test Post Title');
    await user.type(contentInput, 'This is a test post content with more than 10 characters');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('deve tratar erro 403 (sem permissão)', async () => {
    const user = userEvent.setup();
    const error = new Error('Forbidden');
    (error as any).response = { status: 403 };
    mockedPostsApi.createPost.mockRejectedValue(error);

    renderWithProviders(<PostCreate />);

    const titleInput = screen.getByLabelText('Título do Post *');
    const contentInput = screen.getByLabelText('Conteúdo do Post *');
    const submitButton = screen.getByText('Criar Post');

    await user.type(titleInput, 'Test Post Title');
    await user.type(contentInput, 'This is a test post content with more than 10 characters');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockedPostsApi.createPost).toHaveBeenCalled();
    });
  });

  it('deve cancelar criação quando botão cancelar é clicado', async () => {
    const user = userEvent.setup();
    // Mock do window.confirm
    window.confirm = jest.fn(() => true);
    
    renderWithProviders(<PostCreate />);

    const cancelButton = screen.getByText('Cancelar');
    await user.click(cancelButton);

    expect(window.confirm).toHaveBeenCalledWith('Tem certeza que deseja cancelar? As alterações serão perdidas.');
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('não deve cancelar se usuário não confirmar', async () => {
    const user = userEvent.setup();
    // Mock do window.confirm retornando false
    window.confirm = jest.fn(() => false);
    
    renderWithProviders(<PostCreate />);

    const cancelButton = screen.getByText('Cancelar');
    await user.click(cancelButton);

    expect(window.confirm).toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('deve exibir dicas de formatação', () => {
    renderWithProviders(<PostCreate />);

    expect(screen.getByText('Dicas de Formatação')).toBeInTheDocument();
    expect(screen.getByText('Negrito:')).toBeInTheDocument();
    expect(screen.getByText('Itálico:')).toBeInTheDocument();
    expect(screen.getByText('Sublinhado:')).toBeInTheDocument();
  });

  it('deve ter acessibilidade correta', () => {
    renderWithProviders(<PostCreate />);

    const titleInput = screen.getByLabelText('Título do Post *');
    const contentInput = screen.getByLabelText('Conteúdo do Post *');

    expect(titleInput).toHaveAttribute('aria-invalid', 'false');
    expect(contentInput).toHaveAttribute('aria-invalid', 'false');
  });
});
