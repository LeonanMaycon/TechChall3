import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import {
  postsApi,
  Post,
  PostsResponse,
  CreatePostParams,
  UpdatePostParams,
} from "../services/api";

interface PostsState {
  posts: Post[];
  currentPost: Post | null;
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
  cacheExpiry: number;
}

type PostsAction =
  | { type: "FETCH_POSTS_START" }
  | { type: "FETCH_POSTS_SUCCESS"; payload: Post[] }
  | { type: "FETCH_POSTS_ERROR"; payload: string }
  | { type: "FETCH_POST_START" }
  | { type: "FETCH_POST_SUCCESS"; payload: Post }
  | { type: "FETCH_POST_ERROR"; payload: string }
  | { type: "CREATE_POST_START" }
  | { type: "CREATE_POST_SUCCESS"; payload: Post }
  | { type: "CREATE_POST_ERROR"; payload: string }
  | { type: "UPDATE_POST_START" }
  | { type: "UPDATE_POST_SUCCESS"; payload: Post }
  | { type: "UPDATE_POST_ERROR"; payload: string }
  | { type: "DELETE_POST_START" }
  | { type: "DELETE_POST_SUCCESS"; payload: string }
  | { type: "DELETE_POST_ERROR"; payload: string }
  | { type: "CLEAR_ERROR" }
  | { type: "CLEAR_CURRENT_POST" };

const initialState: PostsState = {
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
  lastFetch: null,
  cacheExpiry: 5 * 60 * 1000,
};

function postsReducer(state: PostsState, action: PostsAction): PostsState {
  switch (action.type) {
    case "FETCH_POSTS_START":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "FETCH_POSTS_SUCCESS":
      return {
        ...state,
        posts: action.payload,
        loading: false,
        error: null,
        lastFetch: Date.now(),
      };

    case "FETCH_POSTS_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "FETCH_POST_START":
      return {
        ...state,
        loading: true,
        error: null,
        currentPost: null,
      };

    case "FETCH_POST_SUCCESS":
      return {
        ...state,
        currentPost: action.payload,
        loading: false,
        error: null,
      };

    case "FETCH_POST_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
        currentPost: null,
      };

    case "CREATE_POST_START":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "CREATE_POST_SUCCESS":
      return {
        ...state,
        posts: [action.payload, ...state.posts],
        loading: false,
        error: null,
      };

    case "CREATE_POST_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "UPDATE_POST_START":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "UPDATE_POST_SUCCESS":
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === action.payload._id ? action.payload : post
        ),
        currentPost:
          state.currentPost?._id === action.payload._id
            ? action.payload
            : state.currentPost,
        loading: false,
        error: null,
      };

    case "UPDATE_POST_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "DELETE_POST_START":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "DELETE_POST_SUCCESS":
      return {
        ...state,
        posts: state.posts.filter((post) => post._id !== action.payload),
        currentPost:
          state.currentPost?._id === action.payload ? null : state.currentPost,
        loading: false,
        error: null,
      };

    case "DELETE_POST_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };

    case "CLEAR_CURRENT_POST":
      return {
        ...state,
        currentPost: null,
      };

    default:
      return state;
  }
}

interface PostsContextType {
  posts: Post[];
  currentPost: Post | null;
  loading: boolean;
  error: string | null;

  fetchPosts: (params?: {
    search?: string;
    page?: number;
    limit?: number;
  }) => Promise<void>;
  fetchPost: (id: string) => Promise<void>;
  createPost: (params: CreatePostParams) => Promise<Post | null>;
  updatePost: (params: UpdatePostParams) => Promise<Post | null>;
  deletePost: (id: string) => Promise<boolean>;
  clearError: () => void;
  clearCurrentPost: () => void;

  isCacheValid: () => boolean;
  getPostById: (id: string) => Post | undefined;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

interface PostsProviderProps {
  children: React.ReactNode;
}

export const PostsProvider: React.FC<PostsProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(postsReducer, initialState);

  const isCacheValid = useCallback(() => {
    if (!state.lastFetch) return false;
    return Date.now() - state.lastFetch < state.cacheExpiry;
  }, [state.lastFetch, state.cacheExpiry]);

  const fetchPosts = useCallback(
    async (params?: { search?: string; page?: number; limit?: number }) => {
      dispatch({ type: "FETCH_POSTS_START" });

      try {
        const response: PostsResponse = await postsApi.getPosts();
        dispatch({ type: "FETCH_POSTS_SUCCESS", payload: response.posts });
      } catch (error) {
        console.error("Error fetching posts:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Erro ao buscar posts";
        dispatch({ type: "FETCH_POSTS_ERROR", payload: errorMessage });
      }
    },
    []
  );

  const fetchPost = useCallback(
    async (id: string) => {
      const cachedPost = state.posts.find((post) => post._id === id);
      if (cachedPost) {
        dispatch({ type: "FETCH_POST_SUCCESS", payload: cachedPost });
        return;
      }

      dispatch({ type: "FETCH_POST_START" });

      try {
        const post = await postsApi.getPostById(id);
        dispatch({ type: "FETCH_POST_SUCCESS", payload: post });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Erro ao buscar post";
        dispatch({ type: "FETCH_POST_ERROR", payload: errorMessage });
      }
    },
    [state.posts]
  );

  const createPost = useCallback(
    async (params: CreatePostParams): Promise<Post | null> => {
      dispatch({ type: "CREATE_POST_START" });

      try {
        const newPost = await postsApi.createPost(params);
        dispatch({ type: "CREATE_POST_SUCCESS", payload: newPost });
        return newPost;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Erro ao criar post";
        dispatch({ type: "CREATE_POST_ERROR", payload: errorMessage });
        return null;
      }
    },
    []
  );

  const updatePost = useCallback(
    async (params: UpdatePostParams): Promise<Post | null> => {
      dispatch({ type: "UPDATE_POST_START" });

      try {
        const updatedPost = await postsApi.updatePost(params);
        dispatch({ type: "UPDATE_POST_SUCCESS", payload: updatedPost });
        return updatedPost;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Erro ao atualizar post";
        dispatch({ type: "UPDATE_POST_ERROR", payload: errorMessage });
        return null;
      }
    },
    []
  );

  const deletePost = useCallback(async (id: string): Promise<boolean> => {
    dispatch({ type: "DELETE_POST_START" });

    try {
      await postsApi.deletePost(id);
      dispatch({ type: "DELETE_POST_SUCCESS", payload: id });
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao excluir post";
      dispatch({ type: "DELETE_POST_ERROR", payload: errorMessage });
      return false;
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  const clearCurrentPost = useCallback(() => {
    dispatch({ type: "CLEAR_CURRENT_POST" });
  }, []);

  const getPostById = useCallback(
    (id: string): Post | undefined => {
      return state.posts.find((post) => post._id === id);
    },
    [state.posts]
  );

  const contextValue: PostsContextType = {
    posts: state.posts,
    currentPost: state.currentPost,
    loading: state.loading,
    error: state.error,

    fetchPosts,
    fetchPost,
    createPost,
    updatePost,
    deletePost,
    clearError,
    clearCurrentPost,

    isCacheValid,
    getPostById,
  };

  return (
    <PostsContext.Provider value={contextValue}>
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = (): PostsContextType => {
  const context = useContext(PostsContext);

  if (context === undefined) {
    throw new Error("usePosts deve ser usado dentro de um PostsProvider");
  }

  return context;
};

export const usePostsList = () => {
  const { posts, loading, error, fetchPosts, clearError } = usePosts();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
    refetch: () => fetchPosts(),
    clearError,
  };
};

export const usePost = (id: string) => {
  const {
    currentPost,
    loading,
    error,
    fetchPost,
    clearError,
    clearCurrentPost,
  } = usePosts();

  useEffect(() => {
    if (id) {
      fetchPost(id);
    }

    return () => {
      clearCurrentPost();
    };
  }, [id, fetchPost, clearCurrentPost]);

  return {
    post: currentPost,
    loading,
    error,
    refetch: () => fetchPost(id),
    clearError,
  };
};

export default PostsContext;
