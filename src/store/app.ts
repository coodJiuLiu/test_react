import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  value: number;
  text: string;
}

const initialState: AppState = {
  value: 0,
  text: '',
};

const slice = createSlice({
  name: 'cs',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    setNum: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
    setStr: (state, action: PayloadAction<string>) => {
      state.text = action.payload;
    },
  },
});

const { increment, decrement, setNum, setStr } = slice.actions;

export { increment, decrement, setNum, setStr };
export default slice.reducer;
