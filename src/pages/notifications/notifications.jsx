import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function Notifications(props) {
  const { setHeader } = props;
  const nav = (
    <Link to="/notifications" className="text-dark text-decoration-none">Notifications</Link>
  );
  useEffect(() => {
    setHeader(nav);
  }, []);
  return (
    <div>
      Notifications
    </div>
  );
}

Notifications.propTypes = {
  setHeader: PropTypes.func.isRequired,
};

export default Notifications;
