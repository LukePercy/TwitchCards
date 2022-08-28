import { useState, useEffect } from "react";
import { slides } from "../cardList/CardList";

const useCardsForDisplay = (viewerId, viewersCards, isRewardRedeemed) => {
  const [cardsForDisplay, setCardsForDisplay] = useState([]);
  const [isReward, setRewarded] = useState(false);

  const matchedCards = viewersCards.map((holdingCard) => {
    // use find() to compare two card IDs
    // then return the matched card object
    const matchedCard = slides.find((card) => holdingCard.cardId === card.id);
    // Then update the card type for displaying
    if (holdingCard.cardId === matchedCard.id) {
      if (holdingCard.holdingAmount >= 0 && holdingCard.holdingAmount <= 5) {
        const newCard = {
          ...matchedCard,
          rarity: "Worn", // we dont use this yet. Its used to drive CardRarity() display component.
          frontimage: require(`../cards/${matchedCard.title}-s1_worn.jpg`),
          holdingAmount: holdingCard.holdingAmount,
        };
        return newCard;
      } else if (
        holdingCard.holdingAmount > 5 &&
        holdingCard.holdingAmount <= 15
      ) {
        const newCard = {
          ...matchedCard,
          rarity: "Mint",
          frontimage: require(`../cards/${matchedCard.title}-s1_mint.jpg`), //Mint card image
          backimage: require(`../cards/Card_Back-s1_mint.jpg`),
          holdingAmount: holdingCard.holdingAmount,
        };
        return newCard;
      } else if (holdingCard.holdingAmount > 15) {
        const newCard = {
          ...matchedCard,
          rarity: "Foil",
          frontimage: require(`../cards/${matchedCard.title}-s1_foil.jpg`), //Foil card image
          backimage: require(`../cards/Card_Back-s1_foil.jpg`),
          holdingAmount: holdingCard.holdingAmount,
        };
        return newCard;
      } else {
        throw new Error(
          "Should not happen. Holding amount out of numbered ranges" // if our ranges set fail, throw error
        );
      }
    }
  });
  console.log("isReward in useCardsForDisplay", isReward);
  console.log("isRewardRedeemed useCardsForDisplay", isRewardRedeemed);

  useEffect(() => {
    setCardsForDisplay(matchedCards);
    setRewarded(isRewardRedeemed);
    return () => {
      setRewarded(false);
      setCardsForDisplay([]);
    };
  }, [viewerId, matchedCards.length, isRewardRedeemed]);
  console.log("cardsForDisplay", cardsForDisplay.length);
  console.log("matchedCards", matchedCards);
  return cardsForDisplay.length ? cardsForDisplay : matchedCards;
};

export default useCardsForDisplay;
