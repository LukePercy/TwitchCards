import React, { useState } from 'react';
import ComfyJS from 'comfy.js';

const BASE_URL = 'http://localhost:3003/api/viewers';
const UPDATEAMOUNT = 1;

function ChannelRewards({ card }) {
  const channel = 'gettingdicey'; //make .env when figure it out
  const clientId = 'k7xl2us0z23wmr0cj169zyz66hbnbq'; //make .env when figure it out
  const twitchAuth = 'ajyeqi3zlvszui1h6wi20yaki06ntz'; //make .env when figure it out
  const cardname = ' Card Title Test';
  const cardrarity = ' Card Rarity Test';

  const getCardsViewer = async (userId) => {
    const response = await fetch(`${BASE_URL}/${userId}`);
    const result = await response.json();
    console.log('result :>> ', result);
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
    const response = await fetch(`${BASE_URL}/${userId}`, {
      method: 'POST',
      body: JSON.stringify({
        viewerId: userId,
        viewerName: userName,
        holdingCards: [holdingCards],
      }),
    });

    const { success } = await response.json();

    return success;
  };

  ComfyJS.onCommand = (user, command, message, flags, extra) => {
    if (command == 'test') {
      console.log('!test was typed in chat');
    }
  };

  ComfyJS.onChat = (user, message, flags, self, extra) => {
    console.log('extra :>> ', extra);
    console.log(user + ':', message);
  };

  ComfyJS.Init(channel, twitchAuth);

  ComfyJS.onReward = async (user, reward, cost, extra) => {
    console.log('extra :>> ', extra);
    console.log(user + ' redeemed ' + reward + ' for ' + cost);
    const { rewardFulfilled, userId, username } = extra;

    let response = false;

    if (rewardFulfilled) {
      const hasRedeemUserExisted = await getCardsViewer(userId);

      // Check if the viewer has been stored in db already
      // If true, then update the amount of holding cards for the viewer
      if (hasRedeemUserExisted) {
        response = await updateViewerCardsCollection(userId);
      } else {
        response = await createViewerCardsCollection(
          userId,
          username,
          card.id,
          card.title
        );
      }
    }

    if (response) {
      ComfyJS.Say(user + ' Unlocked a new card! ' + cardname + cardrarity);
    }
  };

  // TODO: may need credentials to test it.
  const createChannelRewardsPoint = async () => {
    let customReward = await ComfyJS.CreateChannelReward(clientId, {
      title: 'Unlock Card',
      prompt: 'Collect all Getting Dicey Collectable Cards',
      cost: 250000,
      is_enabled: true,
      background_color: '#00E5CB',
      is_user_input_required: false,
      is_max_per_stream_enabled: false,
      max_per_stream: 0,
      is_max_per_user_per_stream_enabled: false,
      max_per_user_per_stream: 0,
      is_global_cooldown_enabled: false,
      global_cooldown_seconds: 0,
      should_redemptions_skip_request_queue: true,
    });
    console.log('customReward :>> ', customReward);
  };

  return (
    <div>
      <button onClick={createChannelRewardsPoint}>Create Reward Info</button>
      <br />
      <button onClick={() => getCardsViewer('abc-efg-hijk')}>
        Get Cards Info
      </button>
    </div>
  );
}

export default ChannelRewards;
