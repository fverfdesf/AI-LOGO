import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from '@reduxjs/toolkit'

const initialState = {
  isShowLogin: false,
  isShowRegister: false,
  isTokenInvalid: false
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setIsShowLogin: (state, action:PayloadAction<boolean>) => {
      state.isShowLogin = action.payload;
    },
    setIsShowRegister: (state, action:PayloadAction<boolean>) => {
      state.isShowRegister = action.payload;
    },
    setIsTokenInvalid: (state, action:PayloadAction<boolean>) => {
      state.isTokenInvalid = action.payload;
    },
  }
});

export const {setIsShowLogin, setIsShowRegister, setIsTokenInvalid } = userSlice.actions;
export default userSlice.reducer
