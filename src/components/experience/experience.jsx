import React from 'react';
import PropTypes from 'prop-types';
import './experience.css';

function Experience(props) {
  const {
    datePosted,
    experienceName,
    travelCost,
    placesVisited,
  } = props;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const date = new Date(datePosted);
  return (
    <tr className="experience">
      <td>
        <div>
          <span className="d-flex align-items-center">
            <span className="pe-2">{`${date.getDay()} ${months[date.getMonth()]} ${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}`}</span>
            -
            <span className="fw-bold ps-2">{experienceName}</span>
          </span>
        </div>
        <div className="p-2 pt-0">
          <div className="mb-2 fw-bold">Places Visited :</div>
          <div className="px-3">
            {placesVisited.map((place) => (
              <span key={place} className="badge bg-dark text-light p-2 me-2 mb-2 font-15">
                <i className="fa-solid fa-location-dot me-2" />
                {place}
              </span>
            ))}
          </div>
          <span className="fw-bold">Travel Cost :</span>
          <span className="badge bg-dark text-light font-15 ms-2">{travelCost}</span>
        </div>
        {/* <div className="p-2 d-flex justify-content-center">
            <img alt="" className="postImages" src={`http://localhost:5000/photo/${images[0]}`} />
            <img alt="" className="postImages" src={`http://localhost:5000/photo/${images[1]}`} />
          </div> */}
      </td>
    </tr>
  );
}

Experience.propTypes = {
  datePosted: PropTypes.string.isRequired,
  placesVisited: PropTypes.arrayOf(PropTypes.string).isRequired,
  // images: PropTypes.arrayOf(PropTypes.string).isRequired,
  experienceName: PropTypes.string.isRequired,
  travelCost: PropTypes.string.isRequired,
};

export default Experience;
