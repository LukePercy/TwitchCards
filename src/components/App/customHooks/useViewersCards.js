import React, { useEffect, useState } from 'react';
// Database API. Stores twitch userID and their card collection data
const BASE_URL = 'http://localhost:3003/api/viewers';
const ORIGIN_URL = 'https://localhost:8080';

// useViewersCards hook. Get which cards are held by the viewer, passing in viewerId
const useViewersCards = (viewerId, isRewardRedeemed) => {
  const [viewersCards, setViewersCards] = useState([]);

  useEffect(() => {
    const getCardsViewer = async (viewerId) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');
      headers.append('Origin', ORIGIN_URL);

      const response = await fetch(`${BASE_URL}/${viewerId}`, {
        mode: 'cors',
        method: 'GET',
        headers: headers,
      });
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
  }, [viewerId, isRewardRedeemed]);
  return viewersCards;
};

export default useViewersCards;
