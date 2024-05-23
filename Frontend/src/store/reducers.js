// reducers.js
import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  valueIds: [],
};

// export function valueIdsReducer(state = initialState, action) {
//   switch (action.type) {
//     case ADD_VALUE_ID:
//       return {
//         ...state,
//         valueIds: [...state.valueIds, action.valueId],
//       };
//     default:
//       return state;
//   }
// }

const valueId = createSlice({
  name:"valueIdReducer",
  initialState,
  reducers:{
    addValueId:(state,action)=>{
      state.valueIds.push(action.payload);
    }
  }
})
const valueIdReducer = valueId.reducer;
export default valueIdReducer;
export const {addValueId} = valueId.actions;
