import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

const user = JSON.parse(localStorage.getItem('user') || 'null');
const token = localStorage.getItem('token');

export const login = createAsyncThunk('auth/login', async (creds, { rejectWithValue }) => {
  try { const { data } = await api.post('/auth/login', creds); localStorage.setItem('token', data.token); localStorage.setItem('user', JSON.stringify(data.user)); return data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Login failed'); }
});
export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try { const { data } = await api.post('/auth/register', userData); localStorage.setItem('token', data.token); localStorage.setItem('user', JSON.stringify(data.user)); return data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Registration failed'); }
});
export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  try { const { data } = await api.get('/auth/me'); localStorage.setItem('user', JSON.stringify(data.user)); return data.user; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: user || null, token: token || null, loading: false, error: null },
  reducers: {
    logout: (s) => { s.user = null; s.token = null; localStorage.removeItem('token'); localStorage.removeItem('user'); },
    clearError: (s) => { s.error = null; },
  },
  extraReducers: (b) => {
    b.addCase(login.pending, (s) => { s.loading = true; s.error = null; })
     .addCase(login.fulfilled, (s, a) => { s.loading = false; s.user = a.payload.user; s.token = a.payload.token; })
     .addCase(login.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
     .addCase(register.pending, (s) => { s.loading = true; s.error = null; })
     .addCase(register.fulfilled, (s, a) => { s.loading = false; s.user = a.payload.user; s.token = a.payload.token; })
     .addCase(register.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
     .addCase(getMe.fulfilled, (s, a) => { s.user = a.payload; });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
