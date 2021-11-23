import React from 'react'
import {CARDS} from '../../utils/helper'

const CardSingle = ({ card, toogleIsSelected, transitionCardHandToTray, triggerCardPlayed}) => {
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
    
    function getImagePath(value){
        // console.log(`[CardSingle.js] Getting srcPath. card value: ${value}`);
        let path
        try{
            path = require(`../../pics/${CARDS[value]}`).default
        }catch{
            console.error(`Coudn't find card source path`);
            path = require(`../../pics/backside1.png`).default
        }
        return path
    }



    function _toogleIsSelected() {
        console.log(`clicked card with id= ${card.id}. Selected:  ${card.isSelected}`);
        if (card.isPlayed === true) {
            console.log(`cannot select that card`);
        } else {
            toogleIsSelected(card)  // flipping only the specific card is not sufficient, 
            // since all other cards need to be unselected
        }
    }

    function _playCardDblClicked(){
        console.log(`[CardSingle/_playCardDblClicked]: ${JSON.stringify(card)}`);
        triggerCardPlayed(card.id)
    }

    function _handleTransitionEnd(e){
        // console.log(`trigger "_handleTransitionEnd()"`);
        // e.target.style.opacity = '50%'
        // if (card.isPlayed === true){
        //     transitionCardHandToTray()
        // }
    }

    let tof = undefined;

    function handleButtonClick(e) {
        // console.log(`DOM-event: SINGLE click`);
        if (e.detail === 2) {
            return
        }
        tof = setTimeout(() => _toogleIsSelected(), 200)
        // console.log(`setTimer.tof=${tof}.t= ${performance.now()}`);
        performance.now()
        // console.log(`created tof=${tof}`);
    }

    function handleButtonDblClick(e) {
        // console.log(`DOM-event: %cDOUBLE click`,'color:white;background-color:red');
        if (tof) {
            // console.log(`clearing tof=${tof}`);
            clearTimeout(tof)
            _playCardDblClicked();
        }
    }

    const pathImg = getImagePath(card.value)
    const Imgage = <img name="imgCard" height='100%' width='100%' src={pathImg} alt={`value=${card.value}`} />

    /* ================================================================================
    --------------------------     RENDER      -----------------------------------------
    * ================================================================================ */
    if (card.isPlayed) {
        return (<div style={styleCard.current} className="card" onTransitionEnd={_handleTransitionEnd}>
            {Imgage}
        </div>)
    } else {
        return (<div style={styleCard.current} className="card" data-idext={card.idExt} 
            onClick={handleButtonClick}
            onDoubleClick={handleButtonDblClick}>
                    {Imgage}
                </div>) // close return ()
            }  // close else
}

export default CardSingle
