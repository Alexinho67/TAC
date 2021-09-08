import React from 'react'

const CardsOtherPly = ({ width, pos, numCards, rotate}) => {
    const styleCard = React.useRef({
        left: `${pos.left}%`,
        width: `${width}%`,
        top: `${pos.top}%`,
        cursor: 'unset',
        transform: `translate(-50%,-50%)  rotate(${rotate}deg)`
    })

    function triggerCardPlayed(){
        
    }
    
    const Imgage = <img height='100%' width='100%' src={`${require(`../../pics/backside1.png`).default}`} alt={`cardsOtherPlayer`} />
    
    return (
             <> 
            <div className="card" style={styleCard.current} onClick={triggerCardPlayed} >
                {/* <div style={{transform: `rotate(${rotate}deg) `}}> */}
                        {Imgage}
                <div className="numberCardsOtherPlayer" style={{
                    transform: `translate(-50%,-50%) rotate(${-rotate}deg)`}}>
                {numCards} </div>
                {/* </div> */}
            </div>

        </>
        )
}

export default CardsOtherPly
