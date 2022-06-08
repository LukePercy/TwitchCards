import React from 'react';
import clsx from 'clsx';
import Authentication from '../../util/Authentication/Authentication';
import './Config.css';

// const BASE_API_URL = process.env.REACT_APP_BASE_API_URL; // DEV
const BASE_API_URL = 'https://diceydeckbackend.herokuapp.com'; // PRODUCTON
export default class ConfigPage extends React.Component {
  constructor(props) {
    super(props);
    this.Authentication = new Authentication();

    //if the extension is running on twitch or dev rig, set the shorthand here. otherwise, set to null.
    this.twitch = window.Twitch ? window.Twitch.ext : null;
    this.state = {
      finishedLoading: false,
      theme: 'light',
      clickCounter: 0,
    };
  }

  contextUpdate(context, delta) {
    if (delta.includes('theme')) {
      this.setState(() => {
        return { theme: context.theme };
      });
    }
  }

  componentDidMount() {
    // do config page setup as needed here
    if (this.twitch) {
      this.twitch.onAuthorized((auth) => {
        this.Authentication.setToken(auth.token, auth.userId);
        if (!this.state.finishedLoading) {
          // if the component hasn't finished loading (as in we've not set up after getting a token), let's set it up now.

          // now we've done the setup for the component, let's set the state to true to force a rerender with the correct data.
          this.setState(() => {
            return { finishedLoading: true };
          });
        }
      });

      this.twitch.onContext((context, delta) => {
        this.contextUpdate(context, delta);
      });
    }
  }

  render() {
    if (this.state.finishedLoading && this.Authentication.isModerator()) {
      return (
        <div
          className={
            this.state.theme === 'light' ? 'Config-light' : 'Config-dark'
          }
        >
          <div className='Config'>
            <div className='container'>
              <h2>Channel Point Trading Cards Configuration</h2>
              <section>
                <p>
                  Click the below button to allow Channel Points Trading Cards
                  to interact with your channel.
                </p>
                <button
                  type='button'
                  className={clsx(
                    'authbutton',
                    this.state.clickCounter && 'disabled'
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(`${BASE_API_URL}/api/auth/twitch`, '_blank');
                    this.setState({
                      ...this.state,
                      clickCounter: this.state.clickCounter + 1,
                    });
                  }}
                >
                  Authenticate with Twitch
                  <div className='arrow-wrapper'>
                    <div className='arrow' />
                  </div>
                </button>
              </section>
              <section>
                <div className='container'>
                  <h3>Manage Rewards</h3>
                  <span className='coming-soon-text'>coming soon</span>
                  {/* <button type='button'>Create Reward
            <div class="plus-wrapper">
                <div class="plus"></div>
            </div>
            </button> */}
                </div>
              </section>
              <section>
                <div className='container'>
                  <h3>Manage Your Trading Cards</h3>
                  <span className='coming-soon-text'>coming soon</span>
                </div>
              </section>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className='Config'>
          <div
            className={
              this.state.theme === 'light' ? 'Config-light' : 'Config-dark'
            }
          >
            Loading...
          </div>
        </div>
      );
    }
  }
}
