<<<<<<< HEAD
import React from 'react';
import Authentication from '../../util/Authentication/Authentication'; // Auth helper from twitch extension boilerplate
=======
import React, { useState, useEffect } from 'react';
import Authentication from '../../util/Authentication/Authentication'; //Auth helper from twitch extension boilerplate
>>>>>>> 9727233 (refactored App.js to a functional component)
import './App.css';
import MyCollection from './myCollection/MyCollection'; // Carousel component to display users collection of cards
import NotSharedIdScreen from './notSharedId/NotSharedId';

export const authentication = new Authentication();

const App = () => {
  //if the extension is running on twitch or dev rig, set the shorthand here. otherwise, set to null.
  const twitch = window.Twitch ? window.Twitch.ext : null;
  const [appInitState, setAppInitState] = useState({
    viewerId: '',
    finishedLoading: false,
    theme: 'light',
    isVisible: true,
    token: '',
    channelId: '',
  });

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

  const { viewerId, finishedLoading, isVisible, theme, channelId } =
    appInitState;

  return (
    <>
      {finishedLoading && isVisible && viewerId ? (
        <div className='App'>
          <div className={theme === 'light' ? 'App-light' : 'App-dark'}>
            <MyCollection viewerId={viewerId} channelId={channelId} />
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
