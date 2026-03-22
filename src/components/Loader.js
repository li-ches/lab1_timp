import React from 'react';

function Loader({ text }) {
  return (
    <div className="loader">
      <div className="spinner"></div>
      <p>{text || 'Загрузка...'}</p>
    </div>
  );
}

export default Loader;