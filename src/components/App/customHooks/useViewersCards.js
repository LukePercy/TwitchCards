import React, { useEffect, useState } from 'react';

// Database API. Stores twitch userID and their card collection data
// const BASE_URL = 'http://localhost:3003/api/viewers';
const BASE_URL = 'https://diceydeckbackend.herokuapp.com/api/viewers';

// useViewersCards hook. Get which cards are held by the viewer, passing in viewerId
const useViewersCards = (viewerId, token) => {
  console.log(`useViewersCardsToken ==>`, token)
  const [viewersCards, setViewersCards] = useState([]);
  useEffect(() => {
    const getCardsViewer = async (viewerId) => {
      console.log(`useViewerCardsToken useEffect ===>`, token)
      const response = await fetch(`${BASE_URL}/${viewerId}`,{
        method: 'GET',
        headers: {
          'Access-Control-Allow-Origin': 'https://42xd9tib4hce93bavmhmseapyp7fwj.ext-twitch.tv',
          'Content-Type': 'application/json',
          Authentication: token,
        }
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
  }, [viewerId]);
  return viewersCards;
};

export default useViewersCards;
