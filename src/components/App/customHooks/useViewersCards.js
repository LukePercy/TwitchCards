import React, { useEffect, useState } from "react";
// Database API. Stores twitch userID and their card collection data
// const BASE_API_URL = process.env.REACT_APP_BASE_API_URL; // DEV
// const ORIGIN_URL = process.env.REACT_APP_ORIGIN_URL; // DEV
const BASE_API_URL = "https://diceydeckbackend.herokuapp.com"; // PRODUCTION
const ORIGIN_URL = "https://42xd9tib4hce93bavmhmseapyp7fwj.ext-twitch.tv"; // PRODUCTION

// useViewersCards hook. Get which cards are held by the viewer, passing in viewerId
const useViewersCards = (viewerId, isRewardRedeemed) => {
  const [viewersCards, setViewersCards] = useState([]);
  const [hasViewerExisted, setViewerExisted] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const getCardsViewer = async (viewerId) => {
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
    const { success, data } = result;
    if (success) {
      // If the viewer exists in db
      // return true, otherwise false;
      setViewersCards(data.holdingCards);
      setViewerExisted(success);
      setLoading(!success);
    } else {
      setViewersCards([]);
      setLoading(success);
    }
  };

  useEffect(() => {
    let isCancelled = false;

    if (!isCancelled) getCardsViewer(viewerId);

    return () => {
      isCancelled = true;
    };
  }, [viewerId, isRewardRedeemed]);

  return {
    isLoading,
    viewersCards,
    hasViewerExisted,
  };
};

export default useViewersCards;
