import React, { useEffect, useState } from 'react';
// Database API. Stores twitch userID and their card collection data
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const ORIGIN_URL = process.env.REACT_APP_ORIGIN_URL;
// const BASE_URL = 'https://diceydeckbackend.herokuapp.com/api/viewers';
// const ORIGIN_URL = 'https://42xd9tib4hce93bavmhmseapyp7fwj.ext-twitch.tv';

// useViewersCards hook. Get which cards are held by the viewer, passing in viewerId
const useViewersCards = (viewerId, isRewardRedeemed) => {
  const [viewersCards, setViewersCards] = useState([]);

  useEffect(() => {
    const getCardsViewer = async (viewerId) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');
      headers.append('Origin', ORIGIN_URL);

      const response = await fetch(`${BASE_API_URL}/viewers/${viewerId}`, {
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
