import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PostsList from '../pages/PostsList';
import { postsApi } from '../services/api';

// Mock do postsApi
jest.mock('../services/api');
const mockedPostsApi = postsApi as jest.Mocked<typeof postsApi>;

// Mock do useDebounce
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
  useEffect: jest.fn(),
  useCallback: jest.fn(),
  useMemo: jest.fn(),
}));

const mockPosts = [
  {
    id: '1',
    title: 'Primeiro Post',
    author: 'João Silva',
    content: 'Este é o conteúdo do primeiro post que tem mais de 150 caracteres para testar a funcionalidade de truncamento da descrição que deve ser cortada adequadamente.',
    description: 'Descrição do primeiro post',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Segundo Post',
    author: 'Maria Santos',
    content: 'Conteúdo do segundo post',
    description: 'Descrição do segundo post',
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
  },
];

const mockPostsResponse = {
  posts: mockPosts,
  total: 2,
  page: 1,
  limit: 10,
  totalPages: 1,
};

// Helper para renderizar com Router
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('PostsList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedPostsApi.getPosts.mockResolvedValue(mockPostsResponse);
  });

  it('deve renderizar a lista de posts corretamente', async () => {
    renderWithRouter(<PostsList />);

    await waitFor(() => {
      expect(screen.getByText('Primeiro Post')).toBeInTheDocument();
      expect(screen.getByText('Segundo Post')).toBeInTheDocument();
      expect(screen.getByText('Por João Silva')).toBeInTheDocument();
      expect(screen.getByText('Por Maria Santos')).toBeInTheDocument();
    });
  });

  it('deve exibir campo de busca', () => {
    renderWithRouter(<PostsList />);
    
    expect(screen.getByLabelText('Campo de busca de posts')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite para buscar por título, autor ou conteúdo...')).toBeInTheDocument();
  });

  it('deve chamar a API com os parâmetros corretos', async () => {
    renderWithRouter(<PostsList />);

    await waitFor(() => {
      expect(mockedPostsApi.getPosts).toHaveBeenCalledWith({
        search: undefined,
        page: 1,
        limit: 10,
      });
    });
  });

  it('deve exibir estado de loading', () => {
    // Mock do useState para simular loading
    const mockUseState = jest.fn();
    mockUseState
      .mockReturnValueOnce([]) // posts
      .mockReturnValueOnce(true) // loading
      .mockReturnValueOnce(null) // error
      .mockReturnValueOnce('') // searchTerm
      .mockReturnValueOnce(1) // currentPage
      .mockReturnValueOnce(1) // totalPages
      .mockReturnValueOnce(0); // totalPosts

    (React.useState as jest.Mock).mockImplementation(mockUseState);

    renderWithRouter(<PostsList />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('deve exibir estado de erro', () => {
    // Mock do useState para simular erro
    const mockUseState = jest.fn();
    mockUseState
      .mockReturnValueOnce([]) // posts
      .mockReturnValueOnce(false) // loading
      .mockReturnValueOnce('Erro ao carregar posts') // error
      .mockReturnValueOnce('') // searchTerm
      .mockReturnValueOnce(1) // currentPage
      .mockReturnValueOnce(1) // totalPages
      .mockReturnValueOnce(0); // totalPosts

    (React.useState as jest.Mock).mockImplementation(mockUseState);

    renderWithRouter(<PostsList />);
    
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Erro ao carregar posts')).toBeInTheDocument();
  });

  it('deve exibir mensagem quando não há posts', () => {
    // Mock do useState para simular lista vazia
    const mockUseState = jest.fn();
    mockUseState
      .mockReturnValueOnce([]) // posts
      .mockReturnValueOnce(false) // loading
      .mockReturnValueOnce(null) // error
      .mockReturnValueOnce('') // searchTerm
      .mockReturnValueOnce(1) // currentPage
      .mockReturnValueOnce(1) // totalPages
      .mockReturnValueOnce(0); // totalPosts

    (React.useState as jest.Mock).mockImplementation(mockUseState);

    renderWithRouter(<PostsList />);
    
    expect(screen.getByText('Nenhum post disponível')).toBeInTheDocument();
  });

  it('deve exibir mensagem quando não há resultados de busca', () => {
    // Mock do useState para simular busca sem resultados
    const mockUseState = jest.fn();
    mockUseState
      .mockReturnValueOnce([]) // posts
      .mockReturnValueOnce(false) // loading
      .mockReturnValueOnce(null) // error
      .mockReturnValueOnce('termo inexistente') // searchTerm
      .mockReturnValueOnce(1) // currentPage
      .mockReturnValueOnce(1) // totalPages
      .mockReturnValueOnce(0); // totalPosts

    (React.useState as jest.Mock).mockImplementation(mockUseState);

    renderWithRouter(<PostsList />);
    
    expect(screen.getByText('Nenhum post encontrado')).toBeInTheDocument();
  });

  it('deve ter links para posts individuais', async () => {
    renderWithRouter(<PostsList />);

    await waitFor(() => {
      const firstPostLink = screen.getByLabelText('Ler post: Primeiro Post');
      const secondPostLink = screen.getByLabelText('Ler post: Segundo Post');
      
      expect(firstPostLink).toHaveAttribute('href', '/posts/1');
      expect(secondPostLink).toHaveAttribute('href', '/posts/2');
    });
  });

  it('deve ter estrutura semântica correta', async () => {
    renderWithRouter(<PostsList />);

    await waitFor(() => {
      expect(screen.getByRole('list')).toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(2);
    });
  });

  it('deve exibir paginação quando há múltiplas páginas', () => {
    // Mock do useState para simular múltiplas páginas
    const mockUseState = jest.fn();
    mockUseState
      .mockReturnValueOnce(mockPosts) // posts
      .mockReturnValueOnce(false) // loading
      .mockReturnValueOnce(null) // error
      .mockReturnValueOnce('') // searchTerm
      .mockReturnValueOnce(2) // currentPage
      .mockReturnValueOnce(3) // totalPages
      .mockReturnValueOnce(25); // totalPosts

    (React.useState as jest.Mock).mockImplementation(mockUseState);

    renderWithRouter(<PostsList />);
    
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByLabelText('Página anterior')).toBeInTheDocument();
    expect(screen.getByLabelText('Próxima página')).toBeInTheDocument();
    expect(screen.getByText('Página 2 de 3')).toBeInTheDocument();
  });
});
