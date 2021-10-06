
const { v4: uuidv4 } = require('uuid');
const Ball = require('./ballModel')

let playerList = []

class Player {
    constructor(name, color, position, gameId = undefined) {
        this.id = uuidv4()
        this.cards = []
        this.gameId = gameId
        this.name = name
        this.color = color
        this.isReady = false
        this.position = position
        this.socket = undefined
        this.balls =
            [new Ball(0, color),
            new Ball(1, color),
            new Ball(2, color),
            new Ball(3, color)]
        
        console.log(`New player created: ${this.toString()}`);
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
                state: this.isReady,
                // balls: this.getBallStatus()
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