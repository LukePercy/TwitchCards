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

  // This useEffect hack below is to delay the refresh and update the holding Amount number on cards
  // As we return the cards for display from the API response, the holding amount can take a moment to update
  // after react mounts the child components
  useEffect(() => {
    console.log("inside SetTimeoutUseEffect on Redeem", isRewardRedeemed);
    setTimeout(() => {}, 3000);
  }, [isRewardRedeemed]);
  console.log("outside SetTimeoutUseEffect on Redeem", isRewardRedeemed);
  return (
    <>
      {hasViewerExisted ? (
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
                  return <Slide slide={slide} offset={offset} key={i} />;
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
