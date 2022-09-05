import React, { useState, useEffect } from "react";
import Authentication from "../../util/Authentication/Authentication"; //Auth helper from twitch extension boilerplate
import MyCollection from "./myCollection/MyCollection"; // Carousel component to display users collection of cards
import NotSharedIdScreen from "./notSharedId/NotSharedId";
import ToggleButton from "./ToggleButton/ToggleButton";
import "./App.css";

// const BASE_API_URL = process.env.REACT_APP_BASE_API_URL; // DEV
// const ORIGIN_URL = process.env.REACT_APP_ORIGIN_URL; // DEV
const BASE_API_URL = "https://diceydeckbackend.herokuapp.com"; // PRODUCTION
const ORIGIN_URL = "https://42xd9tib4hce93bavmhmseapyp7fwj.ext-twitch.tv"; // PRODUCTION

export const authentication = new Authentication();

const App = () => {
  //if the extension is running on twitch or dev rig, set the shorthand here. otherwise, set to null.
  const twitch = window.Twitch ? window.Twitch.ext : null;

  const [isViewerHasCards, setViewerHasCards] = useState(false);
  const [toggle, setToggle] = useState(true);

  // The token and viewerId will be retrieved first by calling twitch.onAuthorized.
  // Then are the twitchAuth and channelId
  const [appInitState, setAppInitState] = useState({
    finishedLoading: false,
    theme: "light",
    isVisible: true,
    token: "",
    viewerId: "",
    twitchAuth: "",
    channelId: "",
  });

  const {
    twitchAuth,
    channelId,
    viewerId,
    finishedLoading,
    isVisible,
    theme,
    token,
  } = appInitState;

  const getOAuth = async () => {
    if (!token) return;

    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");
    headers.append("Origin", ORIGIN_URL);
    headers.append("Authorization", `Bearer ${token}`);

    try {
      const response = await fetch(`${BASE_API_URL}/api/authinfo`, {
        mode: "cors",
        method: "GET",
        headers: headers,
      });
      const result = await response.json();
      const { success, data, message } = result;

      if (success) {
        setAppInitState({
          ...appInitState,
          twitchAuth: data.token,
          channelId: data.channelId,
        });
      } else {
        throw new Error(`${message}`);
      }
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  };

  useEffect(() => {
    getOAuth();
  }, [twitchAuth, token]);

  const contextUpdate = (context, delta) => {
    if (delta.includes("theme")) {
      setAppInitState({
        ...appInitState,
        theme: context.theme,
      });
    }
  };

  const visibilityChanged = (isVisible) => {
    setAppInitState({
      ...appInitState,
      isVisible,
    });
  };

  useEffect(() => {
    if (twitch) {
      twitch.onAuthorized((auth) => {
        authentication.setToken(auth.token, auth.userId);
        if (!appInitState.finishedLoading) {
          setAppInitState({
            ...appInitState,
            viewerId: authentication.getUserId(),
            token: authentication.getToken(),
            finishedLoading: true,
          });
        }
      });

      twitch.listen("broadcast", (target, contentType, body) => {
        twitch.rig.log(
          `New PubSub message!\n${target}\n${contentType}\n${body}`
        );
        // now that you've got a listener, do something with the result...

        // do something...
      });

      twitch.onVisibilityChanged((isVisible, _c) => {
        visibilityChanged(isVisible);
      });

      twitch.onContext((context, delta) => {
        contextUpdate(context, delta);
      });
    }

    return () => {
      // clean up event listeners
      if (twitch) {
        twitch.unlisten("broadcast", () =>
          console.log("successfully unlistened")
        );
      }
    };
  }, [appInitState.finishedLoading, isVisible]);

  // const isMod = authentication.isModerator(); // store if user is moderator/broadcaster to see settings admin
  const isReadyForRendering =
    finishedLoading && isVisible && viewerId && twitchAuth && channelId;
  return (
    <>
      {isReadyForRendering ? (
        <div className="App">
          <div className={theme === "light" ? "App-light" : "App-dark"}>
            {isViewerHasCards && (
              <ToggleButton toggle={toggle} setToggle={setToggle} /> // toggle button to toggle between my collection and full deck view, disabled while I fix bugs
            )}
            <MyCollection
              toggle={toggle}
              viewerId={viewerId}
              channelId={channelId}
              twitchAuth={twitchAuth}
              setViewerHasCards={setViewerHasCards}
              isViewerHasCards={isViewerHasCards}
            />
          </div>
        </div>
      ) : (
        <div className="App">
          <NotSharedIdScreen />
        </div>
      )}
    </>
  );
};

export default App;
