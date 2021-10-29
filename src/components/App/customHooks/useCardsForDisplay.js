import React, { useState, useEffect } from 'react';
import { slides } from '../cardList/CardList';
import useViewersCards from '../customHooks/useViewersCards';

const useCardsForDisplay = (viewerId, isRewardRedeemed) => {
  const [cardsForDisplay, setCardsForDisplay] = useState([]);
  const [isReward,setRewarded] = useState(isRewardRedeemed);

  const viewersCards = useViewersCards(viewerId, isRewardRedeemed);
  const matchedCards = viewersCards.map((holdingCard) => {
    // use find() to compare two card IDs
    // then return the matched card object
    const matchedCard = slides.find((card) => holdingCard.cardId === card.id);
    // Then update the card type for displaying
    if (holdingCard.cardId === matchedCard.id) {
      if (holdingCard.holdingAmount >= 0 && holdingCard.holdingAmount <= 5) {
        const newCard = {
          ...matchedCard,
          rarity: 'Worn', // we dont use this yet. Its used to drive CardRarity() display component.
          frontimage: require(`../cards/${matchedCard.title}-s1_worn.jpg`),
        };
        return newCard;
      } else if (
        holdingCard.holdingAmount > 5 &&
        holdingCard.holdingAmount <= 15
      ) {
        const newCard = {
          ...matchedCard,
          rarity: 'Mint',
          frontimage: require(`../cards/${matchedCard.title}-s1_mint.jpg`), //Mint card image
          backimage: require(`../cards/Card_Back-s1_mint.jpg`),
        };
        return newCard;
      } else if (holdingCard.holdingAmount > 15) {
        const newCard = {
          ...matchedCard,
          rarity: 'Foil',
          frontimage: require(`../cards/${matchedCard.title}-s1_foil.jpg`), //Foil card image
          backimage: require(`../cards/Card_Back-s1_foil.jpg`),
        };
        return newCard;
      } else {
        throw new Error(
          'Should not happen. Holding amount out of numbered ranges' // if our ranges set fail, throw error
        );
      }
    }
  });

  console.log('matchedCards in [useCardsForDisplay.js] :>> ', matchedCards);
  console.log(
    'isRewardRedeemed in [useCardsForDisplay.js] :>> ',
    isRewardRedeemed
  );

  useEffect(() => {
    if (isReward) {
      setCardsForDisplay(matchedCards);
    }
    setRewarded(false)
  }, [viewerId,isReward]);
  console.log('isReward in useCardsForDisplay.js', isReward)

  return cardsForDisplay.length ? cardsForDisplay : matchedCards;
};

export default useCardsForDisplay;
