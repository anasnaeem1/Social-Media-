import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

import { UserContext } from "./UserContext";
import {
  deletePhoto,
  deletePost as apiDeletePost,
  getPostWithPostUser,
} from "../../apiCalls";

export const FeedContext = createContext({
  feedReload: false,
  posts: [],
  activePostId: "",
  post: null,
  postUser: null,
  isLoadingPosts: false,
  isLoadingPost: false,
  postsError: null,
  setActivePostId: () => {},
  feedPost: async () => {},
  getSinglePost: async () => {},
  setFeedPosts: () => {},
  prependPost: () => {},
  removePostById: () => {},
  deletePostWithPermission: async () => {},
  updatePostWithPermission: async () => {},
  canModifyPost: () => false,
});

export function FeedContextProvider({ children }) {
  const { user: currentUser } = useContext(UserContext);

  const [posts, setPosts] = useState([]);
  // If you want "dawdwd" to be the visible default, initialise with that here.
  const [activePostId, setActivePostId] = useState("");
  const [post, setPost] = useState(null);
  const [postUser, setPostUser] = useState(null);
  const [feedReload, setFeedReload] = useState(false);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const [postsError, setPostsError] = useState(null);

  const canModifyPost = useCallback(
    (postObj) => {
      if (!currentUser?._id) return false;
      const postUserId = postObj?.userId || postObj?.postUserId;
      if (!postUserId) return false;
      return postUserId.toString() === currentUser._id.toString();
    },
    [currentUser?._id]
  );

  const setFeedPosts = useCallback((nextPosts) => {
    setPosts(Array.isArray(nextPosts) ? nextPosts : []);
  }, []);

  const prependPost = useCallback((nextPost) => {
    if (!nextPost) return;
    setPosts((prev) => [nextPost, ...prev]);
  }, []);

  const removePostById = useCallback((postId) => {
    if (!postId) return;
    setPosts((prev) => prev.filter((p) => p?._id !== postId));
  }, []);

  const feedPost = useCallback(
    async ({ profileUserId, page = 1, limit = 5 }) => {
      setIsLoadingPosts(true);
      setPostsError(null);
      try {
        let res;
        if (profileUserId) {
          res = await axios.get(`/api/posts/profile/${profileUserId}`);
          const list = Array.isArray(res.data) ? res.data : [];
          setFeedPosts(list);
          return { hasMore: false, posts: list };
        }

        if (!currentUser?._id) {
          throw new Error("Missing current user for timeline posts");
        }

        res = await axios.get(
          `/api/posts/timeline/${currentUser._id}?page=${page}&limit=${limit}`
        );
        const fetched = Array.isArray(res.data) ? res.data : [];
        const shuffled = [...fetched];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        setFeedPosts(shuffled);
        const hasMore = fetched.length === limit;
        return { hasMore, posts: shuffled };
      } catch (error) {
        setPostsError(error);
        throw error;
      } finally {
        setIsLoadingPosts(false);
      }
    },
    [currentUser?._id, setFeedPosts]
  );

  // When feedReload is toggled to true, refetch the timeline once and reset it.
  useEffect(() => {
    if (!feedReload) return;

    setFeedPosts([]);
    setPost(null);
    setPostUser(null);

    feedPost({ profileUserId: null, page: 1, limit: 5 })
      .catch(() => null)
      .finally(() => {
        setFeedReload(false);
      });
  }, [feedReload, feedPost, setFeedPosts]);

  const getSinglePost = useCallback(async (postId) => {
    if (!postId) return null;
    setIsLoadingPost(true);
    try {
      const res = await getPostWithPostUser(postId);
      setPost(res?.post ?? null);
      setPostUser(res?.postUser ?? null);
      return res;
    } finally {
      setIsLoadingPost(false);
    }
  }, []);

  const deletePostWithPermission = useCallback(
    async ({ postObj }) => {
      if (!postObj?._id) throw new Error("Missing post to delete");
      if (!currentUser?._id) throw new Error("Not authenticated");

      if (!canModifyPost(postObj)) {
        const err = new Error("Forbidden: you can only delete your own posts");
        err.status = 403;
        throw err;
      }

      if (postObj?.img) {
        await deletePhoto(postObj.img);
      }

      const deleted = await apiDeletePost(postObj._id, currentUser._id);
      removePostById(postObj._id);
      return deleted;
    },
    [canModifyPost, currentUser?._id, removePostById]
  );

  const updatePostWithPermission = useCallback(
    async ({ postId, postUserId, updates }) => {
      if (!postId) throw new Error("Missing postId");
      if (!currentUser?._id) throw new Error("Not authenticated");

      if (postUserId && postUserId.toString() !== currentUser._id.toString()) {
        const err = new Error("Forbidden: you can only update your own posts");
        err.status = 403;
        throw err;
      }

      const response = await axios.put(`/api/posts/${postId}`, {
        userId: currentUser._id,
        ...(updates || {}),
      });

      // Best-effort local sync.
      setPosts((prev) =>
        prev.map((p) => (p?._id === postId ? { ...p, ...(response.data || {}) } : p))
      );
      if (post?._id === postId) {
        setPost((prev) => ({ ...(prev || {}), ...(response.data || {}) }));
      }

      return response.data;
    },
    [currentUser?._id, post?._id]
  );

  const value = useMemo(
    () => ({
      posts,
      activePostId,
      post,
      postUser,
      isLoadingPosts,
      isLoadingPost,
      postsError,
      feedReload,
      feedPost,
      setPost,
      setPostUser,
      getSinglePost,
      setFeedPosts,
      setActivePostId,
      prependPost,
      removePostById,
      deletePostWithPermission,
      updatePostWithPermission,
      canModifyPost,
      setFeedReload,
    }),
    [
      posts,
      post,
      postUser,
      isLoadingPosts,
      isLoadingPost,
      postsError,
      activePostId,
      feedPost,
      setPost,
      setPostUser,
      getSinglePost,
      setFeedPosts,
      setActivePostId,
      prependPost,
      removePostById,
      deletePostWithPermission,
      updatePostWithPermission,
      canModifyPost,
    ]
  );

  return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>;
}

