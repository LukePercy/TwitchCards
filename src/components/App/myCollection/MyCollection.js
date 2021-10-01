import React, { useState, useEffect } from 'react';
// Card info
import { slides } from '../cardList/CardList';
import useViewersCards from '../customHooks/useViewersCards';

import ShowCardsImage from './ShowCardsImage/ShowCardsImage';
import Loader from 'react-loader-spinner';

// const BASE_URL = 'http://localhost:3003/api/viewers';
const BASE_URL = 'https://diceydeckbackend.herokuapp.com/api/viewers';

const initialState = {
  slideIndex: 0,
};

const useCardsForDisplay = (viewerId) => {
  const viewersCards = useViewersCards(viewerId);
  const cardsForDisplay = viewersCards.map((holdingCard) => {
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
  return cardsForDisplay;
}

// Slide navigation to view collection of cards
const slidesReducer = (state, event) => {
const {type, cardsForDisplay} = event;

  if (type === 'NEXT') {
    return {
      ...state,
      slideIndex:
      state.slideIndex === 0 ? cardsForDisplay.length - 1 : state.slideIndex - 1,
    };
  }
  if (type === 'PREV') {
    return {
      ...state,
      slideIndex: (state.slideIndex + 1) % cardsForDisplay.length,
    };
  }
};

// Render cards in slide - see carousel.css
export default function MyCollection({ viewerId }) {
  const [state, dispatch] = React.useReducer(slidesReducer, initialState);
  const [hasViewerExisted, setViewerExisted] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const cardsForDisplay = useCardsForDisplay(viewerId)
  

  // use useEffect to fetch from DB check the viewer has existed in our DB
  useEffect(() => {
    const getCardsViewer = async () => {
      const response = await fetch(`${BASE_URL}/${viewerId}`, {mode: 'no-cors'});
      const result = await response.json();
      const { success } = result;
      // Check the viewer has a card record in our DB first
      if (success) {
        // If the viewer has a card record, then set the flag to true
        setViewerExisted(true);
      }

      // No matter the viewer has or hasn't a card record
      // at this moment, stop the spinner by setting the loading flag
      setLoading(false);
    };
    getCardsViewer();
  }, []);

  return (
    <div className='slides'>
      {isLoading ? (
        <Loader
          type='ThreeDots'
          color='#4d727d'
          height={100}
          width={100}
          timeout={1000}
        />
      ) : (
        <ShowCardsImage
          hasViewerExisted={hasViewerExisted}
          state={state}
          dispatch={dispatch}
          cardsForDisplay={cardsForDisplay}
          viewerId={viewerId}
        />
      )}
    </div>
    );
}
