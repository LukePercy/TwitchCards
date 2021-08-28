import './nocardsview.css';
import React, {useState} from 'react';
import cardimage from './cards/Card_Back-01.svg'

export default function NoCardsView() {
    return (
    <div className="container">
    <div className="titlecontainer">
        <h1>DiceyDecks</h1>
    </div>
    <div className="rotate">
        <div className="spin">
          <img height="150px" width="75px" style={{animation:"cardspin"}} src={cardimage} alt="img"/>
        </div>
    </div>
    </div>    
 );

}