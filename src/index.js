import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from 'react-redux';
import App from './App';
import store from './redux/store';
import { checkLoggedInState, setServerAddress } from './redux/loginSlice';
import { fetchUserData } from './redux/userDataSlice';

// Server Address is set in three places
// Here, loginSlice.js and userDataSlice.js

const start = async () => {
  await store.dispatch(setServerAddress('http://localhost:5000'));
  await store.dispatch(checkLoggedInState());
  if (store.getState().login.loggedIn) await store.dispatch(fetchUserData());
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <GoogleOAuthProvider clientId="585291370033-3p13pavgsncbcdhkcvh71db7r5jv91ra.apps.googleusercontent.com">
      <Provider store={store}>
        <App />
      </Provider>
    </GoogleOAuthProvider>,
  );
};

start();
