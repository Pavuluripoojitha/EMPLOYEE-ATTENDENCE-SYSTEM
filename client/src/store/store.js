// eas/client/src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import attendanceReducer from '../features/attendanceSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    attendance: attendanceReducer
  }
});
