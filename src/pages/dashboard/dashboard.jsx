import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import {
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { isNewUser } from '../../redux/loginSlice';
import Search from '../search/search';
import Profile from '../profile/profile';
import NewExperience from '../newExperience/newExperience';
import AllSettings, { EditProfile } from '../settings/settings';
import Alert from '../../components/Alert/Alert';
import './dashboard.css';

function SideBar() {
  const { pathname } = useLocation();
  return (
    <div className="sideBar p-2">
      <div className="top-section d-flex">
        <LinkContainer to="/search">
          <button
            title="Find other travellers"
            type="button"
            className={`btn mt-3 sideBarItem ${pathname === '/search' ? 'text-light bg-dark' : ''}`}
          >
            <i className="fa-solid fa-magnifying-glass font-30" />
          </button>
        </LinkContainer>
        <LinkContainer to="/new">
          <button
            title="New Experience"
            type="button"
            className={`btn mt-3 sideBarItem ${pathname === '/new' ? 'text-light bg-dark' : ''}`}
          >
            <i className="fa-solid fa-circle-plus font-30" />
          </button>
        </LinkContainer>
      </div>
      <div className="bottom-section d-flex pb-2">
        <LinkContainer to="/profile">
          <button
            title="Profile"
            type="button"
            className={`btn mt-3 sideBarItem ${pathname === '/profile' ? 'text-light bg-dark' : ''}`}
          >
            <i className="fa-solid fa-user font-30" />
          </button>
        </LinkContainer>
        <LinkContainer to="/settings">
          <button
            title="Settings"
            type="button"
            className={`btn mt-3 sideBarItem ${pathname.startsWith('/settings') ? 'text-light bg-dark' : ''}`}
          >
            <i className="fa-solid fa-gear font-30" />
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
  const [header, setHeader] = useState('');
  const [randomUsers, setRandomUsers] = useState([]);

  useEffect(() => {
    if (newUser) {
      navigate('/settings/editProfile');
    } else if (location.pathname === '/') navigate('/profile');
    fetch('http://localhost:5000/randomUsers', {
      credentials: 'include',
    })
      .then((res) => res.json()).then((res) => {
        setRandomUsers(res.users);
      }).catch(() => {
        Alert('An Error Occured', 'danger', 'dashboardAlertPlaceHolder');
      });
  }, []);

  const showUserProfile = (id) => {
    navigate(`/search?id=${id}`);
  };

  return (
    <div className="dashboard">
      <SideBar />
      <div id="dashboardAlertPlaceHolder" />
      <div className="mainPage">
        <div className="page-header d-flex align-items-center px-3 font-20">
          {header}
        </div>
        <div>
          <Routes>
            <Route path="/search" element={<Search setHeader={setHeader} />} />
            <Route path="/search/*" element={<Search setHeader={setHeader} />} />
            <Route path="/profile" element={<Profile setHeader={setHeader} />} />
            <Route path="/new" element={<NewExperience setHeader={setHeader} />} />
            <Route path="/settings/editProfile" element={<EditProfile setHeader={setHeader} />} />
            <Route path="/settings" element={<AllSettings setHeader={setHeader} />} />
          </Routes>
        </div>
      </div>
      <div className="rightSideBar">
        <div className="discover">
          <h4 className="mb-4 mt-2">Discover</h4>
          { randomUsers.map((user, index) => (
            <div
              key={user.id}
              className="badge text-dark rounded-pill bg-light w-100 d-flex align-items-center mb-2 font-15 p-4 py-3"
              onClick={() => showUserProfile(user.id)}
              role="button"
              tabIndex={index + 20}
              onKeyDown={() => {}}
            >
              <span>
                <img
                  alt=""
                  className="smallImg me-3 border border-light"
                  src={`http://localhost:5000/photo/${user.picture}`}
                />
              </span>
              <span className="d-flex flex-column align-items-start">
                <span>{user.name}</span>
                <span className="mt-2">
                  <i className="fa-solid fa-location-dot me-2" />
                  <span className="text-secondary">{user.location}</span>
                </span>
              </span>
            </div>
          )) }
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
