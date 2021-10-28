import React from 'react';
import { slides } from '../../cardList/CardList';
import useViewersCards from '../../customHooks/useViewersCards';

//  Get the holdingAmount from viewers card and display total count over the card
const CardsCount = ({ cardId, viewerId }) => {
  const viewersCards = useViewersCards(viewerId);

  const countForDisplay = viewersCards.map((holdingCard) => {
    // use find() to compare two card IDs
    // then return the matched card object
    const matchedCard = slides.find((card) => card.id === cardId);
    if (matchedCard.id === holdingCard.cardId)
      return (
        <div key={matchedCard.id} className='cardCount'>
          {holdingCard.holdingAmount}
        </div>
      );
  });
  return countForDisplay;
};

export default CardsCount;
