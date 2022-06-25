import React, { useState, useEffect, useReducer } from 'react';
// Card info
import useCardsForDisplay from '../customHooks/useCardsForDisplay';
import ShowCardsImage from './ShowCardsImage/ShowCardsImage';
import Loader from 'react-loader-spinner';
import useRedemption from '../customHooks/useRedemption';
import useViewersCards from '../customHooks/useViewersCards';

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL; // DEV
const ORIGIN_URL = process.env.REACT_APP_ORIGIN_URL; // DEV
// const BASE_API_URL = "https://diceydeckbackend.herokuapp.com"; // PRODUCTION
// const ORIGIN_URL = "https://42xd9tib4hce93bavmhmseapyp7fwj.ext-twitch.tv"; // PRODUCTION

const initialState = {
  slideIndex: 0,
};

// Slide navigation to view collection of cards
const slidesReducer = (state, event) => {
  const { type, cardsForDisplay } = event;

  if (type === 'NEXT') {
    return {
      ...state,
      slideIndex:
        state.slideIndex === 0
          ? cardsForDisplay.length - 1
          : state.slideIndex - 1,
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
const MyCollection = ({
  toggle,
  viewerId,
  channelId,
  twitchAuth,
  setViewerHasCards,
}) => {
  const [state, dispatch] = useReducer(slidesReducer, initialState);
  const isRewardRedeemed = useRedemption(channelId, twitchAuth);
  const { viewersCards, hasViewerExisted, isLoading } = useViewersCards(
    viewerId,
    isRewardRedeemed
  );

  return (
    <div className='slides'>
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
        <Loader type='ThreeDots' color='#4d727d' height={100} width={100} />
      )}
    </div>
  );
};

export default MyCollection;
