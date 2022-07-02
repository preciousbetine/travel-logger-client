/* global bootstrap */
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Experience from '../../components/experience/experience';
import Loader from '../../components/loader/loader';
import './search.css';
import { serverAddress } from '../../redux/loginSlice';

function Search(props) {
  const { setHeader } = props;
  const { search } = useLocation();
  const [user, setUser] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [experiences, addExperiences] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [pageReady, setPageReady] = useState(false);
  const id = new URLSearchParams(search).get('id');
  const navigate = useNavigate();
  const server = useSelector(serverAddress);

  const nav = (
    <div className="d-flex align-items-center h-100">
      <i className="fa-solid fa-briefcase me-3 text-color2 font-20" />
      <Link to="/search" className="text-dark text-decoration-none h3 m-0 font-20">Find Other Travellers</Link>
    </div>
  );

  const userNav = (
    <div className="d-flex align-items-center h-100">
      <button className="btn btn-link p-0 ps-2" type="button" onClick={() => { navigate(-1); }}>
        <i className="fa-solid fa-arrow-left-long me-3 text-color2 font-20" />
      </button>
      <Link to="/search" className="text-dark text-decoration-none h3 m-0 font-20">Find Other Travellers</Link>
    </div>
  );

  useEffect(() => {
    async function work() {
      let res = await fetch(`${server}/user/${id}`);
      res = await res.json();
      setUser(res);

      res = await fetch(`${server}/${id}/experiences?index=${0}`);
      res = await res.json();
      if (res.experiences.length) {
        setCurrentIndex(10);
        addExperiences([...res.experiences]);
      } else {
        setCurrentIndex(0);
        addExperiences([]);
      }
      setPageReady(true);
    }

    if (id) work();
  }, [id]);

  useEffect(() => {
    if (id) {
      setHeader(userNav);
    } else setHeader(nav);
  }, [id]);

  const onScroll = (e) => {
    if (search.trim().length === 0) return;
    if (
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop
      <= (e.currentTarget.clientHeight + 10)
    ) {
      fetch(`${server}/${id}/experiences?index=${currentIndex}`)
        .then((res) => res.json()).then((res) => {
          if (res.experiences.length > 0) {
            setCurrentIndex(currentIndex + 10);
            addExperiences([...experiences, ...res.experiences]);
          }
        }).catch(() => {
          const toast = new bootstrap.Toast(document.getElementById('errorToast'));
          toast.show();
        });
    }
  };

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

  const showUserProfile = (userId) => {
    navigate(`/search?id=${userId}`);
  };

  return (
    <div className="searchPage" onScroll={onScroll}>
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
        <>
          <div className="profileDiv">
            {
              pageReady ? (
                <>
                  <div className="coverImage bg-color2">
                    <img
                      src={user.picture.startsWith('https://lh3.googleusercontent.com') ? user.picture : `${server}/photo/${user.picture}`}
                      alt=""
                      className="userImage bg-white"
                    />
                  </div>
                  <div className="mt-5 ps-4 d-flex pb-3 flex-column justify-content-center align-items-start">
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
              ) : (
                <Loader />
              )
            }
          </div>
          <div>
            <table className="table table-borderless">
              <thead>
                <tr>
                  <th className="ps-4 pb-3">
                    <span className="experienceHeader">Experiences</span>
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
                              userName={user.name}
                              userImage={user.picture}
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
                            <div>This user has not posted any experiences yet.</div>
                          </td>
                        </tr>
                      )
                    }
                  </tbody>
                ) : null
              }
            </table>
          </div>
        </>
      ) : (
        <div>
          <div className="p-3 d-flex align-items-center sticky-top bg-white">
            <i className="fa fa-search d-inline-block text-secondary me-2" />
            <input className="font-15 p-1 content-only d-inline-block w-100" placeholder="Start Typing To Search..." onChange={searchDatabase} />
          </div>
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
                    className="searchResult my-2 p-2 bg-dark text-white d-flex align-items-center rounded-2"
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

export default Search;
