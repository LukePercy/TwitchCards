import React, { useEffect, useReducer } from "react";
// Card info
import ShowCardsImage from "./ShowCardsImage/ShowCardsImage";
import Loader from "react-loader-spinner";
import useRedemption from "../customHooks/useRedemption";
import useViewersCards from "../customHooks/useViewersCards";

const initialState = {
  slideIndex: 0,
};

// Slide navigation to view collection of cards
const slidesReducer = (state, event) => {
  const { type, cardsForDisplay } = event;

  if (type === "NEXT") {
    return {
      ...state,
      slideIndex:
        state.slideIndex === 0
          ? cardsForDisplay.length - 1
          : state.slideIndex - 1,
    };
  }
  if (type === "PREV") {
    return {
      ...state,
      slideIndex: (state.slideIndex + 1) % cardsForDisplay.length,
    };
  }
};

// Render cards in slide - see carousel.css
const MyCollection = ({
  toggle,
  viewerId,
  channelId,
  twitchAuth,
  setViewerHasCards,
}) => {
  const [state, dispatch] = useReducer(slidesReducer, initialState);
  let isRewardRedeemed = useRedemption(channelId, twitchAuth);
  const { viewersCards, hasViewerExisted, isLoading } = useViewersCards(
    viewerId,
    isRewardRedeemed
  );

  useEffect(() => {
    if (isRewardRedeemed) {
      useViewersCards(viewerId, isRewardRedeemed);
    }
    return () => {
      isRewardRedeemed = false;
    };
  }, [isRewardRedeemed]);

  return (
    <div className="slides">
      {!isLoading ? (
        <>
          <ShowCardsImage
            toggle={toggle}
            state={state}
            dispatch={dispatch}
            viewerId={viewerId}
            viewersCards={viewersCards}
            isRewardRedeemed={isRewardRedeemed}
            hasViewerExisted={hasViewerExisted}
            setViewerHasCards={setViewerHasCards}
          />
        </>
      ) : (
        <Loader type="ThreeDots" color="#4d727d" height={100} width={100} />
      )}
    </div>
  );
};

export default MyCollection;
