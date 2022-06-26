/* global bootstrap */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { userData } from '../../redux/userDataSlice';
import Experience from '../../components/experience/experience';
import Loader from '../../components/loader/loader';
import './profile.css';
import { serverAddress } from '../../redux/loginSlice';

function Profile(props) {
  const { setHeader } = props;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [experiences, addExperiences] = useState([]);
  const [postsLoaded, setPostsLoaded] = useState(false);
  const [myModal, setMyModal] = useState(null);
  const [experienceToDelete, setExperienceToDelete] = useState('');
  const user = useSelector(userData);
  const navigate = useNavigate();
  const server = useSelector(serverAddress);

  const nav = (
    <div className="d-flex align-items-center h-100">
      <i className="fa-solid fa-briefcase me-3 text-color2 font-20" />
      <span>
        <h3 className="m-0 font-20">{user.name}</h3>
        <h6 className="text-secondary m-0 font-15">{user.location}</h6>
      </span>
    </div>
  );
  useEffect(() => {
    setHeader(nav);
  }, [user]);
  useEffect(() => {
    fetch(`${server}/myExperiences?index=${currentIndex}`, {
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
      fetch(`${server}/myExperiences?index=${currentIndex}`, {
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
    fetch(`${server}/experience/${experienceToDelete}`, {
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
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content mw-300 m-auto">
            <div className="modal-body">
              <h3 className="my-3">Delete This Experience?</h3>
              <div>This can’t be undone and it will be removed from your profile.</div>
              <button type="button" className="w-100 btn bg-red text-white mt-4 my-2 rounded-pill" onClick={deleteExperience}>Delete</button>
              <button type="button" className="w-100 btn btn-white me-2 rounded-pill border-secondary" data-bs-dismiss="modal">Cancel</button>
            </div>
          </div>
        </div>
      </div>
      <div className="toast-container position-fixed bottom-0 end-0 p-3 toast-sm">
        <div id="deleteToast" className="toast m-0 w-100" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-body d-flex align-items-center bg-color2 text-light">
            Experience Deleted!
          </div>
        </div>
      </div>
      <div className="toast-container position-fixed bottom-0 end-0 p-3 toast-sm">
        <div id="profileUpdatedToast" className="toast m-0 w-100" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-body d-flex align-items-center bg-color2 text-light w-100">
            Profile Updated Successfully!
          </div>
        </div>
      </div>
      <div className="toast-container position-fixed bottom-0 end-0 p-3 toast-sm">
        <div id="passwordUpdatedToast" className="toast m-0 w-100" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-body d-flex align-items-center bg-color2 text-light">
            Password Updated Successfully!
          </div>
        </div>
      </div>
      <div className="toast-container position-fixed bottom-0 end-0 p-3 toast-sm">
        <div id="errorToast" className="toast m-0 w-100" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-body d-flex align-items-center bg-danger text-light">
            An Error Occured!
          </div>
        </div>
      </div>
      <div className="toast-container position-fixed bottom-0 end-0 p-3 toast-sm">
        <div id="postToast" className="toast m-0 w-100" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-body d-flex align-items-center bg-color2 text-light w-100">
            Experience Posted
          </div>
        </div>
      </div>
      <div className="profileDiv">
        {
          user.ready ? (
            <>
              <div className="coverImage bg-color2">
                <img
                  src={user.picture ? `${server}/photo/${user.picture}` : 'https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png'}
                  alt=""
                  className="userImage bg-white"
                />
              </div>
              <div className="ps-3 d-flex pb-3 flex-column justify-content-center align-items-start">
                <LinkContainer to="/settings/editProfile">
                  <button type="button" className="btn border border-2 rounded-pill text-dark align-self-end me-2 px-4" id="editProfileButton">Edit Profile</button>
                </LinkContainer>
                <h4 className="m-0">{user.name}</h4>
                <h5 className="text-secondary m-0 font-15">Joined 2022</h5>
                <div className="text-secondary p-3 ps-0">{user.description}</div>
                <div className="infoDisplay mb-1">
                  {
                    (user.location && user.location.trim !== '') ? (
                      <div>
                        <i className="fa-solid fa-location-dot text-secondary text-center" />
                        <span className="ms-2">{user.location}</span>
                      </div>
                    ) : null
                  }
                  {
                    (user.website && user.website.trim !== '') ? (
                      <div>
                        <i className="fa-solid fa-link text-center" />
                        <span className="ms-1"><a className="text-color2" href={`//${user.website}`} target="_blank" rel="noreferrer">{user.website}</a></span>
                      </div>
                    ) : null
                  }
                </div>
              </div>
            </>
          ) : <Loader />
        }
      </div>
      <div>
        <table className="table table-borderless">
          <thead className="">
            <tr>
              <th className="ps-4 pb-3">
                <span className="experienceHeader">Experiences</span>
              </th>
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
