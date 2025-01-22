import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Defaults to localStorage for web
import authReducer from './authSlice';
import userReducer from './userSlice';
import authDataReducer from './authDataSlice'

// Combine reducers
const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    authData:authDataReducer,
});

// Redux Persist configuration
const persistConfig = {
    key: 'root', // Key to save the persisted state in localStorage
    storage,
    whitelist:['auth','user','authData']
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persisted reducer
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Disable serializable check for Redux Persist
        }),
});

// Create a persistor
export const persistor = persistStore(store);
export default store;
