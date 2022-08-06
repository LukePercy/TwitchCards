import { useEffect, useState } from "react";

// Source: https://www.thepolyglotdeveloper.com/2015/03/create-a-random-nonce-string-using-javascript/
const nonce = (length) => {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

const useRedemption = (channelId, twitchAuth) => {
  const [isRewardFulfilled, setRewardFulfilled] = useState(false);
  const [heartbeatHandle, setHeartbeatHandle] = useState(null);
  const [message, setMessage] = useState({
    type: "LISTEN",
    nonce: nonce(15),
    data: {
      topics: [`channel-points-channel-v1.${channelId}`],
      auth_token: twitchAuth,
    },
  });

  const heartbeatInterval = 1000 * 60; //ms between PING"s
  const reconnectInterval = 1000 * 3; //ms to wait before reconnect

  // connect the twitch pubsub websocket
  const ws = new WebSocket("wss://pubsub-edge.twitch.tv");

  useEffect(() => {
    ws.onopen = (e) => {
      ws.send(JSON.stringify({ type: "PING" }));
      setHeartbeatHandle(
        setInterval(() => {
          ws.send(JSON.stringify({ type: "PING" }));
        }, heartbeatInterval)
      );

      // Listen to channel points topic
      ws.send(JSON.stringify(message));
    };

    ws.onerror = (error) => {
      console.error(error);
    };

    ws.onmessage = (event) => {
      const eventMessage = JSON.parse(event.data);
      setMessage(eventMessage);

      switch (eventMessage.type) {
        case "RESPONSE":
          if (eventMessage.error === "ERR_BADAUTH") {
            console.error("PubSub Authentication Failure");
          }
          break;

        case "RECONNECT":
          setTimeout(() => {
            pubsubConnect(channelId, twitchAuth);
          }, reconnectInterval);
          break;

        case "MESSAGE":
          if (eventMessage.data.topic.startsWith("channel-points-channel")) {
            const messageData = JSON.parse(eventMessage.data.message);
            if (messageData.type === "reward-redeemed") {
              const { redemption } = messageData.data;

              setRewardFulfilled(redemption.status === "FULFILLED");
            }
          }
          break;
      }
    };

    return () => {
      ws.onclose = () => {
        clearInterval(heartbeatHandle);
        setTimeout(() => {
          pubsubConnect(channelId, twitchAuth);
        }, reconnectInterval);
      };
      setRewardFulfilled(false);
    };
  }, [isRewardFulfilled, twitchAuth]);
  return isRewardFulfilled;
};

export default useRedemption;
