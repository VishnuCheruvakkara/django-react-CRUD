// redux/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
