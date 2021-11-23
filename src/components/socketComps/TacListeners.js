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
}

function handleBallMovedByOther(model, ballMoved) {
    console.log(`[handleBallMovedByOther]: "${ballMoved.namePlayedBy} moved ball to posGlobal: ${ballMoved.pos}"`);
    model.dispatcherTac({ type: 'ballMovedByOther', payload: ballMoved })
}

function handleCardPlayed(model, card){
    console.log(`[onServerPlayedCard]: "${card.playedBy} played card: ${card.value}"`);
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