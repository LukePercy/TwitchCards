import React from 'react';
import Authentication from '../../util/Authentication/Authentication'; //Auth helper from twitch extension boilerplate
import './App.css';
import MyCollection from './myCollection/MyCollection'; // Carousel component to display users collection of cards
import ChannelRewards from './ChannelRewards/ChannelRewards';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.Authentication = new Authentication();

    //if the extension is running on twitch or dev rig, set the shorthand here. otherwise, set to null.
    this.twitch = window.Twitch ? window.Twitch.ext : null;
    this.state = {
      viewerId: '',
      finishedLoading: false,
      theme: 'light',
      isVisible: true,
      token: '',
    };
  }

  contextUpdate(context, delta) {
    if (delta.includes('theme')) {
      this.setState(() => {
        return { theme: context.theme };
      });
    }
  }

  visibilityChanged(isVisible) {
    this.setState(() => {
      return {
        isVisible,
      };
    });
  }

  componentDidMount() {
    if (this.twitch) {
      this.twitch.onAuthorized((auth) => {
        console.log('auth :>> ', auth);
        this.Authentication.setToken(auth.token, auth.userId);
        if (!this.state.finishedLoading) {
          // if the component hasn't finished loading (as in we've not set up after getting a token), let's set it up now.

          // now we've done the setup for the component, let's set the state to true to force a rerender with the correct data.
          this.setState(() => {
            return {
              viewerId: this.Authentication.getUserId(),
              token: this.Authentication.getToken(),
              finishedLoading: true,
            };
          });
        }
      });

      this.twitch.listen('broadcast', (target, contentType, body) => {
        this.twitch.rig.log(
          `New PubSub message!\n${target}\n${contentType}\n${body}`
        );
        // now that you've got a listener, do something with the result...

        // do something...
      });

      this.twitch.onVisibilityChanged((isVisible, _c) => {
        this.visibilityChanged(isVisible);
      });

      this.twitch.onContext((context, delta) => {
        this.contextUpdate(context, delta);
      });
    }
  }

  componentWillUnmount() {
    if (this.twitch) {
      this.twitch.unlisten('broadcast', () =>
        console.log('successfully unlistened')
      );
    }
  }
<<<<<<< HEAD
=======

>>>>>>> develop
  render() {
    const viewerId = this.state.viewerId;

    if (this.state.finishedLoading && this.state.isVisible && viewerId) {
      return (
        <div className='App'>
          <div
            className={this.state.theme === 'light' ? 'App-light' : 'App-dark'}
          >
<<<<<<< HEAD
            <ChannelRewards />
            <MyCollection viewerId={viewerId} />
=======
            <MyCollection viewerId={viewerId} />
            <ChannelRewards token={this.state.token} />
            {/* <MyCollection viewerId={viewerId} /> */}
            {/* <p>I have {this.Authentication.hasSharedId() ? `shared my ID, and my user_id is ${this.Authentication.getUserId()}` : 'not shared my ID'}.</p> */}
>>>>>>> develop
          </div>
        </div>
      );
    } else {
      return (
        <div className='App'>
          <p>
            Accept permissions below to start collecting Getting Dicey Trading
            Cards
          </p>
        </div>
      );
    }
  }
}
