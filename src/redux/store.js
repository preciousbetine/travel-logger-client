import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './loginSlice';
import userReducer from './userDataSlice';

export default configureStore({
  reducer: {
    login: loginReducer,
    user: userReducer,
  },
});
