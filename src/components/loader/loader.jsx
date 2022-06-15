import React from 'react';
import './loader.css';

function Loader() {
  return (
    <div className="bg-white loader d-flex justify-content-center align-items-center">
      <i className="font-30 fa-solid fa-hourglass-empty text-secondary rotate" />
    </div>
  );
}

export default Loader;
