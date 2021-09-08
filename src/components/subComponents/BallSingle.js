import React from 'react'

const BallSingle = ({ id, color, isSelected, toogleIsSelected}) => {
    const styleBall = React.useRef({
        border: '2px solid yellow'
    })
    _calcStyling()

    /* ================================================================================
    --------------------------     HOOKS      -----------------------------------------
    * ================================================================================ */


    /* ================================================================================
    --------------------------     Fuctions      -----------------------------------------
    * ================================================================================ */


    function _calcStyling() {
        if (isSelected[id]) {
            styleBall.current = { ...styleBall.current, border: '2px solid yellow' }
        } else {
            styleBall.current = { ...styleBall.current, border: undefined }
        }
    }

    function _toogleIsSelected(e) {
        toogleIsSelected(id)
        console.log(`clicked ball with id= ${id}. Selected:  ${isSelected[id]}`);

    }

    return (
        <div 
            className="ball"
            style={styleBall.current} 
            data-color={color} 
            data-id={id}
            onClick={_toogleIsSelected}
            >
            
        </div>
    )
}

export default BallSingle
