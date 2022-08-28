import React, { useState } from "react";
import { useSprings, animated, to as interpolate } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import styles from "./../../../../App/App.css";

// These two are just helpers, they curate spring data, values that are later being interpolated into css
const to = (i) => ({
  x: 0,
  y: i * -0.1,
  scale: 1,
  rot: -10 + Math.random() * 20,
  delay: i * 100,
});
const from = (_i) => ({ x: 0, rot: 0, scale: 1.5, y: -1000 });
// This is being used down there in the view, it interpolates rotation and scale into a css transform r (rot passed in) and s (scale passed in) being based into the styles
const trans = (r, s) =>
  `perspective(1500px) rotateX(30deg) rotateY(${
    r / 10
  }deg) rotateZ(${r}deg) scale(${s})`;

function Deck({ cards }) {
  const deckImages = cards.map((cards) => {
    let foilCardsNumber;
    let mintCardsNumber;
    let wornCardsNumber;

    if (cards.holdingAmount - 15) {
      foilCardsNumber = cards.holdingAmount - 15;
      mintCardsNumber = 10;
      wornCardsNumber = 5;
    } else if (cards.holdingAmount - 10) {
      foilCardsNumber = 0;
      mintCardsNumber = cards.holdingAmount - 10;
      wornCardsNumber = 5;
    } else if (cards.holdingAmount - 5) {
      foilCardsNumber = 0;
      mintCardsNumber = 0;
      wornCardsNumber = cards.holdingAmount;
    }

    const foilCardImage = require(`../../../cards/${cards.title}-s1_foil.jpg`);
    const mintCardImage = require(`../../../cards/${cards.title}-s1_mint.jpg`);
    const wornCardImage = require(`../../../cards/${cards.title}-s1_worn.jpg`);

    const foilCardArray = [];
    const mintCardArray = [];
    const wornCardArray = [];

    for (let i = 0; i < foilCardsNumber; i++) {
      foilCardArray.push(foilCardImage);
    }
    for (let i = 0; i < mintCardsNumber; i++) {
      mintCardArray.push(mintCardImage);
    }
    for (let i = 0; i < wornCardsNumber; i++) {
      wornCardArray.push(wornCardImage);
    }

    const allCards = [...foilCardArray, ...mintCardArray, ...wornCardArray];
    return allCards;
  });

  // TO DO: This clean up is exensive and can cause issues with lots of cards.
  const cleanUpDeckImages = deckImages.flat();

  // The set flags all the cards that are flicked out
  const [gone] = useState(() => new Set());
  const [props, api] = useSprings(cleanUpDeckImages.length, (i) => ({
    ...to(i),
    from: from(i),
  }));
  // Create a bunch of springs using the helpers above
  // Create a gesture from @use-gesture, we're interested in click and Drag state via useDrag, delta (current-pos - click-pos), direction and velocity
  const bind = useDrag(
    ({
      args: [index],
      active,
      movement: [mx],
      direction: [xDir],
      velocity: [vx],
    }) => {
      const trigger = vx > 0.2; // If you flick hard enough it should trigger the card to fly out
      if (!active && trigger) gone.add(index); // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out
      api.start((i) => {
        if (index !== i) return; // We're only interested in changing spring-data for the current spring
        const isGone = gone.has(index);
        const x = isGone ? (350 + window.innerWidth) * xDir : active ? mx : 0; // When a card is gone it flys out left or right, otherwise goes back to zero
        const rot = mx / 100 + (isGone ? xDir * 10 * vx : 0); // How much the card rotates when flicked to gone, flicking it harder makes it rotate faster
        const scale = active ? 1.25 : 1.1; // Active cards lift up a bit like you are picking it up
        return {
          x,
          rot,
          scale,
          delay: undefined,
          config: { friction: 50, tension: active ? 800 : isGone ? 200 : 500 },
        };
      });
      if (!active && gone.size === cleanUpDeckImages.length)
        setTimeout(() => {
          gone.clear();
          api.start((i) => to(i));
        }, 600);
    }
  );
  // Now we're just mapping the animated values to our view, that's it. Btw, this component only renders once. :-)
  return (
    <div className="deckViewcontainer">
      <div className="deckView">
        {props.map(({ x, y, rot, scale }, i) => (
          <animated.div className={styles.deck} key={i} style={{ x, y }}>
            {/* This is the card itself, we're binding our gesture to it (and inject its index so we know which is which) */}
            <animated.div
              {...bind(i)}
              style={{
                transform: interpolate([rot, scale], trans),
                backgroundImage: `url(${cleanUpDeckImages[i]})`,
              }}
            />
          </animated.div>
        ))}
      </div>
    </div>
  );
}

export default React.memo(Deck);
