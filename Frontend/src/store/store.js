// store.js
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import  valueIdReducer  from './reducers';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';


const persistConfig = {
    key:"root",
    storage
};

const rootReducer = combineReducers(
    {valueIdReducer:valueIdReducer}
)

const persistedReducer = persistReducer(persistConfig,rootReducer);

export const store = configureStore(
    {reducer:persistedReducer}
);

export const persistor = persistStore(store);



