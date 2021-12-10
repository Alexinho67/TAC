import React from 'react'
import CardsPlayedHistory from './CardsPlayedHistory'
import {addMessage, ExpireMsg} from './ExpireMsg'
import LastCardInfo from './LastCardInfo'

const turnOnDelaylastCard = 2000
const timeShowlastCard = 1500

const InnerCenter = ({ gameState, gameSubState, stateInnerCenter, triggerCardPlayed}) => {
    const [debugMsg, setDebugMsg] = React.useState(undefined)
    const [showHistoryCards, setShowHistoryCards] = React.useState(false)
    const [showLastCardInfo, setShowLastCardInfo] = React.useState(false)
    const fcnTimeOut = React.useRef()
    
    // let debugMsg = <ExpireMsg> Clicked me</ExpireMsg>
    const classInnerCenter = 
        stateInnerCenter === 'active'? "highlight": ""

    function _handleClick(){
        // console.log(`clicked [innerCenter]`);
        addMessage('juhuuuuuu', setDebugMsg)
        if (stateInnerCenter === 'active'){
            triggerCardPlayed()
        }
    }

    function onRightClick(e){
        e.preventDefault()
        // alert('test')
        setShowHistoryCards(flag => !flag)
    }

    function onMouseEnter(e){
        // console.log(`[InnerCenter] onMouseEnter. e.target:${JSON.stringify(e.target.id)}`);
        // console.log(`[InnerCenter] onMouseEnter. e.currentTarget:${JSON.stringify(e.currentTarget.id)}`);
        
        fcnTimeOut.current = setTimeout(( )=>{
            setShowLastCardInfo(true)
            setTimeout(( )=>{
                setShowLastCardInfo(false)
            }, timeShowlastCard)
        }, turnOnDelaylastCard)
    }
    
    
    function onMouseLeave(e){
        // console.log(`[InnerCenter] onMouseLeave. e.target:${JSON.stringify(e.target.id)}`);
        // console.log(`[InnerCenter] onMouseLeave. e.currentTarget:${JSON.stringify(e.currentTarget.id)}`);
        // setShowLastCardInfo(false)
        clearTimeout(fcnTimeOut.current)
    }

    if (gameState === 'PLAYING' && gameSubState === 'WAIT_FOR_ALL_CARDS_PLAYED') {
        return (<>
            <div id="innerCenter" onClick={_handleClick} 
                className={classInnerCenter} 
                onContextMenu={(e) => e.preventDefault()} 
                onMouseOver={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onAuxClick={onRightClick} >
            </div>
            {showLastCardInfo ? <LastCardInfo  />: null}
            {showHistoryCards ? <CardsPlayedHistory /> : null}
            {debugMsg}
            {/* <ExpireMsg> Clicked me</ExpireMsg> */}
            </>
        )
    } else {
        return null
    }

}

export default InnerCenter
