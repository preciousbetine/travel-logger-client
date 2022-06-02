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
import Notifications from '../notifications/notifications';
import Search from '../search/search';
import Profile from '../profile/profile';
import AllSettings, { EditProfile } from '../settings/settings';
import './dashboard.css';

function SideBar() {
  const { pathname } = useLocation();
  return (
    <div className="sideBar p-2">
      <div className="top-section d-flex flex-column">
        <LinkContainer to="/notifications">
          <button
            title="Notifications"
            type="button"
            className={`btn mt-3 sideBarItem ${pathname === '/notifications' ? 'bg-dark text-white' : ''}`}
          >
            <i className="fa-solid fa-bell font-30" />
          </button>
        </LinkContainer>
        <LinkContainer to="/search">
          <button
            title="Messages"
            type="button"
            className={`btn mt-3 sideBarItem ${pathname === '/search' ? 'bg-dark text-white' : ''}`}
          >
            <i className="fa-solid fa-magnifying-glass font-30" />
          </button>
        </LinkContainer>
        <button
          title="New Post"
          type="button"
          className={`btn mt-3 sideBarItem ${pathname === '/newPost' ? 'bg-dark text-white' : ''}`}
        >
          <i className="fa-solid fa-circle-plus font-30" />
        </button>
      </div>
      <div className="bottom-section d-flex flex-column pb-2">
        <LinkContainer to="/profile">
          <button
            title="Profile"
            type="button"
            className={`btn mt-3 sideBarItem ${pathname === '/profile' ? 'bg-dark text-white' : ''}`}
          >
            <i className="fa-solid fa-user font-30" />
          </button>
        </LinkContainer>
        <LinkContainer to="/settings">
          <button
            title="Settings"
            type="button"
            className={`btn mt-3 sideBarItem ${pathname.startsWith('/settings') ? 'bg-dark text-white' : ''}`}
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
  useEffect(() => {
    if (newUser) {
      navigate('/settings/editProfile');
    } else if (location.pathname === '/') navigate('/profile');
  });
  return (
    <div className="dashboard d-flex justify-content-center align-items-between">
      <SideBar />
      <div className="mainPage">
        <div className="page-header d-flex align-items-center px-3 font-20">
          {header}
        </div>
        <div>
          <Routes>
            <Route path="/notifications" element={<Notifications setHeader={setHeader} />} />
            <Route path="/search" element={<Search setHeader={setHeader} />} />
            <Route path="/profile" element={<Profile setHeader={setHeader} />} />
            <Route path="/settings/editProfile" element={<EditProfile setHeader={setHeader} />} />
            <Route path="/settings" element={<AllSettings setHeader={setHeader} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
