import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Post } from "../services/api";
import { usePosts, usePostsList } from "../contexts/PostsContext";
import ConfirmModal from "../components/ConfirmModal";

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const AdminPosts: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    post: Post | null;
  }>({ isOpen: false, post: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { posts, loading, error, refetch } = usePostsList();

  const { deletePost } = usePosts();

  const formatDate = useCallback((dateString: string): string => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const truncateText = useCallback(
    (text: string, maxLength: number = 100): string => {
      if (!text) return "";
      return text.length <= maxLength ? text : text.substring(0, maxLength).trim() + "...";
    },
    []
  );

  // Filtragem unificada pelo searchTerm (título, conteúdo ou autor)
  const filteredPosts = useMemo(() => {
    if (!debouncedSearchTerm) return posts;
    const term = debouncedSearchTerm.toLowerCase();
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(term) ||
        post.author.toLowerCase().includes(term) ||
        post.content.toLowerCase().includes(term)
    );
  }, [posts, debouncedSearchTerm]);

  const handleDeleteClick = useCallback((post: Post) => {
    setDeleteModal({ isOpen: true, post });
  }, []);

  const handleDeleteCancel = useCallback(() => {
    setDeleteModal({ isOpen: false, post: null });
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteModal.post) return;

    try {
      setIsDeleting(true);
      const success = await deletePost(deleteModal.post._id);

      if (success) {
        toast.success("Post excluído com sucesso!");
        setDeleteModal({ isOpen: false, post: null });
        refetch();
      } else {
        toast.error("Erro ao excluir post. Tente novamente.");
      }
    } catch (err: any) {
      console.error("Error deleting post:", err);
      if (err.response?.status === 404) toast.error("Post não encontrado");
      else if (err.response?.status === 403) toast.error("Você não tem permissão para excluir este post");
      else toast.error("Erro ao excluir post. Tente novamente.");
    } finally {
      setIsDeleting(false);
    }
  }, [deleteModal.post, deletePost, refetch]);

  const handleEditClick = useCallback(
    (post: Post) => navigate(`/posts/${post._id}/edit`),
    [navigate]
  );

  const handleViewClick = useCallback(
    (post: Post) => navigate(`/posts/${post._id}`),
    [navigate]
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
          <p className="mt-1 text-sm text-gray-500">Gerencie todos os posts do sistema</p>
        </div>
        <Link
          to="/posts/create"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:text-white"
        >
          ➕ Novo Post
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
          Buscar posts
        </label>
        <input
          id="search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Título, autor ou conteúdo..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="text-sm text-blue-600 hover:text-blue-700 mt-2"
          >
            Limpar busca
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-red-800">Erro ao carregar posts</h3>
          <p className="mt-1 text-sm text-red-700">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-sm font-medium text-gray-900">
                {searchTerm ? "Nenhum post encontrado" : "Nenhum post disponível"}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? "Tente ajustar os termos de busca." : "Os posts aparecerão aqui quando estiverem disponíveis."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white shadow-sm rounded-lg border">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Autor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Criado em</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Atualizado em</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPosts.map((post) => (
                    <tr key={post._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{truncateText(post.title, 50)}</div>
                        <div className="text-sm text-gray-500">{truncateText(post.content, 80)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{post.author}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(post.createdAt)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(post.updatedAt)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button onClick={() => handleViewClick(post)} className="text-blue-600 hover:text-blue-900" title="Visualizar">👁️</button>
                          <button onClick={() => handleEditClick(post)} className="text-indigo-600 hover:text-indigo-900" title="Editar">✏️</button>
                          <button onClick={() => handleDeleteClick(post)} className="text-red-600 hover:text-red-900" title="Excluir">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Excluir Post"
        message={`Tem certeza que deseja excluir o post "${deleteModal.post?.title}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  );
};

export default AdminPosts;
