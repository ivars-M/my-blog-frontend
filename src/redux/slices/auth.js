


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios.js";

export const fetchAuth = createAsyncThunk("auth/fetchAuth", async (params) => {
  const { data } = await axios.post("/auth/login", params);
  return data;
});

export const fetchRegister = createAsyncThunk(
  'auth/fetchRegister',
  async (params, { rejectWithValue }) => { // Pievienojam rejectWithValue šeit
    try {
      const { data } = await axios.post('/auth/register', params);
      return data;
    } catch (err) {
      // Šī ir tā maģiskā rindiņa! 
      // Tā paņem ziņu no Backend (UserController) un aizsūta uz React
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const fetchAuthMe = createAsyncThunk("auth/fetchAuthMe", async () => {
  const { data } = await axios.get("/auth/me");
  return data;
});

const initialState = {
  data: null,
  status: "loading",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
    },
    updateUser: (state, action) => {
      state.data = {
        ...state.data,
        ...action.payload,
      };
    },
  },
  extraReducers: {
    [fetchAuth.pending]: (state) => {
      state.status = "loading";
      state.data = null;
    },
    [fetchAuth.fulfilled]: (state, action) => {
      state.status = "loaded";
      state.data = action.payload;
    },
    [fetchAuth.rejected]: (state) => {
      state.status = "error";
      state.data = null;
    },

    [fetchAuthMe.pending]: (state) => {
      state.status = "loading";
      state.data = null;
    },
    [fetchAuthMe.fulfilled]: (state, action) => {
      state.status = "loaded";
      state.data = action.payload;
    },
    [fetchAuthMe.rejected]: (state) => {
      state.status = "error";
      state.data = null;
    },

    [fetchRegister.pending]: (state) => {
      state.status = "loading";
      state.data = null;
    },
    [fetchRegister.fulfilled]: (state, action) => {
      state.status = "loaded";
      state.data = action.payload;
    },
    [fetchRegister.rejected]: (state) => {
      state.status = "error";
      state.data = null;
    },
  },
});

export const selectIsAuth = (state) => Boolean(state.auth.data);

export const { logout, updateUser } = authSlice.actions;

export const authReducer = authSlice.reducer;
