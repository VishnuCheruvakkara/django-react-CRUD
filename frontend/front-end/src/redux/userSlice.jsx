import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: null,
    isAuthenticated: false,
    isAdmin:false,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.isAdmin = action.payload.isAdmin || false;
           
        },
        clearUser(state) {
            state.user = null;
            state.isAuthenticated = false;
            state.isAdmin = false;
          
        }
    }
})

export const { setUser, clearUser,setProfileImage } = userSlice.actions;
export default userSlice.reducer;