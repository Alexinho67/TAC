import React from 'react'
import {CARDS} from '../../utils/helper'

const CardSingle = ({ card, toogleIsSelected, transitionCardHandToTray}) => {
    // console.log(`[CardSingle]. received card:${JSON.stringify(card)}`);
    const styleCard = React.useRef({
        left: `${card.left}%`,
        width: `${card.width}%`,
        top: `${card.top}%`,
        // backgroundImage: `url(${require(`../pics/${CARDS[value]}`).default})`,
    })

    _calcStyling()

    /* ================================================================================
    --------------------------     HOOKS      -----------------------------------------
    * ================================================================================ */


    /* ================================================================================
    --------------------------     Fuctions      -----------------------------------------
    * ================================================================================ */


    function _toogleIsSelected(e){
        console.log(`clicked card with id= ${card.id}. Selected:  ${card.isSelected}`);
        if (card.isPlayed === true) {
            console.log(`cannot select that card`);
        } else {    
            toogleIsSelected(card)  // flipping only the specific card is not sufficient, 
                                    // since all other cards need to be unselected
        }
    }

    function _calcStyling(){
        let stylingAddition = {}
        // if (isSelectedFlag) {
        if (card.isSelected) {
            stylingAddition = { border: '2px solid yellow',
                                borderRadius: '10px',
                                padding: '2px',
                                backgroundColor: 'yellow', }
        } else {
            stylingAddition = { border: undefined, 
                                borderRadius: undefined,    
                                padding: '10px',
                                backgroundColor: 'unset' }
        }
        if (card.isPlayed === true){
            stylingAddition = {...stylingAddition,
                top:'50%',
                left: '50%',
                cursor:  'not-allowed',
                transition: 'top 0.8s ease, left 0.8s ease',
            }

        }
        styleCard.current = { ...styleCard.current, ...stylingAddition}
    }

    function _handleTransitionEnd(e){
        console.log(`trigger "_handleTransitionEnd()"`);
        e.target.style.opacity = '50%'
        if (card.isPlayed === true){
            transitionCardHandToTray()
        }
    }

    const Imgage = <img height='100%' width='100%' src={`${require(`../../pics/${CARDS[card.value]}`).default}`} alt={`value=${card.value}`} />

    /* ================================================================================
    --------------------------     RENDER      -----------------------------------------
    * ================================================================================ */
    if (card.isPlayed) {
        return (<div style={styleCard.current} className="card" onTransitionEnd={_handleTransitionEnd}>
            {Imgage}
        </div>)
    } else {
        return (<div style={styleCard.current} className="card" onClick={_toogleIsSelected}>
                    {Imgage}
                </div>) // close return ()
            }  // close else
}

export default CardSingle
