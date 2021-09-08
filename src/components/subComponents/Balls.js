import React from 'react'
import Ball from './BallSingle'

const Balls = ({numBalls}) => {
    const [isSelectedBall, setIsSelectedBall] = React.useState(Array(numBalls).fill(false))

    function _calculateArrayIsSelected(list, id) {
        /* toggles value of element at pos=id and ensures, that all others are false.
        */
        return list.map((elem, i) => { return (i === id) ? !elem : false })
    }

    function toogleIsSelected(id) {
        console.log(`Toggling status of ball #${id}. Current state: ${isSelectedBall[id]}`);
        setIsSelectedBall((list) => _calculateArrayIsSelected(list, id))
    }


    return ( 
        <div name="balls">  
        {/* <p style={{ backgroundColor: 'yellow' }} >status: {isSelectedBall.toString()}</p> */}
        <Ball id={0} color={'red'} isSelected={isSelectedBall} toogleIsSelected={toogleIsSelected}/>
        <Ball id={1} color={'red'} isSelected={isSelectedBall} toogleIsSelected={toogleIsSelected}/>
        <Ball id={2} color={'red'} isSelected={isSelectedBall} toogleIsSelected={toogleIsSelected}/>
        <Ball id={3} color={'red'} isSelected={isSelectedBall} toogleIsSelected={toogleIsSelected}/>
    </div>)
}

export default Balls
