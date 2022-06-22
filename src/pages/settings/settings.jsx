/* global bootstrap */
import React, { useEffect, useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { setNewUser, setLoggedInState, serverAddress } from '../../redux/loginSlice';
import { userData, fetchUserData, clearUser } from '../../redux/userDataSlice';
import './settings.css';
import Alert from '../../components/Alert/Alert';

function AllSettings(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const server = useSelector(serverAddress);
  const { setHeader } = props;
  const nav = (
    <Link to="/settings" className="text-dark text-decoration-none">Settings</Link>
  );
  useEffect(() => {
    setHeader(nav);
  }, []);
  const editProfilePage = {
    pathname: '/settings/editProfile',
    setHeader,
  };
  const logOut = async () => {
    fetch(`${server}/logout`, {
      credentials: 'include',
    }).then(() => {
      dispatch(clearUser());
      dispatch(setLoggedInState(false));
      navigate('/login');
    }).catch(() => {
      navigate('/login');
    });
  };
  return (
    <div className="settingsPage">
      <LinkContainer to={editProfilePage}>
        <div className="settingItem">Edit Profile</div>
      </LinkContainer>
      <LinkContainer to="/settings/updateCredentials">
        <div className="settingItem">Change Password</div>
      </LinkContainer>
      <div className="settingItem" role="button" onClick={logOut} onKeyPress={logOut} tabIndex="0">Log Out</div>
    </div>
  );
}

AllSettings.propTypes = {
  setHeader: PropTypes.func.isRequired,
};

export function EditProfile(props) {
  const { setHeader } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const server = useSelector(serverAddress);
  const user = useSelector(userData);
  const [newUserName, setNewUserName] = useState('');
  const [newUserLocation, setNewUserLocation] = useState('');
  const [newUserWebsite, setNewUserWebsite] = useState('');
  const [newUserBio, setNewUserBio] = useState('');
  const [imageInfo, setImageInfo] = useState('Max File Size is 3MB');
  const [profilePicSrc, setProfilePicSrc] = useState(user.picture ? `${server}/photo/${user.picture}` : 'https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png');

  const nav = (
    <>
      <Link to="/settings" className="text-dark me-1 text-decoration-none">Settings</Link>
      <span className="text-dark">/</span>
      <Link to="/settings/editProfile" className="text-dark ms-1">Edit Profile</Link>
    </>
  );
  useEffect(() => {
    setNewUserName(user.name);
    setNewUserLocation(user.location);
    setNewUserWebsite(user.website);
    setNewUserBio(user.description);
    setHeader(nav);
    dispatch(setNewUser(false));
  }, []);

  const submitForm = (e) => {
    e.preventDefault();
    const newProfileInfo = {
      newUserName,
      newUserLocation,
      newUserWebsite,
      newUserBio,
      profilePicSrc,
      email: user.email,
    };
    if (profilePicSrc === `${server}/photo/${user.picture}`) newProfileInfo.profilePicSrc = null;
    fetch(`${server}/updateUserInfo`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProfileInfo),
    }).then((res) => res.json()).then(async (res) => {
      if (res.success) {
        await dispatch(fetchUserData());
        setTimeout(() => {
          const toast = new bootstrap.Toast(document.getElementById('profileUpdatedToast'));
          toast.show();
        }, 1000);
        navigate('/profile');
      } else {
        Alert('Profile update failed', 'warning', 'settingsAlert', 'Error ');
      }
    }).catch(() => {
      Alert('Profile update failed', 'warning', 'settingsAlert', 'Error ');
    });
  };

  const selectImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files[0];
      if (FileReader && file) {
        const fr = new FileReader();
        fr.onload = () => {
          if ((file.size / 1024) < 3072) {
            setProfilePicSrc(fr.result);
            setImageInfo('Image Upload Successful');
          } else {
            setImageInfo('Maximum File Size Exceeded');
            setProfilePicSrc(user.picture ? `${server}/photo/${user.picture}` : 'https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png');
            document.getElementById('profilePic').value = null;
          }
        };
        fr.readAsDataURL(file);
      } else {
        setImageInfo('Max File Size is 3MB');
        setProfilePicSrc(user.picture ? `${server}/photo/${user.picture}` : 'https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png');
      }
    };
    input.click();
  };

  const handleInputChange = (e) => {
    switch (e.target.id) {
      case 'newUserName': {
        setNewUserName(e.target.value);
        break;
      }
      case 'newUserLocation': {
        setNewUserLocation(e.target.value);
        break;
      }
      case 'newUserWebsite': {
        setNewUserWebsite(e.target.value);
        break;
      }
      case 'newUserBio': {
        setNewUserBio(e.target.value);
        break;
      }
      default: break;
    }
  };
  return (
    <div className="settingsPage">
      <div id="settingsAlert" />
      <form className="w-100 d-flex flex-column" onSubmit={submitForm}>
        <label htmlFor="profilePic" className="text-dark w-100">
          Profile Picture
          <div>
            <button
              onClick={() => { selectImage(); }}
              className="btn btn-dark border-dark d-flex justify-content-center align-items-center mt-1"
              type="button"
            >
              <i className="fa-solid fa-image font-30 me-2" />
              Choose Picture
            </button>
          </div>
          <small id="emailHelp" className="form-text text-muted d-block">{imageInfo}</small>
          <img
            alt=""
            src={profilePicSrc}
            id="profilePic"
            className="selectedImage mt-2"
          />
        </label>
        <label htmlFor="newUserName" className="text-dark w-100 mt-3">
          Display Name
          <input type="text" className="form-control mt-2" id="newUserName" value={newUserName} onChange={handleInputChange} />
        </label>
        <label htmlFor="newUserLocation" className="text-dark w-100 mt-3">
          Current Location
          <input type="text" className="form-control mt-2" id="newUserLocation" value={newUserLocation} onChange={handleInputChange} />
        </label>
        <label htmlFor="newUserWebsite" className="text-dark w-100 mt-3">
          Website
          <input type="text" className="form-control mt-2" id="newUserWebsite" value={newUserWebsite} onChange={handleInputChange} />
        </label>
        <label htmlFor="newUserBio" className="text-dark w-100 mt-3">
          Bio [Length : 200 Characters Max]
          <textarea
            style={{ resize: 'none' }}
            maxLength="200"
            className="form-control mt-2"
            id="newUserBio"
            rows="5"
            value={newUserBio}
            onChange={handleInputChange}
          />
        </label>
        <div className="btn-group mt-3 align-self-end" role="group">
          <LinkContainer to="/settings">
            <button type="button" className="btn btn-link text-dark px-4">Discard</button>
          </LinkContainer>
          <button type="submit" className="btn btn-dark border border-dark px-4">Save</button>
        </div>
      </form>
    </div>
  );
}

EditProfile.propTypes = {
  setHeader: PropTypes.func.isRequired,
};

export default AllSettings;
