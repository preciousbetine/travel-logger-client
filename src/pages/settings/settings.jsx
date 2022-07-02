/* global bootstrap */
import React, { useEffect, useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { setNewUser, setLoggedInState, serverAddress } from '../../redux/loginSlice';
import { userData, fetchUserData, clearUser } from '../../redux/userDataSlice';
import './settings.css';

function AllSettings(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const server = useSelector(serverAddress);
  const { setHeader } = props;

  const nav = (
    <div className="d-flex align-items-center h-100">
      <i className="fa-solid fa-gear me-3 text-color2 font-20" />
      <Link to="/settings" className="text-dark text-decoration-none">Settings</Link>
    </div>
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
      <div className="modal fade" id="logOutModal" tabIndex="-1" aria-labelledby="deleteExperienceLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content mw-300 m-auto">
            <div className="modal-body">
              <h3 className="my-3">Log Out?</h3>
              <button type="button" className="w-100 btn btn-white rounded-pill border-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" className="w-100 btn bg-red text-white mt-2 rounded-pill" data-bs-dismiss="modal" onClick={logOut}>Log Out</button>
            </div>
          </div>
        </div>
      </div>
      <LinkContainer to={editProfilePage}>
        <div className="settingItem">Edit Profile</div>
      </LinkContainer>
      <LinkContainer to="/settings/updateCredentials">
        <div className="settingItem">Change Password</div>
      </LinkContainer>
      <div
        className="settingItem"
        role="button"
        onClick={() => {
          const modal = new bootstrap.Modal(document.getElementById('logOutModal'));
          modal.show();
        }}
        onKeyPress={() => {}}
        tabIndex="0"
      >
        Log Out

      </div>
    </div>
  );
}

AllSettings.propTypes = {
  setHeader: PropTypes.func.isRequired,
};

export function EditProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const server = useSelector(serverAddress);
  const user = useSelector(userData);
  const [newUserName, setNewUserName] = useState('');
  const [newUserLocation, setNewUserLocation] = useState('');
  const [newUserWebsite, setNewUserWebsite] = useState('');
  const [newUserBio, setNewUserBio] = useState('');
  const [saving, setSavingState] = useState(false);
  const [profilePicSrc, setProfilePicSrc] = useState(user.picture.startsWith('https://lh3.googleusercontent.com') ? user.picture : `${server}/photo/${user.picture}`);

  const submitForm = () => {
    setSavingState(true);
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
          setSavingState(false);
        }, 1000);
        navigate('/profile');
      } else {
        const toast = new bootstrap.Toast(document.getElementById('profileUpdateFailedToast'));
        toast.show();
        setSavingState(false);
      }
    }).catch(() => {
      const toast = new bootstrap.Toast(document.getElementById('profileUpdateFailedToast'));
      toast.show();
      setSavingState(false);
    });
  };

  useEffect(() => {
    setNewUserName(user.name);
    setNewUserLocation(user.location);
    setNewUserWebsite(user.website);
    setNewUserBio(user.description);
    dispatch(setNewUser(false));
  }, []);

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
          } else {
            setProfilePicSrc(user.picture ? `${server}/photo/${user.picture}` : 'https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png');
            document.getElementById('profilePic').value = null;
          }
        };
        fr.readAsDataURL(file);
      } else {
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
    <div className="modal fade" id="editProfileDialog" aria-labelledby="editProfileLabel" aria-hidden="true">
      <div className="toast-container position-fixed end-0 p-3 toast-sm-bottom">
        <div
          id="profileUpdateFailedToast"
          className="toast m-0 w-100"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-body d-flex align-items-center bg-danger text-light w-100">
            Profile Update Failed!
          </div>
        </div>
      </div>
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-fullscreen-sm-down">
        <div className="modal-content">
          <div className="modal-body p-0">
            <div className="d-flex align-items-center justify-content-between px-2 h-70px">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  window.editProfileModal.hide();
                  navigate(-1);
                }}
              >
                <i className="fa-solid fa-arrow-left-long" />
              </button>
              <h3 className="m-0 ms-4 me-auto font-20 text-black">Edit profile</h3>
              <button type="button" className="btn btn-black px-4 rounded-pill" onClick={submitForm}>
                {
                  saving ? 'Saving...' : 'Save'
                }
              </button>
            </div>
            <div
              className="editCoverImage bg-color2"
            >
              <img
                alt=""
                src={profilePicSrc}
                id="profilePic"
                className="editUserImage bg-white"
              />
              <i
                aria-label="Profile Pic"
                className="fa-solid fa-camera text-white"
                id="addPhotoIcon"
                onClick={() => { selectImage(); }}
                onKeyDown={() => {}}
                role="button"
                tabIndex={-2}
              />
            </div>
            <form className="w-100 d-flex flex-column mt-5 p-3">
              <label htmlFor="newUserName" className="border border-2 rounded-3 w-100 p-3 py-2 focus-border-color2 text-secondary visible-count">
                <div className="d-flex justify-content-between font-15">
                  <span>Name</span>
                  <span>
                    {newUserName.length}
                    {' '}
                    / 20
                  </span>
                </div>
                <input autoComplete="off" type="text" maxLength={20} className="d-block mt-2 content-only p-0 w-100" id="newUserName" value={newUserName} onChange={handleInputChange} />
              </label>
              <label htmlFor="newUserLocation" className="border border-2 rounded-3 w-100 p-3 py-2 mt-2 focus-border-color2 text-secondary visible-count">
                <div className="d-flex justify-content-between font-15">
                  <span>Current Location</span>
                  <span>
                    {newUserLocation.length}
                    {' '}
                    / 30
                  </span>
                </div>
                <input autoComplete="off" type="text" maxLength={30} className="d-block mt-2 content-only p-0 w-100" id="newUserLocation" value={newUserLocation} onChange={handleInputChange} />
              </label>
              <label htmlFor="newUserWebsite" className="border border-2 rounded-3 w-100 p-3 py-2 mt-2 focus-border-color2 text-secondary visible-count">
                <div className="d-flex justify-content-between font-15">
                  <span>Website</span>
                  <span>
                    {newUserWebsite.length}
                    {' '}
                    / 50
                  </span>
                </div>
                <input autoComplete="off" type="text" maxLength={50} className="d-block mt-2 content-only p-0 w-100" id="newUserWebsite" value={newUserWebsite} onChange={handleInputChange} />
              </label>
              <label htmlFor="newUserBio" className="border border-2 rounded-3 w-100 p-3 py-2 mt-2 focus-border-color2 text-secondary visible-count">
                <div className="d-flex justify-content-between font-15">
                  <span>Bio</span>
                  <span>
                    {newUserBio.length}
                    {' '}
                    / 200
                  </span>
                </div>
                <textarea
                  style={{ resize: 'none' }}
                  maxLength="200"
                  className="d-block mt-2 content-only p-0 w-100"
                  id="newUserBio"
                  rows="5"
                  value={newUserBio}
                  onChange={handleInputChange}
                />
              </label>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllSettings;
