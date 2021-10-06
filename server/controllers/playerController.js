let {playerList, Player } = require('../models/playerModel')
let {games, GameTac} = require('../models/gameModel')
const gameController =require('./gameController')

let io;

exports.setSocketConnection = (ioFromServerJs) => {
    io = ioFromServerJs
}

exports.handlePlayingCard = (cardPlaying, socket) => {
    let pre = '[PlyCtrl-hndlPlyingCard]'
    let playerId = socket.request.session.playerId
    let ply = Player.findById(playerId)
    let gameId = socket.request.session.gameId
    let game = GameTac.findById(gameId)
    let cardPlayedModd = { playedBy: ply.name, value: cardPlaying.value }
    // 1.output for debug
    console.log(`${pre} %c${ply.name} is playing ${JSON.stringify(cardPlaying)}`,'color:pink');
    // 2.update player instance
    ply.cards = ply.cards.filter(card => card.id !== cardPlaying.id)
    // 3.update game instance
    game.cardsTrash.push(cardPlayedModd)
    // 4.inform other players about the played card
    // io.to(game.id).emit('serverPlayedCard', cardPlayedModd)
    ply.socket.to(game.id).emit('serverPlayedCard', cardPlayedModd)

    // 5.check if all cards have been played
    let sumHandCards = game.players.reduce((old, ply) => { return old + ply.cards.length }, 0)
    console.log(`${sumHandCards} left to play...`);
    if(sumHandCards === 0){
        console.log(`Each player has played his/her hand cards.`)
        game.calcAndInformDealer(io)
        // inform all players about who is the new dealer
    }
}

exports.handleReadyToPlay = (callback, socket) => {
    let pre = '[PlyCtrl-hReady2Play]'
    let playerId = socket.request.session.playerId
    let ply  = Player.findById(playerId)
    if(ply === undefined){
        console.log(`%cCouldn't find player with id: ${playerId}`,'color:red');
        return
    }
    let gameId = socket.request.session.gameId
    let game = GameTac.findById(gameId)
    ply.setReady()
    callback("ok")
    console.log(`${pre} "${ply.name} is ready."`);
    game.sendPlayerStatus(io)
    // gameReady to start ?
    if (game){
        // game.sendPlayerStatus(io)
        game.startGame(io)
        .then((resp )=>{ 
            console.log(`${pre}: ${resp.msg}`);
            io.to(game.id).emit('info', resp.msg);  
        })
        .catch((resp )=>{
            console.log(`${pre}: ${resp}`);
        })
    } else {
        console.log(`Could not find game with id #${gameId}`);
    }
}
    
exports.setSocket = (idPlayer, socket) =>{
    let ply = Player.findById(idPlayer)
    ply.socket = socket
    console.log(`${ply.name} is joining socket-room ${ply.gameId} `);
    ply.socket.join(ply.gameId)
    gameController.sendPlayerStatus(ply.gameId)
}