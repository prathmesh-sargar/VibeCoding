import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "../Features/Auth/AuthSlice";
import InterwiewReducer from "../Features/Auth/interviewSlice";

export const store = configureStore({
  reducer: {
    auth: AuthReducer, // ✅ Fixed syntax: Wrapped inside an object
    interview: InterwiewReducer, // ✅ Fixed syntax: Wrapped inside an object
  },
});
