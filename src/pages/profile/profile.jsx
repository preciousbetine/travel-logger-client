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

  const onScroll = (e) => {
    if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop <= e.currentTarget.clientHeight) {
      fetch(`http://localhost:5000/myExperiences?index=${currentIndex}`, {
        credentials: 'include',
      })
        .then((res) => res.json()).then((res) => {
          if (res.experiences.length > 0) {
            setCurrentIndex(currentIndex + 10);
            addExperiences([...experiences, ...res.experiences]);
          }
        }).catch((err) => {
          console.log('Fetch experiences failed', err);
        });
    }
  };

  const deleteExperience = (id) => {
    console.log(id);
    fetch(`http://localhost:5000/experience/${id}`, {
      credentials: 'include',
      method: 'DELETE',
    })
      .then((res) => res.json()).then((res) => {
        setCurrentIndex(10);
        addExperiences([...res.experiences]);
      }).catch((err) => {
        console.log('Fetch experiences failed', err);
      });
  };

  return (
    <div className="profilePage" id="profilePage" onScroll={onScroll}>
      <div className="profileDiv">
        <img
          src={user.picture ? `http://localhost:5000/photo/${user.picture}` : 'https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png'}
          alt=""
          className="userImage"
        />
        <div className="d-flex flex-column justify-content-center align-items-start">
          <h2>{user.name}</h2>
          <div className="infoDisplay mb-1">
            {
              (user.location && user.location.trim !== '') ? (
                <div>
                  <i className="fa-solid fa-location-dot text-center w-20" />
                  <span className="ms-2">{user.location}</span>
                </div>
              ) : null
            }
            {
              (user.website && user.website.trim !== '') ? (
                <div>
                  <i className="fa-solid fa-link text-center w-20" />
                  <span className="ms-2"><a href={`//${user.website}`} target="_blank" rel="noreferrer">{user.website}</a></span>
                </div>
              ) : null
            }
            <div className="text-secondary px-2 pt-2">{user.description}</div>
          </div>
          <LinkContainer to="/settings/editProfile">
            <button type="button" className="btn p-0 btn-link text-dark">Edit Profile</button>
          </LinkContainer>
        </div>
      </div>
      <div className="pb-3">
        <table className="table table-striped">
          <thead className="">
            <tr>
              <th className="col ps-4">My Experiences</th>
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
                    images={experience.images}
                    description={experience.description}
                    deleteExperience={() => {
                      deleteExperience(experience.postId);
                      document.getElementById('profilePage').scrollTop = 0;
                    }}
                    showDeleteOption
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
