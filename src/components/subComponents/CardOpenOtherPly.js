import React from 'react'
import { GameModelContext } from '../../GameProvider'
import {CARDS} from '../../utils/helper'

const CardOpenOtherPly = ({ card, setOpenCard}) => {
    // console.log(`[CardSingle]. received card:${JSON.stringify(card)}`);
    const initStyle = {
                    left: `${card.left}%`,
                    width: `${card.width}%`,
                    top: `${card.top}%`,
                }

    // const styleCard = React.useRef(initStyle)
    const [styleCardState, setStyleCardState] = React.useState(initStyle)
    const model = React.useContext(GameModelContext)
    
    /* ================================================================================
    --------------------------     HOOKS      -----------------------------------------
    * ================================================================================ */

    React.useEffect(() => {
        console.log(`[CardOpenOtherPly - useEffect@INIT]`);
        let transitionTime = 0.8 //s
        let newStyle = {
            top: '50%',
            left: '50%',
            transition: `top ${transitionTime}s ease, left ${transitionTime}s ease`,
        }
        setTimeout(() => {
            console.log(`[CardOpenOtherPly.js] \t Put card to the middle`);
            setStyleCardState(oldStyle =>{return  { ...oldStyle, ...newStyle } })
        }, 250);

        setTimeout(() => {
            console.log(`[CardOpenOtherPly.js] \t Put card to the middle`);
            setOpenCard(undefined)
            model.dispatcherTac({ type: 'resetCardPlayedByOther' })
        }, 250 + transitionTime);
    }, [])



    /* ================================================================================
    --------------------------     Fuctions      -----------------------------------------
    * ================================================================================ */

    // function _handleTransitionEnd(e){
    //     console.log(`[CardOpenOtherPly] trigger "_handleTransitionEnd()"`);
    //     e.target.style.opacity = '50%'
    //     setOpenCard(undefined)
    //     model.dispatcherTac({ type: 'resetCardPlayedByOther'})
    // }

    const fileNameImage = `${CARDS[card.value]}`
    const Imgage = <img height='100%' width='100%' src={`${require(`../../pics/${fileNameImage}`).default}`} alt={`value=${card.value}`} />

    /* ================================================================================
    --------------------------     RENDER      -----------------------------------------
    * ================================================================================ */
    
    return (<div style={styleCardState} className="card" >
        {Imgage}
    </div>)
    
}

export default CardOpenOtherPly
