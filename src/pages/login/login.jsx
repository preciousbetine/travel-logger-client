/* global $ */
import './login.css';
import React, { useState } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { setLoggedInState, setNewUser } from '../../redux/loginSlice';
import { fetchUserData } from '../../redux/userDataSlice';
import Alert from '../../components/Alert/Alert';

function LoginPage(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginOrSignUp, setLoginOrSignUp] = useState(true);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordConfirmMessage, setPasswordConfirmMessage] = useState('');
  const [emailMessage, setEmailMessage] = useState('');

  const loggedIn = ({ credential }) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${window.server}/tokensignin`);
    xhr.withCredentials = true;
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onload = () => {
      if (xhr.responseText === 'success') {
        fetch(`${window.server}/userLogin`, {
          credentials: 'include',
        }).then((res) => res.json()).then(async (res) => {
          if (res.error) {
            Alert(res.error, 'danger', 'loginAlertPlaceHolder');
            navigate('/login');
            return;
          }
          $('.loginPanel').fadeOut(500);
          $('.sidePanel').animate({ width: '0px' }, 200);
          dispatch(fetchUserData());
          if (res.isNewUser) dispatch(setNewUser(true));
          setTimeout(async () => {
            await dispatch(setLoggedInState(true));
          }, 700);
        }).catch((err) => {
          Alert(err, 'danger', 'loginAlertPlaceHolder');
          navigate('/login');
        });
      }
    };
    xhr.send(JSON.stringify({ credential }));
  };

  const validateForm = () => {
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const emailRegex = /\S+@\S+\.\S+/;
    if (!email.match(emailRegex)) {
      document.getElementById('email').focus();
      return { error: 'Please Enter a valid email address' };
    }
    if (name.trim().length === 0) {
      document.getElementById('name').focus();
      return { error: 'Name Cannot Be Blank!' };
    }
    if (password.trim().length < 8) {
      document.getElementById('password').focus();
      return { error: 'Enter a Valid Password!' };
    }
    if (password !== passwordConfirm) {
      document.getElementById('passwordConfirm').focus();
      return { error: 'Passwords Do Not Match!' };
    }
    return true;
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
      const result = validateForm();
      if (result.error) {
        Alert(result.error, 'danger', 'loginAlertPlaceHolder');
        return;
      }
      endPoint = 'emailSignUp';
      bodyObject.name = e.target.name.value;
    }
    fetch(`${window.server}/${endPoint}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyObject),
    }).then((res) => res.json()).then(async (user) => {
      if (user.error) {
        // Show an alert to the user
        Alert(user.error, 'danger', 'loginAlertPlaceHolder');
        if (e.target.id === 'login-form') document.getElementById('password').focus();
        else document.getElementById('email').focus();
        return;
      }
      if (endPoint === 'emailSignUp') dispatch(setNewUser(true));
      $('.loginPanel').fadeOut(500);
      $('.sidePanel').animate({ width: '0px' });
      await dispatch(fetchUserData());
      await dispatch(setLoggedInState(true));
    });
  };
  const verifyEmail = (e) => {
    const email = e.target.value;
    const emailRegex = /\S+@\S+\.\S+/;
    if (!email.match(emailRegex)) {
      setEmailMessage('Wrong Email Format');
      $('#emailMessage').css('display', 'flex');
    } else {
      setEmailMessage('');
      $('#emailMessage').css('display', 'none');
    }
  };
  const verifyPassword = (e) => {
    if (e.target.value.length > 0 && e.target.value.length < 8) {
      setPasswordMessage('Password is too short');
      $('#passwordMessage').removeClass('text-success');
      $('#passwordMessage').addClass('text-danger pt-2');
      $('#passwordMessage').css('display', 'block');
      $('#passwordMessageIcon').removeClass('fa-circle-check');
      $('#passwordMessageIcon').addClass('fa-ban');
    } else if (e.target.value.length === 0) {
      setPasswordMessage('');
      $('#passwordMessage').css('display', 'none');
      $('#passwordMessage').removeClass('pt-2');
      $('#passwordMessageIcon').removeClass('fa-circle-check fa-ban');
    } else {
      setPasswordMessage('Password Accepted');
      $('#passwordMessage').removeClass('text-danger');
      $('#passwordMessage').addClass('text-success pt-2');
      $('#passwordMessageIcon').removeClass('fa-ban');
      $('#passwordMessageIcon').addClass('fa-circle-check');
    }
  };
  const confirmPassword = () => {
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    if (passwordConfirm !== password) {
      setPasswordConfirmMessage('Passwords do not match');
      $('#passwordConfirmMessage').removeClass('text-success');
      $('#passwordConfirmMessage').addClass('text-danger pt-2');
      $('#passwordConfirmMessage').css('display', 'block');
      $('#passwordConfirmMessageIcon').removeClass('fa-circle-check');
      $('#passwordConfirmMessageIcon').addClass('fa-ban');
    } else if (password.length >= 8) {
      setPasswordConfirmMessage('Password Accepted');
      $('#passwordConfirmMessage').removeClass('text-danger');
      $('#passwordConfirmMessage').addClass('text-success pt-2');
      $('#passwordConfirmMessageIcon').removeClass('fa-ban');
      $('#passwordConfirmMessageIcon').addClass('fa-circle-check');
    }
  };
  const { formForLogin } = props;
  return (
    <div className="App">
      <div id="loginAlertPlaceHolder" />
      <div className="app-name">
        <h1>UpTravel</h1>
        <p>Share Your Experiences with the world</p>
      </div>
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
                variant="link text-dark"
                onClick={() => {
                  document.getElementById('login-form').reset();
                  setLoginOrSignUp(!loginOrSignUp);
                }}
              >
                Sign Up
              </Button>
              <Button type="submit" className="btn btn-dark px-4">Login</Button>
            </ButtonGroup>
          </form>
        ) : (
          <form onSubmit={submitForm} id="signup-form">
            <h2 className="mb-4 text-secondary">Sign Up</h2>
            <div className="form-group mb-3">
              <input id="email" autoComplete="off" className="form-control" placeholder="Enter Email Address" onChange={verifyEmail} />
              <span className="px-2 align-items-center pt-2 text-danger" id="emailMessage">
                <i className="fa-solid pe-2 fa-ban" id="emailMessageIcon" />
                <p className="m-0">{emailMessage}</p>
              </span>
            </div>
            <div className="form-group mb-3">
              <input id="name" type="text" autoComplete="off" className="form-control" placeholder="Choose a Display Name" />
            </div>
            <div className="form-group mb-3">
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="Choose a Password"
                onChange={(e) => {
                  verifyPassword(e);
                  confirmPassword();
                }}
              />
              <span className="px-2 d-flex align-items-center" id="passwordMessage">
                <i className="fa-solid pe-2" id="passwordMessageIcon" />
                <p className="m-0">{passwordMessage}</p>
              </span>
            </div>
            <div className="form-group mb-3">
              <input id="passwordConfirm" type="password" className="form-control" placeholder="Confirm Password" onChange={confirmPassword} />
              <span className="px-2 d-flex align-items-center" id="passwordConfirmMessage">
                <i className="fa-solid pe-2" id="passwordConfirmMessageIcon" />
                <p className="m-0">{passwordConfirmMessage}</p>
              </span>
            </div>
            <ButtonGroup className="mb-3">
              <Button
                variant="link text-dark"
                onClick={() => {
                  document.getElementById('signup-form').reset();
                  setLoginOrSignUp(!loginOrSignUp);
                  setPasswordMessage('');
                  setPasswordConfirmMessage('');
                }}
              >
                Log In
              </Button>
              <Button type="submit" className="btn btn-dark px-4">Sign Up</Button>
            </ButtonGroup>
            <br />
          </form>
        )}
        <div>
          <GoogleLogin
            onSuccess={loggedIn}
            width="300px"
            onError={() => {
              Alert('Login Failed', 'danger', 'loginAlertPlaceHolder');
            }}
            text="continue_with"
          />
        </div>
      </div>
    </div>
  );
}

LoginPage.propTypes = {
  formForLogin: PropTypes.bool.isRequired,
};

export default LoginPage;
