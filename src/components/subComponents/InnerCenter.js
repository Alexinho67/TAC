import React from 'react'
import CardsPlayedHistory from './CardsPlayedHistory'
import {addMessage, ExpireMsg} from './ExpireMsg'


const InnerCenter = ({ gameState, gameSubState, stateInnerCenter, triggerCardPlayed}) => {
    const [debugMsg, setDebugMsg] = React.useState(undefined)
    const [showHistoryCards, setShowHistoryCards] = React.useState(false)
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


    if (gameState === 'PLAYING' && gameSubState === 'WAIT_FOR_ALL_CARDS_PLAYED') {
        return (<>
            <div id="innerCenter" onClick={_handleClick} onContextMenu={(e) => e.preventDefault()} className={classInnerCenter} onAuxClick={onRightClick} onRightClick={onRightClick}>
                {/* {state} */}
            </div>
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
