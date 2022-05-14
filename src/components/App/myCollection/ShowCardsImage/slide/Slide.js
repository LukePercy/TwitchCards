import React, { useState, useEffect } from 'react';
// Flip card over to see back images
import ReactCardFlip from 'react-card-flip';
import useTilt from '../../../customHooks/useTilt';

// Slide content. Includes card image and flip behavior.
const Slide = ({ slide, offset}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const handleClick = (e) => {
    e.preventDefault();
    setIsFlipped(!isFlipped);
  };
  const active = offset === 0 ? true : null;
  const ref = useTilt(active);
  const { holdingAmount } = slide;

  // Return the display of the card and its Flipped state
  return (
    <div
      ref={ref}
      className='slide'
      data-active={active}
      style={{
        '--offset': offset,
        '--dir': offset === 0 ? 0 : offset > 0 ? 1 : -1,
      }}
    >
      <div
        className='slideBackground'
        style={{
          backgroundImage: `url('${slide.frontimage}')`,
        }}
      ></div>
      <ReactCardFlip
        isFlipped={isFlipped}
        flipSpeedFrontToBack={1.0}
        flipSpeedBackToFront={1.0}
        flipDirection='horizontal'
        infinite={false}
      >
        <div key='front' onClick={handleClick}>
          <div
            className='slideContent'
            style={{backgroundImage: `url('${slide.frontimage}')`}}
          >
            <div key={slide.id} className='cardCount'>
              {holdingAmount}
            </div>
              <div className='slideContentInner'>
                <span className='slideSubtitle'>Art by <p className='slideDescription'>{slide.artist}</p></span>
              </div>
          </div>
        </div>
        <div key='back' onClick={handleClick}>
          <div
            className='slideContent'
            style={{
              backgroundImage: `url('${slide.backimage}')`,
            }}
          ></div>
        </div>
      </ReactCardFlip>
    </div>
  );
};

export default Slide;
