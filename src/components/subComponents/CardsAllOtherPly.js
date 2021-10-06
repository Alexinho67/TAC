import React from 'react'
import { GameModelContext } from '../../GameProvider'
import CardOpenOtherPly from './CardOpenOtherPly'
import CardsOtherPly from './CardsOtherPly'

const CardsAllOtherPlayers = ({ width}) => {
    const [openCard, setOpenCard] = React.useState(undefined)

    const { stateGameReduce} = React.useContext(GameModelContext)

    React.useEffect(() => {
        if (stateGameReduce.cardPlayedOther){
            console.log(`[CardsAllOtherPlayers]-[UseEffect@stateGameReduce.cardPlayedOther]`);
            let cardObjWithStyle = createCardPlaying(stateGameReduce.cardPlayedOther)
            console.log(`...Created open card for visualization: ${JSON.stringify(cardObjWithStyle)}`);
            setOpenCard(cardObjWithStyle)
        }
        // return () => {
        //     cleanup
        // }
    }, [stateGameReduce.cardPlayedOther])



    const pos = {
        left :  {name:'left', top:50, left: -10, rotate: 0},
        front:  {name:'front', top:-10, left: 50, rotate: 90},
        right:  {name:'right', top:50, left: 110, rotate: 0},

    }
    
    function createCardPlaying(cardPlaying){
        // let cardPlaying = openCard
        // let cardPlaying = openCard

        switch (cardPlaying.posRel){
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

    return (
        <div name="cardsOtherPlayer">
            <CardsOtherPly width={width} posObj={pos.left}  />
            <CardsOtherPly width={width} posObj={pos.front} />
            <CardsOtherPly width={width} posObj={pos.right} />
            {openCard ? <CardOpenOtherPly card={openCard} setOpenCard={setOpenCard} /> : null}
        </div>
    )
}

export default CardsAllOtherPlayers
