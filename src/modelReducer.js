import { v4 as uuidv4 } from 'uuid';
const clonedeep = require('lodash.clonedeep')

class Player{
    constructor(posRel){
        this.name = 'None'
        this.posAbs = undefined
        this.posRel = posRel
        this.status = 'init'
        this.cards = []
        this.nrCards = undefined
        this.color = undefined
        this.balls = []
    }
}
class GameObj{
    constructor(){
        this.started = false;
        this.gameId = undefined
        this.posDealerAbs = 0; // 1,2,3,4
        this.posDealerRel = undefined;  // self,left,front,right 
        // this.self = initPlayerSelf();
        this.numShuffledCards = 0
        this.players = initPlayers();
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
        let gameID = action.payload
        return setGameID(returnState, gameID)
    } else if (type === 'clearState') {
        return initGameModel()
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
        returnState.self.updateHandCards = false
        return returnState
    } else if (type === 'updateSelfData'){
        return handleUpdateSelfData(returnState, action.payload )
    } else if (type === 'gameStart') {
        console.log(`[Reducer] start game`);
        returnState.started = true
        return returnState
    } else if (type === 'setSelfReady') {
        return setSelfReady(returnState)
    } else if (type === 'removeHandCard') {
        return handleRemoveSingleHandCard(returnState, action.payload)
    }else if (type === 'cardPlayedByOther') {
        return handleCardPlayedByOther(returnState, action.payload)
    } else if (type === 'resetCardPlayedByOther') {
        returnState.cardPlayedOther = undefined
        return returnState
    } else if (type === 'newDealer') {
        return handleNewDealer(returnState, action.payload)
    } else if (type === 'updateBallPosition') {
        return updateBallPosition(returnState, action.payload)
    } else if (type === 'ballMovedByOther') {
        return updateBallMovedByOther(returnState, action.payload)
    } else{
        throw new Error(`DISPATCHER: TYPE "${type}" is not supported!`)
    }    
}

function setGameID(returnState, gameId) {
    returnState.gameId = gameId
    return returnState
}


function setBallToHasBeenRendered(returnState, ballRendered) {
    console.log(`'[modelReducer.js - setBallToHasBeenRendered] ball: ${JSON.stringify(ballRendered)}`);
    returnState.players.forEach(p => {
        let ballFound = p.balls.find(b=> b.id === ballRendered.id)
        if (ballFound) {
            Object.assign(ballFound, {rerender:false})
            console.log(`....ball found: ${JSON.stringify(ballFound)}`);
        }
    })
    return returnState
}

function setSelfReady(returnState) {
    console.log(`'[modelReducer.js - setSelfReady]`);
    returnState.players[0].status = 'ready'
    returnState.players[0].balls = returnState.players[0].balls.map(ball => {
        return Object.assign(ball, {show:true, rerender:true})
    })
    return returnState
}

function updateBallMovedByOther(returnState, ballMovedExt){
    console.log(`'[modelReducer.js - updateBallMovedByOther]: payload: ${JSON.stringify(ballMovedExt)}`);
    // const [idxPosRel,] = getRelativePos(returnState.self.userPosition, ballMovedExt.playerPos)
    // let ballsPlayerOld = returnState.statusOtherPlayers[idxPosRel-1].balls
    let allBalls = returnState.players.reduce( (oldList,p)=>{
        oldList.push(...p.balls)
        return oldList
    },[])
    let ballMoved = allBalls.find(ball => ball.id === ballMovedExt.id)
    Object.assign(ballMoved, { posGlobal: ballMovedExt.pos, rerender:true })
    // no need to reassign the object "ballMoved" to the list "ballsPlayedOld" and this list to the "returnState" object
    // because the referenced are shared
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
    let posSlotGlobal
    // if (idxPosSlot<64){//ball is on the ring
    //     /*    numPlayer | idSlotPlayerPerspective | idSlotGlobal |    notes
    //     1                   2                     2            idSlotGlobal = idSlotPlyPers 
    //     2                   2                     18           idSlotGlobal = idSlotPlyPers + 16
    //     3                   2                     34           idSlotGlobal = idSlotPlyPers + 32
    //     4                   2                     50           idSlotGlobal = idSlotPlyPers + 48
    //     ---> idSlotGlobal = idSlotPlyPers + 16*(numPlayer-1)
    //     control:     
    //     4                   32                 32 + 16*3    ball is in front of player 4, at player-2's personal id=0 field
    //     = 80       -->  finalPos = x mod 64
    //     (mod64) -> 16       -->  finalPos = x mod 64
        
    //     */
    //    posSlotGlobal = idxPosSlot + 16 * (returnState.players[0].posAbs -1 )
    //    posSlotGlobal = posSlotGlobal%64
    // } else { // either in start slots or in home/end slots
    //     let lastDigit = idxPosSlot%10
    //     if (lastDigit <= 4) { //start slot ( numbers x1,x2,x3,x4 with x beeing [7,8,9,10] respective for each player)
    //         /* transform slot position from players perspective to global perspective 
    //         e.g.  player 3 put his own ball to slot #71 (his own, most inner start slot).
    //              on the global perspective this slot is #91 
            
    //             playerNum   posSlotOwnPers     posTemp  posSlotGlobal      comment
    //                 1               71    -->     71         71         start slot of player1
    //                 2               71    -->     81         81         start slot of player2
    //                 2               101   -->     111        71         start slot of player1
    //                 3               81    -->     101       101         start slot of player4
    //                 4               71    -->     101       101         start slot of player4
    //                 4               91    -->     121        91         start slot of player2
    //                 4               101    -->    131        91         start slot of player2
                 
    //         */
    //         posSlotGlobal = idxPosSlot + 10 * (returnState.players[0].posAbs - 1 ) // res: [71...134]
    //         posSlotGlobal = posSlotGlobal - 70 //[1,2,3,11,12...62,63,64] but all x > 34 are invalid/ need to be mapped to [01..34]
    //         posSlotGlobal = posSlotGlobal%40 //[1...34]
    //         posSlotGlobal = posSlotGlobal + 70 //back to number space [71..104]
    //     } else { // home/end slots ( numbers x5,x6,x7,x8 with x beeing [7,8,9,10] respective for each player)
    //         posSlotGlobal = idxPosSlot + 10 * (returnState.players[0].posAbs - 1) // res: [75...138]
    //         posSlotGlobal = posSlotGlobal - 70 //[5,6,7,8,15,16...65,66,67] but all x > 38 are invalid/ need to be mapped to [5,6..37,38]
    //         posSlotGlobal = posSlotGlobal % 40 //[5,6..37,38]
    //         posSlotGlobal = posSlotGlobal + 70 //back up to number space [75,76..105,106,107,108]
    //     }
    // }

    posSlotGlobal = idxPosSlot

    socket.emit('movedBall', { id: ballPlayed.id, pos: posSlotGlobal, posOwner: ballPlayed.posAbsOwner })

    console.log(`%c[modelReducer.js - updateBallPosition]: setting ball:${JSON.stringify(ballPlayed)} to posGlobal=${posSlotGlobal}`,'background-color:#222');
    ballPlayed = Object.assign(ballPlayed, { posGlobal: posSlotGlobal, rerender:true })
    return returnState
}

function handleRemoveSingleHandCard(returnState, idCardPlayed){
    let cardPlayed = returnState.self.cards.find(c => c.idInternal === idCardPlayed)
    if(!cardPlayed){
        alert('[modelReducer.js - removeSingleHandCard]. "cardPlayed" is not defined')
        console.error(`[modelReducer.js - removeSingleHandCard]: "cardPlayed" is not defined`);
        console.error(`\t\t  idCardPlayed=${idCardPlayed}`);
        
    }
    let style= 'color:yellow;background-color: #00f'
    console.log(`issue_%c[modelReducer] Player played a card-id: ${JSON.stringify(cardPlayed)}`, style);
    returnState.self.cards = returnState.self.cards.filter(card => card.idInternal !== idCardPlayed )
    return returnState
}



function getRelativePos(posAbsSelf, posAbsTgt){
    // idea is the following:
    // person to my left has either:
    // -  a position which is "+1"  in respect to my position (e.g. me:#2/left:#3)
    // -  or "-3" in respect to my position ( only for me:4/left:1)
    // to catch both cases the difference is added with 4 before applying mod4 to it
    // ==>  result 0 => self, 1=> left, => 2=> front; 3=> right
    if (typeof (posAbsTgt) === 'string' ){
        posAbsTgt = parseInt(posAbsTgt)
    }
    let posStrings = ['self','left','front','right']
    let idxPosRel = (posAbsTgt - posAbsSelf + 4) % 4 //0,1,2,3 with 0=me,1=left,2=front,3=right
    let posRel = posStrings[idxPosRel]
    return [idxPosRel, posRel]
}

function handleNewDealer(returnState, dealer){
    returnState.posDealerAbs = dealer.pos
    const [, posRel] = getRelativePos(returnState.players[0].posAbs ,dealer.pos)
    returnState.posDealerRel = posRel
    console.log(`[reducer-onHandleNewDealer]. new dealer:"${dealer.name}#${dealer.pos}"`);
    if (posRel === 'self'){console.log(`...It's you!!!`)}
    return returnState
}

function handleCardPlayedByOther(returnState, card){
    console.log(`[handleCardPlayedByOther]: "${card.playedBy}" played card: "${card.value}"`);
    let namePlayedBy = card.playedBy
    let statusOtherPlayers = returnState.statusOtherPlayers
    console.log(`namePlayedBy:${namePlayedBy}. statusOtherPlayers:${JSON.stringify(statusOtherPlayers)}`);

    let playerObjPosRel = statusOtherPlayers.find(p => p.name === namePlayedBy)
    playerObjPosRel.nrCards -= 1 
    let cardObjUpdate = { value: card.value, playedBy: namePlayedBy, posRel: playerObjPosRel.pos }
    console.log(`[handleCardPlayedByOther]xx: updating gameModelState with card obj: "${JSON.stringify(cardObjUpdate)}"`);
    Object.assign(card, cardObjUpdate)
    returnState.cardPlayedOther = card
    return returnState
}

function handleUpdateSelfData(returnState, data){
    console.log(`[handleUpdateSelfData]. data:${JSON.stringify(data)}`);
    // { "userName": "", "userColor": "", "userPosition": "1" }
    returnState.players[0].name = data.userName
    returnState.players[0].color = data.userColor
    returnState.players[0].posAbs = data.userPosition

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
    console.log(`[Reducer-handleUpdateCardsFromServer] received new cards: "${cards.join("-")}". Setting "self.updateHandCards = true" `);
    cards.forEach((cardValue,idx) => {
        // returnState.self.cards.push({ id: uuidv4(), value: cardValue})
        returnState.self.cards.push({ idExt: idx, idInternal: uuidv4(), value: cardValue})
    })

    returnState.self.updateHandCards = true
    // other players received the same number of cards.
    returnState.statusOtherPlayers.forEach(p => { p.nrCards = cards.length })
    return returnState
}

function handleUpdatePlayers(returnState, payload) {
    let self = returnState.players[0]
    console.log(`[Reducer- handleUpdatePlayers] Payload:`);
    console.table(payload)
    payload.msg.forEach(playerDataServer => {
        const [idxPosRel] = getRelativePos(self.posAbs, playerDataServer.pos)
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
        let status = playerDataServer.isReady ? 'is ready' : 'getting a beer. Will be ready soon.'
        let data = { name: playerDataServer.name, status: status, posAbs: playerDataServer.pos, posRel: idxPosRel + 1, color: playerDataServer.color}
        Object.assign(returnState.players[idxOtherPlayer], data)
    }) // end forEach
}