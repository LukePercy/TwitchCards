import React, { useState, useEffect } from 'react';
import Slide from '../slide/Slide';
import Backimage from '../../cards/Card_Back-s1_worn.jpg';
import Deck from '../allCardView/AllCardsView';

const ShowCardsImage = ({
  hasViewerExisted,
  state,
  dispatch,
  cardsForDisplay,
}) => {
  const [isViewToggle, setViewToggle] = useState(false);
  const handleClick = (e) => {
    e.preventDefault();
    setViewToggle(!isViewToggle);
  };
  
  let toggle = !isViewToggle;
  
  return (
    <>
      {hasViewerExisted ? (
          <>
            {toggle ? (
              <>
                <button onClick={() => dispatch({ type: 'PREV', cardsForDisplay })}>
                ‹
                </button>
                {[...cardsForDisplay, ...cardsForDisplay, ...cardsForDisplay].map(
                  (slide, i) => {
                    let offset = cardsForDisplay.length + (state.slideIndex - i);
                      return (
                        <Slide
                          slide={slide}
                          offset={offset}
                          key={i}
                        />
                  );
                }
                )}
                <button onClick={() => dispatch({ type: 'NEXT', cardsForDisplay })}>
                ›
                </button>
              </>
            ) : ( 
           <Deck 
              cards={cardsForDisplay}
           />
          )}
        </>
      ) : (
        <>
          <div key='back'>
            <div
              className='slideContent'
              style={{
                backgroundImage: `url(${Backimage})`,
                margin: 0,
                padding: 25,
              }}
            ></div>
          </div>
        </>
      )}
    </>
  );
};

export default ShowCardsImage;
