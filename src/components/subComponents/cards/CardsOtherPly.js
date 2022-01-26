import React from 'react'
    
const getPosXY = (posRel) => {
    // console.log(`[CardsOtherPly - getPosXY] - posRel: ${posRel}`);
    switch (posRel){
        case 2:                
            return { name: 'left', top: 50, left: -10, rotate: 0}
        case 3:
            return {
                name: 'front', top: -10, left: 50, rotate: 90 }
        case 4:
            return {
                name: 'right', top: 50, left: 110, rotate: 0}
        default:
            return {
                name: 'default', top: 0, left: 0, rotate: 45}
    }
}

const getPosXYForCardSwap = (posRel) => {
    switch (posRel){
        case 2:                
            return { name: 'left', top: 66, left: 23, rotate: 90}
        case 3:
            return {
                name: 'front', top: 22, left: 33, rotate: 0}
        case 4:
            return {
                name: 'right', top: 33, left: 77, rotate: 90}
        default:
            return {
                name: 'default', top: 0, left: 0, rotate: 45}
    }
}

const CardsOtherPly = ({ width, playerObj}) => {
    const [styleCardStack, setStyleCardStack] = React.useState({
        width: `${width}%`})
    
    const [styleCardForSwap, setStyleCardForSwap] = React.useState({
        left: `0%`,
        top: `0%`,
        width: `${width}%`,
        cursor: 'unset',
        transform: `translate(-50%,-50%)  rotate(0deg)`})
    
    const cardForSwap = playerObj.cardForSwap
    const Image = <img height='100%' width='100%' src={`${require(`../../../pics/backside1.png`).default}`} alt={`cardsOtherPlayer`} />
    
    React.useEffect(( )=>{
        let dataObjStack = getPosXY(playerObj.posRel)
        let newStylesStack ={
            left: `${dataObjStack.left}%`,
            top: `${dataObjStack.top}%`,
            transform: `translate(-50%,-50%)  rotate(${dataObjStack.rotate}deg)`}
        setStyleCardStack(styleCard => {return { ...styleCard, ...newStylesStack } })

        let dataObjCardSwap = getPosXYForCardSwap(playerObj.posRel)
        let newStylesCardSwap = {
            left: `${dataObjCardSwap.left}%`,
            top: `${dataObjCardSwap.top}%`,
            transform: `translate(-50%,-50%)  rotate(${dataObjCardSwap.rotate}deg)`
        }
        setStyleCardForSwap(styleCard => { return { ...styleCard, ...newStylesCardSwap } })

    },[])

    if (playerObj.cards.length === 0){
        return <></>
    }

    return (
            <div key={playerObj.cards[0].idInternal}  name="cardsOtherPly">
                <div className="card cardStackOtherPlayer" style={styleCardStack} >
                        {Image}
                    <div className="numberCardsOtherPlayer" style={{
                        transform: `rotate(-${getPosXY(playerObj.posRel).rotate}deg)`}}>
                    {playerObj.cards.length} </div>
                </div>
                {cardForSwap !== undefined
                    ? <div className="card" style={styleCardForSwap} > {Image} </div>
                    : ""}
            </div>
        )
}

export default CardsOtherPly
