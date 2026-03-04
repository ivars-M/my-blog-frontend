import { configureStore } from "@reduxjs/toolkit";

import { postsReducer } from "./slices/posts";

import { authReducer } from "./slices/auth";

// import axios from "../axios.js";

const store = configureStore({
  reducer: {
    posts: postsReducer,
    auth: authReducer,
  },
  
});
export default store;
