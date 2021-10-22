import React, { useEffect, useState } from 'react';

const useRedemption = (channelId, twitchAuth) => {
  const [isRewardFulfilled, setRewardFulfilled] = useState(false);
  const heartbeatInterval = 1000 * 60; //ms between PING's
  const reconnectInterval = 1000 * 5; //ms to wait before reconnect
  let heartbeatHandle;

  // connect the twitch pubsub websocket
  const ws = new WebSocket('wss://pubsub-edge.twitch.tv');

  // Source: https://www.thepolyglotdeveloper.com/2015/03/create-a-random-nonce-string-using-javascript/
  const nonce = (length) => {
    let text = '';
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  };

  useEffect(() => {
    ws.onopen = (e) => {
      ws.send(JSON.stringify({ type: 'PING' }));
      heartbeatHandle = setInterval(() => {
        ws.send(JSON.stringify({ type: 'PING' }));
      }, heartbeatInterval);

      // Listen to channel points topic
      let message = {
        type: 'LISTEN',
        nonce: nonce(15),
        data: {
          topics: [`channel-points-channel-v1.${channelId}`],
          auth_token: twitchAuth,
        },
      };

      ws.send(JSON.stringify(message));
    };

    ws.onerror = (error) => {
      console.error(error);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('message :>> ', message);
      let isRedeemed;

      switch (message.type) {
        case 'RESPONSE':
          if (message.error === 'ERR_BADAUTH') {
            console.error('PubSub Authentication Failure');
          }
          break;

        case 'RECONNECT':
          setTimeout(() => {
            pubsubConnect(channelId, twitchAuth);
          }, reconnectInterval);
          break;

        case 'MESSAGE':
          if (message.data.topic.startsWith('channel-points-channel')) {
            let messageData = JSON.parse(message.data.message);
            if (messageData.type === 'reward-redeemed') {
              let redemption = messageData.data.redemption;
              console.log(redemption);
              isRedeemed = redemption.status === 'FULFILLED';
            }
          }
          break;
      }

      setRewardFulfilled(isRedeemed);
    };

    return () => {
      ws.onclose = () => {
        clearInterval(heartbeatHandle);
        setTimeout(() => {
          pubsubConnect(channelId, twitchAuth);
        }, reconnectInterval);
      };
    };
  }, [isRewardFulfilled]);

  return isRewardFulfilled;
};

export default useRedemption;
