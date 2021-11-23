class Ball {
    constructor(id, color, numPlayer) {
        this.id = id
        this.color = color
        
        /* numPlayer:
            player 1 -> pos = [71, 72, 73, 74 ]
            player 2 -> pos = [81, 82, 83, 84]
            ...
            or: posBall = id + 1 + 60 + numPlayer * 10 
        */
        this.position = id + 60  // "-1" = home

    }
}


module.exports = Ball