
const { v4: uuidv4 } = require('uuid');
const Ball = require('./ballModel')

let playerList = []

class Player {
    constructor(name, color, numPlayer, gameId = undefined) {
        this.id = uuidv4()
        this.cards = []
        this.gameId = gameId
        this.name = name
        this.color = color
        this.isReady = false
        this.cardSwapGive = undefined
        this.cardSwapRecvd = undefined
        this.position = numPlayer // 1..4
        this.socket = undefined
        this.balls =
            [new Ball(numPlayer*10 + 1, color, numPlayer),
            new Ball(numPlayer *10 + 2, color, numPlayer),
            new Ball(numPlayer *10 + 3, color, numPlayer),
            new Ball(numPlayer *10 + 4, color, numPlayer)]
        

        console.log(`New player created: ${this.toString()}`);
        console.log(`   balls: ${JSON.stringify(this.balls)}`);
        playerList.push(this)
    }

    setReady(){
        this.isReady = true
        console.log(`Player ${this.name} is ready.`);
    }

    getStatus(){
        return {name: this.name, 
                pos: this.position, 
                color: this.color, 
                isReady: this.isReady,
                balls: this.getBallStatus()
            }
    }

    getBallStatus(){
        return this.balls.map(b => {
            return {id: b.id, pos:b.position}
        })
    }

    toString(short = false){
        if (short){
            return `${this.name}#${this.position}`
        } else{
            return `${this.name}- #${this.position} - ${this.color}`
        }
    }

    static findById(idPlayer){
        return playerList.find(p => p.id === idPlayer)
    }
}

module.exports = {Player, playerList}