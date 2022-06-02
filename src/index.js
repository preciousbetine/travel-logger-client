import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from 'react-redux';
import App from './App';
import reportWebVitals from './reportWebVitals';
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

start();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
