/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const server = 'https://travel-logger-server.herokuapp.com';
const initialState = {
  loggedIn: false,
};

export const checkLoggedInState = createAsyncThunk(
  'login/fetchDetails',
  async () => {
    let loggedIn = false;
    await fetch(`${server}/userLogin`, {
      credentials: 'include',
    }).then((res) => res.json()).then((res) => {
      if (!res.error) {
        loggedIn = true;
      }
    }).catch(() => {});
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
    setServerAddress: (state, action) => {
      state.serverAddress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(checkLoggedInState.fulfilled, (state, action) => {
      state.loggedIn = action.payload;
    });
  },
});

export const { setLoggedInState, setNewUser, setServerAddress } = loginSlice.actions;

export const isUserLoggedIn = (state) => state.login.loggedIn;
export const isNewUser = (state) => state.login.newUser;
export const serverAddress = (state) => state.login.serverAddress;

export default loginSlice.reducer;
