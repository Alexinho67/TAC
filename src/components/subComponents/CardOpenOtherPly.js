import React from 'react'
import {CARDS} from '../../utils/helper'

const CardOpenOtherPly = ({ card, transitionCardHandToTray}) => {
    // console.log(`[CardSingle]. received card:${JSON.stringify(card)}`);
    const initStyle = {
                    left: `${card.left}%`,
                    width: `${card.width}%`,
                    top: `${card.top}%`,
                }

    // const styleCard = React.useRef(initStyle)
    const [styleCardState, setStyleCardState] = React.useState(initStyle)

    
    /* ================================================================================
    --------------------------     HOOKS      -----------------------------------------
    * ================================================================================ */

    React.useEffect(() => {
        console.log(`test`);
        let newStyle = {
            top: '50%',
            left: '50%',
            transition: 'top 0.8s ease, left 0.8s ease',
        }
        setTimeout(() => {
            console.log(`[CardOpenOtherPly.js] \t Put card to the middle`);
            setStyleCardState(olStyle =>{return  { ...olStyle, ...newStyle } })
        }, 250);
    }, [])

    /* ================================================================================
    --------------------------     Fuctions      -----------------------------------------
    * ================================================================================ */

    function _handleTransitionEnd(e){
        console.log(`trigger "_handleTransitionEnd()"`);
        e.target.style.opacity = '50%'
        if (card.isPlayed === true){
            // transitionCardHandToTray()
        }
    }

    const fileNameImage = `${CARDS[card.value]}`
    const Imgage = <img height='100%' width='100%' src={`${require(`../../pics/${fileNameImage}`).default}`} alt={`value=${card.value}`} />

    /* ================================================================================
    --------------------------     RENDER      -----------------------------------------
    * ================================================================================ */
    
    return (<div style={styleCardState} className="card" onTransitionEnd={_handleTransitionEnd}>
        {Imgage}
    </div>)
    
}

export default CardOpenOtherPly
