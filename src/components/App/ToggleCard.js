import React, {useState} from 'react';
import { slides } from './CardList';

// Mock up for toggle of showing a random card unlock in prep for using Comfy.js API Channel Points to unlock cards

export default function ToggleCard() {

    const [isHidden, setHidden] = useState(true);
    const [cardResult, setCardResult] = useState(null);


    
    function getRandomCard() {
      let randomCard = slides[Math.floor(Math.random()*slides.length)];
      return (
        setCardResult(randomCard)
      );
    }

    function toggleIsHidden () {
      if (isHidden){
        setHidden(false);
      } else {
        setHidden(true)
      }
    }

    function showRandomCard() {
      getRandomCard();
      toggleIsHidden()
    }
        return (
          <div>
            <div>
                <button className="w3-btn" onClick={() => showRandomCard()}>Unlock Card</button>
                <div>
                    {!isHidden && 
                      <div>
                        <p>You Unlocked!</p>
                        <div>
                          <img style={{width: 150}} src={cardResult.frontimage} alt={cardResult.title}/>
                        </div>
                      </div>
                      }
                </div>
            </div>
          </div>
        );
}