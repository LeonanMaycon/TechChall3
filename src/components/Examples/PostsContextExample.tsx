import React, { useState } from "react";
import { Button, Input, Card, CardHeader, CardContent } from "../../ui";
import { usePosts, usePostsList, usePost } from "../../contexts/PostsContext";
import Container from "../Layout/Container";

/**
 * Exemplo de uso do PostsContext
 *
 * Este componente demonstra como usar todos os hooks e funcionalidades
 * do contexto de posts implementado.
 */
const PostsContextExample: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPostId, setSelectedPostId] = useState("");

  // Hook principal para operações CRUD
  const {
    posts,
    currentPost,
    loading,
    error,
    createPost,
    updatePost,
    deletePost,
    clearError,
    isCacheValid,
    getPostById,
  } = usePosts();

  // Hook para listar posts com parâmetros
  const {
    posts: searchResults,
    loading: searchLoading,
    error: searchError,
    refetch: refetchSearch,
  } = usePostsList();

  // Hook para buscar post individual
  const {
    post: individualPost,
    loading: postLoading,
    error: postError,
    refetch: refetchPost,
  } = usePost(selectedPostId);

  // Exemplo de criação de post
  const handleCreatePost = async () => {
    const newPost = await createPost({
      title: "Post de Exemplo",
      content: "<p>Este é um post criado via contexto!</p>",
      author: "user-123",
    });

    if (newPost) {
      alert(`Post criado com sucesso! ID: ${newPost._id}`);
    } else {
      alert("Erro ao criar post");
    }
  };

  // Exemplo de atualização de post
  const handleUpdatePost = async (postId: string) => {
    const updatedPost = await updatePost({
      id: postId,
      title: "Post Atualizado",
      content: "<p>Este post foi atualizado via contexto!</p>",
    });

    if (updatedPost) {
      alert(`Post atualizado com sucesso! ID: ${updatedPost._id}`);
    } else {
      alert("Erro ao atualizar post");
    }
  };

  // Exemplo de exclusão de post
  const handleDeletePost = async (postId: string) => {
    const success = await deletePost(postId);

    if (success) {
      alert("Post excluído com sucesso!");
    } else {
      alert("Erro ao excluir post");
    }
  };

  // Exemplo de busca de post por ID
  const handleGetPostById = (postId: string) => {
    const post = getPostById(postId);
    if (post) {
      alert(`Post encontrado: ${post.title}`);
    } else {
      alert("Post não encontrado no cache");
    }
  };

  return (
    <Container maxWidth="2xl" padding="lg">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary-900 mb-4">
            Exemplo de Uso do PostsContext
          </h1>
          <p className="text-lg text-secondary-600">
            Demonstração prática de todos os hooks e funcionalidades do contexto
          </p>
        </div>

        {/* Status do Cache */}
        <Card variant="outlined" padding="md">
          <CardHeader title="Status do Cache" />
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-secondary-600">
                <strong>Cache válido:</strong> {isCacheValid() ? "Sim" : "Não"}
              </p>
              <p className="text-sm text-secondary-600">
                <strong>Total de posts em cache:</strong> {posts.length}
              </p>
              <p className="text-sm text-secondary-600">
                <strong>Post atual:</strong>{" "}
                {currentPost ? currentPost.title : "Nenhum"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Operações CRUD */}
        <Card variant="outlined" padding="md">
          <CardHeader title="Operações CRUD" />
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="font-semibold text-secondary-900">Criar Post</h3>
                <Button
                  onClick={handleCreatePost}
                  loading={loading}
                  variant="primary"
                  fullWidth
                >
                  Criar Post de Exemplo
                </Button>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-secondary-900">
                  Atualizar Post
                </h3>
                <div className="flex space-x-2">
                  <Input
                    placeholder="ID do post"
                    value={selectedPostId}
                    onChange={(e) => setSelectedPostId(e.target.value)}
                    size="sm"
                  />
                  <Button
                    onClick={() => handleUpdatePost(selectedPostId)}
                    loading={loading}
                    variant="secondary"
                    disabled={!selectedPostId}
                  >
                    Atualizar
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-secondary-900">
                  Excluir Post
                </h3>
                <div className="flex space-x-2">
                  <Input
                    placeholder="ID do post"
                    value={selectedPostId}
                    onChange={(e) => setSelectedPostId(e.target.value)}
                    size="sm"
                  />
                  <Button
                    onClick={() => handleDeletePost(selectedPostId)}
                    loading={loading}
                    variant="danger"
                    disabled={!selectedPostId}
                  >
                    Excluir
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-secondary-900">
                  Buscar no Cache
                </h3>
                <div className="flex space-x-2">
                  <Input
                    placeholder="ID do post"
                    value={selectedPostId}
                    onChange={(e) => setSelectedPostId(e.target.value)}
                    size="sm"
                  />
                  <Button
                    onClick={() => handleGetPostById(selectedPostId)}
                    variant="outline"
                    disabled={!selectedPostId}
                  >
                    Buscar
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Busca com usePostsList */}
        <Card variant="outlined" padding="md">
          <CardHeader title="Busca com usePostsList" />
          <CardContent>
            <div className="space-y-4">
              <Input
                label="Termo de busca"
                placeholder="Digite para buscar posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                }
              />

              <div className="flex space-x-2">
                <Button
                  onClick={() => refetchSearch()}
                  loading={searchLoading}
                  variant="outline"
                >
                  Refetch
                </Button>
                <Button onClick={() => setSearchTerm("")} variant="ghost">
                  Limpar
                </Button>
              </div>

              {searchLoading && (
                <p className="text-sm text-secondary-500">Buscando posts...</p>
              )}

              {searchError && (
                <p className="text-sm text-error-600">Erro: {searchError}</p>
              )}

              {searchResults.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-secondary-900">
                    Resultados encontrados: {searchResults.length}
                  </p>
                  <div className="space-y-1">
                    {searchResults.slice(0, 3).map((post) => (
                      <div
                        key={post._id}
                        className="p-2 bg-neutral-50 rounded text-sm"
                      >
                        <strong>{post.title}</strong> - {post.author}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Busca individual com usePost */}
        <Card variant="outlined" padding="md">
          <CardHeader title="Busca Individual com usePost" />
          <CardContent>
            <div className="space-y-4">
              <Input
                label="ID do Post"
                placeholder="Digite o ID do post..."
                value={selectedPostId}
                onChange={(e) => setSelectedPostId(e.target.value)}
              />

              <div className="flex space-x-2">
                <Button
                  onClick={() => refetchPost()}
                  loading={postLoading}
                  variant="outline"
                  disabled={!selectedPostId}
                >
                  Buscar Post
                </Button>
                <Button onClick={() => setSelectedPostId("")} variant="ghost">
                  Limpar
                </Button>
              </div>

              {postLoading && (
                <p className="text-sm text-secondary-500">Carregando post...</p>
              )}

              {postError && (
                <p className="text-sm text-error-600">Erro: {postError}</p>
              )}

              {individualPost && (
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <h3 className="font-semibold text-secondary-900 mb-2">
                    {individualPost.title}
                  </h3>
                  <p className="text-sm text-secondary-600 mb-2">
                    Por {individualPost.author}
                  </p>
                  <p className="text-sm text-secondary-500">
                    {individualPost.content.substring(0, 100)}...
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Lista de Posts em Cache */}
        <Card variant="outlined" padding="md">
          <CardHeader title="Posts em Cache" />
          <CardContent>
            {posts.length === 0 ? (
              <p className="text-center text-secondary-500 py-4">
                Nenhum post em cache
              </p>
            ) : (
              <div className="space-y-2">
                {posts.slice(0, 5).map((post) => (
                  <div
                    key={post._id}
                    className="flex items-center justify-between p-3 bg-neutral-50 rounded"
                  >
                    <div>
                      <h4 className="font-medium text-secondary-900">
                        {post.title}
                      </h4>
                      <p className="text-sm text-secondary-500">
                        Por {post.author}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleGetPostById(post._id)}
                      >
                        Buscar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdatePost(post._id)}
                      >
                        Atualizar
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDeletePost(post._id)}
                      >
                        Excluir
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Estados de Loading e Erro */}
        <Card variant="outlined" padding="md">
          <CardHeader title="Estados do Contexto" />
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div
                  className={`w-4 h-4 rounded-full mx-auto mb-2 ${
                    loading ? "bg-warning-500" : "bg-success-500"
                  }`}
                />
                <p className="text-sm font-medium">Loading</p>
                <p className="text-xs text-secondary-500">
                  {loading ? "Ativo" : "Inativo"}
                </p>
              </div>

              <div className="text-center">
                <div
                  className={`w-4 h-4 rounded-full mx-auto mb-2 ${
                    error ? "bg-error-500" : "bg-success-500"
                  }`}
                />
                <p className="text-sm font-medium">Erro</p>
                <p className="text-xs text-secondary-500">
                  {error ? "Sim" : "Não"}
                </p>
              </div>

              <div className="text-center">
                <div
                  className={`w-4 h-4 rounded-full mx-auto mb-2 ${
                    isCacheValid() ? "bg-success-500" : "bg-warning-500"
                  }`}
                />
                <p className="text-sm font-medium">Cache</p>
                <p className="text-xs text-secondary-500">
                  {isCacheValid() ? "Válido" : "Expirado"}
                </p>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-error-50 border border-error-200 rounded">
                <p className="text-sm text-error-700">{error}</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={clearError}
                  className="mt-2"
                >
                  Limpar Erro
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default PostsContextExample;
