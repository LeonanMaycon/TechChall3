import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Login from '../pages/Login';
import { authApi } from '../services/api';
import { AuthProvider } from '../contexts/AuthContext';

// Mock do authApi
jest.mock('../services/api');
const mockedAuthApi = authApi as jest.Mocked<typeof authApi>;

// Mock do useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockUser = {
  id: '1',
  name: 'Test Teacher',
  email: 'teacher@example.com',
  role: 'teacher' as const
};

const mockLoginResponse = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  user: mockUser
};

// Helper para renderizar com Router e AuthProvider
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAuthApi.login.mockResolvedValue(mockLoginResponse);
  });

  it('deve renderizar o formulário de login corretamente', () => {
    renderWithProviders(<Login />);

    expect(screen.getByText('Entrar na sua conta')).toBeInTheDocument();
    expect(screen.getByText('Acesse o painel administrativo para gerenciar posts')).toBeInTheDocument();
    expect(screen.getByLabelText('Usuário')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    expect(screen.getByText('Entrar')).toBeInTheDocument();
  });

  it('deve exibir credenciais de teste', () => {
    renderWithProviders(<Login />);

    expect(screen.getByText('Credenciais de Teste')).toBeInTheDocument();
    expect(screen.getByText('Professor: professor / senha123')).toBeInTheDocument();
    expect(screen.getByText('Admin: admin / admin123')).toBeInTheDocument();
  });

  it('deve validar campos obrigatórios', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);

    const submitButton = screen.getByText('Entrar');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('O usuário é obrigatório')).toBeInTheDocument();
      expect(screen.getByText('A senha é obrigatória')).toBeInTheDocument();
    });

    expect(mockedAuthApi.login).not.toHaveBeenCalled();
  });

  it('deve validar tamanho mínimo do usuário', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);

    const usernameInput = screen.getByLabelText('Usuário');
    const passwordInput = screen.getByLabelText('Senha');
    const submitButton = screen.getByText('Entrar');

    await user.type(usernameInput, 'ab');
    await user.type(passwordInput, 'senha123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('O usuário deve ter pelo menos 3 caracteres')).toBeInTheDocument();
    });

    expect(mockedAuthApi.login).not.toHaveBeenCalled();
  });

  it('deve validar tamanho mínimo da senha', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);

    const usernameInput = screen.getByLabelText('Usuário');
    const passwordInput = screen.getByLabelText('Senha');
    const submitButton = screen.getByText('Entrar');

    await user.type(usernameInput, 'professor');
    await user.type(passwordInput, '123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('A senha deve ter pelo menos 6 caracteres')).toBeInTheDocument();
    });

    expect(mockedAuthApi.login).not.toHaveBeenCalled();
  });

  it('deve fazer login com sucesso', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);

    const usernameInput = screen.getByLabelText('Usuário');
    const passwordInput = screen.getByLabelText('Senha');
    const submitButton = screen.getByText('Entrar');

    await user.type(usernameInput, 'professor');
    await user.type(passwordInput, 'senha123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockedAuthApi.login).toHaveBeenCalledWith({
        username: 'professor',
        password: 'senha123'
      });
    });

    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('deve exibir loading durante login', async () => {
    const user = userEvent.setup();
    // Mock de promise que não resolve imediatamente
    mockedAuthApi.login.mockImplementation(() => new Promise(() => {}));
    
    renderWithProviders(<Login />);

    const usernameInput = screen.getByLabelText('Usuário');
    const passwordInput = screen.getByLabelText('Senha');
    const submitButton = screen.getByText('Entrar');

    await user.type(usernameInput, 'professor');
    await user.type(passwordInput, 'senha123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Entrando...')).toBeInTheDocument();
    });
  });

  it('deve exibir erro de login', async () => {
    const user = userEvent.setup();
    const error = new Error('Invalid credentials');
    (error as any).response = { data: { message: 'Credenciais inválidas' } };
    mockedAuthApi.login.mockRejectedValue(error);

    renderWithProviders(<Login />);

    const usernameInput = screen.getByLabelText('Usuário');
    const passwordInput = screen.getByLabelText('Senha');
    const submitButton = screen.getByText('Entrar');

    await user.type(usernameInput, 'professor');
    await user.type(passwordInput, 'senha123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Erro de autenticação')).toBeInTheDocument();
      expect(screen.getByText('Credenciais inválidas')).toBeInTheDocument();
    });
  });

  it('deve exibir erro genérico quando não há mensagem específica', async () => {
    const user = userEvent.setup();
    const error = new Error('Network error');
    mockedAuthApi.login.mockRejectedValue(error);

    renderWithProviders(<Login />);

    const usernameInput = screen.getByLabelText('Usuário');
    const passwordInput = screen.getByLabelText('Senha');
    const submitButton = screen.getByText('Entrar');

    await user.type(usernameInput, 'professor');
    await user.type(passwordInput, 'senha123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Erro de autenticação')).toBeInTheDocument();
      expect(screen.getByText('Erro ao fazer login. Verifique suas credenciais.')).toBeInTheDocument();
    });
  });

  it('deve redirecionar para página anterior após login', async () => {
    const user = userEvent.setup();
    const mockLocation = {
      state: { from: { pathname: '/admin' } }
    };
    
    // Mock do useLocation
    jest.spyOn(require('react-router-dom'), 'useLocation').mockReturnValue(mockLocation);
    
    renderWithProviders(<Login />);

    const usernameInput = screen.getByLabelText('Usuário');
    const passwordInput = screen.getByLabelText('Senha');
    const submitButton = screen.getByText('Entrar');

    await user.type(usernameInput, 'professor');
    await user.type(passwordInput, 'senha123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin', { replace: true });
    });
  });

  it('deve ter acessibilidade correta', () => {
    renderWithProviders(<Login />);

    const usernameInput = screen.getByLabelText('Usuário');
    const passwordInput = screen.getByLabelText('Senha');

    expect(usernameInput).toHaveAttribute('aria-invalid', 'false');
    expect(passwordInput).toHaveAttribute('aria-invalid', 'false');
    expect(usernameInput).toHaveAttribute('autocomplete', 'username');
    expect(passwordInput).toHaveAttribute('autocomplete', 'current-password');
  });

  it('deve exibir link para voltar', () => {
    renderWithProviders(<Login />);

    expect(screen.getByText('← Voltar para a página inicial')).toBeInTheDocument();
  });

  it('deve desabilitar botão durante envio', async () => {
    const user = userEvent.setup();
    mockedAuthApi.login.mockImplementation(() => new Promise(() => {}));
    
    renderWithProviders(<Login />);

    const usernameInput = screen.getByLabelText('Usuário');
    const passwordInput = screen.getByLabelText('Senha');
    const submitButton = screen.getByText('Entrar');

    await user.type(usernameInput, 'professor');
    await user.type(passwordInput, 'senha123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });
});
