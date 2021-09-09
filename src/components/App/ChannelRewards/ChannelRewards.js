import React from 'react';
import ComfyJS from 'comfy.js';
import { slides } from '../CardList';

const BASE_URL = 'http://localhost:3003/api/viewers';
const UPDATEAMOUNT = 1;

function ChannelRewards() {
  const channel = 'gettingdicey';//make .env when figure it out
  const clientId = '42xd9tib4hce93bavmhmseapyp7fwj'; //make .env when figure it out
  const twitchAuth = '5nuj572wexnwxvt1q7fsjx79q01xy8'; //make .env when figure it out
  const randomCard = slides[Math.floor(Math.random()*slides.length)];
  
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

  ComfyJS.onChat = (user, message, flags, self, extra) => {
    console.log('extra :>> ', extra);
    console.log(user + ':', message);
  };

  ComfyJS.Init(channel, twitchAuth);

  function getRandomCard() {
    return randomCard;
  }

  ComfyJS.onReward = async (user, reward, cost, message, extra) => {
    console.log('extra :>> ', extra);
    console.log(user + ' redeemed ' + reward + ' for ' + cost);
    const { rewardFulfilled, userId, username } = extra;

    let response = false;

    if (rewardFulfilled) {
      const hasRedeemUserExisted = await getCardsViewer(userId);
      console.log("hasredeemned", hasRedeemUserExisted);
      // Check if the viewer has been stored in db already
      // If true, then update the amount of holding cards for the viewer
      if (hasRedeemUserExisted) {
        response = await updateViewerCardsCollection(userId, randomCard);
      } else {
        response = await createViewerCardsCollection(
          userId,
          username,
          randomCard.id,
          randomCard.title
        );
      }
    }
    console.log("response ==>", response);

    getRandomCard(); // Pick a random card to store in users collection

    if (response) {
      ComfyJS.Say(user + ' unlocked a new' + randomCard.title + ' card!');
    }
  };

  function getReward(){
    const channelRewards = ComfyJS.GetChannelRewards( clientId, true );
    console.log( channelRewards );
  }

  // TODO: may need credentials to test it.
  const createChannelRewardsPoint = async () => {
    let customReward = await ComfyJS.CreateChannelReward(clientId, {
      title: 'Unlock a card test',
      prompt: 'Whoop',
      cost: 1,
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

// return testing view w/ buttons
  return (
    <div>
      <button onClick={createChannelRewardsPoint}>Create Reward Info</button>
      <br />
      {/* <button onClick={removeReward}>Remove Reward</button>
      <br /> */}
      <button onClick={getReward}>Get Reward info</button>
      <br />
      <button onClick={() => getCardsViewer('abc-efg-hijk')}>Get Cards Info</button>
    </div>
  );
}

export default ChannelRewards;
