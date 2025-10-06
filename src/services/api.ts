import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const newTokens = await authApi.refreshToken(refreshToken);

          sessionStorage.setItem("accessToken", newTokens.accessToken);
          if (newTokens.refreshToken) {
            localStorage.setItem("refreshToken", newTokens.refreshToken);
          }

          originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        sessionStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export interface Post {
  _id: string;
  title: string;
  author: string;
  content: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
}

export interface PostsParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface Comment {
  _id: string;
  postId: string;
  author: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentParams {
  postId: string;
  content: string;
  author: string;
}

export interface CreatePostParams {
  title: string;
  content: string;
  author: string;
}

export interface UpdatePostParams {
  id: string;
  title: string;
  content: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "professor";
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export const postsApi = {
  getPosts: async (): Promise<PostsResponse> => {

    const queryParams = new URLSearchParams();
    const response = await api.get(`/posts${queryParams.toString()}`);

    const data = response.data;

    if (Array.isArray(data)) {
      const mappedPosts = data.map((post: any) => ({
        _id: post._id || post._id,
        title: post.title,
        author: post.author,
        content: post.content,
        description:
          post.description || post.content?.substring(0, 150) + "...",
        createdAt: post.createdAt,
        updatedAt: post.updatedAt || post.createdAt,
      }));


      const result = {
        posts: mappedPosts,
        total: data.length,
      };

      return result;
    }

    if (data && typeof data === "object" && data._id) {
      const mappedPost = {
        _id: data._id || data._id,
        title: data.title,
        author: data.author,
        content: data.content,
        description:
          data.description || data.content?.substring(0, 150) + "...",
        createdAt: data.createdAt,
        updatedAt: data.updatedAt || data.createdAt,
      };

      return {
        posts: [mappedPost],
        total: 1,
      };
    }

    if (data && data.posts) {
      return data;
    }

    return {
      posts: [],
      total: 0,
    };
  },

  getPostById: async (_id: string): Promise<Post> => {
    const response = await api.get(`/posts/${_id}`);
    return response.data;
  },

  getComments: async (postId: string): Promise<Comment[]> => {
    const response = await api.get(`/posts/${postId}/comments`);
    return response.data;
  },

  createComment: async (params: CreateCommentParams): Promise<Comment> => {
    const response = await api.post(`/posts/${params.postId}/comments`, {
      content: params.content,
      author: params.author,
    });
    return response.data;
  },

  createPost: async (params: CreatePostParams): Promise<Post> => {
    const response = await api.post("/posts", {
      title: params.title,
      content: params.content,
      author: params.author,
    });
    return response.data;
  },

  updatePost: async (params: UpdatePostParams): Promise<Post> => {
    const response = await api.put(`/posts/${params.id}`, {
      title: params.title,
      content: params.content,
    });
    return response.data;
  },

  deletePost: async (_id: string): Promise<void> => {
    await api.delete(`/posts/${_id}`);
  },
};

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  refreshToken: async (refreshToken: string): Promise<AuthTokens> => {
    const response = await api.post("/auth/refresh", { refreshToken });
    return response.data;
  },
};

export default api;
