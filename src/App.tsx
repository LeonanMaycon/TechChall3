import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PostsProvider } from './contexts/PostsContext';
import PostsList from './pages/PostsList';
import PostView from './pages/PostView';
import PostCreate from './pages/PostCreate';
import PostEdit from './pages/PostEdit';
import AdminPosts from './pages/AdminPosts';
import Login from './pages/Login';
import LoginButton from './components/LoginButton';
import ToastProvider from './components/ToastProvider';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <PostsProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    <Link to="/" className="no-underline text-gray-900 hover:text-gray-600">Tech Challenge - Posts</Link>
                  </h1>
                  <LoginButton />
                </div>
              </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                <Route path="/" element={<PostsList />} />
                <Route path="/login" element={<Login />} />
                <Route path="/posts/:id" element={<PostView />} />
                <Route
                  path="/posts/create"
                  element={
                    <ProtectedRoute requiredRole="professor">
                      <PostCreate />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/posts/:id/edit"
                  element={
                    <ProtectedRoute requiredRole="professor">
                      <PostEdit />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requiredRole="professor">
                      <AdminPosts />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <ToastProvider />
          </div>
        </Router>
      </PostsProvider>
    </AuthProvider>
  );
}

export default App;
