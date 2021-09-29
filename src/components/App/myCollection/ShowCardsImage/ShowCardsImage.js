import React from 'react';
import Slide from '../slide/Slide';
import Backimage from '../../cards/Card_Back-s1_worn.jpg'

const ShowCardsImage = ({
  hasViewerExisted,
  state,
  dispatch,
  cardsForDisplay,
  viewerId,
}) => {
  console.log(`Backimage`, Backimage)
  return (
    <>
      {hasViewerExisted ? (
        <>
          <button onClick={() => dispatch({ type: 'PREV', cardsForDisplay })}>‹</button>
          {[...cardsForDisplay, ...cardsForDisplay, ...cardsForDisplay].map(
            (slide, i) => {
              let offset = cardsForDisplay.length + (state.slideIndex - i);
              return (
                <Slide
                  viewerId={viewerId}
                  slide={slide}
                  offset={offset}
                  key={i}
                />
              );
            }
          )}
          <button onClick={() => dispatch({ type: 'NEXT', cardsForDisplay })}>›</button>
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
