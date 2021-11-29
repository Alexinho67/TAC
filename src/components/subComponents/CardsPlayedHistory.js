import React from 'react'
import { GameModelContext } from '../../GameProvider'

const CardsPlayedHistory = () => {

    const { stateGameReduce } = React.useContext(GameModelContext)

    const data = stateGameReduce.cardsPlayed.map((c,i) => {
        return <> {i+1} - {c.playedByName}: {c.value} <br/></>
    })

    return (
        <div className={'cardsPlayedHistory'}>
            {data}
        </div>
    )
}

export default CardsPlayedHistory
