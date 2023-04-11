import { configureStore } from "@reduxjs/toolkit";
import { menuItemReducer } from "./menuItemSlice";
import {
  authApi,
  menuItemApi,   
} from "../../Apis"; 
import { userAuthReducer } from "./userAuthSlice";
const store = configureStore({
  reducer: {
    menuItemStore: menuItemReducer, 
    userAuthStore: userAuthReducer,
    [menuItemApi.reducerPath]: menuItemApi.reducer, 
    [authApi.reducerPath]: authApi.reducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(menuItemApi.middleware)
      .concat(authApi.middleware)   
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
