// eas/client/src/features/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';

export const login = createAsyncThunk('auth/login', async (data, thunkAPI) => {
  const res = await API.post('/auth/login', data);
  return res.data;
});

export const register = createAsyncThunk('auth/register', async (data, thunkAPI) => {
  const res = await API.post('/auth/register', data);
  return res.data;
});

const slice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null, status: 'idle' },
  reducers: {
    logout(state) { state.user = null; state.token = null; }
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    });
  }
});

export const { logout } = slice.actions;
export default slice.reducer;
