import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: null,
  userData: null,
  profile: null,
  profileCompleted: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { userData, profile } = action.payload;

      state.status = true;
      state.userData = userData;
      state.profile = profile;
      state.profileCompleted = !!profile; // 🔑 FIX
    },

    logout: (state) => {
      state.status = false;
      state.userData = null;
      state.profile = null;
      state.profileCompleted = false;
    },

    completeProfile: (state, action) => {
      state.profile = action.payload;
      state.profileCompleted = true;
    },
  },
});

export const { login, logout, completeProfile } = authSlice.actions;
export default authSlice.reducer;
