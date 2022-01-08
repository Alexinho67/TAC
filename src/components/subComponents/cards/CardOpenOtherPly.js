import React from 'react'
import { GameModelContext } from '../../../providers/GameProvider'
import {CARDS} from '../../../utils/helper'

const CardOpenOtherPly = ({ card, setOpenCard}) => {

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
        let delayShowCardBeforeMove = 1000 //ms
        let transitionTime = 1000  //ms
        let newStyle = {
            top: '50%',
            left: '50%',
            transition: `top ${transitionTime}ms ease, left ${transitionTime}ms ease`,
        }
        setTimeout(() => {
            console.log(`[CardOpenOtherPly.js] \t Put card to the middle`);
            setStyleCardState(oldStyle =>{return  { ...oldStyle, ...newStyle } })
        }, delayShowCardBeforeMove);

        setTimeout(() => {
            console.log(`[CardOpenOtherPly.js] \t Kill card`);
            setOpenCard(undefined)
            model.dispatcherTac({ type: 'resetCardPlayedByOther' })
        }, delayShowCardBeforeMove + transitionTime);
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
    const Imgage = <img height='100%' width='100%' src={`${require(`../../../pics/${fileNameImage}`).default}`} alt={`value=${card.value}`} />

    /* ================================================================================
    --------------------------     RENDER      -----------------------------------------
    * ================================================================================ */
    
    return (<div style={styleCardState} className="card" >
        {Imgage}
    </div>)
    
}

export default CardOpenOtherPly
