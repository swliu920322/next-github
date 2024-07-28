import { createAppSlice } from '@/lib/createAppSlice';

interface userSliceState {
  userInfo: Object;
}

const initialState = {
  userInfo: {},
};
export const userSlice = createAppSlice({
  name: 'userInfo',
  initialState,
  reducers: (create) => {
    return {
      initial: create.reducer((state: userSliceState, action) => {
        console.log(action?.payload);
        state.userInfo = action?.payload;
      }),
    };
  },
  selectors: {
    selectUserInfo: state => state.userInfo,
  },
});

export const { initial } =
  userSlice.actions;

export const { selectUserInfo } = userSlice.selectors;
