import React from 'react'
import {CARDS} from '../../utils/helper'


const CardSingle = ({ card, toogleIsSelected, transitionCardHandToTray, triggerCardPlayed, onMouseEnter = undefined}) => {
    console.log(`[CardSingle] onMouseEnter defined? ${onMouseEnter !== undefined} `);
    // console.log(`[CardSingle]. received card:${JSON.stringify(card)}`);
    const [styleCard, setStyleCard] = React.useState({
        left: `${card.left}%`,
        width: `${card.width}%`,
        top: `${card.top}%`,
        // backgroundImage: `url(${require(`../pics/${CARDS[value]}`).default})`,
    })


    

    /* ================================================================================
    --------------------------     HOOKS      -----------------------------------------
    * ================================================================================ */

    React.useEffect(() => {
        console.log(`[CardSingle - useEffect@Card] card(#${card.idExt},val:${card.value})`);
        _calcStyling(card)
    }, [card.left, card.top, card.width, card.isCardForSwap, card.isSelected, card.isPlayed])

    /* ================================================================================
    --------------------------     Fuctions      -----------------------------------------
    * ================================================================================ */


    function _calcStyling(card){
        let styleBasis = {left: `${card.left}%`,
                            width: `${card.width}%`,
                            top: `${card.top}%`}

        let stylingAddition = {}

        // if (isSelectedFlag) {
        if (card.isSelected && !card.isPlayed && !card.isCardForSwap) {
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
                zIndex:3,
                transition: 'top 0.8s ease, left 0.8s ease',
            }

        } else if (card.isCardForSwap === true){
            stylingAddition = {
                ...stylingAddition,
                top: '72%',
                left: '69%',
                cursor: 'not-allowed',
                transition: 'top 0.8s ease, left 0.8s ease',
                zIndex:2,
            }
        }
        let styleNew = { ...styleBasis, ...stylingAddition }
        
        console.log(`[CardSingle-calcStyle].card(#${card.idExt},val:${card.value}) -> left:${styleNew.left}, top:${styleNew.top}`);
        setStyleCard(styleCardCurrent => { return { ...styleCardCurrent, ...styleNew} })
    }
    
    function getImagePath(value){
        let fileString = `../../pics/${CARDS[value]}`
    
        // console.log(`[CardSingle.js] Getting srcPath. card value: ${value}. FileString: ${fileString}`);
        let path
        try{
            switch (value) {
                case 1:
                    path = require('../../pics/1_small.png').default
                    break
                case 2:
                    path = require('../../pics/2_small.png').default
                    break
                case 3:
                    path = require('../../pics/3_small.png').default
                    break
                case 4:
                    path = require('../../pics/4_small.png').default
                    break
                case 5:
                    path = require('../../pics/5_small.png').default
                    break
                case 6:
                    path = require('../../pics/6_small.png').default
                    break
                case 7:
                    path = require('../../pics/7_small.png').default
                    break
                case 8:
                    path = require('../../pics/8_small.png').default
                    break
                case 9:
                    path = require('../../pics/9_small.png').default
                    break
                case 10:
                    path = require('../../pics/10_small.png').default
                    break
                case 12:
                    path = require('../../pics/12_small.png').default
                    break
                case 13:
                    path = require('../../pics/13_small.png').default
                    break
                case 14:
                    path = require('../../pics/Trickser_small.png').default
                    break
                case 15:
                    path = require('../../pics/TAC_small.png').default
                    break
                default:
                    path = require(`../../pics/backside1.png`).default
            }
            
        }catch{

            // console.error(`Coudn't find card source path with fileString=${fileString}`);
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


    function dummyOnMouseEnter(){
        console.log(`[CardSingle] dummyOnMouseEnter`);
    }

    const pathImg = getImagePath(card.value)
    const Imgage = <img name="imgCard" height='100%' width='100%' src={pathImg} alt={`value=${card.value}`} 
            onMouseEnterCapture={dummyOnMouseEnter} onMouseOver={dummyOnMouseEnter}
            onMouseEnter={dummyOnMouseEnter}
            />

    /* ================================================================================
    --------------------------     RENDER      -----------------------------------------
    * ================================================================================ */
    if (card.isPlayed) {
        return (<div key={card.idExt} style={styleCard} className="card" onTransitionEnd={_handleTransitionEnd} >
            {Imgage}
        </div>)
    } else {
        return (<div key={card.idExt} style={styleCard} className="card" data-idext={card.idExt}
            onClick={handleButtonClick}
            onDoubleClick={handleButtonDblClick}
            >
                {Imgage}
            </div>) // close return ()
            }  // close else
}

export default CardSingle
