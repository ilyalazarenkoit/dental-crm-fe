/**
 * @module Store
 * @remarks Redux store configuration with persistence and middleware setup
 */

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authReducer } from "@store/features/authSlice";

import { useDispatch } from "react-redux";

import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

/**
 * @remarks Combined root reducer including all feature reducers
 */
const rootReducer = combineReducers({
  auth: authReducer,
});

/**
 * @remarks Configuration for Redux persist
 * Specifies which parts of the state should be persisted
 */
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["auth"], // Persist auth and token state
};

/**
 * @remarks Persisted reducer wrapping the root reducer
 * Handles saving and rehydrating the specified state slices
 */
const persistedReducer = persistReducer(persistConfig, rootReducer);

/**
 * @remarks Redux store instance with configured reducers and middleware
 */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Set up listeners for RTK-Query
setupListeners(store.dispatch);

/**
 * @remarks Redux persistor instance for managing persisted state
 */
export const persistor = persistStore(store);

/**
 * @remarks Type definition for the complete Redux state tree
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * @remarks Type definition for the store's dispatch function.
 * Includes all action creators and thunks
 */
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
