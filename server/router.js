const express = require('express')
const gameController = require('./controllers/gameController')
const router = express.Router()
const { PORT } = require('./CONSTANTS')

router.get('/initSession', (req, res) => {
    // console.log(`GET /initSession`);
    // res.send('hello')
    res.json({ msg: `hello from MAIN SERVER (PORT:${PORT})` })
})

router.get('/admin', gameController.displayAllGames)
router.get('/resetState', gameController.reset)

router.post('/newGame',  gameController.createNewGame, gameController.addPlayer )
router.post('/joinGame', gameController.addPlayer)

module.exports = router