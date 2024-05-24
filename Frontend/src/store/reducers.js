// reducers.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  valueIds: [],
  bodyValues: {},
};

const valueId = createSlice({
  name: "valueIdReducer",
  initialState,
  reducers: {
    addValueId: (state, action) => {
      state.valueIds.push(action.payload);
    },
    setBodyValue: (state, action) => {
      const { resourceId, formJson } = action.payload;
      state.bodyValues[resourceId] = formJson;
    },
    updateBodyValue: (state, action) => {
      const { resourceId, formJson } = action.payload;
      if (state.bodyValues[resourceId]) {
        state.bodyValues[resourceId] = formJson;
      }
    },
    deleteBodyValue: (state, action) => {
      delete state.bodyValues[action.payload];
      state.valueIds = state.valueIds.filter(id => id !== action.payload);
    }
  },
});

const valueIdReducer = valueId.reducer;
export default valueIdReducer;
export const { addValueId, setBodyValue, updateBodyValue, deleteBodyValue } = valueId.actions;
