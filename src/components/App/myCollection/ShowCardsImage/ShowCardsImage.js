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
              // offset = i - 1 for one card. play with this more for 2 cards
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
        <><p>Unlock 3 characters to see your collection</p>
          <div
            style={{
              padding: 0,
              margin: 0,
            }}
          >
          </div>
          <div key='back'>
            <div
              className='slideContent'
              style={{
                backgroundImage: `url('${slides[0].backimage}')`,
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
