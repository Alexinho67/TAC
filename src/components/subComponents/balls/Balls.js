import React from 'react'
import Ball from './BallSingle'

const Balls = ({ setResetTimer , ballsData, setBallsAllData}) => {


    function toogleIsSelected(idBallClicked) {
        console.log(`Toggling status of ball #${idBallClicked}. Current state: ${ballsData.find(ball => ball.id === idBallClicked).isSelected}`);
        let ballSelectedOld = ballsData.find(ball => ball.isSelected)
        if ((ballSelectedOld) && (ballSelectedOld.id !== idBallClicked)){
            setResetTimer(true)
        }

        setBallsAllData((list) => {
            /* toggles value of element at pos=id and ensures,
            /   that all others are false.
            */
            return list.map(ballData => {
                if (ballData.id !== idBallClicked){
                    return { ...ballData, isSelected: false} // if ball not clicked -> set selected to false
                } else {
                    return {...ballData, isSelected: !ballData.isSelected} // for clicked ball -> toggle flag
                }
            })
        })
    }

    /* ================================================================================
    --------------------------     RENDER      -----------------------------------------
    * ================================================================================ */

    console.log(`%c[Balls.js] Render`,'color:#fa0');

    return ( 
        <div name="balls">  
            {ballsData.map(ballDataSingle => {
                // console.log(`...idBall:${ballDataSingle.id} - top:${ballDataSingle.top} - left:${ballDataSingle.left}`);
                if (!ballDataSingle.show) {return null}
                else {
                    return <Ball  key={ballDataSingle.id}
                            // id = {ballSingleData.id}
                            ballDataSingle={ballDataSingle}
                            toogleIsSelected={toogleIsSelected} />
                }
            })}
    </div>)
}

export default Balls
