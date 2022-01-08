import React from 'react'
import { GameModelContext } from '../../../providers/GameProvider'

const ShuffledDeck = ({ width }) => {
    const { stateGameReduce } = React.useContext(GameModelContext)
    const styleCard = React.useRef({
        left: `-12%`,
        width: `${width}%`,
        top: `-7%`,
        cursor: 'unset',
        transform: `translate(-50%,-50%)`
    })



    const numShuffledCards = stateGameReduce.numShuffledCards
    const Imgage = <img height='100%' width='100%' src={`${require(`../../../pics/backsideStackNew.png`).default}`} alt={`stack`} />

    if (numShuffledCards === 0) {
        return <></>
    }

    return (
        <>
            <div className="card" style={styleCard.current} >
                {Imgage}
                <div className="numberCardsOtherPlayer">
                    {numShuffledCards} </div>
            </div>
        </>
    )
}

export default ShuffledDeck
