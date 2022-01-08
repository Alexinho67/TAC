import React from 'react'
import Balls from './subComponents/balls/Balls'
import InnerCenter from './subComponents/InnerCenter'
import DealerButton from './subComponents/dealer/DealerButton'
import CardsAllOtherPlayers from './subComponents/cards/CardsAllOtherPly'
import { useSocketContext } from '../providers/SocketProvider'
import ConfirmReady from './subComponents/ConfirmReady'
import { GameModelContext } from '../providers/GameProvider'
import ShuffledDeck from './subComponents/cards/ShuffledDeck'
import BallSlots from './subComponents/slots/BallSlots'
import CardSwapZone from './subComponents/cards/CardSwapZone'
import HandCardsSelf from './subComponents/cards/HandCardsSelf'
import TrashCards from './subComponents/cards/TrashCards'
import FieldDealCards from './subComponents/dealer/FieldDealCards'

import { updateBallsForRender,  unselectBallOnClickToVoid, triggerSelectedCardForSwap, initCards, triggerCardPlayed } from "./functionCollectionForBoard.js";

const numCards = 6
const WIDTHCARD = 18; // %
const ASPECT_RAT_CARD = 0.7

const Board = ({ isReady, setIsReady }) => {
    const { socket } = useSocketContext()
    const { stateGameReduce, dispatcherTac} = React.useContext(GameModelContext)
    // cards
    const [idCardSelected, setIdCardSelected] = React.useState(undefined)
    // const [idCardPlayed, setIdCardPlayed] = React.useState(-1)
    const [cardsHand, setCardsHand] = React.useState([])
    // center
    const [stateInnerCenter, setStateInnerCenter] = React.useState('inactive')
    //balls
    // const [idBallSelected, setIdBallSelected] = React.useState(-1)
    const [highlightBallSlots, setHighlightBallSlots] = React.useState(false)
    const [ballsAllData, setBallsAllData] = React.useState([])
    // slots
    const [resetTimer, setResetTimer] = React.useState(false) // in "BallSlots" is a timer, which deactives the slots after a certain time
    // dealer
    const [showDealerField, setShowDealerField] = React.useState(false)
    
    /* ================================================================================
    --------------------------     HOOKS      -----------------------------------------
    * ================================================================================ */
    // test.current = React.createElement('div', null, 'INIT');
    React.useEffect(() => { 
        console.log(`%c[Board]-INIT`, 'color:#999')
        },[])
    
    React.useEffect(() => {
        if (showDealerField === false && stateGameReduce.posDealerRel === 1){
            setShowDealerField(true)
        }
    }, [stateGameReduce.posDealerRel])

    React.useEffect(()=>{

        // console.log(`Lvl1-[Board-useEffect@stateGameReduce.players[0..4].balls]`);

        updateBallsForRender(stateGameReduce.players, setBallsAllData, dispatcherTac, stateGameReduce.players[0].posAbs, isReady) 
        }, [stateGameReduce.players[0].balls, 
            stateGameReduce.players[1].balls,
            stateGameReduce.players[2].balls, 
            stateGameReduce.players[3].balls])

    React.useEffect(() => { 
        if (isReady){
            setBallsAllData(balls => {
                return balls.map(ball => Object.assign(ball,{isSelectable:true}))
        }) // close setBallsAllData
    } // close if
    }, [isReady])

    React.useEffect(() => {

        function clickHandler(e){
            unselectBallOnClickToVoid(e,ballsAllData, setBallsAllData)
        }
        
        window.addEventListener("click", clickHandler);
        return () => {
            window.removeEventListener("click", clickHandler);
        }
    }, [ballsAllData])
    
    React.useEffect(() => {
        console.log(`%c[Board-useEffect] - "stateGameReduce.self.cards" has changed`,'color:#999');
        if (stateGameReduce.players[0].cards.length > 0 && stateGameReduce.rerenderHandCards === true){
            setCardsHand(initCards(stateGameReduce.players[0].cards, WIDTHCARD, ASPECT_RAT_CARD, numCards, stateGameReduce.players[0].cardForSwap))
            dispatcherTac({ type: 'deactUpdateHandCards'})
        }else{
            console.log(`...No cards found. stateGameReduce.self.cards.length:${stateGameReduce.players[0].cards.length}`);
        }
    }, [stateGameReduce.players[0].cards])

    React.useEffect(() => {
        /**
         *  if cardsHand changed (e.g. by selecting/ deSelecting one single card)::
         *  - check if innerCircle shall be set to "active"/"inactive"
         *  - update state variable idSelectedCard
         */
        let stateInnerCircle = 'inactive'
        let idSelectedCard = -1
        cardsHand.forEach((card)=>{
            if (card.isSelected === true){
                idSelectedCard = card.id
                stateInnerCircle = 'active'
                return
            }
        })
        console.log(`[Board - useEffect [cardsHand]]: set "StateInnerCenter" => ${stateInnerCircle}`);
        setStateInnerCenter(stateInnerCircle)
        setIdCardSelected(idSelectedCard)
    }, [cardsHand])

    React.useEffect(() => {
        /*
        if any of the balls is currently selected --> highlight ball slots
        */
       let singleBallSelected = ballsAllData.some(ball => ball.isSelected) 
       singleBallSelected ? setHighlightBallSlots(true) : setHighlightBallSlots(false)
        let stringTemp = singleBallSelected  ? "show" : "hide"
        console.log(`[Board - useEffect@ballsAllData] singleBallSelected= ${singleBallSelected} --> ${stringTemp} ball slots`);
    }, [ballsAllData])


    /* ================================================================================
    --------------------------     Fuctions      -----------------------------------------
    * ================================================================================ */

    function preTriggerSelectedCardForSwap(){
        triggerSelectedCardForSwap(idCardSelected, cardsHand, setCardsHand, dispatcherTac, socket)
    }

    function preTriggerCardPlayed(idCardDblClicked = undefined){
        /**
         * function gets triggered by: 
         *  a) having a card selected and clicking the innerCircle or  (input to "HandCardsSelf")
         *  b) doubleClicking a card on your hand   (input to "InnerCenter")
         */
        triggerCardPlayed(cardsHand, setCardsHand, idCardSelected, socket, dispatcherTac, idCardDblClicked)
    }

    // function preTransitionCardHandToTray(dispatcherTac){
    //     transitionCardHandToTray(cardsHand, setCardsHand, dispatcherTac)
    // }



    /* ================================================================================
    --------------------------     RENDER      -----------------------------------------
    * ================================================================================ */

   // console.log(`Render [BOARD]`);
   
    return (<>
            <BallSlots resetTimer={resetTimer} setResetTimer={setResetTimer} highlightBallSlots={highlightBallSlots} setBallsAllData={setBallsAllData} ballsAllData={ballsAllData}/>
            {ballsAllData.length > 0 ? <Balls setResetTimer={setResetTimer} ballsData={ballsAllData} setBallsAllData={setBallsAllData}  /> : "" }
            {!isReady  
            ? <ConfirmReady {...{ isReady, setIsReady }} />: <>  </>
            }
            {(isReady && stateGameReduce.state === 'PLAYING' )
            ?  <>
                <DealerButton />
                <TrashCards width={WIDTHCARD}/>
                <HandCardsSelf cards={cardsHand} setCards={setCardsHand}
                    triggerCardPlayed={preTriggerCardPlayed} />
                <CardsAllOtherPlayers width={WIDTHCARD} />
                <ShuffledDeck width={WIDTHCARD} />
                <CardSwapZone gameState={stateGameReduce.state} gameSubState={stateGameReduce.subState} idCardSelected={idCardSelected} triggerSelectedCardForSwap={preTriggerSelectedCardForSwap}/>      
                <InnerCenter gameState={stateGameReduce.state} gameSubState={stateGameReduce.subState} stateInnerCenter={stateInnerCenter} triggerCardPlayed={preTriggerCardPlayed} />
                <FieldDealCards showDealerField={showDealerField} setShowDealerField={setShowDealerField} gameState={stateGameReduce.state} gameSubState={stateGameReduce.subState}/>
                </> 
            : null
            }

        {/* <TableDebug ballsAllData={ballsAllData} /> */}
        </>
    )
}

export default Board