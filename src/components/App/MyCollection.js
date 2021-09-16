import React, { useEffect, useState } from 'react';
// Card info
import { slides } from './CardList';
<<<<<<< HEAD
// Flip card over to see back images
import ReactCardFlip from 'react-card-flip';
//cards
import BillWorn from './cards/Bill-s1-worn.svg';
import MiraqenWorn from './cards/Miraqen-s1-worn.svg';
import BaronWorn from './cards/Byrem-s1-worn.svg';
import DMWorn from './cards/DM-s1-worn.svg';
import MorelyWorn from './cards/Morely-s1-worn.svg';
import BillMint from './cards/Bill-s1-mint.svg';
import MiraqenMint from './cards/Miraqen-s1-mint.svg';
import BaronMint from './cards/Byrem-s1-mint.svg';
import DMMint from './cards/DM-s1-mint.svg';
import MorelyMint from './cards/Morely-s1-mint.svg';
import BillFoil from './cards/Bill-s1-foil.svg';
import MiraqenFoil from './cards/Miraqen-s1-foil.svg';
import BaronFoil from './cards/Byrem-s1-foil.svg';
import DMFoil from './cards/DM-s1-foil.svg';
import MorelyFoil from './cards/Morely-s1-foil.svg';

// Database API. Stores twitch userID and their card collection data
const BASE_URL = 'https://diceydeckbackend.herokuapp.com/api/viewers';

// useViewersCards hook. Get which cards are held by the viewer, passing in viewerId
function useViewersCards(viewerId) {
  const [viewersCards, setViewersCards] = useState([]);
  useEffect(() => {
    const getCardsViewer = async (viewerId) => {
      const response = await fetch(`${BASE_URL}/${viewerId}`);
      const result = await response.json();
      const { data } = result;
      if (data) {
        // If the viewer exists in db
        // return true, otherwise false;
        setViewersCards(data.holdingCards);
      } else {
        setViewersCards([]);
      }
    };
    getCardsViewer(viewerId);
  }, [viewerId]);
  return viewersCards;
}

// Cards 3d effect tilting on mouseover
function useTilt(active) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!ref.current || !active) {
      return;
    }

    const state = {
      rect: undefined,
      mouseX: undefined,
      mouseY: undefined,
    };

    let el = ref.current;

    const handleMouseMove = (e) => {
      if (!el) {
        return;
      }
      if (!state.rect) {
        state.rect = el.getBoundingClientRect();
      }
      state.mouseX = e.clientX;
      state.mouseY = e.clientY;
      const px = (state.mouseX - state.rect.left) / state.rect.width;
      const py = (state.mouseY - state.rect.top) / state.rect.height;

      el.style.setProperty('--px', px);
      el.style.setProperty('--py', py);
    };

    el.addEventListener('mousemove', handleMouseMove);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
    };
  }, [active]);

  return ref;
}
=======
import useViewersCards from '../../customHooks/useViewersCards';
import Slide from '../App/Slide';
>>>>>>> e1ed07b2aa9b4ca669789b5b237f0a1d09bfcd08

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
  } else {
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
>>>>>>> e1ed07b2aa9b4ca669789b5b237f0a1d09bfcd08
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
