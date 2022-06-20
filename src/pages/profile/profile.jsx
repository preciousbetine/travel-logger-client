/* global bootstrap */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { LinkContainer } from 'react-router-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { userData } from '../../redux/userDataSlice';
import Experience from '../../components/experience/experience';
import Loader from '../../components/loader/loader';
import './profile.css';

function Profile(props) {
  const { setHeader } = props;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [experiences, addExperiences] = useState([]);
  const [postsLoaded, setPostsLoaded] = useState(false);
  const [myModal, setMyModal] = useState(null);
  const [experienceToDelete, setExperienceToDelete] = useState('');
  const user = useSelector(userData);
  const navigate = useNavigate();

  const nav = (
    <Link to="/profile" className="text-dark text-decoration-none">My Profile</Link>
  );
  useEffect(() => {
    setHeader(nav);
  }, []);
  useEffect(() => {
    fetch(`${window.server}/myExperiences?index=${currentIndex}`, {
      credentials: 'include',
    })
      .then((res) => res.json()).then((res) => {
        setCurrentIndex(10);
        addExperiences([...experiences, ...res.experiences]);
        setPostsLoaded(true);
      }).catch(() => {
        const toast = new bootstrap.Toast(document.getElementById('errorToast'));
        toast.show();
      });
  }, []);

  const onScroll = (e) => {
    if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop <= e.currentTarget.clientHeight) {
      fetch(`${window.server}/myExperiences?index=${currentIndex}`, {
        credentials: 'include',
      })
        .then((res) => res.json()).then((res) => {
          if (res.experiences.length > 0) {
            setCurrentIndex(currentIndex + 10);
            addExperiences([...experiences, ...res.experiences]);
          }
        }).catch(() => {
          myModal.hide();
          navigate('/login');
        });
    }
  };

  const deleteExperience = () => {
    fetch(`${window.server}/experience/${experienceToDelete}`, {
      credentials: 'include',
      method: 'DELETE',
    })
      .then((res) => res.json()).then((res) => {
        myModal.hide();
        setCurrentIndex(10);
        addExperiences([...res.experiences]);
        const toast = new bootstrap.Toast(document.getElementById('deleteToast'));
        toast.show();
      }).catch(() => {
        myModal.hide();
        navigate('/login');
      });
  };

  return (
    <div className="profilePage" id="profilePage" onScroll={onScroll}>
      <div className="modal fade" id="deleteExperienceDialog" tabIndex="-1" aria-labelledby="deleteExperienceLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header bg-danger">
              <h5 className="modal-title text-white" id="deleteExperienceLabel">Delete this experience?</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body d-flex justify-content-between align-items-center">
              <span>This cannot be undone</span>
              <span>
                <button type="button" className="btn btn-link text-secondary me-2" data-bs-dismiss="modal">Cancel</button>
                <button type="button" className="btn btn-danger" onClick={deleteExperience}>Delete</button>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        <div id="deleteToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-body d-flex align-items-center bg-danger text-light">
            Experience Deleted!
          </div>
        </div>
      </div>
      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        <div id="profileUpdatedToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-body d-flex align-items-center bg-success text-light">
            Profile Updated Successfully!
          </div>
        </div>
      </div>
      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        <div id="errorToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-body d-flex align-items-center bg-danger text-light">
            An Error Occured!
          </div>
        </div>
      </div>
      <div className="toast-container position-fixed w-100 bottom-0 start-0 p-3 d-flex justify-content-end">
        <div id="postToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-body d-flex align-items-center bg-success text-light">
            Experience Posted
          </div>
        </div>
      </div>
      <div className="profileDiv">
        {
          user.ready ? (
            <>
              <img
                src={user.picture ? `${window.server}/photo/${user.picture}` : 'https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png'}
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
            </>
          ) : <Loader />
        }
      </div>
      <div className="pb-3">
        <table className={`table ${experiences.length > 0 ? 'table-striped' : ''}`}>
          <thead className="">
            <tr>
              <th className="col ps-4">My Experiences</th>
            </tr>
          </thead>
          <tbody>
            {
              postsLoaded ? (
                <>
                  {
                    (experiences.length > 0) ? (experiences.map(
                      (experience) => (
                        <Experience
                          key={experience.datePosted}
                          datePosted={experience.datePosted}
                          experienceName={experience.experienceName}
                          images={experience.images}
                          postId={experience.postId}
                          description={experience.description}
                          deleteExperience={() => {
                            setExperienceToDelete(experience.postId);
                            const modal = new bootstrap.Modal(document.getElementById('deleteExperienceDialog'));
                            setMyModal(modal);
                            modal.show();
                          }}
                          showDeleteOption
                        />
                      ),
                    )) : (
                      <tr>
                        <td>
                          <div className="text-center mt-5 text-secondary">
                            <i className="fa-solid fa-file font-30" />
                            <div>You have not shared any experiences yet.</div>
                            <button
                              type="button"
                              onClick={() => {
                                const modal = new bootstrap.Modal(document.getElementById('newPostModal'));
                                window.newPostModal = modal;
                                modal.show();
                              }}
                              className="btn bg-secondary text-light my-2"
                            >
                              Share a New Experience
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  }
                  <tr />
                </>
              )
                : (
                  <tr>
                    <td>
                      <Loader />
                    </td>
                  </tr>
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
