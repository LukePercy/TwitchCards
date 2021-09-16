import React, { useEffect, useState } from 'react';
// Card info
import { slides } from './CardList';
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
// Slide content. Includes card image and flip behavior.
function Slide({ viewerId, slide, offset }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const handleClick = (e) => {
    e.preventDefault();
    setIsFlipped(!isFlipped);
  };
  const active = offset === 0 ? true : null;
  const ref = useTilt(active);

  // Determine how different card rarities display between Worn, Mint and Foil
  // Not used in v1
  // function CardRarity() {
  //   let rarity = slide.rarity;
  //   if (rarity == 'Mint') {
  //     return <h4 className='slideRarityMint'>{slide.rarity}</h4>;
  //   } else if (rarity == 'Foil') {
  //     return <h4 className='slideRarityFoil shine'>{slide.rarity}</h4>;
  //   } else {
  //     return <h4 className='slideRarityWorn'>{slide.rarity}</h4>;
  //   }
  // }

  //  Get the holdingAmount from viewers card and display total count over the card
  function GetCardCount({ cardId }) {
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
  }
  // Return the display of the card and its Flipped state
  return (
    <div
      ref={ref}
      className='slide'
      data-active={active}
      style={{
        '--offset': offset,
        '--dir': offset === 0 ? 0 : offset > 0 ? 1 : -1,
      }}
    >
      <div
        className='slideBackground'
        style={{
          backgroundImage: `url('${slide.frontimage}')`,
        }}
      ></div>
      <ReactCardFlip
        isFlipped={isFlipped}
        flipSpeedFrontToBack={1.0}
        flipSpeedBackToFront={1.0}
        flipDirection='horizontal'
        infinite={false}
      >
        <div key='front' onClick={handleClick}>
          <div
            className='slideContent'
            style={{ backgroundImage: `url('${slide.frontimage}')` }}
          >
            <div>
              <GetCardCount cardId={slide.id} />
            </div>
            <div className='slideContentInner'>
              {/* Not used right now. But we can show other text properties on cards too
              <h2 className='slideTitle'>{slide.title}</h2>
              <h3 className='slideSubtitle'>{slide.subtitle}</h3>
              <p className='slideDescription'>{slide.description}</p> */}
              {/* <CardRarity/> */}
            </div>
          </div>
        </div>
        <div key='back' onClick={handleClick}>
          <div
            className='slideContent'
            style={{
              backgroundImage: `url('${slide.backimage}')`,
            }}
          ></div>
        </div>
      </ReactCardFlip>
    </div>
  );
}

// Render cards in slide - see carousel.css
export default function myCollection({ viewerId }) {
  const [state, dispatch] = React.useReducer(slidesReducer, initialState);
  const viewersCards = useViewersCards(viewerId);

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
          frontimage: displayCardType(matchedCard.title,'Worn')
        };
      } else if (
        holdingCard.holdingAmount > 5 &&
        holdingCard.holdingAmount <= 15
      ) {
        return {
          ...matchedCard,
          rarity: 'Mint',
          frontimage: displayCardType(matchedCard.title,'Mint') //Mint card image
        };
      } else if (holdingCard.holdingAmount > 15) {
        return {
          ...matchedCard,
          rarity: 'Foil',
          frontimage: displayCardType(matchedCard.title,'Foil') //Foil card image
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
