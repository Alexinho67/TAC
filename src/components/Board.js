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



const numCards = 6
const WIDTHCARD = 18; // %
const ASPECT_RAT_CARD = 0.7

const ConfirmReady = ({ isReady, setIsReady }) => {
    const { socket } = useSocketContext()

    React.useEffect(() => {
        if (!socket){ return }
        setTimeout(()=>{    
            clickReady()
        }, 1000)
    }, [socket])

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
            : <div id="fieldConfirmReady" onClick={clickReady} tabIndex={1}> READY ?</div>}
    </>)
}

                        

const Board = ({ isReady, setIsReady, gameStarted, setGameStarted}) => {
    const { socket } = useSocketContext()
    const { stateGameReduce, dispatcherTac} = React.useContext(GameModelContext)

    const [idCardSelected, setIdCardSelected] = React.useState(undefined)
    const [idCardPlayed, setIdCardPlayed] = React.useState(-1)
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
        console.log(`%c[Board]-INIT`, 'color:#999')}
        ,[])
    
    React.useEffect(() => {
        console.log(`%c[Board-useEffect] - "stateGameReduce.self.cards" has changed`,'color:#999');
        if (stateGameReduce.self.cards.length > 0 && stateGameReduce.self.updateHandCards === true){
            setCardsHand(initCards(stateGameReduce.self.cards))
            dispatcherTac({ type: 'deactUpdateHandCards'})
        }else{
            console.log(`...No cards found. stateGameReduce.self.cards.length:${stateGameReduce.self.cards.length}`);
        }
    }, [stateGameReduce.self.cards])

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

    function initCards(cardsFromServer) {
        let cardObjects = []
       
        for (let i = 0; i < cardsFromServer.length; i++) {
            let newCard = {
                id: cardsFromServer[i].idInternal,
                idExt: cardsFromServer[i].idExt,
                isPlayed: false,
                isSelected: false,
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

        setIdCardPlayed(idCardPlaying)
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
                let cardTmp = { ...card, isPlayed:true};
                // console.log(`\t\t Setting card #${card.id} to ${JSON.stringify(cardTmp)} `); 
                return cardTmp
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
        setIdCardPlayed(-1)
    }


    /* ================================================================================
    --------------------------     RENDER      -----------------------------------------
    * ================================================================================ */

   // console.log(`Render [BOARD]`);
   
    return (<>
            <DebugBox {...{ cnt, idCardPlayed, idCardSelected, stateInnerCenter, cardsHand, cardsPlayed}} />
            {!isReady  
            ? <ConfirmReady {...{ isReady, setIsReady }} />
            : <> <Balls numBalls={4} />
                 {/* <button onClick={() => { setGameStarted(true) }}>Start Game(TEMP)</button>  */}
                 <DealerButton />
                 </>
            }
            {isReady && stateGameReduce.started
            ?  <>
                <CardsJSX name={"playedCards"} cards={cardsPlayed}/> 
                <CardsJSX name={"handCards"} cards={cardsHand} setCards={setCardsHand} 
                    transitionCardHandToTray={transitionCardHandToTray} 
                    triggerCardPlayed={triggerCardPlayed} />
                {/* <CardsAllOtherPlayers width={WIDTHCARD} openCard={openCard} /> */}
                <CardsAllOtherPlayers width={WIDTHCARD} />
                <InnerCenter state={stateInnerCenter} triggerCardPlayed={triggerCardPlayed} />
                <ShuffledDeck width={WIDTHCARD} />
                </> 
            : ""
            }
        </>
    )
}

export default Board