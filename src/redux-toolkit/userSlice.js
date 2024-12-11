import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',

  initialState: {
    isLogin: false,
    userInfo: {}
  },

  reducers: {
    login(state, action) {
      state.userInfo = action.payload;
      state.isLogin = true;
    },
    logout(state, action) {
        state.userInfo = {}
        state.isLogin = false;
      },
  },
})

export const { login, logout } = userSlice.actions
export default userSlice.reducer