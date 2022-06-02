import React, { useEffect, useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import { setNewUser, setLoggedInState } from '../../redux/loginSlice';
import { userData, fetchUserData, clearUser } from '../../redux/userDataSlice';
import './settings.css';

function AllSettings(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
  const logOut = () => {
    Cookies.remove('user_session_id');
    Cookies.remove('session-token');
    dispatch(clearUser());
    dispatch(setLoggedInState(false));
    navigate('/login');
  };
  return (
    <div className="settingsPage">
      <LinkContainer to={editProfilePage}>
        <div className="settingItem">Edit Profile</div>
      </LinkContainer>
      <LinkContainer to="/settings">
        <div className="settingItem">Change Password</div>
      </LinkContainer>
      <div className="settingItem" role="button" onClick={logOut} onKeyPress={logOut} tabIndex="0">Log Out</div>
      <LinkContainer to="/settings/">
        <div className="settingItem">Delete Account</div>
      </LinkContainer>
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
  const user = useSelector(userData);
  const [newUserName, setNewUserName] = useState('');
  const [newUserLocation, setNewUserLocation] = useState('');
  const [newUserWebsite, setNewUserWebsite] = useState('');
  const [newUserBio, setNewUserBio] = useState('');
  const [imageInfo, setImageInfo] = useState('Max File Size is 3MB');
  const [profilePicSrc, setProfilePicSrc] = useState('https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png');

  const nav = (
    <>
      <Link to="/settings" className="text-dark me-1 text-decoration-none">Settings</Link>
      <span>/</span>
      <Link to="/settings/editProfile" className="text-dark ms-1">Edit Profile</Link>
    </>
  );
  useEffect(() => {
    setNewUserName(user.name);
    setNewUserLocation(user.location);
    setNewUserWebsite(user.website);
    setNewUserBio(user.description);
    if (user.picture) setProfilePicSrc(user.picture);
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
    fetch('http://localhost:5000/updateUserInfo', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProfileInfo),
    }).then((res) => res.json()).then(async (res) => {
      if (res.success) {
        await dispatch(fetchUserData());
        navigate('/profile');
      } else {
        console.log('Update User Failed');
      }
    }).catch(() => {
      console.log('Update User Failed');
    });
  };

  const fileSelected = (e) => {
    const { files } = e.target;

    if (FileReader && files && files.length) {
      const fr = new FileReader();
      fr.onload = () => {
        if ((files[0].size / 1024) < 3072) {
          setProfilePicSrc(fr.result);
          setImageInfo('Image Upload Successful');
        } else {
          setImageInfo('Maximum File Size Exceeded');
          setProfilePicSrc(user.picture || 'https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png');
          document.getElementById('profilePic').value = null;
        }
      };
      fr.readAsDataURL(files[0]);
    } else {
      setImageInfo('Max File Size is 3MB');
      setProfilePicSrc(user.picture || 'https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png');
    }
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
      <form className="w-100 d-flex flex-column" onSubmit={submitForm}>
        <label htmlFor="profilePic" className="w-100 fw-bold">
          Profile Picture
          <input type="file" className="form-control mt-2" id="profilePic" accept="image/*" onChange={fileSelected} />
          <small id="emailHelp" className="form-text text-muted d-block">{imageInfo}</small>
          <img
            alt=""
            src={profilePicSrc}
            className="selectedImage mt-2"
          />
        </label>
        <label htmlFor="newUserName" className="w-100 mt-3 fw-bold">
          Display Name
          <input type="text" className="form-control mt-2" id="newUserName" value={newUserName} onChange={handleInputChange} />
        </label>
        <label htmlFor="newUserLocation" className="w-100 mt-3 fw-bold">
          Current Location
          <input type="text" className="form-control mt-2" id="newUserLocation" value={newUserLocation} onChange={handleInputChange} />
        </label>
        <label htmlFor="newUserWebsite" className="w-100 mt-3 fw-bold">
          Website
          <input type="text" className="form-control mt-2" id="newUserWebsite" value={newUserWebsite} onChange={handleInputChange} />
        </label>
        <label htmlFor="newUserBio" className="w-100 mt-3 fw-bold">
          Bio [Length : 200 Characters Max]
          <textarea
            type="text"
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
          <button type="submit" className="btn btn-dark px-4">Save</button>
        </div>
      </form>
    </div>
  );
}

EditProfile.propTypes = {
  setHeader: PropTypes.func.isRequired,
};

export default AllSettings;
