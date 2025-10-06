import { postsApi } from '../services/api';
import axios from 'axios';

// Mock do axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPosts', () => {
    it('deve fazer requisição GET para /posts com parâmetros corretos', async () => {
      const mockResponse = {
        data: {
          posts: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        },
      };

      mockedAxios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue(mockResponse),
      } as any);

      await postsApi.getPosts({ search: 'test', page: 2, limit: 5 });

      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api',
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('deve usar parâmetros padrão quando não fornecidos', async () => {
      const mockResponse = {
        data: {
          posts: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        },
      };

      const mockGet = jest.fn().mockResolvedValue(mockResponse);
      mockedAxios.create.mockReturnValue({
        get: mockGet,
      } as any);

      await postsApi.getPosts();

      expect(mockGet).toHaveBeenCalledWith('/posts?page=1&limit=10');
    });

    it('deve incluir parâmetro de busca quando fornecido', async () => {
      const mockResponse = {
        data: {
          posts: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        },
      };

      const mockGet = jest.fn().mockResolvedValue(mockResponse);
      mockedAxios.create.mockReturnValue({
        get: mockGet,
      } as any);

      await postsApi.getPosts({ search: 'react' });

      expect(mockGet).toHaveBeenCalledWith('/posts?search=react&page=1&limit=10');
    });

    it('deve retornar dados da resposta', async () => {
      const mockData = {
        posts: [
          {
            id: '1',
            title: 'Test Post',
            author: 'Test Author',
            content: 'Test content',
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      const mockResponse = { data: mockData };
      const mockGet = jest.fn().mockResolvedValue(mockResponse);
      mockedAxios.create.mockReturnValue({
        get: mockGet,
      } as any);

      const result = await postsApi.getPosts();

      expect(result).toEqual(mockData);
    });

    it('deve tratar erros de requisição', async () => {
      const mockError = new Error('Network Error');
      const mockGet = jest.fn().mockRejectedValue(mockError);
      mockedAxios.create.mockReturnValue({
        get: mockGet,
      } as any);

      await expect(postsApi.getPosts()).rejects.toThrow('Network Error');
    });
  });

  describe('getPostById', () => {
    it('deve fazer requisição GET para /posts/:id', async () => {
      const mockPost = {
        id: '1',
        title: 'Test Post',
        author: 'Test Author',
        content: 'Test content',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      const mockResponse = { data: mockPost };
      const mockGet = jest.fn().mockResolvedValue(mockResponse);
      mockedAxios.create.mockReturnValue({
        get: mockGet,
      } as any);

      await postsApi.getPostById('1');

      expect(mockGet).toHaveBeenCalledWith('/posts/1');
    });

    it('deve retornar dados do post', async () => {
      const mockPost = {
        id: '1',
        title: 'Test Post',
        author: 'Test Author',
        content: 'Test content',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      const mockResponse = { data: mockPost };
      const mockGet = jest.fn().mockResolvedValue(mockResponse);
      mockedAxios.create.mockReturnValue({
        get: mockGet,
      } as any);

      const result = await postsApi.getPostById('1');

      expect(result).toEqual(mockPost);
    });
  });
});
