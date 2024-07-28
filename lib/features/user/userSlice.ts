import { createAppSlice } from '@/lib/createAppSlice';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { AppThunk } from '@/lib/store';

interface userSliceState {
  userInfo: Object;
  isLogout: boolean;
}

const initialState = {
  userInfo: {},
  isLogout: true,
};
export const userSlice = createAppSlice({
  name: 'userInfo',
  initialState,
  reducers: (create) => {
    return {
      initial(state: userSliceState, action) {
        state.userInfo = action?.payload;
        state.isLogout = false;
      },
      // initial: create.reducer((state: userSliceState, action) => {
      //   console.log(action?.payload);
      //   state.userInfo = action?.payload;
      // }),
      logout(state) {
        state.isLogout = true;
        state.userInfo = null;
      },
    };
  },
  selectors: {
    selectUserInfo: state => state.userInfo,
  },
});

export const { initial, logout } =
  userSlice.actions;

export const { selectUserInfo } = userSlice.selectors;

export const logoutFunc = (): AppThunk =>
  async (dispatch, getState) => {
    const resp = await axios.post('/logout');
    if (resp.status === 200) {
      dispatch(logout());
    } else {
      console.log(resp);
    }
  };