import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import serviceReducer from "./slice";
import { serviceApi } from "./service";

const rootReducer = combineReducers({
  service: serviceReducer,
  [serviceApi.reducerPath]: serviceApi.reducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["service"], // chỉ lưu phần service thôi
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(serviceApi.middleware),
});

export const persistor = persistStore(store);
