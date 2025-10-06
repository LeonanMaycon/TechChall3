import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { postsApi, Post, UpdatePostParams } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

interface PostFormData {
  title: string;
  content: string;
}

const PostEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PostFormData>({
    mode: "onChange",
  });

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        setNotFound(false);

        const postData = await postsApi.getPostById(id);
        setPost(postData);

        if (!isAuthenticated) {
          setError("Você precisa estar logado para editar posts");
          return;
        }

        if (user?.role !== "professor" && postData.author !== user?.name) {
          setError("Você não tem permissão para editar este post");
          return;
        }

        reset({
          title: postData.title,
          content: postData.content,
        });
      } catch (err: any) {
        if (err.response?.status === 404) {
          setNotFound(true);
        } else if (err.response?.status === 403) {
          setError("Você não tem permissão para editar este post");
        } else {
          setError("Erro ao carregar o post. Tente novamente.");
          console.error("Error fetching post:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, isAuthenticated, user, reset]);

  const onSubmit = async (data: PostFormData) => {
    if (!id || !post) return;

    try {
      setIsSubmitting(true);

      const updateParams: UpdatePostParams = {
        id,
        title: data.title.trim(),
        content: data.content.trim(),
      };

      const updatedPost = await postsApi.updatePost(updateParams);

      toast.success("Post atualizado com sucesso!");

      navigate(`/posts/${updatedPost._id}`);
    } catch (error: any) {
      console.error("Error updating post:", error);

      if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData.errors) {
          Object.keys(errorData.errors).forEach((field) => {
            toast.error(`${field}: ${errorData.errors[field]}`);
          });
        } else {
          toast.error(errorData.message || "Dados inválidos");
        }
      } else if (error.response?.status === 401) {
        toast.error("Você precisa estar logado para editar posts");
        navigate("/login");
      } else if (error.response?.status === 403) {
        toast.error("Você não tem permissão para editar este post");
      } else if (error.response?.status === 404) {
        toast.error("Post não encontrado");
        navigate("/");
      } else {
        toast.error("Erro ao atualizar post. Tente novamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (
      window.confirm(
        "Tem certeza que deseja cancelar? As alterações serão perdidas."
      )
    ) {
      if (post) {
        navigate(`/posts/${post._id}`);
      } else {
        navigate("/");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div
          className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
          role="status"
          aria-label="Carregando post"
        >
          <span className="sr-only">Carregando...</span>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h2 className="mt-2 text-xl font-semibold text-gray-900">
          Post não encontrado
        </h2>
        <p className="mt-1 text-gray-500">
          O post que você está tentando editar não existe ou foi removido.
        </p>
        <div className="mt-6">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            ← Voltar para Posts
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-50 border border-red-200 rounded-md p-4"
        role="alert"
      >
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Erro ao carregar post
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={() => navigate("/")}
                className="text-sm font-medium text-red-800 hover:text-red-600"
              >
                Voltar para Posts
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <nav
        className="flex items-center space-x-2 text-sm text-gray-500 mb-6"
        aria-label="Breadcrumb"
      >
        <button onClick={() => navigate("/")} className="hover:text-gray-700">
          Posts
        </button>
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
        <button
          onClick={() => navigate(`/posts/${post._id}`)}
          className="hover:text-gray-700"
        >
          {post.title}
        </button>
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-gray-900 font-medium">Editar</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Editar Post</h1>
        <p className="mt-2 text-gray-600">
          Faça as alterações necessárias no post abaixo.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="mb-6">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Título do Post *
            </label>
            <input
              id="title"
              type="text"
              {...register("title", {
                required: "O título é obrigatório",
                minLength: {
                  value: 3,
                  message: "O título deve ter pelo menos 3 caracteres",
                },
                maxLength: {
                  value: 200,
                  message: "O título deve ter no máximo 200 caracteres",
                },
              })}
              className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                errors.title ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Digite o título do post..."
              aria-invalid={errors.title ? "true" : "false"}
              aria-describedby={errors.title ? "title-error" : undefined}
            />
            {errors.title && (
              <p
                id="title-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Conteúdo do Post *
            </label>
            <textarea
              id="content"
              rows={12}
              {...register("content", {
                required: "O conteúdo é obrigatório",
                minLength: {
                  value: 10,
                  message: "O conteúdo deve ter pelo menos 10 caracteres",
                },
                maxLength: {
                  value: 10000,
                  message: "O conteúdo deve ter no máximo 10.000 caracteres",
                },
              })}
              className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-vertical ${
                errors.content ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Digite o conteúdo do post... Você pode usar HTML básico como &lt;strong&gt;, &lt;em&gt;, &lt;p&gt;, etc."
              aria-invalid={errors.content ? "true" : "false"}
              aria-describedby={errors.content ? "content-error" : undefined}
            />
            {errors.content && (
              <p
                id="content-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors.content.message}
              </p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Dica: Você pode usar HTML básico para formatação (negrito,
              itálico, parágrafos, etc.)
            </p>
          </div>

          <div className="bg-gray-50 rounded-md p-4 mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Informações do Post
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <strong>Autor:</strong> {post.author}
              </p>
              <p>
                <strong>Criado em:</strong>{" "}
                {new Date(post.createdAt).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-6 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Salvando...
              </div>
            ) : (
              "Salvar Alterações"
            )}
          </button>
        </div>
      </form>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">
          Dicas de Formatação
        </h3>
        <div className="text-sm text-blue-700 space-y-1">
          <p>
            <strong>Negrito:</strong> &lt;strong&gt;texto&lt;/strong&gt;
          </p>
          <p>
            <em>Itálico:</em> &lt;em&gt;texto&lt;/em&gt;
          </p>
          <p>
            <u>Sublinhado:</u> &lt;u&gt;texto&lt;/u&gt;
          </p>
          <p>Parágrafo: &lt;p&gt;texto&lt;/p&gt;</p>
          <p>Quebra de linha: &lt;br&gt;</p>
          <p>Títulos: &lt;h1&gt; até &lt;h6&gt;</p>
        </div>
      </div>
    </div>
  );
};

export default PostEdit;
