import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function Search(props) {
  const { setHeader } = props;
  const nav = (
    <Link to="/search" className="text-dark text-decoration-none">Find Other Travellers</Link>
  );
  useEffect(() => {
    setHeader(nav);
  }, []);
  return (
    <div>
      Find Other Travellers
    </div>
  );
}

Search.propTypes = {
  setHeader: PropTypes.func.isRequired,
};

export default Search;
