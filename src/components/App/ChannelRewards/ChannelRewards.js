import React from 'react';
import ComfyJS from 'comfy.js';
import { slides } from '../cardList/CardList';

// const BASE_URL = 'https://diceydeckbackend.herokuapp.com/api/viewers';
const BASE_URL = 'http://localhost:3003/api/viewers';
const UPDATEAMOUNT = 1;

function ChannelRewards({ token }) {
  const channel = 'gettingdicey'; //make .env when figure it out
  const clientId = '42xd9tib4hce93bavmhmseapyp7fwj'; //make .env when figure it out
  const twitchAuth = 'h7wpt7417rl2djr830vojy0zu5mj6f'; //make .env when figure it out

  const getCardsViewer = async (userId) => {
    const response = await fetch(`${BASE_URL}/${userId}`);
    const result = await response.json();
    const { success } = result;

    // If the viewer exists in db
    // return true, otherwise false;
    return success;
  };

  const updateViewerCardsCollection = async (userId, card) => {
    // Check if any of the param is not provided
    if (!userId || !card) {
      throw new Error('user ID or card is not provided!');
    }

    // Add the card to the viewer
    const response = await fetch(`${BASE_URL}/${userId}`, {
      method: 'PUT',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cardId: card.id,
        cardName: card.title,
        updateAmount: UPDATEAMOUNT,
      }),
    });

    const { success } = await response.json();

    return success;
  };

  const createViewerCardsCollection = async (userId, userName, card) => {
    // Check if any of the param is not provided
    if (!userId || !userName || !card) {
      throw new Error('some ID or name is not provided!');
    }

    // Prepare the holding cards object
    const holdingCards = {
      cardId: card.id,
      cardName: card.title,
      holdingAmount: 1,
    };

    // create a viewer
    const response = await fetch(`${BASE_URL}`, {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        {
          viewerId: userId,
          viewerName: userName,
          holdingCards: [holdingCards],
        },
      ]),
    });

    const { success } = await response.json();

    return success;
  };

  // On chat API - to add the custom reward
  ComfyJS.onChat = (user, message, flags, self, extra) => {
    if (message === '!cardrewardcreate') {
      ComfyJS.CreateChannelReward(clientId, {
        title: 'Unlock Trading Card',
        prompt:
          'Unlock a random Getting Dicey Trading Card and check your collection panel below the stream',
        cost: 250,
        is_enabled: true,
        background_color: '#00E5CB',
        is_user_input_required: false,
        is_max_per_stream_enabled: false,
        max_per_stream: 0,
        is_max_per_user_per_stream_enabled: false,
        max_per_user_per_stream: 0,
        is_global_cooldown_enabled: true,
        global_cooldown_seconds: 30,
        should_redemptions_skip_request_queue: true,
      });
      ComfyJS.Say(`Trading Card Reward Created!`);
    }
  };

  ComfyJS.Init(channel, twitchAuth);

  ComfyJS.onReward = async (user, reward, cost, message, extra) => {
    const { rewardFulfilled, userId, username } = extra;
    let randomCard = slides[Math.floor(Math.random() * slides.length)];

    let response = false;

    // Bug: this happens twice becuase response is true twice
    if (rewardFulfilled) {
      const hasRedeemUserExisted = await getCardsViewer(userId);
      // Check if the viewer has been stored in db already
      // If true, then update the amount of holding cards for the viewer
      if (hasRedeemUserExisted) {
        response = await updateViewerCardsCollection(userId, randomCard);
      } else {
        response = await createViewerCardsCollection(
          userId,
          username,
          randomCard
        );
      }
    }
    // this getRandomCard() may not be needed here
    // still, the randomCard var can be reachable with a random card
    // getRandomCard(); // Pick a random card to store in users collection

    if (response) {
      ComfyJS.Say(`${user} unlocked a new ${randomCard.title} card!`);
    }
  };
  const updateCard = {
    id: 5,
    title: 'DM',
    subtitle: 'The DM',
    description: "It's Get...Getting Dicey!",
    rarity: 'Mint',
    frontimage: 'DM-s1_mint.jpg',
    backimage: 'Card_Back-s1_mint.jpg',
  };

  // function getReward() {
  //   const channelRewards = ComfyJS.GetChannelRewards(clientId, true);
  //   console.log(channelRewards);
  // }
  return (
    <>
      <button
        onClick={() => updateViewerCardsCollection('425762901', updateCard)}
      >
        Update an existing Viewer Cards
      </button>
    </>
  );
}

export default ChannelRewards;
