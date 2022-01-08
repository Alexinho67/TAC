import React from 'react'

// const BallSingle = ({ id, ballsData, isSelected, toogleIsSelected}) => {
const BallSingle = ({ ballDataSingle, toogleIsSelected}) => {
    const [topBall, setTopBall] = React.useState(0)
    const [leftBall, setLeftBall] = React.useState(0)

    const styleBall = React.useRef({
        border: '2px solid yellow',
        // left: `${ballsData.find(ball => ball.id === id).left}%`,
        // top: `${ballsData.find(ball => ball.id === id).top}%`,
        left: `${ballDataSingle.left}%`,
        top: `${ballDataSingle.top}%`,
    })


    _calcStyling()


    /* ================================================================================
    --------------------------     HOOKS      -----------------------------------------
    * ================================================================================ */

    React.useEffect(() => {
        // console.log(`%c[BallSingle - UseEffect@ballData]`,'color:#0fa');
        setTopBall(ballDataSingle.left)
        setLeftBall(ballDataSingle.top)

    }, [ballDataSingle, ballDataSingle.left])

    React.useEffect(() => {
        // console.log(`%c[BallSingle - UseEffect] - Render ball-id:${ballDataSingle.id}`,'color:#0fa');
    })
    
    /* ================================================================================
    --------------------------     Fuctions      -----------------------------------------
    * ================================================================================ */


    function _calcStyling() {
        // console.log(`[BallsSingle] _calcStyling(). ballDataSingle:${ JSON.stringify(ballDataSingle)} `);
        if (ballDataSingle.isSelected) {
            styleBall.current = { ...styleBall.current, border: '2px solid yellow' }
        } else {
            styleBall.current = { ...styleBall.current, border: undefined }
        }
        
        if (!ballDataSingle.isSelectable){
            styleBall.current = { ...styleBall.current, cursor:"not-allowed" }
        } else{
            styleBall.current = { ...styleBall.current, cursor: "pointer" }
        }
    }

    function _toogleIsSelected(e) {
        e.stopPropagation()
        toogleIsSelected(ballDataSingle.id)
        // console.log(`clicked ball with id= ${ballDataSingle.id}. Selected:  ${ballDataSingle.isSelected}`);
    }

    /* ================================================================================
    --------------------------     RENDER      -----------------------------------------
    * ================================================================================ */

    // console.log(`%c[BallSingle.js] Render - id:${ballDataSingle.id}`, 'color:#fa0');
    let updateProp = {
            left: `${topBall}%`,
            top: `${leftBall}%` }
    let styleFinal = { ...styleBall.current, ...updateProp}

    return (
        <div 
            className="ball"
            style={styleFinal}
            data-color={ballDataSingle.color}
            data-id={ballDataSingle.id}
            onClick={ballDataSingle.isSelectable? _toogleIsSelected:undefined}
            >
        </div>
    )
}

export default BallSingle
