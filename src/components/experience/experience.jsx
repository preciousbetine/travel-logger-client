import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { serverAddress } from '../../redux/loginSlice';

import './experience.css';

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
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const date = new Date(datePosted);
  const dateString = `${date.getDate()} 
                      ${months[date.getMonth()]}
                      ${date.getFullYear()}, 
                      ${date.getHours().toLocaleString('en-US', { minimumIntegerDigits: 2 })}:${date.getMinutes().toLocaleString('en-US', { minimumIntegerDigits: 2 })}`;

  return (
    <tr className="experience bg-light">
      <td>
        <div className="d-flex justify-content-between align-items-center p-2">
          <span className="bg-dark text-light text-center p-3 py-1 fw-bold rounded-pill font-15">
            <i className="fa-solid fa-calendar-days me-2" />
            <span>
              { dateString }
            </span>
          </span>
          {
            showDeleteOption ? (
              <button type="button" className="btn btn-link text-danger" onClick={deleteExperience}>delete</button>
            ) : null
          }
        </div>
        <div className="mx-3 mb-2 p-3 py-1">
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
          <div>
            { (images.length > 1) ? (
              <div className="post-image-div p-2 m-3 my-1">
                <img className="post-image-1" alt="" src={`${server}/photo/${images[0]}`} />
                <img className="post-image-2" alt="" src={`${server}/photo/${images[1]}`} />
              </div>
            ) : (
              <div className="post-image-div p-2 m-3 my-1">
                <img className="post-image" alt="" src={`${server}/photo/${images[0]}`} />
              </div>
            )}
          </div>
        ) : null}
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
