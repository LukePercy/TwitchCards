	  import ComfyJS from 'comfy.js';
      import Authentication from '../../util/Authentication/Authentication';
      
      // Authentication Instructions are at https://github.com/instafluff/ComfyJS#channel-point-reward-redemptions
      // "ge0du4vlbzikinfye6663dbgdq02rf" API Secret? You can get this also from the dev console o fthe extension. 
      // MAy need to hook this up to the Authenticaion Component under util becuase this below doesn't want to work.
	  const twitchAuth = new Authentication();  // Extension secret not sure which one to use yet...
	  const channel = "randomorigins"; // my channel

      export default function comfyTest() {
        ComfyJS.onCommand = ( command ) => {
        if( command === "test" ) {
          console.log( "!test was typed in chat" );
            }
            else {
                return (<div></div>
                );
            }
           }
        ComfyJS.Init( channel, twitchAuth );
        };