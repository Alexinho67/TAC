import React from 'react'
import { GameModelContext } from '../../providers/GameProvider'

const LastCardInfo = () => {
    const { stateGameReduce } = React.useContext(GameModelContext)
    const [lastCard, setLastCard] = React.useState(stateGameReduce.cardsPlayed.slice(-1)[0])

    React.useEffect(() => {
        console.log(`[LastCardInfo-useEffect-INIT]. Last card: ${JSON.stringify(lastCard)}`);
    }, [])

    if (lastCard === undefined) {return null}
    return (
        <div className={'cardLastPlayed'} >
            {lastCard.playedByName} : {lastCard.value}
        </div>
    )
}

export default LastCardInfo
