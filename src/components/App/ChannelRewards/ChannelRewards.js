import React from 'react';
import ComfyJS from 'comfy.js';
import { slides } from '../cardList/CardList';

// const BASE_URL = 'http://localhost:3003/api/viewers';
const BASE_URL = 'https://diceydeckbackend.herokuapp.com/api/viewers';
const UPDATEAMOUNT = 1;

function ChannelRewards({ token }) {
  const channel = 'gettingdicey'; //make .env when figure it out
  const clientId = '42xd9tib4hce93bavmhmseapyp7fwj'; //make .env when figure it out
  const twitchAuth = 'h7wpt7417rl2djr830vojy0zu5mj6f'; //make .env when figure it out

  const getCardsViewer = async (userId) => {
    const response = await fetch(`${BASE_URL}/${userId}`, { mode: 'no-cors'});
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
        'Content-Type': 'application/json',
        Authentication: token,
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
        'Content-Type': 'application/json',
        Authentication: token,
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
  ComfyJS.onCommand = (user, command, message, flags, extra) => {
  if (command=== 'cardrewardcreate') {
    ComfyJS.CreateChannelReward(clientId, {
      title: 'Unlock Trading Card',
      prompt: 'Unlock a random Getting Dicey Trading Card and check your collection panel below the stream',
      cost: 250,
      is_enabled: true,
      background_color: '#00E5CB',
      is_user_input_required: false,
      is_max_per_stream_enabled: false,
      max_per_stream: 0,
      is_max_per_user_per_stream_enabled: false,
      max_per_user_per_stream: 0,
      is_global_cooldown_enabled: true,
      global_cooldown_seconds: 10,
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

  // function getReward() {
  //   const channelRewards = ComfyJS.GetChannelRewards(clientId, true);
  //   console.log(channelRewards);
  // }

  // const randCard = {
  //   backimage: 'img/Card_Back-01.svg',
  //   description: "It's Get...Getting Dicey!",
  //   frontimage: 'img/DM_2-01.svg',
  //   id: 5,
  //   rarity: 'Foil',
  //   subtitle: 'The DM',
  //   title: 'The DM',
  // };

  // const updateNewCard = {
  //   backimage: 'img/Card_Back-01.svg',
  //   description: 'Run away!',
  //   frontimage: 'img/Morely_2.svg',
  //   id: 3,
  //   rarity: 'Worn',
  //   subtitle: 'Rogue',
  //   title: 'Cptn. Morely',
  // };

  // const updateExistingCard = {
  //   backimage: 'img/Card_Back-01.svg',
  //   description: 'Run away!',
  //   frontimage: 'img/Morely_2.svg',
  //   id: 3,
  //   rarity: 'Worn',
  //   subtitle: 'Rogue',
  //   title: 'Cptn. Morely',
  // };

  // return testing view w/ buttons
  return (
    <div>
      {/* <button onClick={createChannelRewardsPoint}>Create Reward Info</button>
      <br /> */}
      {/* <button onClick={removeReward}>Remove Reward</button>
      <br /> */}
      {/* <button onClick={getReward}>Get Reward info</button>
      <br />
      <button
        onClick={() =>
          createViewerCardsCollection('zxc-vbn-mlkj', 'skyblue', randCard)
        }
      >
        Create a new Viewer
      </button>
      <br />
      <button
        onClick={() => updateViewerCardsCollection('425762901', updateNewCard)}
      >
        Update a viewer with a new card
      </button>
      <br />
      <button
        onClick={() =>
          updateViewerCardsCollection('zxc-vbn-mlkj', updateExistingCard)
        }
      >
        Update a viewer with an existing card
      </button> */}
    </div>
  );
}

export default ChannelRewards;
