import { configureStore, createSlice } from '@reduxjs/toolkit';

const initialState = {
  portalUserInfo: null,
  kidsInfo: null,
  currentKid: null,
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.portalUserInfo = action.payload;
    },
    setKidsInfoStore: (state, action) => {
      state.kidsInfo = action.payload;
    },
    setCurrentKidStore: (state, action) => {
      state.currentKid = action.payload;
    },
  },
});

export const { setUserInfo, setKidsInfoStore, setCurrentKidStore } = counterSlice.actions;

const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
});

export default store;