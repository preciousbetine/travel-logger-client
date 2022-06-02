import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { userData } from '../../redux/userDataSlice';
import './profile.css';

function Profile(props) {
  const { setHeader } = props;
  const user = useSelector(userData);

  const nav = (
    <Link to="/profile" className="text-dark text-decoration-none">My Profile</Link>
  );
  useEffect(() => {
    setHeader(nav);
  }, []);

  return (
    <div className="profilePage">
      <div className="profileDiv">
        <img
          src={user.picture || 'https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png'}
          alt=""
          className="userImage"
        />
        <div className="d-flex justify-content-between">
          <h2 className="mt-2 displayName">{user.name}</h2>
          <LinkContainer to="/settings/editProfile">
            <button type="button" className="btn rounded-pill border-dark border-2 px-5">Edit Profile</button>
          </LinkContainer>
        </div>
        <div className="infoDisplay">
          <i className="fa-solid fa-location-dot" />
          <span className="ms-1">{user.location}</span>
          <i className="fa-solid fa-link ms-2" />
          <span className="ms-1"><a href={user.website}>{user.website}</a></span>
        </div>
        <div className="numFollow mt-1">
          <span>
            <b>{user.followersCount}</b>
            {' '}
            Followers
          </span>
          <span className="ms-2">
            <b>{user.followingCount}</b>
            {' '}
            Following
          </span>
        </div>
        <div className="mt-2">
          {user.description}
        </div>
      </div>
    </div>
  );
}

Profile.propTypes = {
  setHeader: PropTypes.func.isRequired,
};

export default Profile;
