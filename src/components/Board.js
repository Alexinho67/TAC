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



const numCards = 6
const WIDTHCARD = 18; // %
const ASPECT_RAT_CARD = 0.7

const numCardsOthers = {left:3,
                        front:4,
                        right:4}  //data from server


const ConfirmReady = ({ isReady, setIsReady }) => {
    const { socket } = useSocketContext()

    function clickReady() {
        socket.emit('readyToPlay', (resp) => {
            console.log(`[readyToPlay] ACKM: ${resp}`);
            if (resp === 'ok') {
                setIsReady(true)
            }
        })
    }

    return (<>
        {isReady ? <div>Waiting for other players</div>
            : <button id="btnReady" onClick={clickReady}> READY </button>}
    </>)
}

                        

const Board = ({ isReady, setIsReady, gameStarted, setGameStarted}) => {

    const [idCardSelected, setIdCardSelected] = React.useState(undefined)
    const [stateInnerCenter, setStateInnerCenter] = React.useState('inactive')
    const [cardsHand, setCardsHand] = React.useState([])
    const [cardsPlayed, setCardsPlayed] = React.useState([])
    const cnt = React.useRef(0)
    // const test = React.useRef(<div> Hello World</div>)

    
    /* ================================================================================
    --------------------------     HOOKS      -----------------------------------------
    * ================================================================================ */
    // test.current = React.createElement('div', null, 'INIT');
    
    React.useEffect(() => {
        console.log(`[CARDS] - INIT useEffect`);
        setCardsHand(initCards())
    }, [])

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



    /* ================================================================================
    --------------------------     Fuctions      -----------------------------------------
    * ================================================================================ */

    function initCards() {
        let cards = []
       
        for (let i = 0; i < numCards; i++) {
            let newCard = {
                id: i,
                isPlayed: false,
                isSelected: false,
                width: WIDTHCARD,
                value: Math.floor(Math.random() * 9) + 1,
                left: (100 - WIDTHCARD * numCards) * 0.5 + WIDTHCARD * i + WIDTHCARD/2,
                top: 100 + ASPECT_RAT_CARD * WIDTHCARD } // left edge of each card
            cards.push(newCard)
        }
        console.log(`[initCards()] cards: ${cards}`);
        return cards
    }

    function triggerCardPlayed(){
        console.log(`%c[Board=>triggerCardPlayed] User wants to play card #${idCardSelected}`,CNST.ORANGE);


        setCardsHand( (list)=>{return list.map((card )=>{
            console.log(`\t Current card: #${card.id} - value: ${card.value}. Compare to idCardSelected = ${idCardSelected}`);
            if (card.id !== idCardSelected) { return card}
            else { 
                let cardTmp = { ...card, isPlayed:true};
                console.log(`\t\t Setting card #${card.id} to ${JSON.stringify(cardTmp)} `); 
                return cardTmp
            } // closing if-else
        }) // closing- list.map()
        }) // closing setCards()
    } // closing triggerCardPlayed()

    function transitionCardHandToTray(){
        // after transition has ended, the card shall move from the array "cardsHand" to "cardsPlayed"
        console.log(`[Board=>transitionCardHandToTray] execute. idCardSelected=${idCardSelected}`);
                
        const _updateFncCardsPlayed = (list) => {
            console.log(`list: ${list}`);
            let cardPlayed = cardsHand.filter(card => card.id === idCardSelected)[0]
            let cardToTray = { ...cardPlayed, top: 50, left: 50, isSelected: false}
            list.push(cardToTray)
            console.log(`\t(new)list: ${JSON.stringify(list)}`);
            return list
        }
        setCardsPlayed(list => _updateFncCardsPlayed(list))


        setCardsHand( (list) => {return list.filter(card => {
            return card.isPlayed !== true
        })})
    }


    /* ================================================================================
    --------------------------     RENDER      -----------------------------------------
    * ================================================================================ */

   // console.log(`Render [BOARD]`);
    if (cardsPlayed.length>0){
        console.log(`cardsPlayed:`);
        cardsPlayed.forEach( (card, i) => {
            console.log(`\t\t -card #${i}-value:${card.value}`);
        })
    }

    return (<>
            <div>idReady:{isReady.toString()}</div>
            <div>gameStarted:{gameStarted.toString()}</div>
            <DebugBox {...{ cnt, idCardSelected, stateInnerCenter, cardsHand, cardsPlayed}} />    
            {!isReady  
            ? <ConfirmReady {...{ isReady, setIsReady }} />
            : <> <Balls numBalls={4} />
                 <button onClick={() => { setGameStarted(true) }}>Start Game(TEMP)</button> </>
            }
            {isReady && gameStarted 
            ?  <>
                <DealerButton />
                <CardsJSX name={"playedCards"} cards={cardsPlayed}/> 
                <CardsJSX name={"handCards"} cards={cardsHand} setCards={setCardsHand} transitionCardHandToTray={transitionCardHandToTray} />
                <CardsAllOtherPlayers width={WIDTHCARD} numCardsOthers={numCardsOthers} openCard={{ value: 13, player: 'right' }} />
                <InnerCenter state={stateInnerCenter} triggerCardPlayed={triggerCardPlayed} />
                </> 
            : ""
            }
        </>
    )
}

export default Board