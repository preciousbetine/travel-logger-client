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
import './dashboard.css';

function SideBar() {
  const { pathname } = useLocation();
  return (
    <div className="sideBar p-2">
      <div className="top-section d-flex flex-column">
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
      <div className="bottom-section d-flex flex-column pb-2">
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
            <Route path="/search" element={<Search setHeader={setHeader} />} />
            <Route path="/profile" element={<Profile setHeader={setHeader} />} />
            <Route path="/new" element={<NewExperience setHeader={setHeader} />} />
            <Route path="/settings/editProfile" element={<EditProfile setHeader={setHeader} />} />
            <Route path="/settings" element={<AllSettings setHeader={setHeader} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
