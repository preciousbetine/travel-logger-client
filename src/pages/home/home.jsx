/* eslint-disable react/style-prop-object */
import React from 'react';
import PropTypes from 'prop-types';
import './home.css';
import NewExperience from '../newExperience/newExperience';

class Home extends React.Component {
  componentDidMount() {
    const { setHeader } = this.props;
    const nav = (
      <div className="d-flex align-items-center h-100">
        <h6 className="m-0 font-20">Home</h6>
      </div>
    );
    setHeader(nav);
  }

  render() {
    return (
      <div className="home-page d-flex  h-max-content">
        <NewExperience />
        {}
      </div>
    );
  }
}

Home.propTypes = {
  setHeader: PropTypes.func.isRequired,
};

export default Home;
