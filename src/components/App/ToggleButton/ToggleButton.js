import React from 'react';
import clsx from 'clsx';

const ToggleButton = ({ toggle, setToggle, isViewerHasCards }) => {
  const toggleBtnClassName = clsx('toggle-view-icon', toggle && 'deck'); // conditional styles

  const handleClick = (e) => {
    e.preventDefault();
    setToggle(!toggle);
  };

  return (
    <div className='icons-area'>
      <span className={toggleBtnClassName} onClick={handleClick}></span>
    </div>
  );
};

export default ToggleButton;
