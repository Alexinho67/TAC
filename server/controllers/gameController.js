let {games, GameTac} = require('../models/gameModel')
const {Player} = require('../models/playerModel') 

let io;

exports.setSocketConnection = (ioFromServerJs) => {
    io = ioFromServerJs
}

exports.sendPlayerStatus = (idGame) =>{
    let game = GameTac.findById(idGame)
    console.log(`Sockets in room:"${idGame}": ${Array.from(io.sockets.adapter.rooms.get(idGame))}`);
    console.log(`[gameController.sendPlayerStatus()]`);
    game.sendPlayerStatus(io)

}

exports.createNewGame = (req, res, next) => {
    console.log(`req.body:${req.body}`);
    console.table(req.body);
    let gameNew = new GameTac()
    let url = `/game/${gameNew.id}`
    console.log(`newGame requested. Redirecting to "${url}"`);
    
    req.session.gameId = gameNew.id
    req.session.save(( )=>{ 
        next()
    })
}

exports.handleDealRequest = (socket, callback ) => {
    let game = GameTac.findById(socket.request.session.gameId)
    game.dealCards()
    game.players.forEach(p => {
        let stringCards = p.cards.map(c => JSON.stringify(c.value)).join("-")
        console.log(`sending: io.to(${p.socket.id}).emit('newCards', {cards: ${stringCards}}))`);
        let msgData = {
            cards: p.cards,
            numCardsShuffledRemain: game.deck.cards.length
            }
        io.to(p.socket.id).emit('newCards', msgData)
    })
    callback('ok')
    
}

exports.reset = (req, res) => {
    while (games.length) {
        games.pop();
    }
    console.log(`Resetting game state`);
    res.status(200).end()
}

exports.displayAllGames = (req, res) => {
    res.render('GameStatus', {games: games})
}


exports.displaySingleGame = (req, res) => {
    // res.render('GameStatus', { games: games })
    let idGame = req.params.idgame
    let game = games.find(game => game.id === idGame)
    let stringOut = ''

    game.players.forEach(p => stringOut += p.toString())
    // res.send(stringOut)
    res.render('SingleGame', {game})
}   

exports.addPlayer = async (req, res) =>{
    console.log(`[GameCtlr-AddPlayer]`);
    let { userName, userColor, userPosition } = req.body
    
    let gameIdJoining
    if (req.url.includes('joinGame')) {
        let { gameId} = req.body
        gameIdJoining = gameId
        
    } else {
        gameIdJoining = req.session.gameId
    }

    /* if clients session data   
    
    */
    let game = GameTac.findById(gameIdJoining)  

    if (game.players.some(p => p.id === req.session.playerId)){
        console.log(`[GameCtlr - addPlayer]. Client is already player at game "${game.id}" `);
        let plyObjKnown = game.players.find(p => p.id === req.session.playerId)
        console.log(`[GameCtlr - addPlayer]. plyObjKnown "${plyObjKnown.toString()}" `);
        res.json({ room: game.id, msg: `Re-joining room with id ${game.id}.` })
        return
    }

    let player = new Player(userName, userColor, parseInt(userPosition), gameIdJoining)
    if (game === undefined) {
        res.status(404)
        res.json({ room: null, msg: `Room with id ${gameIdJoining} not found` })
        return
    }
    try{
        let resp = await game.addPlayer(player)
        console.log(`Adding player ${player.toString()} --> ${resp}`);
        req.session.playerName = player.name;
        req.session.playerPos = player.position;
        req.session.playerColor = player.color;
        req.session.playerId = player.id;
        req.session.gameId = gameIdJoining;
        req.session.save(() => {
            res.json({ room: game.id, msg: `Joining room with id ${game.id}.` })
        })
    } catch (err){
        console.log(`Error: ${err}`);
        res.status(404)
        res.json({ room: null, msg: err })
        return
    }
}