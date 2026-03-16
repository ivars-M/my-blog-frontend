import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios.js";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async (tag) => {
  const url = tag ? `/posts/tags/${tag}` : "/posts";
  const { data } = await axios.get(url);
  console.log("DATA:", data);
  return data;
});
export const fetchTags = createAsyncThunk("posts/fetchTags", async () => {
  const { data } = await axios.get("/tags");
  return data;
});

export const fetchRemovePost = createAsyncThunk(
  "posts/fetchRemovePost",
  async (id) => {
    await axios.delete(`/posts/${id}`);
  },
);
export const fetchPostsByUserId = createAsyncThunk(
  "posts/fetchPostsByUserId",
  async (id) => {
    const { data } = await axios.get(`/posts/user/${id}`);
    return data;
  },
);

const initialState = {
  posts: {
    items: [],
    status: "loading",
  },
  tags: {
    items: [],
    status: "loading",
  },
  searchQuery: "",
};
const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: {
    //raksta iegūšana
    [fetchPosts.pending]: (state) => {
      state.posts.items = [];
      state.posts.status = "loading";
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = "loaded";
    },
    [fetchPosts.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = "error";
    },
    //tagu iegūšana
    [fetchTags.pending]: (state) => {
      state.tags.items = [];
      state.tags.status = "loading";
    },
    [fetchTags.fulfilled]: (state, action) => {
      state.tags.items = action.payload;
      state.tags.status = "loaded";
    },
    [fetchTags.rejected]: (state) => {
      state.tags.items = [];
      state.tags.status = "error";
    },
    //raksta dzēšana
    [fetchRemovePost.fulfilled]: (state, action) => {
      const id = action.meta.arg;
      state.posts.items = state.posts.items.filter((obj) => obj._id !== id);
    },

    //rakstu iegūšana pēc lietotāja ID
    [fetchPostsByUserId.pending]: (state) => {
      state.posts.items = [];
      state.posts.status = "loading";
    },
    [fetchPostsByUserId.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = "loaded";
    },
    [fetchPostsByUserId.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = "error";
    },
  },
});

export const { setSearchQuery } = postsSlice.actions;
export const postsReducer = postsSlice.reducer;
