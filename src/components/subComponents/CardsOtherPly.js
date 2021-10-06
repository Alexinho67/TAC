import React from 'react'
import { GameModelContext } from '../../GameProvider'

const CardsOtherPly = ({ width, posObj}) => {
    const { stateGameReduce } = React.useContext(GameModelContext)
    const styleCard = React.useRef({
        left: `${posObj.left}%`,
        width: `${width}%`,
        top: `${posObj.top}%`,
        cursor: 'unset',
        transform: `translate(-50%,-50%)  rotate(${posObj.rotate}deg)`
    })
    
    const player = stateGameReduce.statusOtherPlayers.find(ply => ply.pos === posObj.name)
    const numCards = player.nrCards
    const Imgage = <img height='100%' width='100%' src={`${require(`../../pics/backside1.png`).default}`} alt={`cardsOtherPlayer`} />
    
    if (numCards === 0){
        return <></>
    }

    return (
             <> 
            <div className="card" style={styleCard.current} >
                {/* <div style={{transform: `rotate(${rotate}deg) `}}> */}
                        {Imgage}
                <div className="numberCardsOtherPlayer" style={{
                    transform: `translate(-50%,-50%) rotate(-${posObj.rotate}deg)`}}>
                {numCards} </div>
                {/* </div> */}
            </div>

        </>
        )
}

export default CardsOtherPly
