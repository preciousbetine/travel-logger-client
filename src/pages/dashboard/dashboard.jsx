/* eslint-disable react/style-prop-object */
/* global bootstrap */
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import {
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { isNewUser, serverAddress } from '../../redux/loginSlice';
import Home from '../home/home';
import Search from '../search/search';
import Profile from '../profile/profile';
import NewExperience from '../newExperience/newExperience';
import AllSettings, { EditProfile } from '../settings/settings';
import './dashboard.css';
import UpdateCredentials from '../updateCredentials/updateCredentials';

function SideBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [editProfileModal, setEditProfileModal] = useState(null);
  useEffect(() => {
    if (pathname === '/settings/editProfile') {
      const modal = new bootstrap.Modal(document.getElementById('editProfileDialog'));
      if (modal) {
        setEditProfileModal(modal);
        window.editProfileModal = modal;
        document.getElementById('editProfileDialog').addEventListener('hidden.bs.modal', () => {
          navigate('/profile');
        });
        document.getElementById('editProfileDialog').addEventListener('shown.bs.modal', () => {
          document.getElementById('newUserName').focus();
        });
        modal.show();
      }
    } else if (editProfileModal) {
      editProfileModal.hide();
    }
  }, [pathname]);
  return (
    <div className="sideBar">
      <div id="lgSideBar">
        <div className="top-section d-flex">
          <LinkContainer to="/home">
            <button
              title="Home"
              type="button"
              className="btn mt-3 sideBarItem"
            >
              <svg x="0px" y="0px" width="25px" height="22px" viewBox="0 0 550 550">
                <path
                  fill={`${pathname === '/home' ? '#000000' : '#ffffff'}`}
                  stroke="#000000"
                  strokeWidth="30"
                  d="M276.462,3.693L276.462,3.693L276.462,3.693L276.462,3.693L0,242.311l27.551,31.92l35.408-30.58v305.567H221.08V385.688    h55.382l0,0h55.382v163.531h158.119V243.657l35.403,30.583l27.546-31.923L276.462,3.693z M276.462,261.906    c-33.82,0-61.237-27.417-61.237-61.234c0-33.814,27.422-61.232,61.237-61.232c33.816,0,61.227,27.418,61.227,61.232    C337.688,234.483,310.278,261.906,276.462,261.906z"
                />
              </svg>
            </button>
          </LinkContainer>
          <LinkContainer to="/search">
            <button
              title="Search"
              type="button"
              className="btn mt-3 sideBarItem"
            >
              <svg x="0px" y="0px" width="25px" height="22px" viewBox="-20 -20 550 550">
                <path fill="#ffffff" stroke="#000000" strokeWidth={`${pathname === '/search' ? '50' : '30'}`} d="M484.1,454.796l-110.5-110.6c29.8-36.3,47.6-82.8,47.6-133.4c0-116.3-94.3-210.6-210.6-210.6S0,94.496,0,210.796   s94.3,210.6,210.6,210.6c50.8,0,97.4-18,133.8-48l110.5,110.5c12.9,11.8,25,4.2,29.2,0C492.5,475.596,492.5,463.096,484.1,454.796z    M41.1,210.796c0-93.6,75.9-169.5,169.5-169.5s169.6,75.9,169.6,169.5s-75.9,169.5-169.5,169.5S41.1,304.396,41.1,210.796z" />
              </svg>
            </button>
          </LinkContainer>
          <button
            title="New Post"
            type="button"
            className="btn mt-3 sideBarItem"
            onClick={() => {
              const modal = new bootstrap.Modal(document.getElementById('newPostModal'));
              window.newPostModal = modal;
              modal.show();
            }}
          >
            <svg x="0px" y="0px" width="22px" height="22px" viewBox="-2 0 53 53">
              <path stroke="#000000" strokeWidth="1" d="M45.707,10.074l-9.794-9.782C35.726,0.105,35.471,0,35.206,0H8C7.447,0,7,0.447,7,1v51c0,0.553,0.447,1,1,1h37    c0.553,0,1-0.447,1-1V10.782C46,10.517,45.895,10.263,45.707,10.074z M42.586,10H36V3.414L42.586,10z M9,51V2h25v9    c0,0.553,0.447,1,1,1h9v39H9z" />
              <path d="M40.5,39H35v-6c0-0.553-0.447-1-1-1s-1,0.447-1,1v6h-6c-0.553,0-1,0.447-1,1s0.447,1,1,1h6v6c0,0.553,0.447,1,1,1    s1-0.447,1-1v-6h5.5c0.553,0,1-0.447,1-1S41.053,39,40.5,39z" />
            </svg>
          </button>
        </div>
        <div className="bottom-section d-flex pb-2">
          <LinkContainer to="/profile">
            <button
              title="Profile"
              type="button"
              className="btn mt-3 sideBarItem"
            >
              <svg x="0px" y="0px" width="22px" height="30px" viewBox="0 0 60 60">
                <path fill={`${pathname === '/profile' ? '#000000' : '#ffffff'}`} stroke="#000000" strokeWidth="4" d="M48.014,42.889l-9.553-4.776C37.56,37.662,37,36.756,37,35.748v-3.381c0.229-0.28,0.47-0.599,0.719-0.951  c1.239-1.75,2.232-3.698,2.954-5.799C42.084,24.97,43,23.575,43,22v-4c0-0.963-0.36-1.896-1-2.625v-5.319  c0.056-0.55,0.276-3.824-2.092-6.525C37.854,1.188,34.521,0,30,0s-7.854,1.188-9.908,3.53C17.724,6.231,17.944,9.506,18,10.056  v5.319c-0.64,0.729-1,1.662-1,2.625v4c0,1.217,0.553,2.352,1.497,3.109c0.916,3.627,2.833,6.36,3.503,7.237v3.309  c0,0.968-0.528,1.856-1.377,2.32l-8.921,4.866C8.801,44.424,7,47.458,7,50.762V54c0,4.746,15.045,6,23,6s23-1.254,23-6v-3.043  C53,47.519,51.089,44.427,48.014,42.889z" />
              </svg>
            </button>
          </LinkContainer>
          <LinkContainer to="/settings">
            <button
              title="Settings"
              type="button"
              className="btn mt-3 sideBarItem"
            >
              <svg x="0px" y="0px" width="25px" height="30px" viewBox="-50 -30 600 600">
                <path fill="#ffffff" stroke="#000000" strokeWidth={`${pathname === '/settings' ? '50' : '30'}`} d="M491.584,192.576l-55.918-6.914c-0.919-2.351-1.884-4.681-2.892-6.991l34.648-44.429    c7.227-9.266,6.412-22.464-1.901-30.773l-57.028-56.996c-8.31-8.304-21.501-9.114-30.762-1.891l-44.414,34.633    c-2.31-1.01-4.642-1.975-6.994-2.895l-6.915-55.903C317.966,8.755,308.061,0,296.311,0h-80.635    c-11.748,0-21.655,8.758-23.097,20.416l-6.912,55.904c-2.351,0.92-4.682,1.884-6.988,2.892l-44.417-34.641    c-9.266-7.225-22.46-6.414-30.768,1.893l-57.021,57.009c-8.308,8.307-9.123,21.506-1.896,30.771l34.644,44.417    c-1.01,2.312-1.977,4.647-2.898,7.002l-55.906,6.915C8.757,194.02,0,203.925,0,215.675v80.64c0,11.751,8.758,21.658,20.421,23.099    l55.9,6.901c0.92,2.354,1.885,4.686,2.894,6.994l-34.639,44.42c-7.224,9.264-6.412,22.46,1.894,30.766l57.021,57.031    c8.307,8.308,21.507,9.123,30.771,1.896l44.418-34.648c2.306,1.007,4.636,1.972,6.985,2.889l6.914,55.921    C194.02,503.245,203.926,512,215.676,512h80.637c11.748,0,21.654-8.755,23.097-20.415l6.915-55.921    c2.352-0.919,4.684-1.884,6.993-2.892l44.424,34.65c9.269,7.227,22.463,6.412,30.773-1.897l57.015-57.031    c8.305-8.307,9.117-21.504,1.891-30.767l-34.639-44.409c1.01-2.313,1.977-4.648,2.897-7.004l55.9-6.903    C503.242,317.971,512,308.066,512,296.313v-80.64C512,203.925,503.243,194.019,491.584,192.576z M255.997,310.301    c-29.941,0-54.3-24.354-54.3-54.294c0-29.946,24.359-54.309,54.3-54.309c29.944,0,54.306,24.363,54.306,54.309    C310.303,285.947,285.941,310.301,255.997,310.301z" />
              </svg>
            </button>
          </LinkContainer>
        </div>
      </div>
      <div id="smSideBar">
        <LinkContainer to="/home">
          <button
            title="Home"
            type="button"
            className="btn mt-3 sideBarItem"
          >
            <i className={`fa-solid fa-house text-color1 p-2 rounded-3 ${pathname === '/home' ? 'font-20 text-color2' : 'font-25'}`} />
          </button>
        </LinkContainer>
        <LinkContainer to="/search">
          <button
            title="Search"
            type="button"
            className="btn mt-3 sideBarItem"
          >
            <i className={`fa-solid fa-magnifying-glass text-color1 p-2 rounded-3 ${pathname === '/search' ? 'font-20 text-color2' : 'font-25'}`} />
          </button>
        </LinkContainer>
        <button
          title="New Post"
          type="button"
          className={`btn mt-3 sideBarItem ${pathname === '/new' ? '' : ''}`}
          onClick={() => {
            const modal = new bootstrap.Modal(document.getElementById('newPostModal'));
            window.newPostModal = modal;
            modal.show();
          }}
        >
          <svg x="0px" y="0px" width="22px" height="22px" viewBox="0 0 53 53">
            <path d="M45.707,10.074l-9.794-9.782C35.726,0.105,35.471,0,35.206,0H8C7.447,0,7,0.447,7,1v51c0,0.553,0.447,1,1,1h37    c0.553,0,1-0.447,1-1V10.782C46,10.517,45.895,10.263,45.707,10.074z M42.586,10H36V3.414L42.586,10z M9,51V2h25v9    c0,0.553,0.447,1,1,1h9v39H9z" />
            <path d="M40.5,39H35v-6c0-0.553-0.447-1-1-1s-1,0.447-1,1v6h-6c-0.553,0-1,0.447-1,1s0.447,1,1,1h6v6c0,0.553,0.447,1,1,1    s1-0.447,1-1v-6h5.5c0.553,0,1-0.447,1-1S41.053,39,40.5,39z" />
          </svg>
        </button>
        <LinkContainer to="/profile">
          <button
            title="Profile"
            type="button"
            className="btn mt-3 sideBarItem"
          >
            <i className={`fa-solid text-color1 fa-user p-2 rounded-3 ${pathname === '/profile' ? 'font-20 text-color2' : 'font-25'}`} />
          </button>
        </LinkContainer>
        <LinkContainer to="/settings">
          <button
            title="Settings"
            type="button"
            className="btn mt-3 sideBarItem"
          >
            <i className={`fa-solid text-color1 fa-gear p-2 rounded-3 ${pathname === '/settings' ? 'font-20 text-color2' : 'font-25'}`} />
          </button>
        </LinkContainer>
      </div>
    </div>
  );
}

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const newUser = useSelector(isNewUser);
  const server = useSelector(serverAddress);
  const [header, setHeader] = useState('');
  const [randomUsers, setRandomUsers] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (newUser) {
      navigate('/settings/editProfile');
    } else if (location.pathname === '/') navigate('/profile');
    fetch(`${server}/randomUsers`, {
      credentials: 'include',
    })
      .then((res) => res.json()).then((res) => {
        setRandomUsers(res.users);
      }).catch(() => {
        const toast = new bootstrap.Toast(document.getElementById('dashboardErrorToast'));
        toast.show();
      });
  }, []);

  const showUserProfile = (id) => {
    navigate(`/search?id=${id}`);
  };

  return (
    <div className="dashboard d-flex justify-content-center h-max-content">
      <SideBar />
      <div className="toast-container position-fixed end-0 p-3 toast-sm">
        <div
          id="dashboardErrorToast"
          className="toast m-0 w-100"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-body d-flex align-items-center bg-danger text-light w-100">
            An Error Occured!
          </div>
        </div>
      </div>
      <div className="modal fade" id="newPostModal" tabIndex="-1" aria-labelledby="postExperienceLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <div className="d-flex align-items-center h-100 justify-content-between w-100">
                <h5 className="text-dark m-0">New Post</h5>
                <button className="btn btn-link m-0 p-0" title="Close" type="button" data-bs-dismiss="modal">
                  <i className="fa-solid fa-circle-xmark text-color2 font-20" />
                </button>
              </div>
            </div>
            <div className="modal-body p-0">
              <NewExperience />
            </div>
          </div>
        </div>
      </div>
      <div className="mainPage">
        <EditProfile />
        <div className="page-header align-items-center px-3 font-20">
          {header}
        </div>
        <Routes>
          <Route path="/home" element={<Home setHeader={setHeader} />} />
          <Route path="/search" element={<Search setHeader={setHeader} />} />
          <Route path="/search/*" element={<Search setHeader={setHeader} />} />
          <Route path="/profile" element={<Profile setHeader={setHeader} />} />
          <Route path="/settings/updateCredentials" element={<UpdateCredentials setHeader={setHeader} />} />
          <Route path="/settings/editProfile" element={<Profile setHeader={setHeader} />} />
          <Route path="/settings" element={<AllSettings setHeader={setHeader} />} />
        </Routes>
      </div>
      <div className="rightSideBar">
        <div className="discover pt-3">
          <h4 className="font-20 fw-bold mb-4 px-3">Discover Other Users</h4>
          { randomUsers.map((user, index) => (
            <div
              key={user.id}
              className="w-100 d-flex align-items-center user-tile px-3 py-2"
              onClick={() => showUserProfile(user.id)}
              role="button"
              tabIndex={index + 20}
              onKeyDown={() => {}}
            >
              <span>
                <img
                  alt=""
                  className="discover-img me-3"
                  src={user.picture.startsWith('https://lh3.googleusercontent.com') ? user.picture : `${server}/photo/${user.picture}`}
                />
              </span>
              <span className="d-flex flex-column align-items-start">
                <span className="font-13 fw-bold">{user.name}</span>
                {
                  user.location.trim().length ? (
                    <span>
                      <i className="fa-solid fa-location-dot me-2 font-10" />
                      <span className="text-secondary font-13">{user.location}</span>
                    </span>
                  ) : null
                }
              </span>
              <span className="ms-auto">
                <button type="button" className="btn-black rounded-pill px-3 fw-bold font-15 view-btn">View</button>
              </span>
            </div>
          )) }
          <a href="/profile" className="text-color2 font-15 d-block p-3 see-more-link">See More</a>
        </div>
        <p className="text-secondary font-13 mt-2">
          © 2022 Posts, Inc.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
