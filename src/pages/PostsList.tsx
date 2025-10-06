import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { Post } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { usePostsList } from "../contexts/PostsContext";

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const PostsList: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPosts, setTotalPosts] = useState(0);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { posts, loading, error } = usePostsList();

  useEffect(() => {
    const total = posts.length;
    setTotalPosts(total);
  }, [posts]);

  const truncateDescription = useCallback(
    (content: string, maxLength: number = 150): string =>
      content.length <= maxLength
        ? content
        : content.substring(0, maxLength).trim() + "...",
    []
  );

  const filteredPosts = useMemo(() => {
    if (!debouncedSearchTerm) return posts;
    const search = debouncedSearchTerm.toLowerCase();
    return posts.filter(
      (post: Post) =>
        post.title.toLowerCase().includes(search) ||
        post.author.toLowerCase().includes(search) ||
        post.content.toLowerCase().includes(search)
    );
  }, [posts, debouncedSearchTerm]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <label
          htmlFor="search"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Buscar posts
        </label>
        <input
          id="search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Digite para buscar por título, autor ou conteúdo..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
        />
        {loading && <p className="text-sm text-gray-500 mt-2">Buscando...</p>}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-red-800">
            Erro ao carregar posts
          </h3>
          <p className="mt-1 text-sm text-red-700">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Posts {totalPosts > 0 && `(${totalPosts})`}
            </h2>
            <div className="flex items-center space-x-4">
              {isAuthenticated && user?.role === "professor" && (
                <Link
                  to="/posts/create"
                  className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 hover:text-white"
                >
                  ➕ Criar Post
                </Link>
              )}
            </div>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-sm font-medium text-gray-900">
                {searchTerm
                  ? "Nenhum post encontrado"
                  : "Nenhum post disponível"}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm
                  ? "Tente ajustar os termos de busca."
                  : "Os posts aparecerão aqui quando estiverem disponíveis."}
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {filteredPosts.map((post: Post) => (
                <li
                  key={post._id}
                  className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
                >
                  <Link
                    to={`/posts/${post._id}`}
                    className="block p-6 hover:bg-gray-50"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600">
                      {post.title}
                    </h3>
                    <div className="text-sm text-gray-500 mt-1">
                      Por {post.author} •{" "}
                      {new Date(post.createdAt).toLocaleDateString("pt-BR")}
                    </div>
                    <p className="text-gray-700 mt-3 leading-relaxed">
                      {truncateDescription(post.description || post.content)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};

export default PostsList;
