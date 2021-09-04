import React from 'react';
import ComfyJS from 'comfy.js';


function ChannelRewards() {
  const channel = 'gettingdicey';//make .env when figure it out
  const clientId = 'k7xl2us0z23wmr0cj169zyz66hbnbq';//make .env when figure it out
  const twitchAuth = 'ajyeqi3zlvszui1h6wi20yaki06ntz'; //make .env when figure it out
  const cardname = " Card Title Test";
  const cardrarity = " Card Rarity Test";



  ComfyJS.onCommand = (user, command, message, flags, extra) => {
    if (command == 'test') {
      console.log('!test was typed in chat');
    }
  };

  ComfyJS.onChat = (user, message, flags, self, extra) => {
    console.log(user + ':', message);
  };

  ComfyJS.Init(channel, twitchAuth);

  const getChannelRewardsPoint = async () => {
    let channelRewards = await ComfyJS.GetChannelRewards(clientId, true);
    console.log('channelRewards :>> ', channelRewards);
    if (channelRewards) {
      return channelRewards;
    }
  };

  ComfyJS.onReward = async ( user, reward, cost, extra ) => {
    console.log( user + " redeemed " + reward + " for " + cost );
    ComfyJS.Say( user + " Unlocked a new card! " + cardname + cardrarity);
  }

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
      <button onClick={getChannelRewardsPoint}>Get Points Info</button>
      <br />
      <button onClick={createChannelRewardsPoint}>Create Reward Info</button>
    </div>
  );
}

export default ChannelRewards;
