
import { useHistory } from "react-router-dom";


export function addListenersForTac(socket, model) {

    // socket.on('playerStatus',(data )=>{
        //     console.log(`onPlayerStatus: data: ${JSON.stringify(data)} `);
        //     console.dir(data.message);
        //     // model.setGameStatus(obj => { return { ...obj, state: 'started' } })
        //     model.dispatcherTac({ type: 'updatePlayers', payload: { msg: data.message, playerData: model.playerData } })
        // })
        // socket.on('playerStatus',(data )=>{console.log(`PLAYERSTATUS received`) })
    socket.on('playerStatus',(data)=>{ handlePlayerStatus(model, data) })
    socket.on('info',(info)=>{ handleInfo(info) })
    socket.on('newCards', (data) => handleNewCards(model, data) )
    socket.on('gameStart', () => handleGameStart(model) )
    socket.on('serverPlayedCard', (card)=>{handleCardPlayed(model, card)})
    socket.on('newDealer', (dealer) => { handleNewDealer(model, dealer)})
    socket.on('serverMovedBallByOther', (ballMoved) => { handleBallMovedByOther(model, ballMoved)})
    socket.on('playerSelectedCardForSwap', (playerData) => { handlePlayerSlctdCard4Swap(model, playerData)})
    socket.on('serverCardSwapRecvd', (cardSwapRecvd) => { handleNewCardFromSwap(model, cardSwapRecvd)})
    socket.on('redirectToHome', () => { handleRedirectToHome()})
    socket.on('userInfoAfterReload', (updateData) => { handleUserInfoAfterReload(model, updateData)})
}

function handleUserInfoAfterReload(model, updateData){
    console.log(`[TacListener - handleUserInfoAfterReload].updateData:${JSON.stringify(updateData)}.`);
    model.dispatcherTac({ type: 'userInfoAfterReload', payload: updateData })
}

function handleRedirectToHome(){
    console.log(`[TacListener - handleRedirectToHome]`);
    window.location.href = '/';
}

function handleNewCardFromSwap(model, cardSwapRecvd){
    console.log(`[TacListener - handleNewCardFromSwap]: Received new card from card swap => ${JSON.stringify(cardSwapRecvd)}`);
    model.dispatcherTac({ type: 'cardFromSwapReceived', payload: cardSwapRecvd})
}

function handlePlayerSlctdCard4Swap(model, playerData) {
    console.log(`[handlePlayerSlctdCard4Swap]: Player #${playerData.posAbsPlayer} did select a card for swapping`);
    model.dispatcherTac({ type: 'cardForSwapSelectedOtherPlayer', payload: playerData.posAbsPlayer })
}

function handleBallMovedByOther(model, ballMoved) {
    console.log(`[handleBallMovedByOther]: "${ballMoved.namePlayedBy} moved ball to posGlobal: ${ballMoved.pos}"`);
    model.dispatcherTac({ type: 'ballMovedByOther', payload: ballMoved })
}

function handleCardPlayed(model, card){
    console.log(`[onServerPlayedCard]: "${card.playedBy}#${card.playedByPosAbs} played card: ${card.value}"`);
    model.dispatcherTac({ type: 'cardPlayedByOther', payload: card })
}

function handleGameStart(model){
    console.log(`ongameStart: ...`);
    model.dispatcherTac({ type: 'gameStart'})
}

function handlePlayerStatus(model, data){
        console.log(`onPlayerStatus: data: ${JSON.stringify(data)} `);
        console.dir(data.message);
        // model.setGameStatus(obj => { return { ...obj, state: 'started' } })
        model.dispatcherTac({ type: 'updatePlayers', payload: { msg: data.message, playerData: model.playerData } })
    }


function handleInfo(info) {
    console.log(`onInfo: Info: ${JSON.stringify(info)} `);
    // alert('GAME STARTS!')
}

function handleNewCards(model, data){
    // console.log(`%c onNewCards: received data: ${JSON.stringify(data)}`,'color:red');
    console.log(`onNewCards: received new cards: ${data.cards}. Cards in stack: ${data.numCardsShuffledRemain}`);
    model.dispatcherTac({ type: 'updateCardsFromServer', payload: data.cards})
    model.dispatcherTac({ type: 'updateNumCardsShuffled', payload: data.numCardsShuffledRemain})
}

function handleNewDealer(model, dealer){
    console.log(`%c[onHandleNewDealer]: New dealer is "${dealer.name}#${dealer.pos}"`,'color:pink');
    model.dispatcherTac({type: 'newDealer', payload: dealer})
}