import React from 'react';
import PropTypes from 'prop-types';
import './experience.css';

function Experience(props) {
  const {
    datePosted,
    experienceName,
    description,
    images,
  } = props;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const date = new Date(datePosted);
  const dateString = `${date.getDay()} 
                      ${months[date.getMonth()]}
                      ${date.getFullYear()}, 
                      ${date.getHours().toLocaleString('en-US', { minimumIntegerDigits: 2 })}:${date.getMinutes().toLocaleString('en-US', { minimumIntegerDigits: 2 })}`;

  return (
    <tr className="experience">
      <td>
        <div className="d-flex justify-content-between align-items-center p-2">
          <span className="bg-dark text-light text-center p-3 py-1 fw-bold rounded-pill font-15">
            <i className="fa-solid fa-calendar-days me-2" />
            <span>
              { dateString }
            </span>
          </span>
          <button type="button" className="btn btn-link text-danger">delete</button>
        </div>
        <div className="mx-3 mb-2 p-3 py-1 fw-bold">
          { experienceName }
          {'  '}
          ----
          {'  '}
          { description }
        </div>
        {images.length ? (
          <div>
            { (images.length > 1) ? (
              <div className="post-image-div p-2 m-3 my-1">
                <img className="post-image-1" alt="" src={`http://localhost:5000/photo/${images[0]}`} />
                <img className="post-image-2" alt="" src={`http://localhost:5000/photo/${images[1]}`} />
              </div>
            ) : (
              <div className="post-image-div p-2 m-3 my-1">
                <img className="post-image" alt="" src={`http://localhost:5000/photo/${images[0]}`} />
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
};

export default Experience;
