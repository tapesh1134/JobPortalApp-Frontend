import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import jobReducer from "./jobSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobReducer,
  },

  // Optional: useful for debugging in dev
  devTools: import.meta.env.MODE !== "production",
});

export default store;