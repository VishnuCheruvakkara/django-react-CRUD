import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    authData: [], // Stores all fetched data
};

const authDataSlice = createSlice({
    name: 'authData',
    initialState,
    reducers: {
        setAuthData(state, action) {
            state.authData = action.payload; // Update the fetched data
        },
        clearAuthData(state) {
            state.authData = []; // Clear fetched data
        },
    },
});

export const { setAuthData, clearAuthData } = authDataSlice.actions;
export default authDataSlice.reducer;
