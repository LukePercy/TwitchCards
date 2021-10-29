import React, {useState, useEffect} from 'react';
import { slides } from '../../cardList/CardList';
import useViewersCards from '../../customHooks/useViewersCards';

//  Get the holdingAmount from viewers card and display total count over the card
const CardsCount = ({ cardId, viewerId, isRewardRedeemed }) => {

  const [cardCountUpdated, setCardCountUpdated] = useState(0);
  console.log(`cardCountUpdated`, cardCountUpdated)
  const [isReward,setRewarded] = useState(isRewardRedeemed);
  console.log(`isReward state in CardsCount`,isReward)
  const viewersCards = useViewersCards(viewerId, isRewardRedeemed);
  let countForDisplay = `<div className='cardCount'></div>`;

  if (viewersCards.length){
    countForDisplay = viewersCards.map((holdingCard) => {
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
  }

  useEffect(() => {
    if (isReward) {
      console.log(`isReward triggered in useEffect`, isReward)
      setCardCountUpdated(countForDisplay);
    }
    setRewarded(false);
  }, [viewerId, isReward, viewersCards]);
  return cardCountUpdated ? cardCountUpdated : countForDisplay;
};

export default CardsCount;
