import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Function to set default token in axios
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
};

// Async thunk for user login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userdata, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/login`,
        userdata
      );
      setAuthToken(response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Login failed");
    }
  }
);

// Async thunk to edit user profile
export const editUser = createAsyncThunk(
  "auth/editUser",
  async (updatedData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/user/edit`,
        updatedData
      );
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Update failed");
    }
  }
);

// Async thunk to check authentication
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      setAuthToken(token);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user`
      );
      return response.data;
    } catch (error) {
      setAuthToken(null);
      return rejectWithValue(error.response?.data || "Not authenticated");
    }
  }
);

// Async thunk for user signup
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (userdata, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/signup`,
        userdata
      );
      setAuthToken(response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Signup failed");
    }
  }
);

// Initial State
const initialState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

// Authentication Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      setAuthToken(null);
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle Edit User
      .addCase(editUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(editUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // Handle Signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // Handle Auth Check
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
      });
  },
});

// Export actions & reducer
export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;
