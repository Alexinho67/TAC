import React from 'react'
import CardsPlayedHistory from './cards/CardsPlayedHistory'
import LastCardInfo from './LastCardInfo'

const turnOnDelaylastCard = 2000
const timeShowlastCard = 1500

const InnerCenter = ({ gameState, gameSubState, stateInnerCenter, triggerCardPlayed}) => {
    const [showHistoryCards, setShowHistoryCards] = React.useState(false)
    const [showLastCardInfo, setShowLastCardInfo] = React.useState(false)
    const fcnTimeOut = React.useRef()
    
    const classInnerCenter = 
        stateInnerCenter === 'active'? "highlight": ""

    function _handleClick(){
        if (stateInnerCenter === 'active'){
            triggerCardPlayed()
        }
    }

    function onRightClick(e){
        e.preventDefault()
        setShowHistoryCards(flag => !flag)
    }

    function onMouseEnter(e){
       
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
        clearTimeout(fcnTimeOut.current)
    }

    if (gameState === 'PLAYING' && gameSubState === 'WAIT_FOR_ALL_CARDS_PLAYED') {
        return (<>
            <div style={{backgroundColor:'unset'}} id="innerCenter" onClick={_handleClick} 
                className={classInnerCenter} 
                onContextMenu={(e) => e.preventDefault()} 
                onMouseOver={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onAuxClick={onRightClick} >
            </div>
            {showLastCardInfo ? <LastCardInfo  />: null}
            {showHistoryCards ? <CardsPlayedHistory /> : null}
            </>
        )
    } else {
        return null
    }
}

export default InnerCenter
