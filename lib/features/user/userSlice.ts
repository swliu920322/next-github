import { createAppSlice } from '@/lib/createAppSlice';


const initialState = {

}
export const userSlice = createAppSlice({
  name: "userInfo",
  initialState,
  reducers: (create) => {
  
  },
  selectors: {
  
  }
})

export const { decrement, increment, incrementByAmount, incrementAsync } =
  userSlice.actions;

export const { selectCount, selectStatus } = userSlice.selectors;
