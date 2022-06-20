import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from 'react-redux';
import App from './App';
import store from './redux/store';
import { checkLoggedInState } from './redux/loginSlice';
import { fetchUserData } from './redux/userDataSlice';

const start = async () => {
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

window.server = 'http://localhost:5000';
start();
