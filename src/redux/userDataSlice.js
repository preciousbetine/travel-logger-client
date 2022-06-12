/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {};

export const fetchUserData = createAsyncThunk(
  'user/fetchData',
  async () => {
    let userData = null;
    await fetch('http://localhost:5000/myFullInfo', {
      credentials: 'include',
    }).then((res) => res.json()).then(async (res) => {
      userData = res;
    }).catch((err) => {
      console.log('An Error Occured', err);
    });
    return userData;
  },
);

export const userDataSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.name = '';
      state.email = '';
      state.picture = '';
      state.location = '';
      state.website = '';
      state.description = '';
      state.followingCount = '';
      state.followersCount = '';
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserData.fulfilled, (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.picture = action.payload.picture;
      state.location = action.payload.location;
      state.website = action.payload.website;
      state.description = action.payload.description;
      state.followingCount = action.payload.followingCount;
      state.followersCount = action.payload.followersCount;
    });
  },
});

export const userData = (state) => state.user;
export const { clearUser } = userDataSlice.actions;

export default userDataSlice.reducer;
