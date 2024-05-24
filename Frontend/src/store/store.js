// store.js
import { configureStore } from '@reduxjs/toolkit';
import  valueIdReducer  from './reducers';

export const store = configureStore(
    {reducer:valueIdReducer}
);



    