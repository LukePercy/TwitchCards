import React from 'react';
import Slide from '../slide/Slide';

const ShowCardsImage = ({
  hasViewerExisted,
  state,
  dispatch,
  cardsForDisplay,
  slides,
  viewerId,
}) => {
  return (
    <>
      {hasViewerExisted ? (
        <>
          <button onClick={() => dispatch({ type: 'PREV' })}>‹</button>
          {[...cardsForDisplay, ...cardsForDisplay, ...cardsForDisplay].map(
            (slide, i) => {
              let offset = slides.length + (state.slideIndex - i);
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
          <button onClick={() => dispatch({ type: 'NEXT' })}>›</button>
        </>
      ) : (
        <>
          <div
            style={{
              padding: 0,
              margin: 0,
            }}
          >
            Unlock 3 cards to see your collection
          </div>
          <div key='back'>
            <div
              className='slideContent'
              style={{
                backgroundImage: `url('${slides[0].backimage}')`,
                margin: 0,
                padding: 20,
                alignContent: 'center',
              }}
            ></div>
          </div>
        </>
      )}
    </>
  );
};

export default ShowCardsImage;
