// store/orderSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  summary: null,
};

if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('orderSummary');
  if (stored) {
    initialState.summary = JSON.parse(stored);
  }
}

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setSummary: (state, action) => {
      state.summary = action.payload;
      localStorage.setItem('orderSummary', JSON.stringify(action.payload));
    },
    clearSummary: (state) => {
      state.summary = null;
      localStorage.removeItem('orderSummary');
    },
  },
});

export const { setSummary, clearSummary } = orderSlice.actions;
export default orderSlice.reducer;
