const LENGTH_GAME_IDENTIFYER = 6
const crypto = require("crypto")
const Cards = require('./cardsModel')
// const { v4: uuidv4 } = require('uuid');

let games = []


class GameTac {
    
    constructor() {
        this.players = []
        this.state = 'INIT' // INIT -> WAIT FOR OTHER PLAYERS -> WAIT FOR READY -> PLAYING -> FINISHED
        this.id = crypto.randomBytes(LENGTH_GAME_IDENTIFYER / 2).toString('hex');
        this.cards = new Cards()
        games.push(this)
        console.log(`Games on server:`);
        games.forEach(g => console.log(`\t - ${g.id}: ${g.players.length} players`))
        }


    addPlayer(player) {
        this.players.push(player)
        this.state = (this.players.length < 4) ?
             'WAIT_FOR_OTHER_PLAYERS'
            : 'WAIT_FOR_READY'
    }

    startGame(){
        return new Promise( (resolve, reject)=>{
            if (this.players.length < 4){
                reject(`Cannot start game. Only ${this.players.length}/4 players at the table`)
            } else{
                this.state = 'WAIT_FOR_READY'
                let plyrsNotReady = this.players.filter(p => p.isReady === false)
                if (plyrsNotReady.length > 0){
                    reject(`Cannot start game. ${this.players.length} are not ready yet.`)
                } else {
                    this.state = 'PLAYING'
                    resolve('Start game')
                }                
            }
         })
    }

    getStatusAllPlayers(){
        return this.players.map(p => {
            return p.getStatus()
        })
    }

    sendPlayerStatus(io){
        console.log(`[gameModel.sendPlayerStatus()]`);
        let message = this.getStatusAllPlayers()
        console.log(`{io.in(${this.id}).emit("playerStatus")} => Sending: `)
        message.forEach(m => console.log(`\t - ${JSON.stringify(m)}`))
        let fb = io.to(this.id).emit('playerStatus', { message });
        console.log(`....retun value: ${fb}`);
        console.log(`........sended(from gameController)`);
    }

    static findById(idGame) {
        return games.find(g => g.id === idGame)
    }
}


module.exports = { GameTac, games}