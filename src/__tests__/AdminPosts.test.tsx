import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import AdminPosts from '../pages/AdminPosts';
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

const mockPosts = [
  {
    id: '1',
    title: 'First Post',
    author: 'John Doe',
    content: 'This is the first post content',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Second Post',
    author: 'Jane Smith',
    content: 'This is the second post content',
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
  },
];

const mockPostsResponse = {
  posts: mockPosts,
  total: 2,
  page: 1,
  limit: 20,
  totalPages: 1,
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

describe('AdminPosts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockedPostsApi.getPosts.mockResolvedValue(mockPostsResponse);
    mockedPostsApi.deletePost.mockResolvedValue();
  });

  it('deve renderizar o painel administrativo corretamente', async () => {
    renderWithProviders(<AdminPosts />);

    await waitFor(() => {
      expect(screen.getByText('Painel Administrativo')).toBeInTheDocument();
      expect(screen.getByText('Gerencie todos os posts do sistema')).toBeInTheDocument();
      expect(screen.getByText('Novo Post')).toBeInTheDocument();
    });
  });

  it('deve exibir a tabela de posts', async () => {
    renderWithProviders(<AdminPosts />);

    await waitFor(() => {
      expect(screen.getByText('First Post')).toBeInTheDocument();
      expect(screen.getByText('Second Post')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('deve exibir filtros de busca', async () => {
    renderWithProviders(<AdminPosts />);

    expect(screen.getByLabelText('Buscar posts')).toBeInTheDocument();
    expect(screen.getByLabelText('Filtrar por autor')).toBeInTheDocument();
    expect(screen.getByLabelText('Filtrar por data')).toBeInTheDocument();
  });

  it('deve filtrar posts por autor', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminPosts />);

    await waitFor(() => {
      const authorFilter = screen.getByLabelText('Filtrar por autor');
      user.type(authorFilter, 'John');
    });

    await waitFor(() => {
      expect(screen.getByText('First Post')).toBeInTheDocument();
      expect(screen.queryByText('Second Post')).not.toBeInTheDocument();
    });
  });

  it('deve filtrar posts por data', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminPosts />);

    await waitFor(() => {
      const dateFilter = screen.getByLabelText('Filtrar por data');
      user.type(dateFilter, '2023-01-01');
    });

    await waitFor(() => {
      expect(screen.getByText('First Post')).toBeInTheDocument();
      expect(screen.queryByText('Second Post')).not.toBeInTheDocument();
    });
  });

  it('deve exibir estado de loading', () => {
    mockedPostsApi.getPosts.mockImplementation(() => new Promise(() => {}));
    
    renderWithProviders(<AdminPosts />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('deve exibir estado de erro', async () => {
    mockedPostsApi.getPosts.mockRejectedValue(new Error('API Error'));

    renderWithProviders(<AdminPosts />);

    await waitFor(() => {
      expect(screen.getByText('Erro ao carregar os posts. Tente novamente.')).toBeInTheDocument();
    });
  });

  it('deve exibir estado vazio quando não há posts', async () => {
    mockedPostsApi.getPosts.mockResolvedValue({
      posts: [],
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
    });

    renderWithProviders(<AdminPosts />);

    await waitFor(() => {
      expect(screen.getByText('Nenhum post encontrado')).toBeInTheDocument();
    });
  });

  it('deve abrir modal de confirmação ao clicar em excluir', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminPosts />);

    await waitFor(() => {
      const deleteButtons = screen.getAllByTitle('Excluir');
      user.click(deleteButtons[0]);
    });

    await waitFor(() => {
      expect(screen.getByText('Excluir Post')).toBeInTheDocument();
      expect(screen.getByText('Tem certeza que deseja excluir o post "First Post"? Esta ação não pode ser desfeita.')).toBeInTheDocument();
    });
  });

  it('deve excluir post com sucesso', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminPosts />);

    await waitFor(() => {
      const deleteButtons = screen.getAllByTitle('Excluir');
      user.click(deleteButtons[0]);
    });

    await waitFor(() => {
      const confirmButton = screen.getByText('Excluir');
      user.click(confirmButton);
    });

    await waitFor(() => {
      expect(mockedPostsApi.deletePost).toHaveBeenCalledWith('1');
    });
  });

  it('deve cancelar exclusão quando cancelar no modal', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminPosts />);

    await waitFor(() => {
      const deleteButtons = screen.getAllByTitle('Excluir');
      user.click(deleteButtons[0]);
    });

    await waitFor(() => {
      const cancelButton = screen.getByText('Cancelar');
      user.click(cancelButton);
    });

    expect(mockedPostsApi.deletePost).not.toHaveBeenCalled();
  });

  it('deve redirecionar para edição ao clicar em editar', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminPosts />);

    await waitFor(() => {
      const editButtons = screen.getAllByTitle('Editar');
      user.click(editButtons[0]);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/posts/1/edit');
  });

  it('deve redirecionar para visualização ao clicar em visualizar', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminPosts />);

    await waitFor(() => {
      const viewButtons = screen.getAllByTitle('Visualizar');
      user.click(viewButtons[0]);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/posts/1');
  });

  it('deve redirecionar para criação ao clicar em Novo Post', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminPosts />);

    await waitFor(() => {
      const newPostButton = screen.getByText('Novo Post');
      user.click(newPostButton);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/posts/create');
  });

  it('deve tratar erro ao excluir post', async () => {
    const user = userEvent.setup();
    const error = new Error('Delete failed');
    (error as any).response = { status: 403 };
    mockedPostsApi.deletePost.mockRejectedValue(error);

    renderWithProviders(<AdminPosts />);

    await waitFor(() => {
      const deleteButtons = screen.getAllByTitle('Excluir');
      user.click(deleteButtons[0]);
    });

    await waitFor(() => {
      const confirmButton = screen.getByText('Excluir');
      user.click(confirmButton);
    });

    await waitFor(() => {
      expect(mockedPostsApi.deletePost).toHaveBeenCalledWith('1');
    });
  });

  it('deve exibir paginação quando há múltiplas páginas', async () => {
    mockedPostsApi.getPosts.mockResolvedValue({
      posts: mockPosts,
      total: 50,
      page: 1,
      limit: 20,
      totalPages: 3,
    });

    renderWithProviders(<AdminPosts />);

    await waitFor(() => {
      expect(screen.getByText('Página 1 de 3')).toBeInTheDocument();
      expect(screen.getByLabelText('Página anterior')).toBeInTheDocument();
      expect(screen.getByLabelText('Próxima página')).toBeInTheDocument();
    });
  });

  it('deve navegar para próxima página', async () => {
    const user = userEvent.setup();
    mockedPostsApi.getPosts.mockResolvedValue({
      posts: mockPosts,
      total: 50,
      page: 1,
      limit: 20,
      totalPages: 3,
    });

    renderWithProviders(<AdminPosts />);

    await waitFor(() => {
      const nextButton = screen.getByLabelText('Próxima página');
      user.click(nextButton);
    });

    expect(mockedPostsApi.getPosts).toHaveBeenCalledWith({
      search: undefined,
      page: 2,
      limit: 20,
    });
  });

  it('deve limpar filtros', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminPosts />);

    await waitFor(() => {
      const searchInput = screen.getByLabelText('Buscar posts');
      const authorInput = screen.getByLabelText('Filtrar por autor');
      
      user.type(searchInput, 'test');
      user.type(authorInput, 'John');
    });

    await waitFor(() => {
      const clearButton = screen.getByText('Limpar filtros');
      user.click(clearButton);
    });

    expect(screen.getByLabelText('Buscar posts')).toHaveValue('');
    expect(screen.getByLabelText('Filtrar por autor')).toHaveValue('');
  });

  it('deve ter acessibilidade correta na tabela', async () => {
    renderWithProviders(<AdminPosts />);

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getAllByRole('columnheader')).toHaveLength(5);
      expect(screen.getAllByRole('row')).toHaveLength(3); // header + 2 posts
    });
  });
});
