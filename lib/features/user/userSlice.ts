import { createAppSlice } from '@/lib/createAppSlice';
import axios from 'axios';
import { AppThunk } from '@/lib/store';

interface userSliceState {
  userInfo: Object;
  isLogout: boolean;
  ready: boolean;
}

const initialState: userSliceState = {
  userInfo: null,
  isLogout: true,
  ready: false,
};
export const userSlice = createAppSlice({
  name: 'userInfo',
  initialState,
  reducers: (create) => {
    return {
      initial(state: userSliceState, action) {
        if (action?.payload) {
          state.userInfo = action.payload;
          state.isLogout = true;
        }
        state.ready = true;
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
    selectReady: state => state.ready,
  },
});

export const { initial, logout } =
  userSlice.actions;

export const { selectUserInfo, selectReady } = userSlice.selectors;

export const logoutFunc = (): AppThunk =>
  async (dispatch, getState) => {
    const resp = await axios.post('/logout');
    if (resp.status === 200) {
      dispatch(logout());
    } else {
      console.log(resp);
    }
  };