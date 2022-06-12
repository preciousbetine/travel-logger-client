import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { userData } from '../../redux/userDataSlice';
import Experience from '../../components/experience/experience';
import './profile.css';

function Profile(props) {
  const { setHeader } = props;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [experiences, addExperiences] = useState([]);
  const user = useSelector(userData);

  const nav = (
    <Link to="/profile" className="text-dark text-decoration-none">My Profile</Link>
  );
  useEffect(() => {
    setHeader(nav);
    console.log('Fetching Experiences');
    fetch(`http://localhost:5000/myExperiences?index=${currentIndex}`, {
      credentials: 'include',
    })
      .then((res) => res.json()).then((res) => {
        setCurrentIndex(currentIndex + 10);
        addExperiences([...experiences, ...res.experiences]);
      }).catch((err) => {
        console.log('Fetch experiences failed', err);
      });
  }, []);

  return (
    <div className="profilePage">
      <div className="profileDiv">
        <img
          src={user.picture ? `http://localhost:5000/photo/${user.picture}` : 'https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png'}
          alt=""
          className="userImage"
        />
        <div className="d-flex flex-column justify-content-center align-items-start">
          <h2>{user.name}</h2>
          <div className="infoDisplay mb-1">
            <div>
              <i className="fa-solid fa-location-dot text-center w-20" />
              <span className="ms-2">{user.location}</span>
            </div>
            <div>
              <i className="fa-solid fa-link text-center w-20" />
              <span className="ms-2"><a href={`//${user.website}`} target="_blank" rel="noreferrer">{user.website}</a></span>
            </div>
          </div>
          <LinkContainer to="/settings/editProfile">
            <button type="button" className="btn p-0 btn-link text-dark">Edit Profile</button>
          </LinkContainer>
        </div>
      </div>
      <div className="pb-3">
        <table className="table">
          <thead className="bg-dark text-light">
            <tr>
              <th scope="col">My Experiences</th>
            </tr>
          </thead>
          <tbody>
            {
              experiences.map(
                (experience) => (
                  <Experience
                    key={experience.datePosted}
                    datePosted={experience.datePosted}
                    experienceName={experience.experienceName}
                    travelCost={experience.travelCost}
                    placesVisited={experience.placesVisited}
                    images={experience.images}
                  />
                ),
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

Profile.propTypes = {
  setHeader: PropTypes.func.isRequired,
};

export default Profile;
