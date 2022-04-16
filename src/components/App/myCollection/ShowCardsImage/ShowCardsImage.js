import React from 'react';
import Slide from '../slide/Slide';
import Backimage from '../../cards/Card_Back-s1_worn.jpg';
import Deck from '../allCardView/AllCardsView';

const ShowCardsImage = ({
  hasViewerExisted,
  state,
  dispatch,
  cardsForDisplay,
}) => {
  return (
    <>
      {hasViewerExisted ? (
        <div id="root">
        <Deck cards={cardsForDisplay}/>
        </div>
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
