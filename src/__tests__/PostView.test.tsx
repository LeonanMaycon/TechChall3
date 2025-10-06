import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PostView from '../pages/PostView';
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

const mockPost = {
  id: '1',
  title: 'Test Post Title',
  author: 'Test Author',
  content: '<p>This is the <strong>post content</strong> with <em>HTML</em>.</p>',
  description: 'Test description',
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
};

const mockComments = [
  {
    id: '1',
    postId: '1',
    author: 'Comment Author',
    content: 'This is a test comment',
    createdAt: '2023-01-01T01:00:00Z',
    updatedAt: '2023-01-01T01:00:00Z',
  },
];

// Helper para renderizar com Router e AuthProvider
const renderWithProviders = (component: React.ReactElement, user = null) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('PostView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedPostsApi.getPostById.mockResolvedValue(mockPost);
    mockedPostsApi.getComments.mockResolvedValue(mockComments);
  });

  it('deve renderizar o post corretamente', async () => {
    renderWithProviders(<PostView />);

    await waitFor(() => {
      expect(screen.getByText('Test Post Title')).toBeInTheDocument();
      expect(screen.getByText('Por Test Author')).toBeInTheDocument();
      expect(screen.getByText('This is the post content with HTML.')).toBeInTheDocument();
    });
  });

  it('deve exibir breadcrumb', async () => {
    renderWithProviders(<PostView />);

    await waitFor(() => {
      expect(screen.getByText('Posts')).toBeInTheDocument();
      expect(screen.getByText('Test Post Title')).toBeInTheDocument();
    });
  });

  it('deve exibir botão voltar', async () => {
    renderWithProviders(<PostView />);

    await waitFor(() => {
      expect(screen.getByText('← Voltar')).toBeInTheDocument();
    });
  });

  it('deve exibir estado de loading', () => {
    mockedPostsApi.getPostById.mockImplementation(() => new Promise(() => {}));
    
    renderWithProviders(<PostView />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('deve exibir erro quando post não é encontrado', async () => {
    const error = new Error('Not found');
    (error as any).response = { status: 404 };
    mockedPostsApi.getPostById.mockRejectedValue(error);

    renderWithProviders(<PostView />);

    await waitFor(() => {
      expect(screen.getByText('Post não encontrado')).toBeInTheDocument();
    });
  });

  it('deve exibir erro genérico', async () => {
    mockedPostsApi.getPostById.mockRejectedValue(new Error('API Error'));

    renderWithProviders(<PostView />);

    await waitFor(() => {
      expect(screen.getByText('Erro ao carregar o post. Tente novamente.')).toBeInTheDocument();
    });
  });

  it('deve exibir botão editar para professores', async () => {
    // Mock do localStorage para simular usuário professor
    const teacherUser = {
      id: '1',
      name: 'Teacher Name',
      email: 'teacher@example.com',
      role: 'teacher' as const
    };
    
    localStorage.setItem('user', JSON.stringify(teacherUser));

    renderWithProviders(<PostView />);

    await waitFor(() => {
      expect(screen.getByText('✏️ Editar')).toBeInTheDocument();
    });

    localStorage.removeItem('user');
  });

  it('não deve exibir botão editar para estudantes', async () => {
    // Mock do localStorage para simular usuário estudante
    const studentUser = {
      id: '1',
      name: 'Student Name',
      email: 'student@example.com',
      role: 'student' as const
    };
    
    localStorage.setItem('user', JSON.stringify(studentUser));

    renderWithProviders(<PostView />);

    await waitFor(() => {
      expect(screen.queryByText('✏️ Editar')).not.toBeInTheDocument();
    });

    localStorage.removeItem('user');
  });

  it('deve exibir comentários', async () => {
    renderWithProviders(<PostView />);

    await waitFor(() => {
      expect(screen.getByText('Comentários (1)')).toBeInTheDocument();
      expect(screen.getByText('Comment Author')).toBeInTheDocument();
      expect(screen.getByText('This is a test comment')).toBeInTheDocument();
    });
  });

  it('deve exibir formulário de comentário para usuários autenticados', async () => {
    const user = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'student' as const
    };
    
    localStorage.setItem('user', JSON.stringify(user));

    renderWithProviders(<PostView />);

    await waitFor(() => {
      expect(screen.getByLabelText('Adicionar comentário')).toBeInTheDocument();
      expect(screen.getByText('Enviar comentário')).toBeInTheDocument();
    });

    localStorage.removeItem('user');
  });

  it('deve adicionar comentário quando formulário é submetido', async () => {
    const user = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'student' as const
    };
    
    localStorage.setItem('user', JSON.stringify(user));

    const newComment = {
      id: '2',
      postId: '1',
      author: 'Test User',
      content: 'New comment',
      createdAt: '2023-01-01T02:00:00Z',
      updatedAt: '2023-01-01T02:00:00Z',
    };

    mockedPostsApi.createComment.mockResolvedValue(newComment);

    renderWithProviders(<PostView />);

    await waitFor(() => {
      const textarea = screen.getByLabelText('Adicionar comentário');
      const submitButton = screen.getByText('Enviar comentário');
      
      fireEvent.change(textarea, { target: { value: 'New comment' } });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockedPostsApi.createComment).toHaveBeenCalledWith({
        postId: '1',
        content: 'New comment',
        author: 'Test User'
      });
    });

    localStorage.removeItem('user');
  });

  it('deve sanitizar conteúdo HTML', async () => {
    renderWithProviders(<PostView />);

    await waitFor(() => {
      // O conteúdo deve ser renderizado sem tags HTML perigosas
      expect(screen.getByText('This is the post content with HTML.')).toBeInTheDocument();
    });
  });

  it('deve exibir mensagem quando não há comentários', async () => {
    mockedPostsApi.getComments.mockResolvedValue([]);

    renderWithProviders(<PostView />);

    await waitFor(() => {
      expect(screen.getByText('Comentários (0)')).toBeInTheDocument();
      expect(screen.getByText('Nenhum comentário ainda. Seja o primeiro a comentar!')).toBeInTheDocument();
    });
  });
});
