import React, { useState, useEffect } from 'react';
import Authentication from '../../util/Authentication/Authentication'; //Auth helper from twitch extension boilerplate
import clsx from 'clsx';
import './App.css';
import MyCollection from './myCollection/MyCollection'; // Carousel component to display users collection of cards
import NotSharedIdScreen from './notSharedId/NotSharedId';

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL; // DEV
const ORIGIN_URL = process.env.REACT_APP_ORIGIN_URL; // DEV
// const BASE_API_URL = 'https://diceydeckbackend.herokuapp.com/api/authinfo'; // PRODUCTION
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

  const getOAuth = async () => {
    if (!token) return;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Origin', ORIGIN_URL);
    headers.append('Authorization', `Bearer ${token}`);

    const response = await fetch(`${BASE_API_URL}/api/authinfo`, {
      mode: 'cors',
      method: 'GET',
      headers: headers,
    });
    const result = await response.json();
    const { success, data } = result;
    if (success) {
      setTwitchAuth(data);
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
            channelId: auth.channelId,
            finishedLoading: true,
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
  }, []);

  const { viewerId, finishedLoading, isVisible, theme, channelId } = appInitState;
  const isMod = authentication.isModerator();
  const toggleBtnClassName = clsx('toggle-view-icon', toggle && 'deck');
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
              <span className={toggleBtnClassName} onClick={handleClick}></span>
              {isMod ? (
                  <a
                    href='/config.html'
                    target='_blank'
                  ><span className='settings-icon'/></a>
              ) : (
                <></>
              )}
            </div>
            <MyCollection
              toggle={toggle}
              viewerId={viewerId}
              channelId={channelId}
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
