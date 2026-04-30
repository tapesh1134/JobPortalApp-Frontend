import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },

  // Optional: useful for debugging in dev
  devTools: import.meta.env.MODE !== "production",
});

export default store;