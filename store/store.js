import { configureStore } from '@reduxjs/toolkit';
import applicationSlice from './slices/appslice';

export const store = configureStore({
  reducer: {
    application: applicationSlice
  },
});
