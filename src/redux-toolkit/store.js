import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import postSlice from './postSlice'
import userSlice from './userSlice'
import loadingSlice from './loadingSlice'
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';

const createNoopStorage = () => {
    return {
        getItem(_key) {
            return Promise.resolve(null);
        },
        setItem(_key, value) {
            return Promise.resolve(value);
        },
        removeItem(_key) {
            return Promise.resolve();
        },
    };
};

const storage =
    typeof window !== "undefined"
        ? createWebStorage("local")
        : createNoopStorage();

const persistCommonConfig = {
    storage: storage,
    stateReconciler: autoMergeLevel2,
};

// Cấu hình persist cho userSlice
const userPersistConfig = {
    ...persistCommonConfig,
    key: 'user', // Key để lưu trong localStorage
    whitelist: ["isLogin", "userInfo"],
};

const persistedUserReducer = persistReducer(userPersistConfig, userSlice);

const rootReducer = combineReducers({
    post: postSlice, // Không cần persist
    user: persistedUserReducer, // Chỉ userSlice được persist
    loading: loadingSlice, // Không cần persist
})

export const store = configureStore({
    reducer: rootReducer,
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