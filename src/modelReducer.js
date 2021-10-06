import { v4 as uuidv4 } from 'uuid';
const clonedeep = require('lodash.clonedeep')

class GameObj{
    constructor(){
        this.started = false;
        this.posDealerAbs = 0; // 1,2,3,4
        this.posDealerRel = undefined;  // self,left,front,right 
        this.self = initPlayerSelf();
        this.numShuffledCards = 0
        this.statusOtherPlayers = initPlayersStatus();
        this.cardPlayedOther = undefined
    }
}


function initPlayerSelf() {
    return { userName: undefined, 
        userColor: undefined, 
        userPosition: undefined, 
        cards: [], 
        updateHandCards: false }
}

function initPlayersStatus() {
    return [{ pos: 'left', posAbs: 0, name: 'empty', status: undefined, nrCards:0 },
        { pos: 'front', posAbs: 0, name: 'empty', status: undefined, nrCards: 0 },
        { pos: 'right', posAbs: 0, name: 'empty', status: undefined, nrCards: 0 }]
}

export function initGameModel() {
    // let statusOtherPlayers= initPlayersStatus()
    let newGame = new GameObj()
    return newGame
}

export function reducerFcnGameModel(state, action) {
    const { type } = action
    let returnState = clonedeep(state)
    if (type === 'updatePlayers') {
        handleUpdatePlayers(returnState, action.payload)
        return returnState
    } else if (type === 'clearState') {
        return initGameModel()
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
    } else if (type === 'removeHandCard') {
        return handleRemoveSingleHandCard(returnState, action.payload)
    }else if (type === 'cardPlayedByOther') {
        return handleCardPlayedByOther(returnState, action.payload)
    } else if (type === 'resetCardPlayedByOther') {
        returnState.cardPlayedOther = undefined
        return returnState
    } else if (type === 'newDealer') {
        
        return handleNewDealer(returnState, action.payload)
    } 
    else{
        throw new Error(`DISPATCHER: TYPE "${type}" is not supported!`)
    }    
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
    let idxPosRel = (posAbsTgt - posAbsSelf + 4) % 4 
    let posRel = posStrings[idxPosRel]
    return [idxPosRel, posRel]
}

function handleNewDealer(returnState, dealer){
    returnState.posDealerAbs = dealer.pos
    const [, posRel] = getRelativePos(returnState.self.userPosition ,dealer.pos)
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
    Object.assign(returnState.self, data)
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
    let self = returnState.self
    console.log(`[Reducer-handleUpdatePlayers] Self:${JSON.stringify(self)}Payload:`);
    console.table(payload)
    payload.msg.forEach(player => {
        const [idxPosRel, ] = getRelativePos(self.userPosition, player.pos)
        //{name: 'Raelynn Cline', pos: '2', color: 'red', state: 'false', balls: Array(4)}
        if (idxPosRel === 0) {
            return
        }
        console.log(`idxPosRel=`, idxPosRel);
        let idxOtherPlayer = idxPosRel - 1 
        returnState.statusOtherPlayers[idxOtherPlayer].name = player.name
        returnState.statusOtherPlayers[idxOtherPlayer].status = player.state ? 'is ready' : 'getting a beer. Will be ready soon.'
        returnState.statusOtherPlayers[idxOtherPlayer].posAbs = player.pos
    }) // end forEach

}