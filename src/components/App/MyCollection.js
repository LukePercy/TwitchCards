import React from 'react';
// Card info
import { slides } from './CardList';
import useViewersCards from '../../customHooks/useViewersCards';
import Slide from '../App/Slide';

const initialState = {
  slideIndex: 0,
};
// Slide navigation to view collection of cards
const slidesReducer = (state, event) => {
  if (event.type === 'NEXT') {
    return {
      ...state,
      slideIndex: (state.slideIndex + 1) % slides.length,
    };
  }
  if (event.type === 'PREV') {
    return {
      ...state,
      slideIndex:
        state.slideIndex === 0 ? slides.length - 1 : state.slideIndex - 1,
    };
  }
};

// Render cards in slide - see carousel.css
export default function MyCollection({ viewerId }) {
  const [state, dispatch] = React.useReducer(slidesReducer, initialState);
  const viewersCards = useViewersCards(viewerId);

<<<<<<< HEAD
// awfulness becuase strings are stupid
// matchedcard.title from cardslist title 
  function displayCardType(title, type) {
    if ( title === 'Miraqen' ) {
      switch (type) {
        case 'Worn':
          return MiraqenWorn
        case 'Mint':
          return MiraqenMint
        case 'Foil':
          return MiraqenFoil
  
        default:
        break;
      }
    } else if (title === 'Bill') {
      switch (type) {
        case 'Worn':
          return BillWorn
        case 'Mint':
          return BillMint
        case 'Foil':
          return BillFoil

        default:
        break;
    } 
  } else if (title === 'Baron') {
    switch (type) {
      case 'Worn':
        return BaronWorn
      case 'Mint':
        return BaronMint
      case 'Foil':
        return BaronFoil

      default:
      break;
    }
  } else if (title === 'DM') {
    switch (type) {
      case 'Worn':
        return DMWorn
      case 'Mint':
        return DMMint
      case 'Foil':
        return DMFoil

      default:
      break;
    }
  } else if (title === 'Morely') {
    switch (type) {
      case 'Worn':
        return MorelyWorn
      case 'Mint':
        return MorelyMint
      case 'Foil':
        return MorelyFoil

      default:
      break;
    }
  }
}
=======
>>>>>>> develop
  // Dealing with two things here:
  //  - 1. Display the right cards that the viewer has
  //  - 2. Display the right card type accordingly based on the holding amount of that card
  //       - If 0 <= HoldingAmount < 5 ---> show Worn image
  //       - If 5 <= HoldingAmount < 15 ---> show Mint image
  //       - If HoldingAmount >= 15 ---> show Foil Image

  // use map() to loop all cards
  // that the viewer is holding
  const cardsForDisplay = viewersCards.map((holdingCard) => {
    // use find() to compare two card IDs
    // then return the matched card object
    const matchedCard = slides.find((card) => holdingCard.cardId === card.id);

    // Then update the card type for displaying
    if (holdingCard.cardId === matchedCard.id) {
      if (holdingCard.holdingAmount >= 0 && holdingCard.holdingAmount <= 5) {
        return {
          ...matchedCard,
          rarity: 'Worn', // we dont use this yet. Its used to drive CardRarity() display component.
          frontimage: require(`./cards/${matchedCard.title}-s1-worn.svg`),
        };
      } else if (
        holdingCard.holdingAmount > 5 &&
        holdingCard.holdingAmount <= 15
      ) {
        return {
          ...matchedCard,
          rarity: 'Mint',
          frontimage: require(`./cards/${matchedCard.title}-s1-mint.svg`), //Mint card image
        };
      } else if (holdingCard.holdingAmount > 15) {
        return {
          ...matchedCard,
          rarity: 'Foil',
          frontimage: require(`./cards/${matchedCard.title}-s1-foil.svg`), //Foil card image
        };
      } else {
        throw new Error(
          'Should not happen. Holding amount out of numbered ranges' // if our ranges set fail, throw error
        );
      }
    }
    return matchedCard;
  });
  // render collection if cards exist, if not show just a back card.
  return (
    <div className='slides'>
      {cardsForDisplay.length ? (
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
          <div key='back'>
            <div
              className='slideContent'
              style={{
                backgroundImage: `url('${slides[0].backimage}')`,
              }}
            ></div>
          </div>
        </>
      )}
    </div>
  );
}
