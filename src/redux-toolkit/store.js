import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Sử dụng localStorage
import postSlice from './postSlice'
import userSlice from './userSlice'
import loadingSlice from './loadingSlice'


// Cấu hình persist cho userSlice
const userPersistConfig = {
  key: 'user', // Key để lưu trong localStorage
  storage,     // Storage sử dụng, ở đây là localStorage
  whitelist: ["isLogin", "userInfo"],
};

const persistedUserReducer = persistReducer(userPersistConfig, userSlice);

export const store = configureStore({
  reducer: {
      post: postSlice,
      user: persistedUserReducer,
      loading: loadingSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [
                'persist/PERSIST',
                'persist/REHYDRATE',
                'persist/REGISTER',
            ],
        },
    }),
});

// Kích hoạt persist store
export const persistor = persistStore(store);