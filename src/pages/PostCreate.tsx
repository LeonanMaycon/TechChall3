import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { postsApi, CreatePostParams } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

interface PostFormData {
  title: string;
  content: string;
}

const PostCreate: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    reset: _,
  } = useForm<PostFormData>({
    mode: "onChange",
  });

  const onSubmit = async (data: PostFormData) => {
    if (!user) {
      toast.error("Usuário não autenticado");
      return;
    }

    try {
      setIsSubmitting(true);

      const createParams: CreatePostParams = {
        title: data.title.trim(),
        content: data.content.trim(),
        author: user.name,
      };

      const newPost = await postsApi.createPost(createParams);

      toast.success("Post criado com sucesso!");

      navigate(`/posts/${newPost._id}`);
    } catch (error: any) {
      console.error("Error creating post:", error);

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
        toast.error("Você precisa estar logado para criar posts");
        navigate("/login");
      } else if (error.response?.status === 403) {
        toast.error("Você não tem permissão para criar posts");
      } else {
        toast.error("Erro ao criar post. Tente novamente.");
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
      navigate(-1);
    }
  };

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
        <span className="text-gray-900 font-medium">Criar Post</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Criar Novo Post</h1>
        <p className="mt-2 text-gray-600">
          Preencha os campos abaixo para criar um novo post.
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
            <h3 className="text-sm font-medium text-gray-700 mb-2">Dados do Autor:</h3>
            <p className="text-sm text-gray-600">
              <strong>Nome:</strong> {user?.name}
              <br />
              <strong>Função:</strong>{" "}
              {user?.role === "professor" ? "Professor" : user?.role}
            </p>
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
                Criando...
              </div>
            ) : (
              "Criar Post"
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

export default PostCreate;
