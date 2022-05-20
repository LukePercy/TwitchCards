import React, { useState, useEffect, useReducer, useContext } from "react";
// Card info
import useCardsForDisplay from "../customHooks/useCardsForDisplay";
import ShowCardsImage from "./ShowCardsImage/ShowCardsImage";
import Loader from "react-loader-spinner";
import { ChannelAuthContext } from "../ChannelAuthContext";
import useRedemption from "../customHooks/useRedemption";

<<<<<<< Updated upstream
 const BASE_API_URL = process.env.REACT_APP_BASE_API_URL; // DEV
 const ORIGIN_URL = process.env.REACT_APP_ORIGIN_URL; // DEV
// const BASE_API_URL  = 'https://diceydeckbackend.herokuapp.com'; // PRODUCTION
// const ORIGIN_URL = 'https://42xd9tib4hce93bavmhmseapyp7fwj.ext-twitch.tv'; // PRODUCTION
=======
// const BASE_API_URL = process.env.REACT_APP_BASE_API_URL; // DEV
// const ORIGIN_URL = process.env.REACT_APP_ORIGIN_URL; // DEV
const BASE_API_URL = "https://diceydeckbackend.herokuapp.com"; // PRODUCTION
const ORIGIN_URL = "https://42xd9tib4hce93bavmhmseapyp7fwj.ext-twitch.tv"; // PRODUCTION
>>>>>>> Stashed changes

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
const MyCollection = ({ viewerId, channelId, toggle }) => {
  const twitchAuth = useContext(ChannelAuthContext);
  const [state, dispatch] = useReducer(slidesReducer, initialState);
  const [hasViewerExisted, setViewerExisted] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const isRewardRedeemed = useRedemption(channelId, twitchAuth);
  const cardsForDisplay = useCardsForDisplay(viewerId, isRewardRedeemed);

  // use useEffect to fetch from DB check the viewer has existed in our DB
  useEffect(() => {
    const getCardsViewer = async () => {
      let headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("Accept", "application/json");
      headers.append("Origin", ORIGIN_URL);

      const response = await fetch(`${BASE_API_URL}/api/viewers/${viewerId}`, {
        mode: "cors",
        method: "GET",
        headers: headers,
      });
      const result = await response.json();
      const { success } = result;
      // Check the viewer has a card record in our DB first
      if (success) {
        // If the viewer has a card record, then set the flag to true
        setViewerExisted(true);
      }

      // No matter the viewer has or hasn't a card record
      // at this moment, stop the spinner by setting the loading flag
      setLoading(false);
    };
    getCardsViewer();
  }, [isRewardRedeemed]);

  return (
    <div className="slides">
      {isLoading ? (
        <Loader type="ThreeDots" color="#4d727d" height={100} width={100} />
      ) : (
        <>
          <ShowCardsImage
            hasViewerExisted={hasViewerExisted}
            state={state}
            dispatch={dispatch}
            cardsForDisplay={cardsForDisplay}
            toggle={toggle}
          />
        </>
      )}
    </div>
  );
};

export default MyCollection;
