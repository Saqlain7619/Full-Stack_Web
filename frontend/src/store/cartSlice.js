import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try { const { data } = await api.get('/cart'); return data.cart; } catch (err) { return rejectWithValue(err.response?.data?.message); }
});
export const addToCart = createAsyncThunk('cart/add', async (item, { rejectWithValue }) => {
  try { const { data } = await api.post('/cart', item); return data.cart; } catch (err) { return rejectWithValue(err.response?.data?.message); }
});
export const updateCartItem = createAsyncThunk('cart/update', async ({ itemId, quantity }, { rejectWithValue }) => {
  try { const { data } = await api.put(`/cart/items/${itemId}`, { quantity }); return data.cart; } catch (err) { return rejectWithValue(err.response?.data?.message); }
});
export const removeFromCart = createAsyncThunk('cart/remove', async (itemId, { rejectWithValue }) => {
  try { const { data } = await api.delete(`/cart/items/${itemId}`); return data.cart; } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { cart: null, loading: false, error: null },
  reducers: { resetCart: (s) => { s.cart = null; } },
  extraReducers: (b) => {
    [fetchCart, addToCart, updateCartItem, removeFromCart].forEach(action => {
      b.addCase(action.pending, (s) => { s.loading = true; })
       .addCase(action.fulfilled, (s, a) => { s.loading = false; s.cart = a.payload; })
       .addCase(action.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
    });
  },
});

export const { resetCart } = cartSlice.actions;
export const selectCartCount = (s) => s.cart.cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
export const selectCartTotal = (s) => s.cart.cart?.items?.reduce((sum, i) => sum + i.product.price * i.quantity, 0) || 0;
export default cartSlice.reducer;
