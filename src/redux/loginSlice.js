/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  loggedIn: false,
};

export const checkLoggedInState = createAsyncThunk(
  'login/fetchDetails',
  async () => {
    let loggedIn = false;
    await fetch('http://localhost:5000/userLogin', {
      credentials: 'include',
    }).then((res) => res.json()).then((res) => {
      // User is either signed in with google token or our login token
      if (res.error) {
        console.log(res.error);
      } else {
        console.log('User signed in with login token', res);
        loggedIn = true;
      }
    }).catch((err) => {
      console.log('User not logged in via token', err);
    });
    return loggedIn;
  },
);

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setLoggedInState: (state, action) => {
      state.loggedIn = action.payload;
    },
    setNewUser: (state, action) => {
      state.newUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(checkLoggedInState.fulfilled, (state, action) => {
      state.loggedIn = action.payload;
    });
  },
});

export const { setLoggedInState, setNewUser } = loginSlice.actions;

export const isUserLoggedIn = (state) => state.login.loggedIn;
export const isNewUser = (state) => state.login.newUser;

export default loginSlice.reducer;
