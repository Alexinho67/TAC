import { v4 as uuidv4 } from 'uuid';
const clonedeep = require('lodash.clonedeep')

class Player{
    constructor(posRel){
        this.name = 'None'
        this.posAbs = undefined
        this.posRel = posRel
        this.state = 'init'
        this.cards = []
        this.cardForSwap = undefined //hasSelectdCardForSwap = false // used to display a card for swapping on the board
        this.color = undefined
        this.balls = []
    }
}
class GameObj{
    constructor(){
        this.state = 'init'
        this.subState = 'init'
        this.gameId = undefined
        this.posDealerAbs = 0; // 1,2,3,4
        this.posDealerRel = undefined;  // self,left,front,right 
        // this.self = initPlayerSelf();
        this.numShuffledCards = 0
        this.players = initPlayers();
        this.cardsPlayed = []
        this.cardPlayedOther = undefined
        this.rerenderHandCards = false
    }
}

function initPlayers() {
    return [new Player(0), new Player(1), new Player(2), new Player(3)]
}

export function initGameModel() {
    let newGame = new GameObj()
    return newGame
}

export function reducerFcnGameModel(state, action) {
    const { type } = action
    let returnState = clonedeep(state)
    if (type === 'updatePlayers') {
        handleUpdatePlayers(returnState, action.payload)
        return returnState
    } else if (type === 'setGameID') {
        let gameId = action.payload
        return setGameId(returnState, gameId)
    } else if (type === 'clearState') {
        let player = returnState.players[0]
        let newGameState = initGameModel()
        newGameState.players[0] = player
        return newGameState
    } else if (type === 'setBallToHasBeenRendered') {
        return setBallToHasBeenRendered(returnState, action.payload)
    } else if (type === 'updateCardsFromServer') {
        return handleUpdateCardsFromServer(returnState, action.payload)
    } else if (type === 'updateNumCardsShuffled') {
        console.log(`[updateNumCardsShuffled]. Payload: ${action.payload}`);
        returnState.numShuffledCards = action.payload
        return returnState
    } else if (type === 'deactUpdateHandCards') {
        console.log(`[ModelReducer] Setting "self.updateHandCards = false" `);
        returnState.rerenderHandCards = false
        return returnState
    } else if (type === 'updateSelfData'){
        return handleUpdateSelfData(returnState, action.payload )
    } else if (type === 'gameStart') {
        console.log(`[Reducer] start game`);
        returnState.state = 'PLAYING'
        return returnState
    } else if (type === 'setSelfReady') {
        return setSelfReady(returnState)
    } else if (type === 'removeHandCard') {
        return handleRemoveSingleHandCard(returnState, action.payload)
    }else if (type === 'cardPlayedByOther') {
        return handleCardPlayedByOther(returnState, action.payload)
    } else if (type === 'resetCardPlayedByOther') {
        
        return handleResetCardPlayedByOther(returnState)
    } else if (type === 'newDealer') {
        return handleNewDealer(returnState, action.payload)
    } else if (type === 'updateBallPosition') {
        return updateBallPosition(returnState, action.payload)
    } else if (type === 'ballMovedByOther') {
        return updateBallMovedByOther(returnState, action.payload)   
    } else if (type === 'cardForSwapSelectedSelf') {
        // payload: cardSwaping.idExt
        const idExtCard = action.payload
        const posAbsSelf = returnState.players[0].posAbs
        return handleCardForSwapSelected(returnState, posAbsSelf, idExtCard)
    } else if (type === 'cardForSwapSelectedOtherPlayer') {
        let posAbsPlayer = action.payload
        return handleCardForSwapSelected(returnState, posAbsPlayer) 
    } else if (type === 'cardFromSwapReceived') {
        let cardFromSwapRecvd = action.payload
        return handleCardFrmSwapReceived(returnState, cardFromSwapRecvd)
    } else if (type === 'setUserName') {
        let userName = action.payload
        console.log(`[modelReducer.js - setUserName]: userName:${userName} `);
        returnState.players[0].name = userName
        return returnState
    } else if (type === 'userInfoAfterReload') {
        const { playerStatus, gameState } = action.payload
        console.log(`[modelReducer.js - userInfoAfterReload]: gameState: ${JSON.stringify(gameState)} \n playerStatus:${JSON.stringify(playerStatus)} `);
        return updateDataAfterReload(returnState, playerStatus, gameState)
    } else{
        throw new Error(`DISPATCHER: TYPE "${type}" is not supported!`)
    }    
}

function handleResetCardPlayedByOther(returnState){
    let cardRecentlyPlayed = returnState.cardPlayedOther
    returnState.cardPlayedOther = undefined
    // returnState.cardsPlayed.push({...card, idExt:card.id}) //rewrite id to idExt
    returnState.cardsPlayed.push(cardRecentlyPlayed) //rewrite id to idExt
    return returnState
}

function updateDataAfterReload(returnState, playerStatus, gameState) {
    returnState.gameId = gameState.id
    returnState.state = gameState.state
    returnState.subState = gameState.subState
    // update dealer
    const [, posRel] = getRelativePos(playerStatus.pos, gameState.dealerPos)
    returnState.posDealerRel = posRel
    returnState.posDealerAbs = gameState.dealerPos
    
    // update trash cards
    returnState.cardsPlayed = gameState.trashCards.map(cardTrashServer => {
        return { ...cardTrashServer, idExt: cardTrashServer.id } //rewrite id to idExt
    })

    
    // update ball objects
    let ballsData = playerStatus.balls.map(ballServer => {
        return {
            id: ballServer.id,
            posAbsOwner: parseInt(playerStatus.pos),
            posGlobal: ballServer.pos,
            color: playerStatus.color,
            show: playerStatus.isReady,
            rerender: playerStatus.isReady
        }
    })
    let cardsData = playerStatus.cards.map(cardServer => {
        let newCardObj = {
            idExt: cardServer.id,
            idInternal: uuidv4(),
            value: parseInt(cardServer.value)
        }
        return newCardObj })

    let playerDataNew = {
        name: playerStatus.name,
        color: playerStatus.color,
        posAbs: playerStatus.pos,
        posRel: 0,
        balls: ballsData,
        state: playerStatus.isReady ? 'ready' : 'init',
        cardForSwap: playerStatus.cardSwapGive ?
             {...playerStatus.cardSwapGive, idExt: playerStatus.cardSwapGive.id} : undefined ,
        cards: cardsData,
    }
    

    returnState.rerenderHandCards = true
    returnState.players[0] = playerDataNew
    return returnState
}

function setGameId(returnState, gameId) {
    returnState.gameId = gameId
    return returnState
}

function handleCardFrmSwapReceived(returnState, cardFromSwapRecvd){
    console.log(`'[modelReducer.js - handleCardFrmSwapReceived]. card:${JSON.stringify(cardFromSwapRecvd)}`);
    /* remove swapCard from "handCards" */
    let self = returnState.players[0]
    self.cards = self.cards.filter(card => {
        return card.idExt !== self.cardForSwap.idExt
    })
    returnState.players.forEach(p => p.cardForSwap = undefined)

    /* add new card to "handCards" */
    let newCardObj = { idExt: cardFromSwapRecvd.id, idInternal: uuidv4(), value: cardFromSwapRecvd.value }
    returnState.players[0].cards.push(newCardObj)
    returnState.rerenderHandCards = true

    /* update game state */
    returnState.subState = 'WAIT_FOR_ALL_CARDS_PLAYED'
    return returnState
}

function handleCardForSwapSelected(returnState, posAbsPlayer, idExtCard = undefined) {
    let plyObj = returnState.players.find(p => p.posAbs === posAbsPlayer)
    let cardForSwap = undefined
    if (idExtCard){
        // "self" has selected a fresh card
        cardForSwap = plyObj.cards.find(card => card.idExt === idExtCard)
    } else {
        cardForSwap = {idExt:-1, value:0}
    }
    plyObj.cardForSwap = cardForSwap
    return returnState
}

function setBallToHasBeenRendered(returnState, ballRendered) {
    // console.log(`'[modelReducer.js - setBallToHasBeenRendered] ball: ${JSON.stringify(ballRendered)}`);
    returnState.players.forEach(p => {
        let ballFound = p.balls.find(b=> b.id === ballRendered.id)
        if (ballFound) {
            Object.assign(ballFound, {rerender:false})
            // console.log(`....ball found: ${JSON.stringify(ballFound)}`);
        }
    })
    return returnState
}

function setSelfReady(returnState) {
    console.log(`'[modelReducer.js - setSelfReady]`);
    returnState.players[0].state = 'ready'
    returnState.players[0].balls = returnState.players[0].balls.map(ball => {
        return Object.assign(ball, {show:true, rerender:true})
    })
    return returnState
}

function updateBallMovedByOther(returnState, ballMovedExt){
    console.log(`'[modelReducer.js - updateBallMovedByOther]: payload: ${JSON.stringify(ballMovedExt)}`);
    let allBalls = returnState.players.reduce( (oldList,p)=>{
        oldList.push(...p.balls)
        return oldList
    },[])
    let ballMoved = allBalls.find(ball => ball.id === ballMovedExt.id)
    Object.assign(ballMoved, { posGlobal: ballMovedExt.pos, rerender:true })
    /* no need to reassign the object "ballMoved" to the list "ballsPlayedOld" and this list to the "returnState" object
       because the referenced are shared */
    return returnState 
}


function updateBallPosition(returnState, payload ){
    /* function "updateBallPostion" update the ball position from the players perspective
        to the global perspective.
        E.g. this player is #3 and has a fresh ball in right in front of him
             for him it's on slot #0, but the global position of that slot is #32.
    */
    console.log(`%c'[modelReducer.js - updateBallPosition]: payload:`,'background-color:#999');
    console.table(payload);

    const {idxPosSlot, ballSelected, socket} = payload
    let allBalls = returnState.players.reduce((listRes,p) => {
        listRes.push(...p.balls)
        return listRes
    }  ,[])
    let ballPlayed = allBalls.find(ball => ball.id === ballSelected.id )

    if(!ballPlayed){
        // console.log(`...BallPlayed not defined`);
    }
    let posSlotGlobal = idxPosSlot

    socket.emit('movedBall', { id: ballPlayed.id, pos: posSlotGlobal, posOwner: ballPlayed.posAbsOwner })

    console.log(`%c[modelReducer.js - updateBallPosition]: setting ball:${JSON.stringify(ballPlayed)} to posGlobal=${posSlotGlobal}`,'background-color:#222');
    ballPlayed = Object.assign(ballPlayed, { posGlobal: posSlotGlobal, rerender:true })
    return returnState
}

function handleRemoveSingleHandCard(returnState, idCardPlayed){


    let cardPlayed = returnState.players[0].cards.find(c => c.idInternal === idCardPlayed)
    let selfName = returnState.players[0].name
    returnState.cardsPlayed.push({ ...cardPlayed, playedByName: selfName})
    
    if(!cardPlayed){
        alert('[modelReducer.js - removeSingleHandCard]. "cardPlayed" is not defined')
        console.error(`[modelReducer.js - removeSingleHandCard]: "cardPlayed" is not defined`);
        console.error(`\t\t  idCardPlayed=${idCardPlayed}`);
        
    }
    let style= 'color:yellow;background-color: #00f'
    console.log(`issue_%c[modelReducer] Player played a card-id: ${JSON.stringify(cardPlayed)}`, style);
    returnState.players[0].cards = returnState.players[0].cards.filter(card => card.idInternal !== idCardPlayed )
    return returnState
}



function getRelativePos(posAbsSelf, posAbsTgt){
    /* idea is the following:
        person to my left has either:
        -  a position which is "+1"  in respect to my position (e.g. me:#2/left:#3)
        -  or "-3" in respect to my position ( only for me:4/left:1)
        to catch both cases the difference is added with 4 before applying mod4 to it
        ==>  result 0 => self, 1=> left, => 2=> front; 3=> right
    */
    if (typeof (posAbsTgt) === 'string' ){
        posAbsTgt = parseInt(posAbsTgt)
    }
    // let posStrings = ['self','left','front','right']
    let idxPosRel = (posAbsTgt - posAbsSelf + 4) % 4 //0,1,2,3 with 0=me,1=left,2=front,3=right
    let posRel = idxPosRel + 1  // posStrings[idxPosRel]
    return [idxPosRel, posRel]
}

function handleNewDealer(returnState, dealer){
    returnState.cardsPlayed =  []
    returnState.posDealerAbs = dealer.pos
    returnState.subState = 'WAIT_FOR_DEAL_REQ'
    const [, posRel] = getRelativePos(returnState.players[0].posAbs ,dealer.pos)
    returnState.posDealerRel = posRel
    console.log(`[reducer-onHandleNewDealer]. new dealer:"${dealer.name}#${dealer.pos}"`);
    if (posRel === 1){console.log(`...It's you!!!`)}
    return returnState
}

function handleCardPlayedByOther(returnState, card){
    console.log(`[handleCardPlayedByOther]: "${card.playedByName}"-#${card.playedByPosAbs} played card: "${card.value}"`);
    // update "played cards" 
    
    let namePlayedBy = card.playedByName
    let playersOthers = returnState.players.slice(1,4)
    let playerCardPlayed = playersOthers.find(p => p.posAbs === card.playedByPosAbs)
    playerCardPlayed.cards.pop()
    const [, posRel] = getRelativePos(returnState.players[0].posAbs, card.playedByPosAbs)
    let cardObjUpdate = { value: card.value, playedByName: namePlayedBy, posRelOfPlayer: posRel, posAbsOfPlayer: playerCardPlayed.posAbs }
    console.log(`[handleCardPlayedByOther]: updating gameModelState with card obj: "${JSON.stringify(cardObjUpdate)}"`);
    returnState.cardPlayedOther = cardObjUpdate
 
    return returnState
}

function handleUpdateSelfData(returnState, data){
    console.log(`[handleUpdateSelfData]. data:${JSON.stringify(data)}`);
    returnState.state = 'WAIT_FOR_OTHER_PLAYERS'
    // { "userName": "", "userColor": "", "userPosition": "1" }
    returnState.players[0].name = data.userName
    returnState.players[0].color = data.userColor
    returnState.players[0].posAbs = parseInt(data.userPosition)

    // update "balls" (id:11..14 --> player1, 21..24--> player2, ... , 41..44 --> player4)
    for (let i = 0; i<4; i++){
        let newBall = { id: i + 1 + 10 * returnState.players[0].posAbs,
                    posAbsOwner: parseInt(returnState.players[0].posAbs),
                    posGlobal: i + 1 + 60 + returnState.players[0].posAbs*10,
                    color: returnState.players[0].color,
                    rerender: false,
                    show:false}
        console.log(`... creating new ball: newBall ${JSON.stringify(newBall)}`);
        returnState.players[0].balls.push(newBall )
    }
    return returnState
}

function handleUpdateCardsFromServer(returnState, cards){
console.log(`[Reducer-handleUpdateCardsFromServer] received new cards: "${JSON.stringify(cards)}". Setting ".rerenderHandCards = true" `);
    cards.forEach(card => {
        let newCardObj = { 
                idExt: card.id, 
                idInternal: uuidv4(), 
                value: parseInt(card.value)}
        returnState.players[0].cards.push(newCardObj)
    })

    returnState.rerenderHandCards = true
    returnState.subState = 'WAIT_FOR_SWAP_CARDS'


    // other players received the same number of cards.
    returnState.players.slice(1,4).map(p => {
        let dummyCards = []
        for (let i = 0; i < cards.length; i++) {
            dummyCards.push({ idExt: -1, idInternal: uuidv4(), val: 0 })
        }
        return p.cards = dummyCards})
    return returnState
}

function handleUpdatePlayers(returnState, payload) {
    let self = returnState.players[0]
    console.log(`[Reducer- handleUpdatePlayers] Payload:`);
    console.table(payload)
    payload.msg.forEach(playerDataServer => {
        const [idxPosRel, ] = getRelativePos(self.posAbs, playerDataServer.pos)
        console.log(`    player data from server: ${JSON.stringify(playerDataServer)}`);

        //{name: 'Raelynn Cline', pos: '2', color: 'red', state: 'false', balls: Array(4)}
        if (idxPosRel === 0) {
            return
        }
        console.log(`idxPosRel=`, idxPosRel);
        let idxOtherPlayer = idxPosRel

        // add balls 
        if (returnState.players[idxOtherPlayer].balls.length === 0){
            // player has no balls yet assigned --> create them now
            playerDataServer.balls.forEach(ballDataServer => {
                let newBall = {
                    id: ballDataServer.id,
                    posAbsOwner: parseInt(playerDataServer.pos),
                    posGlobal: ballDataServer.pos,
                    color: playerDataServer.color,
                    show: playerDataServer.isReady,
                    rerender: playerDataServer.isReady
                }
                returnState.players[idxOtherPlayer].balls.push(newBall)
            }) 
        } else{ 
            // balls already created. Check if player is ready to "show" the balls. 
            // Otherwise -> return
            if (playerDataServer.isReady === true) {
                returnState.players[idxOtherPlayer].balls.forEach(b => {
                    b.show = true
                    b.rerender = true
                })
            } else {
                return
            }
        }
        let stateUpdate = playerDataServer.isReady ? 'is ready' : 'getting a beer. Will be ready soon.'
        let data = { 
            name: playerDataServer.name, 
            state: stateUpdate, 
            posAbs: playerDataServer.pos, 
            posRel: idxPosRel + 1, 
            color: playerDataServer.color,
            cardForSwap: playerDataServer.hasSelectedCardSwap ? { idExt: -1, value: 0 } : undefined}
        Object.assign(returnState.players[idxOtherPlayer], data)
    }) // end forEach
}