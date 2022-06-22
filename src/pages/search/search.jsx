import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Experience from '../../components/experience/experience';
import Loader from '../../components/loader/loader';
import './search.css';
import Alert from '../../components/Alert/Alert';
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
    <Link to="/search" className="text-dark text-decoration-none">Find Other Travellers</Link>
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
    setHeader(nav);
  }, []);

  const onScroll = (e) => {
    if (search.trim().length === 0) return;
    if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop <= e.currentTarget.clientHeight) {
      fetch(`${server}/${id}/experiences?index=${currentIndex}`)
        .then((res) => res.json()).then((res) => {
          if (res.experiences.length > 0) {
            setCurrentIndex(currentIndex + 10);
            addExperiences([...experiences, ...res.experiences]);
          }
        }).catch(() => {
          Alert('An Error Occured! Reload the page', 'danger', 'searchAlert');
        });
    }
  };

  const searchDatabase = async (e) => {
    if (e.target.value.trim().length === 0) { setSearchResults([]); } else {
      let result = await fetch(`${server}/searchUser/${e.target.value.trim()}`);
      result = await result.json();
      setSearchResults(result.users);
    }
  };

  const showUserProfile = (userId) => {
    navigate(`/search?id=${userId}`);
  };

  return (
    <div className="searchPage" onScroll={onScroll}>
      <div id="searchAlert" />
      {id ? (
        <>
          <div className="profileDiv border border-2 rounded-3">
            {
              pageReady ? (
                <>
                  <img
                    src={user.picture ? `${server}/photo/${user.picture}` : 'https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png'}
                    alt=""
                    className="userImage"
                  />
                  <div className="d-flex flex-column justify-content-center align-items-start">
                    <h2>{user.name}</h2>
                    <div className="infoDisplay mb-1">
                      {(user.location && user.location.trim !== '') ? (
                        <div>
                          <i className="fa-solid fa-location-dot text-center w-20" />
                          <span className="ms-2">{user.location}</span>
                        </div>
                      ) : null}
                      {(user.website && user.website.trim !== '') ? (
                        <div>
                          <i className="fa-solid fa-link text-center w-20" />
                          <span className="ms-2"><a href={`//${user.website}`} target="_blank" rel="noreferrer">{user.website}</a></span>
                        </div>
                      ) : null}
                      <div className="text-secondary px-2 pt-2">{user.description}</div>
                    </div>
                  </div>
                </>
              ) : (
                <Loader />
              )
            }
          </div>
          <div className="pb-3 mt-2">
            <table className={`table ${experiences.length > 0 ? 'table-striped' : 'table-borderless'}`}>
              <thead className="bg-light text-dark">
                <tr>
                  <th className="col ps-4">Experiences</th>
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
          <input className="font-20 p-3 form-control" placeholder="Start Typing To Search..." onChange={searchDatabase} />
          <div>
            {
              searchResults.map(
                (result, index) => (
                  <div
                    key={result.id}
                    onClick={() => showUserProfile(result.id)}
                    role="button"
                    tabIndex={index + 40}
                    onKeyDown={() => {}}
                    className="my-2 p-2 bg-light d-flex align-items-center rounded-2"
                  >
                    <span>
                      <img
                        alt=""
                        className="smallImg me-3 border border-light"
                        src={`${server}/photo/${result.picture}`}
                      />
                    </span>
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
