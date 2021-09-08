import React from 'react'
import CardOpenOtherPly from './CardOpenOtherPly'
import CardsOtherPly from './CardsOtherPly'

const CardsAllOtherPlayers = ({ numCardsOthers, width, openCard}) => {

    const pos = {
        left :  {top:50, left: -10},
        front : {top:-10, left: 50},
        right : {top:50, left: 110},

    }
    
    function createCardPlaying(){
        let cardPlaying = openCard
        switch (cardPlaying.player){
            case 'left':
                cardPlaying = { ...cardPlaying, left:-10, top:50, width: width }
                break
            case 'front':
                cardPlaying = { ...cardPlaying, left: 50, top: -10, width: width }
                break
            case 'right':
                cardPlaying = { ...cardPlaying, left: 110, top: 50, width: width }
                break
            default:
                console.log(`SWITCH DEFAULT`);
                break
        }
        return cardPlaying

    }

    const cardPlaying = createCardPlaying()

    return (
        <div name="cardsOtherPlayer">
            <CardsOtherPly width={width} rotate={0}  pos={pos.left}  numCards={numCardsOthers.left} />
            <CardsOtherPly width={width} rotate={90}  pos={pos.front} numCards={numCardsOthers.front} />
            <CardsOtherPly width={width} rotate={0}  pos={pos.right} numCards={numCardsOthers.right} />
            {openCard ? <CardOpenOtherPly card={cardPlaying} /> : null}
        </div>
    )
}

export default CardsAllOtherPlayers
