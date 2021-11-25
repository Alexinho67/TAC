import React from 'react'
import { GameModelContext } from '../../GameProvider'
import CardOpenOtherPly from './CardOpenOtherPly'
import CardsOtherPly from './CardsOtherPly'

const CardsAllOtherPlayers = ({ width}) => {
    const [openCard, setOpenCard] = React.useState(undefined)

    const { stateGameReduce} = React.useContext(GameModelContext)

    React.useEffect(() => {
        console.log(`[CardsAllOtherPlayers - useEffect @ stateGameReduce.cardPlayedOther] -stateGameReduce.cardPlayedOther:${JSON.stringify(stateGameReduce.cardPlayedOther)} `);
        if (stateGameReduce.cardPlayedOther){
            let cardObjWithStyle = createCardOpenPlaying(stateGameReduce.cardPlayedOther)
            console.log(`...Created open card for visualization: ${JSON.stringify(cardObjWithStyle)}`);
            setOpenCard(cardObjWithStyle)
        }
        // return () => {
        //     cleanup
        // }
    }, [stateGameReduce.cardPlayedOther])
    
    function createCardOpenPlaying(cardPlaying){
        // let cardPlaying = openCard
        // let cardPlaying = openCard

        switch (cardPlaying.posRelOfPlayer){
            case 2:
                cardPlaying = { ...cardPlaying, left:-10, top:50, width: width }
                break
            case 3:
                cardPlaying = { ...cardPlaying, left: 50, top: -10, width: width }
                break
            case 4:
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
            {stateGameReduce.players.slice(1,4).map(player => {
                if (player.state === "init"){
                    return <></>
                } else {
                    return <CardsOtherPly width = {width} playerObj={player} />
                }
            })}
            {/* //TODO: why only 1x "openCard"  */}
            {/* // what happens if two or even three other player are selecting a card? */}
            {openCard ? <CardOpenOtherPly card={openCard} setOpenCard={setOpenCard} /> : null}
        </div>
    )
}

export default CardsAllOtherPlayers
