const express = require('express')
const gameController = require('./controllers/gameController')
const router = express.Router()

function getSessionData(req){
    console.log(`sessionData:${JSON.stringify(req.session)}`);
    let userNameSession = req.session?.playerName
    // printFieldsOfSession(socket.request.session)
    if (userNameSession) { // --> has already user session data
        console.log(`\nKNOWN User is  . ================================`.green)
        console.log(`\t\t His/her name is: "${userNameSession}"`);
        return {name: userNameSession,
                color: req.session.playerColor,
                posAbs: req.session.playerPos,
                gameId: req.session.gameId }
    } else { // user is unknown
        console.log(`\nUNKNOWN user ======================================`.red);
    }
}


router.get('/game/:idgame', (req, res)=>{
    res.redirect('/')
} )

router.get('/initSession', (req, res) => {
    // console.log(`GET /initSession`);
    // res.send('hello')
    let data = getSessionData(req)
    res.json({ msg: `hello from MAIN SERVER `, ...data })
})

router.get('/admin/:idgame', gameController.displaySingleGame )

router.get('/admin', gameController.displayAllGames)
router.get('/resetState', gameController.reset)

router.post('/newGame',  gameController.createNewGame, gameController.addPlayer )
router.post('/joinGame', gameController.addPlayer)

module.exports = router