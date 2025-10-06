import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginButton: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isAuthenticated) {
    return (
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-700">
          Olá, <span className="font-medium">{user?.email}</span>
        </span>
        {user?.role === 'professor' && (
          <Link
            to="/admin"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Admin
          </Link>
        )}
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Sair
        </button>
      </div>
    );
  }

  return (
    <Link
      to="/login"
      className="text-sm text-blue-600 hover:text-blue-700"
    >
      Entrar
    </Link>
  );
};

export default LoginButton;
