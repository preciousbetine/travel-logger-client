/* eslint-disable react/prop-types */
import './login.css';
import React, { useState } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLoggedInState, setNewUser } from '../../redux/loginSlice';
import { fetchUserData } from '../../redux/userDataSlice';

function LoginPage(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginOrSignUp, setLoginOrSignUp] = useState(true);
  const loggedIn = ({ credential }) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:5000/tokensignin');
    xhr.withCredentials = true;
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onload = () => {
      if (xhr.responseText === 'success') {
        fetch('http://localhost:5000/userLogin', {
          credentials: 'include',
        }).then((res) => res.json()).then(async (res) => {
          if (res.error) {
            alert(res.error);
            navigate('/login');
          }
          await dispatch(setLoggedInState(true));
          if (res.isNewUser) await dispatch(setNewUser(true));
          await dispatch(fetchUserData());
        }).catch((err) => {
          alert(err);
          navigate('/login');
        });
      }
    };
    xhr.send(JSON.stringify({ credential }));
  };
  const submitForm = (e) => {
    e.preventDefault();
    const bodyObject = {
      email: e.target.email.value,
      password: e.target.password.value,
    };
    let endPoint;

    if (e.target.id === 'login-form') {
      endPoint = 'emailLogin';
    } else {
      endPoint = 'emailSignUp';
      bodyObject.name = e.target.name.value;
    }
    fetch(`http://localhost:5000/${endPoint}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyObject),
    }).then((res) => res.json()).then(async (user) => {
      if (user.error) {
        alert(user.error);
        navigate('/login');
        return;
      }
      if (endPoint === 'emailSignUp') dispatch(setNewUser(true));
      await dispatch(fetchUserData());
      await dispatch(setLoggedInState(true));
    });
  };
  const { formForLogin } = props;
  return (
    <div className="App">
      <div className="sidePanel" />
      <div className="loginPanel">
        {formForLogin && loginOrSignUp ? (
          <form onSubmit={submitForm} id="login-form">
            <h2 className="mb-4 text-secondary">Login</h2>
            <div className="form-group mb-3">
              <input required id="email" type="email" autoComplete="off" className="form-control" placeholder="Enter Email Address" />
            </div>
            <div className="form-group mb-3">
              <input required id="password" type="password" className="form-control" placeholder="Password" />
            </div>
            <ButtonGroup className="mb-3">
              <Button
                variant="link text-secondary"
                onClick={() => {
                  setLoginOrSignUp(!loginOrSignUp);
                }}
              >
                Sign Up
              </Button>
              <Button type="submit" className="btn btn-secondary px-4">Login</Button>
            </ButtonGroup>
            <br />
          </form>
        ) : (
          <form onSubmit={submitForm} id="signup-form">
            <h2 className="mb-4 text-secondary">Sign Up</h2>
            <div className="form-group mb-3">
              <input required id="email" type="email" autoComplete="off" className="form-control" placeholder="Enter Email Address" />
            </div>
            <div className="form-group mb-3">
              <input required id="name" type="text" autoComplete="off" className="form-control" placeholder="Choose a Display Name" />
            </div>
            <div className="form-group mb-3">
              <input required id="password" type="password" className="form-control" placeholder="Choose a Password" />
            </div>
            <div className="form-group mb-3">
              <input required id="passwordConfirm" type="password" className="form-control" placeholder="Confirm Password" />
            </div>
            <ButtonGroup className="mb-3">
              <Button
                variant="link text-secondary"
                onClick={() => {
                  setLoginOrSignUp(!loginOrSignUp);
                }}
              >
                Log In
              </Button>
              <Button type="submit" className="btn btn-secondary px-4">Sign Up</Button>
            </ButtonGroup>
            <br />
          </form>
        )}
        <div>
          <GoogleLogin
            onSuccess={loggedIn}
            width="300px"
            onError={() => {
              console.log('Login Failed');
            }}
            text="continue_with"
          />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
