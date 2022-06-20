import React, { useState, useEffect } from 'react';
import Authentication from '../../util/Authentication/Authentication'; //Auth helper from twitch extension boilerplate
import clsx from 'clsx';
import './App.css';
import MyCollection from './myCollection/MyCollection'; // Carousel component to display users collection of cards
import NotSharedIdScreen from './notSharedId/NotSharedId';
import useRedemption from './customHooks/useRedemption';
import useCardsForDisplay from './customHooks/useCardsForDisplay';

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL; // DEV
const ORIGIN_URL = process.env.REACT_APP_ORIGIN_URL; // DEV
// const BASE_API_URL = 'https://diceydeckbackend.herokuapp.com'; // PRODUCTION
// const ORIGIN_URL = 'https://42xd9tib4hce93bavmhmseapyp7fwj.ext-twitch.tv'; // PRODUCTION

export const authentication = new Authentication();

const App = () => {
  //if the extension is running on twitch or dev rig, set the shorthand here. otherwise, set to null.
  const twitch = window.Twitch ? window.Twitch.ext : null;
  const [twitchAuth, setTwitchAuth] = useState('');
  const [appInitState, setAppInitState] = useState({
    viewerId: '',
    finishedLoading: false,
    theme: 'light',
    isVisible: true,
    token: '',
    channelId: '',
  });
  const [isViewToggle, setViewToggle] = useState(false);
  const handleClick = (e) => {
    e.preventDefault();
    setViewToggle(!isViewToggle);
  };

  let toggle = !isViewToggle;

  const { token } = appInitState;

  let isRewardRedeemed;
  let cardsForDisplay;
  let hasViewerCards;

  const getOAuth = async () => {
    if (!token) return;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Origin', ORIGIN_URL);
    headers.append('Authorization', `Bearer ${token}`);

    try {
      const response = await fetch(`${BASE_API_URL}/api/authinfo`, {
        mode: 'cors',
        method: 'GET',
        headers: headers,
      });
      const result = await response.json();
      const { success, data, message } = result;
      if (success) {
        setTwitchAuth(data);
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
    if (delta.includes('theme')) {
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
            channelId: '52092016',
            finishedLoading: true,
            isVisible,
          });
        }
      });

      twitch.listen('broadcast', (target, contentType, body) => {
        twitch.rig.log(
          `New PubSub message!\n${target}\n${contentType}\n${body}`
        );
        // now that you've got a listener, do something with the result...

        // do something...
      });

      twitch.onVisibilityChanged((isVisible, _c) => {
        console.log('isVisible :>> ', isVisible);
        visibilityChanged(isVisible);
      });

      twitch.onContext((context, delta) => {
        contextUpdate(context, delta);
      });
    }

    return () => {
      if (twitch) {
        twitch.unlisten('broadcast', () =>
          console.log('successfully unlistened')
        );
      }
    };
  }, [appInitState.finishedLoading]);

  const { viewerId, finishedLoading, isVisible, theme, channelId } =
    appInitState;
  // const isMod = authentication.isModerator(); // store if user is moderator/broadcaster to see settings admin
  const toggleBtnClassName = clsx('toggle-view-icon', toggle && 'deck'); // conditional styles

  isRewardRedeemed = useRedemption(channelId, twitchAuth); // usehook for getting cards
  cardsForDisplay = useCardsForDisplay(viewerId, isRewardRedeemed); // usehook for getting cards
  hasViewerCards = cardsForDisplay.length > 1; // check if viewer has cards before showing view toggle

  // when toggle is false
  // toggleBtnClassName = 'toggle-view-icon'
  // when toggle is true
  // toggleBtnClassName = 'toggle-view-icon deck'
  return (
    <>
      {finishedLoading && isVisible && viewerId && twitchAuth ? (
        <div className='App'>
          <div className={theme === 'light' ? 'App-light' : 'App-dark'}>
            <div className='icons-area'>
              {hasViewerCards ? (
                <span
                  className={toggleBtnClassName}
                  onClick={handleClick}
                ></span>
              ) : (
                <></>
              )}
            </div>
            <MyCollection
              toggle={toggle}
              viewerId={viewerId}
              isRewardRedeemed={isRewardRedeemed}
              cardsForDisplay={cardsForDisplay}
            />
          </div>
        </div>
      ) : (
        <div className='App'>
          <NotSharedIdScreen />
        </div>
      )}
    </>
  );
};

export default App;
