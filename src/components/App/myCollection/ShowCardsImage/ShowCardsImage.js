import React, { useEffect } from "react";
import Slide from "./slide/Slide";
import useCardsForDisplay from "../../customHooks/useCardsForDisplay";
import Backimage from "../../cards/Card_Back-s1_worn.jpg";
import Deck from "./allCardView/AllCardsView";
import "../../App.css";

const ShowCardsImage = ({
  toggle,
  state,
  dispatch,
  viewerId,
  viewersCards,
  isRewardRedeemed,
  hasViewerExisted,
  setViewerHasCards,
  isViewerHasCards,
}) => {
  const cardsForDisplay = useCardsForDisplay(
    viewerId,
    viewersCards,
    isRewardRedeemed
  );

  // check if viewer has cards before showing view toggle
  if (cardsForDisplay.length) {
    setViewerHasCards(true);
  }

  return (
    <>
      {hasViewerExisted && isViewerHasCards ? (
        <>
          {toggle ? (
            <>
              <button
                onClick={() => dispatch({ type: "PREV", cardsForDisplay })}
              >
                ‹
              </button>
              {[...cardsForDisplay, ...cardsForDisplay, ...cardsForDisplay].map(
                (slide, i) => {
                  let offset = cardsForDisplay.length + (state.slideIndex - i);
                  return (
                    <Slide
                      slide={slide}
                      offset={offset}
                      key={i}
                      isRewardRedeemed={isRewardRedeemed}
                    />
                  );
                }
              )}
              <button
                onClick={() => dispatch({ type: "NEXT", cardsForDisplay })}
              >
                ›
              </button>
            </>
          ) : (
            <>
              <Deck cards={cardsForDisplay} />
            </>
          )}
        </>
      ) : (
        <>
          <div key="back">
            <div
              className="nocardsContainer"
              style={{
                backgroundImage: `url(${Backimage})`,
              }}
            ></div>
          </div>
        </>
      )}
    </>
  );
};

export default ShowCardsImage;
