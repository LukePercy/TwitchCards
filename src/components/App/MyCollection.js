import React, { useEffect, useState } from 'react';
import { slides } from './CardList';
import ReactCardFlip from 'react-card-flip';

const BASE_URL = 'http://localhost:3003/api/viewers';

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

function Slide({ slide, offset }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const handleClick = (e) => {
    e.preventDefault();
    setIsFlipped(!isFlipped);
  };
  const active = offset === 0 ? true : null;
  const ref = useTilt(active);

  // Function to determine how different card rarities display
  // This will be changed to be based off Backend card.holdingAmount
  function CardRarity() {
    let rarity = slide.rarity;
    if (rarity == 'Mint') {
      return <h4 className='slideRarityMint'>{slide.rarity}</h4>;
    } else if (rarity == 'Foil') {
      return <h4 className='slideRarityFoil shine'>{slide.rarity}</h4>;
    } else {
      return <h4 className='slideRarityWorn'>{slide.rarity}</h4>;
    }
  }

  function GetCardCount() {
    // Mock card count for styling skeleton
    let count = Math.floor(Math.random() * 26),
        maxCount = 25;

    // return values
    return (
      <div className="cardCount">{count}</div>
    );
  }

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
          <div className='slideContent' style={{backgroundImage: `url('${slide.frontimage}')`,}}>
            <div>
              <GetCardCount/>
            </div>
            <div className='slideContentInner'>

              {/* <h2 className='slideTitle'>{slide.title}</h2>
              <h3 className='slideSubtitle'>{slide.subtitle}</h3>
              <p className='slideDescription'>{slide.description}</p> */}
              <CardRarity/>
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
export default function myCollection() {
  const [state, dispatch] = React.useReducer(slidesReducer, initialState);
  const [viewersCards, setViewersCards] = useState([]);

  useEffect(() => {
    const getCardsViewer = async (userId = '425762901') => {
      const response = await fetch(`${BASE_URL}/${userId}`);
      const result = await response.json();
      const { data } = result;
      // If the viewer exists in db
      // return true, otherwise false;
      setViewersCards(data.holdingCards);
    };
    getCardsViewer();
  }, []);

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
          rarity: 'Worn',
        };
      } else if (
        holdingCard.holdingAmount > 5 &&
        holdingCard.holdingAmount <= 15
      ) {
        return {
          ...matchedCard,
          rarity: 'Mint',
        };
      } else if (holdingCard.holdingAmount > 15) {
        return {
          ...matchedCard,
          rarity: 'Foil',
        };
      } else {
        throw new Error('Should not happen. Holding amount out of numbered ranges');
      }
    }

    return matchedCard;
  });

  return (
    <div className='slides'>
      <button onClick={() => dispatch({ type: 'PREV' })}>‹</button>
      {[...cardsForDisplay, ...cardsForDisplay, ...cardsForDisplay].map(
        (slide, i) => {
          let offset = slides.length + (state.slideIndex - i);
          return <Slide slide={slide} offset={offset} key={i} />;
        }
      )}
      <button onClick={() => dispatch({ type: 'NEXT' })}>›</button>
    </div>
  );
}
