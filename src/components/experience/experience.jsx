import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { serverAddress } from '../../redux/loginSlice';

import './experience.css';
import { userData } from '../../redux/userDataSlice';

function Experience(props) {
  const {
    datePosted,
    experienceName,
    description,
    images,
    deleteExperience,
    showDeleteOption,
  } = props;
  const server = useSelector(serverAddress);
  const user = useSelector(userData);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const date = new Date(datePosted);
  const dateString = `${date.getDate()} 
                      ${months[date.getMonth()]}
                      ${date.getFullYear()}, 
                      ${date.getHours().toLocaleString('en-US', { minimumIntegerDigits: 2 })}:${date.getMinutes().toLocaleString('en-US', { minimumIntegerDigits: 2 })}`;

  return (
    <tr className="experience">
      <td>
        <div className="d-flex p-2 pt-0 border-bottom">
          <img className="postProfilePicture me-3" alt="" src={`${server}/photo/${user.picture}`} />
          <div className="w-100">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="font-15 m-0">{user.name}</h4>
                <h4 className="font-13 fw-normal">{dateString}</h4>
              </div>
              {
                showDeleteOption ? (
                  <button type="button" className="btn btn-link text-color2 hover-danger p-0" onClick={deleteExperience}>
                    <i className="fa-solid fa-trash-can me-2" />
                  </button>
                ) : null
              }
            </div>
            <div>
              { experienceName ? (
                <strong>
                  {experienceName}
                  {' '}
                  :
                  {' '}
                </strong>
              ) : null }
              { description }
            </div>
            {images.length ? (
              <div className="my-2">
                { (images.length > 1) ? (
                  <div className="post-image-div">
                    <img className="post-image-1" alt="" src={`${server}/photo/${images[0]}`} />
                    <img className="post-image-2" alt="" src={`${server}/photo/${images[1]}`} />
                  </div>
                ) : (
                  <div className="post-image-div">
                    <img className="post-image" alt="" src={`${server}/photo/${images[0]}`} />
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </td>
    </tr>
  );
}

Experience.propTypes = {
  datePosted: PropTypes.string.isRequired,
  images: PropTypes.arrayOf(
    PropTypes.string.isRequired,
  ).isRequired,
  experienceName: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  deleteExperience: PropTypes.func.isRequired,
  showDeleteOption: PropTypes.bool.isRequired,
};

export default Experience;
