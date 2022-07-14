/* global bootstrap */
import React from 'react';
import PropTypes from 'prop-types';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { userData } from '../../redux/userDataSlice';
import Experience from '../../components/experience/experience';
import Loader from '../../components/loader/loader';
import './profile.css';
import { serverAddress } from '../../redux/loginSlice';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: 0,
      experiences: [],
      postsLoaded: false,
      myModal: null,
      experienceToDelete: '',
    };
    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll);
    const {
      setHeader,
      userName,
      userLocation,
      server,
    } = this.props;
    const { currentIndex, experiences } = this.state;
    const nav = (
      <div className="d-flex align-items-center h-100">
        <i className="fa-solid fa-arrow-left me-4 text-color2 font-20" />
        <span>
          <h6 className="m-0 font-15">{userName}</h6>
          <h6 className="text-secondary m-0 font-13">{userLocation}</h6>
        </span>
      </div>
    );
    setHeader(nav);
    fetch(`${server}/myExperiences?index=${currentIndex}`, {
      credentials: 'include',
    })
      .then((res) => res.json()).then((res) => {
        this.setState({
          currentIndex: 10,
          experiences: [...experiences, ...res.experiences],
          postsLoaded: true,
        });
      }).catch(() => {
        const toast = new bootstrap.Toast(document.getElementById('errorToast'));
        toast.show();
      });
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }

  onScroll() {
    const { server } = this.props;
    const { currentIndex, experiences } = this.state;
    if (
      document.documentElement.scrollHeight - document.documentElement.scrollTop
    <= (document.documentElement.clientHeight + 10)
    ) {
      fetch(`${server}/myExperiences?index=${currentIndex}`, {
        credentials: 'include',
      })
        .then((res) => res.json()).then((res) => {
          if (res.experiences.length > 0) {
            this.setState({
              currentIndex: currentIndex + 10,
              experiences: [...experiences, ...res.experiences],
            });
          }
        }).catch(() => {
          const toast = new bootstrap.Toast(document.getElementById('errorToast'));
          toast.show();
        });
    }
  }

  deleteExperience() {
    const { server, navigate } = this.props;
    const { myModal, experienceToDelete } = this.state;
    fetch(`${server}/experience/${experienceToDelete}`, {
      credentials: 'include',
      method: 'DELETE',
    })
      .then((res) => res.json()).then((res) => {
        myModal.hide();
        this.setState({
          currentIndex: 10,
          experiences: res.experiences,
        });
        const toast = new bootstrap.Toast(document.getElementById('deleteToast'));
        toast.show();
      }).catch(() => {
        myModal.hide();
        navigate('/login');
      });
  }

  render() {
    const {
      userReady,
      userPicture,
      userName,
      userDescription,
      userWebsite,
      userLocation,
      server,
    } = this.props;

    const {
      postsLoaded,
      experiences,
    } = this.state;

    return (
      <div className="profilePage" id="profilePage">
        <div className="modal fade" id="deleteExperienceDialog" tabIndex="-1" aria-labelledby="deleteExperienceLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content mw-300 m-auto">
              <div className="modal-body">
                <h3 className="my-3">Delete This Experience?</h3>
                <div>This can’t be undone and it will be removed from your profile.</div>
                <button type="button" className="w-100 btn bg-red text-white mt-4 my-2 rounded-pill" onClick={this.deleteExperience}>Delete</button>
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
        <div className="profile">
          <div className="profileDiv">
            {
            userReady ? (
              <>
                <div className="coverImage bg-color2">
                  <img
                    src={userPicture.toString().startsWith('https://lh3.googleusercontent.com') ? userPicture : `${server}/photo/${userPicture}`}
                    alt=""
                    className="userImage bg-white"
                  />
                </div>
                <div className="ps-3 d-flex pb-3 flex-column justify-content-center align-items-start">
                  <LinkContainer to="/settings/editProfile">
                    <button type="button" className="btn border border-2 rounded-pill text-dark align-self-end me-2 px-4" id="editProfileButton">Edit Profile</button>
                  </LinkContainer>
                  <h4 className="m-0 font-20 mt-3">{userName}</h4>
                  <h5 className="text-secondary m-0 font-13 fw-normal">Joined 2022</h5>
                  <div className="p-3 ps-0">{userDescription}</div>
                  <div className="infoDisplay mb-1">
                    {
                      (userLocation && userLocation.trim !== '') ? (
                        <div>
                          <i className="fa-solid fa-location-dot text-secondary text-center" />
                          <span className="ms-2">{userLocation}</span>
                        </div>
                      ) : null
                    }
                    {
                      (userWebsite && userWebsite.toString().trim !== '') ? (
                        <div>
                          <i className="fa-solid fa-link text-center" />
                          <span className="ms-1"><a className="text-color2" href={`//${userWebsite}`} target="_blank" rel="noreferrer">{userWebsite}</a></span>
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
              <thead>
                <tr>
                  <th className="ps-4 pb-3">
                    <span className="experienceHeader">My Posts</span>
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
                            userName={userName}
                            userImage={userPicture}
                            deleteExperience={() => {
                              this.setState({ experienceToDelete: experience.postId });
                              const modal = new bootstrap.Modal(document.getElementById('deleteExperienceDialog'));
                              this.setState({ myModal: modal });
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
      </div>
    );
  }
}

function ProfileContainer(props) {
  const navigate = useNavigate();
  const user = useSelector(userData);
  const server = useSelector(serverAddress);

  const { setHeader } = props;
  return (
    <Profile
      setHeader={setHeader}
      userName={user.name}
      userLocation={user.location}
      userReady={user.ready}
      userPicture={user.picture}
      userDescription={user.description}
      userWebsite={user.website}
      server={server}
      navigate={navigate}
    />
  );
}

ProfileContainer.propTypes = {
  setHeader: PropTypes.func.isRequired,
};

Profile.propTypes = {
  setHeader: PropTypes.func.isRequired,
  userName: PropTypes.string.isRequired,
  userLocation: PropTypes.string.isRequired,
  userReady: PropTypes.bool.isRequired,
  userPicture: PropTypes.string.isRequired,
  userDescription: PropTypes.string.isRequired,
  userWebsite: PropTypes.string.isRequired,
  server: PropTypes.string.isRequired,
  navigate: PropTypes.func.isRequired,
};

export default ProfileContainer;
