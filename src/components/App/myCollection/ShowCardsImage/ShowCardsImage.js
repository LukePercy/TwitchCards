import React from 'react';
import Slide from './slide/Slide';
import Backimage from '../../cards/Card_Back-s1_worn.jpg';
import Deck from './allCardView/AllCardsView';
import '../../App.css';

const ShowCardsImage = ({
  hasViewerExisted,
  state,
  dispatch,
  cardsForDisplay,
  toggle,
}) => {
  return (
    <>
      {hasViewerExisted ? (
        <>
          {toggle ? (
            <>
              <button
                onClick={() => dispatch({ type: 'PREV', cardsForDisplay })}
              >
                ‹
              </button>
              {[...cardsForDisplay, ...cardsForDisplay, ...cardsForDisplay].map(
                (slide, i) => {
                  let offset = cardsForDisplay.length + (state.slideIndex - i);
                  return <Slide slide={slide} offset={offset} key={i} />;
                }
              )}
              <button
                onClick={() => dispatch({ type: 'NEXT', cardsForDisplay })}
              >
                ›
              </button>
            </>
          ) : (
            <>
              <Deck cards={cardsForDisplay} />
            </>
          )}
        </>
      ) : (
        <>
          <div key='back'>
            <div
              className='nocardsContainer'
              style={{
                backgroundImage: `url(${Backimage})`,
              }}
            ></div>
          </div>
        </>
      )}
    </>
  );
};

export default ShowCardsImage;
