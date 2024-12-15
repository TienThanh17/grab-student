import { createSlice } from '@reduxjs/toolkit'
import Cookies from 'js-cookie';

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
      state.userInfo = null
      state.isLogin = false;
      Cookies.remove('accessToken')
      Cookies.remove('refreshToken')
    },
    updateUser2fa(state, action) {
      state.userInfo = {
        ...state.userInfo,
        is2faEnabled: action.payload
      }
    }
  },
})

export const { login, logout, updateUser2fa } = userSlice.actions
export default userSlice.reducer