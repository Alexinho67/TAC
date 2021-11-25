import React from 'react'
import Balls from './subComponents/Balls'
import CardsJSX from './subComponents/CardsJSX'
import InnerCenter from './subComponents/InnerCenter'
import DealerButton from './subComponents/DealerButton'
import CardsAllOtherPlayers from './subComponents/CardsAllOtherPly'
// import { addMessage, ExpireMsg } from './ExpireMsg'
import DebugBox from './debugComps/DebugBox'
import { useSocketContext } from './socketComps/SocketProvider'
import CNST from '../utils/Constants'
import { GameModelContext } from '../GameProvider'
import ShuffledDeck from './subComponents/ShuffledDeck'
import BallSlots from './subComponents/BallSlots'
import CardSwapZone from './subComponents/CardSwapZone'



const numCards = 6
const WIDTHCARD = 18; // %
const ASPECT_RAT_CARD = 0.7

const ConfirmReady = ({ isReady, setIsReady }) => {
    const { socket } = useSocketContext()
    const skipConfirmReady = React.useRef(false)
    const { dispatcherTac } = React.useContext(GameModelContext)
    
    
    
    React.useEffect(() => {
        if (!socket || !skipConfirmReady.current){ return }
        setTimeout(()=>{    
            clickReady()
        }, 1000)
    }, [socket])

    function clickReady() {
        dispatcherTac({ type: 'setSelfReady' })
        socket.emit('readyToPlay', (resp) => {
            console.log(`[readyToPlay] ACKM: ${resp}`);
            if (resp === 'ok') {
                setIsReady(true)
            }
        })
    }

    return (<>
        {isReady ? <div>Waiting for other players</div>
            : <div id="fieldConfirmReady" onClick={clickReady} tabIndex={1}> READY ?</div>}
    </>)
}

                        

const Board = ({ isReady, setIsReady }) => {
    const { socket } = useSocketContext()
    const { stateGameReduce, dispatcherTac} = React.useContext(GameModelContext)
    // cards
    const [idCardSelected, setIdCardSelected] = React.useState(undefined)
    // const [idCardPlayed, setIdCardPlayed] = React.useState(-1)
    const [cardsHand, setCardsHand] = React.useState([])
    const [cardsPlayed, setCardsPlayed] = React.useState([])
    // center
    const [stateInnerCenter, setStateInnerCenter] = React.useState('inactive')
    //balls
    // const [idBallSelected, setIdBallSelected] = React.useState(-1)
    const [highlightBallSlots, setHighlightBallSlots] = React.useState(false)
    const [ballsAllData, setBallsAllData] = React.useState([])
    // slots
    const [resetTimer, setResetTimer] = React.useState(false) // in "BallSlots" is a timer, which deactives the slots after a certain time
    /* ================================================================================
    --------------------------     HOOKS      -----------------------------------------
    * ================================================================================ */
    // test.current = React.createElement('div', null, 'INIT');
    React.useEffect(() => { 
        console.log(`%c[Board]-INIT`, 'color:#999')} ,
        [])

    React.useEffect(()=>{

        // console.log(`Lvl1-[Board-useEffect@stateGameReduce.players[0..4].balls]`);

        function getNewBallObject(ballReRenderModel){
            // console.log(`....[Board-useEffect@getNewBallObject]: ballReRenderModel:${JSON.stringify(ballReRenderModel)} `);
            let xBallGlobCentered, yBallGlobCentered
            if (ballReRenderModel.posGlobal <= 63) {
                let phi = Math.PI * 2 / 64 // angle between to ring slots
                let alpha = phi * ballReRenderModel.posGlobal + Math.PI / 2
                let radius = 45.25
                xBallGlobCentered = Math.cos(alpha) * radius
                yBallGlobCentered = Math.sin(alpha) * radius

            } else { // either start or home slot
                let lastDigit = ballReRenderModel.posGlobal % 10
                if (lastDigit <= 4) {// startSlot
                    //  corner right bottom:
                    //           #1 - O x   #2:  x O   #3: x x  #4: x x
                    //                x x        x x       O x      x O
                    let factxy
                    if (ballReRenderModel.posAbsOwner === 1) { factxy = [1, 1] }
                    else if (ballReRenderModel.posAbsOwner === 2) { factxy = [-1, 1] }
                    else if (ballReRenderModel.posAbsOwner === 3) { factxy = [-1, -1] }
                    else if (ballReRenderModel.posAbsOwner === 4) { factxy = [+1, -1] }
                    else { factxy = [0, 0] }
                    console.log(`factxy: ${factxy}`);
                    xBallGlobCentered = factxy[0] * (40 + (lastDigit - 1) % 2 * 5)
                    /* ==> lastDigit=1 -> factxy[0]* (40)
                       ==> lastDigit=2 -> factxy[0] * (40 + 5) =  factxy [0] * 45
                     */
                    yBallGlobCentered = factxy[1] * (40 + parseInt((lastDigit - 1) / 2) * 5)
                } else { // homeSlot
                    let idxHomeSlot = lastDigit - 5 // [5,6,7,8] --> [0,1,2,3]
                    let leadingDigit = parseInt(ballReRenderModel.posGlobal/10)
                    switch (leadingDigit){
                        case 7: //player 1
                            // idxHomeSlot=[0,2] are with xCenter = 0
                            // idxHomeSlot=[1,3] are with yCenter = 20.25
                            xBallGlobCentered = 0 + idxHomeSlot % 2 * (idxHomeSlot - 2) * 6.8 // for idxHomeSlot=[0,2] -> x=50, for i = [1] -> fact gets "-1" with "idxHomeSlot-2"
                            yBallGlobCentered = 20.25 + 0 * Math.pow(idxHomeSlot, 3) + 4 * Math.pow(idxHomeSlot, 2) - 16 * idxHomeSlot + 12
                            break
                        case 8://player 2
                            // idxHomeSlot= [0,3] same pos of xCenter= - 28
                            // idxHomeSlot= [1,2] same pos of xCenter= - 21.25
                            xBallGlobCentered = -28 + (idxHomeSlot % 2 + parseInt(idxHomeSlot / 2)) % 2 * 6.75 // for i=[0,3] the factor will be "0"
                            yBallGlobCentered = -8 + 4 * idxHomeSlot + parseInt(idxHomeSlot / 2) * 4 // each gap 4%, but lower two additionally 4 %
                            break
                        case 9: //player 3 (Front)
                            // idxHomeSlot = [0,2] are with xCenter = 0
                            // idxHomeSlot = [1,3] are with yCenter = -20.5
                            xBallGlobCentered =  idxHomeSlot % 2 * (idxHomeSlot - 2) * (-1) * 6.8 // for idxHomeSlot=[0,2] -> x=50, for i = [1] -> fact gets "-1" with                        "idxHomeSlot-2"
                            yBallGlobCentered = -20.5 + 0 * Math.pow(idxHomeSlot, 3) - 4 * Math.pow(idxHomeSlot, 2) + 16 * idxHomeSlot - 12
                            break
                        case 10://player 4
                            // idxHomeSlot= [0,3] same pos of xCenter= + 28
  
                            xBallGlobCentered = 28 - (idxHomeSlot % 2 + parseInt(idxHomeSlot / 2)) % 2 * 6.75 // for i=[0,3] the factor will be "0"
                            yBallGlobCentered = 7.8 - 4 * idxHomeSlot - parseInt(idxHomeSlot / 2) * 4 // each gap 4%, but lower two additionally 4 %
                            break
                        default:
                            xBallGlobCentered = 0
                            yBallGlobCentered = 0
                    }
                }
            }

            let alphaRot = - (stateGameReduce.players[0].posAbs - 1) * Math.PI / 2 // player1-> posAbs = 1 --> no Rotation; player4 --> rotation by 270°/ 1.5pi ; "-" because anti-clockwise
            let xBallRel = xBallGlobCentered * Math.cos(alphaRot) - yBallGlobCentered * Math.sin(alphaRot) + 50
            let yBallRel = xBallGlobCentered * Math.sin(alphaRot) + yBallGlobCentered * Math.cos(alphaRot) + 50

            // console.log(`%cTRANSFORMATION`,'color:red');
            // console.log(`%c alphaRot:${alphaRot},xBallGlobCentered:${xBallGlobCentered},yBallGlobCentered:${yBallGlobCentered}  `,'color:red');
            // console.log(`%c    ===> xBallRel:${xBallRel},yBallRel:${yBallRel}  `,'color:red');

            let newBall = { id: ballReRenderModel.id,
                            posGlobal: ballReRenderModel.posGlobal,
                            left: Math.round(xBallRel * 100) / 100, 
                            top: Math.round(yBallRel * 100) / 100 ,
                            color: ballReRenderModel.color,
                            isSelected: false, 
                            show: true, 
                            isSelectable: isReady }
            return newBall
        }

        function updateBallsList(listBalls, ballsListRerender){
            /* parameters: listBalls - old values of "ballsAllData"
                           ballsListRerender - list of balls from the model containing informations about balls which 
                                 shall be rerendered
                description: 
                    function loops through the list of ball which shall be rendered and 
            */
            // console.log(`    Lvl3-[Board-useEffect@stateGameReduce.players[0..4].balls] updateBallsList.`);
                                  
            ballsListRerender.forEach(ballReRenderModel => {
            //     // console.log(`    Lvl3-[Board-useEffect@stateGameReduce.players[0..4].balls] updateBallsList. Looping through list \n. Rerendering ball ${JSON.stringify(ballReRenderModel)}`);
                    // find ball in list "listBall"
                let ballTobeUpdated = listBalls.find(ball => ball.id === ballReRenderModel.id) 
                let newBall = getNewBallObject(ballReRenderModel)
                if (!ballTobeUpdated){ // ball not created yet 
                    listBalls.push(newBall)
                } else {
                    Object.assign(ballTobeUpdated, { left: newBall.left, top: newBall.top, posGlobal: newBall.posGlobal})
                }

                dispatcherTac({ type: 'setBallToHasBeenRendered', payload: ballReRenderModel })
            })
            
            return listBalls 

        }

            function updateBallsForRender(){
            /* function checks the model data and gets the list of balls which have the 
                property "rerender === true"
                These balls shall be created/updated in the state variable "ballsAllData"
            */
           let ballsListRerender = stateGameReduce.players.reduce((oldList, player) => {
               oldList.push(...player.balls.filter(ball => ball.rerender === true))
               return oldList
            }, [])
            
            // console.log(`  Lvl2-[Board-useEffect@stateGameReduce.players[0..4].balls] updateBallsForRender. ballsToRender: ${JSON.stringify(ballsListRerender)}`);
            setBallsAllData( listBalls => {
                return updateBallsList(listBalls, ballsListRerender)
            })
        }

        updateBallsForRender()
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
        function mouseClickHandler(e){
            /* function: 
                - unselect ball if user clicks somewhere into the "void"
            */
            console.log(`%c[Board]-MouseClick`,'background-color:#a0f; color:white');
            let elemTgt = e.target
            let ballSelected = ballsAllData.find(ball => {
                return ball.isSelected === true
            })
            // console.log(`....ballSelected:${JSON.stringify(ballSelected)}`);
            // console.log(`......elemTgt: id:${elemTgt.id}-class:${elemTgt.className}`);
            if (ballSelected !== undefined & elemTgt.className !== 'ballSlot') {
                // console.log(`....unselect ball`);
                setBallsAllData(list => list.map(b => {
                     return { ...b, isSelected: false }} ) )
            } else if (elemTgt.name === 'imgCard') {
                // console.log(`....clicked "imgCard"`);
                return
            }
        }
        window.addEventListener("click", mouseClickHandler);
        return () => {
            window.removeEventListener("click", mouseClickHandler);
        }
    }, [ballsAllData])
    
    React.useEffect(() => {
        console.log(`%c[Board-useEffect] - "stateGameReduce.self.cards" has changed`,'color:#999');
        if (stateGameReduce.players[0].cards.length > 0 && stateGameReduce.rerenderHandCards === true){
            setCardsHand(initCards(stateGameReduce.players[0].cards))
            dispatcherTac({ type: 'deactUpdateHandCards'})
        }else{
            console.log(`...No cards found. stateGameReduce.self.cards.length:${stateGameReduce.players[0].cards.length}`);
        }
    }, [stateGameReduce.players[0].cards])

    React.useEffect(() => {
        let stateInnerCircle = 'inactive'
        let idSelectedCard = -1
        cardsHand.forEach((card)=>{
            if (card.isSelected === true){
                idSelectedCard = card.id
                stateInnerCircle = 'active'
                return
            }
        })
        setStateInnerCenter(stateInnerCircle)
        setIdCardSelected(idSelectedCard)
    }, [cardsHand])

    React.useEffect(() => {
       let singleBallSelected = ballsAllData.some(ball => ball.isSelected) 
       singleBallSelected ? setHighlightBallSlots(true) : setHighlightBallSlots(false)
        let stringTemp = singleBallSelected  ? "show" : "hide"
        console.log(`[Board - useEffect@ballsAllData] singleBallSelected= ${singleBallSelected} --> ${stringTemp} ball slots`);
    }, [ballsAllData])


    /* ================================================================================
    --------------------------     Fuctions      -----------------------------------------
    * ================================================================================ */

    function initCards(cardsFromServer) {
        let cardObjects = []
       
        for (let i = 0; i < cardsFromServer.length; i++) {
            let newCard = {
                id: cardsFromServer[i].idInternal,
                idExt: cardsFromServer[i].idExt,
                isPlayed: false,   // card is set to "isPlayed" to set position "top=50%" and "left=50%" while using a transition
                isCardForSwap: false,   // card is set to "isCardForSwap" to set position approx. "top=70%" and "left=70%" while using a transition
                isSelected: false,  // use can (pre) select or unselect each card. Selection get highlighted 
                width: WIDTHCARD,
                // value: Math.floor(Math.random() * 9) + 1,
                value: cardsFromServer[i].value,
                left: (100 - WIDTHCARD * numCards) * 0.5 + WIDTHCARD * i + WIDTHCARD/2,
                top: 100 + ASPECT_RAT_CARD * WIDTHCARD } // left edge of each card
            cardObjects.push(newCard)
        }
        console.log(`[initCards()] cards: ${JSON.stringify(cardObjects)}`);
        return cardObjects
    }


    function triggerSelectedCardForSwap(idCardDblClicked = undefined){
        console.log(`[Board - triggerSelectedCardForSwap ]`);

        let idCardSwaping = idCardDblClicked ? idCardDblClicked : idCardSelected
        let cardSwaping = cardsHand.find(card => card.id === idCardSwaping)
        if (!cardSwaping) {
            console.log('cardSwaping not defined')
        }
        let cardToServer = { value: cardSwaping.value, id: cardSwaping.idExt }
        
        dispatcherTac({ type: 'cardForSwapSelectedSelf', payload: cardSwaping.idExt })
        socket.emit('swappingCard', cardToServer)

        setCardsHand( cardsListOld => {
            cardsListOld = cardsListOld.map(card => {
                if (card.id === idCardSwaping) { Object.assign(card, {isCardForSwap:true})} 
                return card 
            })
            return cardsListOld
        })
    }

    function triggerCardPlayed(idCardDblClicked = undefined){
        /* function simply looks for the card in "the hand" and set't it's status "isPlayed=true"
        */
        if(cardsHand.find(c => c.isPlayed)){
            /* if one card in the hand has currently the status "isPlayed", then no other card can be played */
            console.log('Please wait till previous card has been played.')
            return
        }

        let idCardPlaying
        if (idCardDblClicked){
            idCardPlaying = idCardDblClicked
        } else {
            idCardPlaying = idCardSelected
        }

        // setIdCardPlayed(idCardPlaying)
        console.log(`%c[Board=>triggerCardPlayed] User wants to play card #${idCardPlaying}`,CNST.ORANGE);
        let cardPlaying = cardsHand.find(card => card.id === idCardPlaying)
        if(!cardPlaying){
            console.log('CardPlaying not defined')
        }

        // inform the server of the card which is played
        let cardToServer = { value: cardPlaying.value, id: cardPlaying.idExt }
        console.log(`...Playing cardToServer:${JSON.stringify(cardToServer)}`);
        socket.emit('playingCard', cardToServer)


        
        setCardsHand( (list)=>{return list.map((card )=>{
            // console.log(`\t Current card: #${card.id} - value: ${card.value}. Compare to idCardSelected = ${idCardSelected}`);
            if (card.id !== idCardPlaying) { return card}
            else { 
                return Object.assign(card, { isPlayed: true} ) //setting card to "isPlayed : true"
            } // closing if-else
        }) // closing- list.map()
        }) // closing setCards()

        let timeAnimation = 800
        setTimeout(() => transitionCardHandToTray(idCardPlaying), timeAnimation)

    } // closing triggerCardPlayed()

    function transitionCardHandToTray(idCardPlaying){
        // after transition has ended, the card shall move from the array "cardsHand" to "cardsPlayed"
        console.log(`[Board=>transitionCardHandToTray] execute. idCardPlaying=${idCardPlaying}`);
                
        const _updateFncCardsPlayed = (list) => {
            console.log(`\t [Board/setCardsPlayed] old list(len:${list.length}): ${list}`);
            let cardPlayed = cardsHand.filter(card => card.id === idCardPlaying)[0]
            console.log(`\t [Board/setCardsPlayed] cardPlayed: ${JSON.stringify(cardPlayed)}`);
            let cardToTray = { ...cardPlayed, top: 50, left: 50, isSelected: false}
            list.push(cardToTray)
            console.log(`\t [Board/setCardsPlayed] new list(len:${list.length}): `)
            console.table(list)
            return list
        }
        setCardsPlayed(list => _updateFncCardsPlayed(list))


        setCardsHand( (list) => {return list.filter(card => {
            return card.isPlayed !== true
        })})

        // remove card from the model
        let style = 'color:yellow;background-color: #00f'
        console.log(`issue_%c[Board/transitionCardHandToTray] card played with id: ${idCardPlaying}`, style);
        dispatcherTac({ type: 'removeHandCard', payload: idCardPlaying })
        // setIdCardPlayed(-1)
    }


    /* ================================================================================
    --------------------------     RENDER      -----------------------------------------
    * ================================================================================ */

   // console.log(`Render [BOARD]`);


    const TableDebug = ({ ballsAllData} ) => {

        if (ballsAllData?.length === 0){
            return <></>
        } else {
            return (
                <>
                <div style={{ marginEnd: '3rem', position: 'absolute', top: '135%', left: '-50%', color: 'red' }}>ballsAllData
                    <table style={{ width: '400px', textAlign: 'center' }}>
                        <tbody>
                            <tr>
                                {ballsAllData?.length > 0 ? Object.keys(ballsAllData[0]).map((key) => {
                                    return <th style={{ padding: '1rem' }} key={Math.floor(Math.random() * 1000000)}>{key}</th>
                                }) : ""}
                            </tr>
                            {ballsAllData.map(ball => <tr key={ball.id}>
                                {Object.keys(ball).map((key) => {
                                    let val = ball[key]
                                    if (typeof val === 'number') {
                                        val = Math.floor(val * 100) / 100
                                    }
                                    return <td key={Math.floor(Math.random() * 1000000)}>{JSON.stringify(val)}</td>
                                })}
                            </tr>)}
                        </tbody>
                    </table>
                </div>
                </>)
        }
    } 
   
    return (<>
            {/* <DebugBox {...{idCardPlayed, idCardSelected, stateInnerCenter, cardsHand, cardsPlayed}} /> */}
            <BallSlots resetTimer={resetTimer} setResetTimer={setResetTimer} highlightBallSlots={highlightBallSlots} setBallsAllData={setBallsAllData} ballsAllData={ballsAllData}/>
            {ballsAllData.length > 0 ? <Balls setResetTimer={setResetTimer} ballsData={ballsAllData} setBallsAllData={setBallsAllData}  /> : "" }
            {!isReady  
            ? <ConfirmReady {...{ isReady, setIsReady }} />: <>  </>
            }
            {isReady && stateGameReduce.started
            ?  <>
                <DealerButton />
                <CardsJSX name={"trashCards"} cards={cardsPlayed}/> 
                <CardsJSX name={"handCards"} cards={cardsHand} setCards={setCardsHand} 
                    transitionCardHandToTray={transitionCardHandToTray} 
                    triggerCardPlayed={triggerCardPlayed} />
                {/* <CardsAllOtherPlayers width={WIDTHCARD} openCard={openCard} /> */}
                <CardsAllOtherPlayers width={WIDTHCARD} />
                
                <ShuffledDeck width={WIDTHCARD} />
                </> 
            : <></>
            }

        {(stateGameReduce.state === 'PLAYING' && 
          stateGameReduce.subState === 'WAIT_FOR_SWAP_CARDS') 
            ? <>
                <CardSwapZone idCardSelected={idCardSelected} triggerSelectedCardForSwap={triggerSelectedCardForSwap}/>
            </>
           : <></>
        }       

        <InnerCenter stateInnerCenter={stateInnerCenter} triggerCardPlayed={triggerCardPlayed} />
   
     {(stateGameReduce.state === 'PLAYING' && 
            stateGameReduce.subState === 'WAIT_FOR_ALL_CARDS_PLAYED')
            ? <InnerCenter stateInnerCenter={stateInnerCenter} triggerCardPlayed={triggerCardPlayed} />
           : <></>
        }
        <TableDebug ballsAllData={ballsAllData} />
        </>
    )
}

export default Board