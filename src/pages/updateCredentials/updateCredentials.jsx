/* global $, bootstrap */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { serverAddress } from '../../redux/loginSlice';

export default function UpdateCredentials(props) {
  const { setHeader } = props;
  const navigate = useNavigate();
  const server = useSelector(serverAddress);
  const [newPassword, setNewUserPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordConfirmMessage, setPasswordConfirmMessage] = useState('');
  const [passwordVerified, setPasswordVerified] = useState(false);

  const nav = (
    <div className="d-flex align-items-center h-100">
      <button className="btn btn-link p-0 ps-2" type="button" onClick={() => { navigate(-1); }}>
        <i className="fa-solid fa-arrow-left-long me-3 text-color2 font-20" />
      </button>
      <Link to="/settings" className="text-dark me-1 text-decoration-none">Settings</Link>
      <span className="text-dark">/</span>
      <Link to="/settings/updateCredentials" className="text-dark ms-1">Change Password</Link>
    </div>
  );

  useEffect(() => {
    setHeader(nav);
  }, []);

  const submitForm = (e) => {
    e.preventDefault();
    const newCredentials = {
      newPassword,
    };
    fetch(`${server}/updateUserCredentials`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCredentials),
    }).then((res) => res.json()).then(async (res) => {
      if (res.success) {
        setTimeout(() => {
          const toast = new bootstrap.Toast(document.getElementById('passwordUpdatedToast'));
          toast.show();
        }, 1000);
        navigate('/profile');
      } else {
        const toast = new bootstrap.Toast(document.getElementById('passwordUpdateFailedToast'));
        toast.show();
      }
    }).catch(() => {
      const toast = new bootstrap.Toast(document.getElementById('passwordUpdateFailedToast'));
      toast.show();
    });
  };

  const verifyPassword = (e) => {
    if (e.target.value.length > 0 && e.target.value.length < 8) {
      setPasswordVerified(false);
      setPasswordMessage('Password is too short');
      $('#passwordMessage').removeClass('text-success');
      $('#passwordMessage').addClass('text-danger pt-2');
      $('#passwordMessage').css('display', 'block');
      $('#passwordMessageIcon').removeClass('fa-circle-check');
      $('#passwordMessageIcon').addClass('fa-ban');
    } else if (e.target.value.length === 0) {
      setPasswordVerified(false);
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
      setPasswordVerified(false);
      setPasswordConfirmMessage('Passwords do not match');
      $('#passwordConfirmMessage').removeClass('text-success');
      $('#passwordConfirmMessage').addClass('text-danger pt-2');
      $('#passwordConfirmMessage').css('display', 'block');
      $('#passwordConfirmMessageIcon').removeClass('fa-circle-check');
      $('#passwordConfirmMessageIcon').addClass('fa-ban');
    } else if (password.length >= 8) {
      setPasswordConfirmMessage('Password Accepted');
      setPasswordVerified(true);
      $('#passwordConfirmMessage').removeClass('text-danger');
      $('#passwordConfirmMessage').addClass('text-success pt-2');
      $('#passwordConfirmMessageIcon').removeClass('fa-ban');
      $('#passwordConfirmMessageIcon').addClass('fa-circle-check');
    }
  };

  return (
    <div className="settingsPage p-3">
      <div className="toast-container position-fixed bottom-0 end-0 p-3 toast-sm">
        <div id="passwordUpdateFailedToast" className="toast m-0 w-100" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-body d-flex align-items-center bg-danger text-light fw-bold">
            Password Update Failed!
          </div>
        </div>
      </div>
      <form className="w-100 d-flex flex-column" onSubmit={submitForm}>
        <div className="form-group mb-3">
          Enter New Password
          <input
            id="password"
            type="password"
            className="form-control mt-1"
            placeholder="Choose a Password"
            onChange={(e) => {
              setNewUserPassword(e.target.value);
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
          Confirm New Password
          <input id="passwordConfirm" type="password" className="form-control mt-1" placeholder="Confirm Password" onChange={confirmPassword} />
          <span className="px-2 d-flex align-items-center" id="passwordConfirmMessage">
            <i className="fa-solid pe-2" id="passwordConfirmMessageIcon" />
            <p className="m-0">{passwordConfirmMessage}</p>
          </span>
        </div>
        <div className="btn-group mt-3 align-self-end" role="group">
          <button type="submit" className="btn btn-danger px-4" disabled={!passwordVerified}>Update</button>
        </div>
      </form>
    </div>
  );
}

UpdateCredentials.propTypes = {
  setHeader: PropTypes.func.isRequired,
};
