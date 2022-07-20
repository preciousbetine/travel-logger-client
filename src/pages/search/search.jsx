/* global bootstrap */
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Experience from '../../components/experience/experience';
import Loader from '../../components/loader/loader';
import './search.css';
import { serverAddress } from '../../redux/loginSlice';

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      experiences: [],
      pageReady: false,
      currentIndex: 0,
      following: false,
    };
    this.onScroll = this.onScroll.bind(this);
    this.followUser = this.followUser.bind(this);
  }

  async componentDidMount() {
    const { server, id } = this.props;
    // Check if the currently logged in user is following this user
    let res = await fetch(`${server}/checkFollowing/${id}`, { credentials: 'include' });
    res = await res.json();
    this.setState(res);
    res = await fetch(`${server}/${id}/experiences?index=${0}`);
    res = await res.json();
    if (res.experiences.length) {
      this.setState({
        currentIndex: 10,
        experiences: res.experiences,
      });
    }
    this.setState({ pageReady: true });
    window.addEventListener('scroll', this.onScroll);
  }

  async componentDidUpdate(prevProps) {
    const { server, id } = this.props;
    if (prevProps.id !== id) {
      this.setState({ pageReady: false });
      let res = await fetch(`${server}/checkFollowing/${id}`, { credentials: 'include' });
      res = await res.json();
      this.setState(res);
      res = await fetch(`${server}/${id}/experiences?index=${0}`);
      res = await res.json();
      if (res.experiences.length) {
        this.setState({
          currentIndex: 10,
        });
      }
      this.setState({ pageReady: true, experiences: res.experiences });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }

  onScroll() {
    const { search, server, id } = this.props;
    const { currentIndex, experiences } = this.state;
    if (search.toString().trim().length === 0) return;
    if (
      document.documentElement.scrollHeight - document.documentElement.scrollTop
    <= (document.documentElement.clientHeight + 10)
    ) {
      fetch(`${server}/${id}/experiences?index=${currentIndex}`)
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

  async followUser() {
    const { server, id, reloadUser } = this.props;
    const { following } = this.state;
    if (!following) {
      let res = await fetch(`${server}/followUser/${id}`, {
        credentials: 'include',
      });
      res = await res.json();
      if (res.success) this.setState({ following: true });
    } else {
      let res = await fetch(`${server}/unfollowUser/${id}`, {
        credentials: 'include',
      });
      res = await res.json();
      if (res.success) this.setState({ following: false });
    }
    let res = await fetch(`${server}/user/${id}`);
    res = await res.json();
    reloadUser(res);
  }

  render() {
    const {
      userPicture,
      userName,
      userDescription,
      userLocation,
      userWebsite,
      userFollowers,
      userFollowing,
      server,
    } = this.props;
    const { experiences, pageReady, following } = this.state;
    return (
      <>
        <div className="profileDiv">
          <div className="coverImage bg-color2">
            <img
              src={userPicture.toString().startsWith('https://lh3.googleusercontent.com') ? userPicture : `${server}/photo/${userPicture}`}
              alt=""
              className="userImage bg-white"
            />
          </div>
          <div className="mt-5 ps-4 d-flex pb-3 flex-column justify-content-center align-items-start">
            <button
              type="button"
              onClick={this.followUser}
              className={`btn border border-2 rounded-pill align-self-end me-2 px-4 ${following ? 'btn-black' : 'btn-light'}`}
              id="followUserButton"
            >
              {
                following ? 'Unfollow' : 'Follow'
              }
            </button>
            <h4 className="m-0 mt-4">{userName}</h4>
            <h5 className="text-secondary m-0 font-15">Joined 2022</h5>
            <div className="text-secondary p-3 ps-0">{userDescription}</div>
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
              <div className="mt-2">
                <LinkContainer to="/followers">
                  <span role="button" className="me-2 hover-underline">
                    <span className="fw-bold">{userFollowers}</span>
                    {' '}
                    <span>Followers</span>
                  </span>
                </LinkContainer>
                <LinkContainer to="/followers">
                  <span role="button" className="hover-underline">
                    <span className="fw-bold">{userFollowing}</span>
                    {' '}
                    <span>Following</span>
                  </span>
                </LinkContainer>
              </div>
            </div>
          </div>
        </div>
        <div>
          <table className="table table-borderless">
            <thead>
              <tr>
                <th className="ps-4 pb-3">
                  <span className="experienceHeader">Posts</span>
                </th>
              </tr>
            </thead>
            {
                pageReady ? (
                  <tbody>
                    {
                      (experiences.length > 0) ? (
                        experiences.map(
                          (experience) => (
                            <Experience
                              key={experience.datePosted}
                              datePosted={experience.datePosted}
                              experienceName={experience.experienceName}
                              images={experience.images}
                              userName={userName}
                              userImage={userPicture}
                              description={experience.description}
                              deleteExperience={() => {}}
                              showDeleteOption={false}
                            />
                          ),
                        )
                      ) : (
                        <tr>
                          <td className="text-center mt-5 text-secondary py-5">
                            <i className="fa-solid fa-file font-30" />
                            <div>This user has not posted anything yet.</div>
                          </td>
                        </tr>
                      )
                    }
                  </tbody>
                ) : (
                  <tbody>
                    <tr>
                      <td>
                        <Loader />
                      </td>
                    </tr>
                  </tbody>
                )
              }
          </table>
        </div>
      </>
    );
  }
}

function Search(props) {
  const { setHeader } = props;
  const { search } = useLocation();
  const [user, setUser] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [pageReady, setPageReady] = useState(false);
  const id = new URLSearchParams(search).get('id');
  const navigate = useNavigate();
  const server = useSelector(serverAddress);

  const userNav = (userToSet) => (
    <div className="d-flex align-items-center h-100">
      <button className="btn btn-link p-0 ps-2" type="button" onClick={() => { navigate(-1); }}>
        <i className="fa-solid fa-arrow-left-long me-3 text-color2 font-20" />
      </button>
      <div>
        <h3 className="text-dark m-0 font-20">{userToSet.name}</h3>
        <h4 className="text-dark m-0 font-10">{userToSet.location}</h4>
      </div>
    </div>
  );

  useEffect(() => {
    async function work() {
      let res = await fetch(`${server}/user/${id}`);
      res = await res.json();
      setUser(res);
      setHeader(userNav(res));
      setPageReady(true);
    }

    if (id) work();
  }, [id]);

  const searchDatabase = async (e) => {
    if (e.target.value.trim().length === 0) { setSearchResults([]); } else {
      let result;
      try {
        result = await fetch(`${server}/searchUser/${e.target.value.trim()}`);
      } catch {
        const toast = new bootstrap.Toast(document.getElementById('noInternetToast'));
        toast.show();
      }
      result = await result.json();
      setSearchResults(result.users);
    }
  };

  const nav = (
    <div className="d-flex align-items-center h-100">
      <div className="search-user-div p-2 mt-3 d-flex align-items-center w-100 bg-white border rounded-pill px-3 focus-border-black">
        <i className="fa fa-search d-inline-block search-icon me-2" />
        <input
          className="font-15 p-1 content-only d-inline-block w-100"
          placeholder="Start Typing To Search..."
          onChange={searchDatabase}
        />
      </div>
    </div>
  );

  useEffect(() => {
    if (id) {
      setHeader(userNav(user));
    } else setHeader(nav);
  }, [id]);

  const showUserProfile = (userId) => {
    navigate(`/search?id=${userId}`);
  };

  return (
    <div className="searchPage">
      <div className="toast-container position-fixed bottom-0 end-0 p-3 toast-sm">
        <div id="errorToast" className="toast m-0 w-100" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-body d-flex align-items-center bg-danger text-light">
            An Error Occured!
          </div>
        </div>
      </div>
      <div className="toast-container position-fixed bottom-0 end-0 p-3 toast-sm">
        <div id="noInternetToast" className="toast m-0 w-100" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-body d-flex align-items-center bg-danger text-light">
            🍳 Connection Lost!
          </div>
        </div>
      </div>
      {id ? (
        <div>
          {
          pageReady ? (
            <UserProfile
              userName={user.name}
              userLocation={user.location}
              userPicture={user.picture}
              userDescription={user.description}
              userWebsite={user.website}
              userFollowing={user.following.length}
              userFollowers={user.followers.length}
              server={server}
              id={id}
              search={search}
              reloadUser={setUser}
            />
          ) : <Loader />
        }
        </div>
      ) : (
        <div>
          <div className="px-3">
            {
              searchResults.map(
                (result, index) => (
                  <div
                    key={result.id}
                    onClick={() => showUserProfile(result.id)}
                    role="button"
                    tabIndex={index + 40}
                    onKeyDown={() => {}}
                    className="searchResult my-2 p-2 d-flex align-items-center rounded-pill"
                  >
                    <img
                      alt=""
                      className="resultImage me-3 border border-light"
                      src={result.picture.startsWith('https://lh3.googleusercontent.com') ? result.picture : `${server}/photo/${result.picture}`}
                    />
                    <span className="d-flex flex-column align-items-start">
                      <span>{result.name}</span>
                    </span>
                  </div>
                ),
              )
            }
          </div>
        </div>
      )}
    </div>
  );
}

Search.propTypes = {
  setHeader: PropTypes.func.isRequired,
};

UserProfile.propTypes = {
  userName: PropTypes.string.isRequired,
  userLocation: PropTypes.string.isRequired,
  userPicture: PropTypes.string.isRequired,
  userDescription: PropTypes.string.isRequired,
  userWebsite: PropTypes.string.isRequired,
  userFollowers: PropTypes.number.isRequired,
  userFollowing: PropTypes.number.isRequired,
  server: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired,
  reloadUser: PropTypes.func.isRequired,
};

export default Search;
