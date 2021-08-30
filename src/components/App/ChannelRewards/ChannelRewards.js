import React from 'react';
import ComfyJS from 'comfy.js';

function ChannelRewards() {
  const channel = process.env.TWITCHCHANNEL;
  const clientId = process.env.CLIENTID;
  const twitchAuth = process.env.TWITCHOAUTH;

  ComfyJS.onCommand = (user, command, message, flags, extra) => {
    if (flags.broadcaster && command == 'test') {
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
  // TODO: may need credentials to test it.
  const createChannelRewardsPoint = async () => {
    let customReward = await ComfyJS.CreateChannelReward(clientId, {
      title: 'Test Reward',
      prompt: 'Test Description',
      cost: 100,
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
