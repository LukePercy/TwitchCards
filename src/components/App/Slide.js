import React, { useState } from 'react';
// Flip card over to see back images
import ReactCardFlip from 'react-card-flip';
import useTilt from '../../customHooks/useTilt';
import CardsCount from '../App/CardsCount';

// Slide content. Includes card image and flip behavior.
const Slide = ({ viewerId, slide, offset }) => {
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
              <CardsCount cardId={slide.id} viewerId={viewerId} />
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
};

export default Slide;
