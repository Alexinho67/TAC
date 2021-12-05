import React from 'react'
import Board from './Board'
import { GameModelContext } from '../GameProvider';
import StatusOtherPlayer from './subComponents/StatusOtherPlayer';

const Table = () => {
    const { stateGameReduce} = React.useContext(GameModelContext)
    // if self state equals "ready" (because of a reload for example) --> init ReactState "isReady" with true
    const [isReady, setIsReady] = React.useState(false)
    const [gameStarted, setGameStarted] = React.useState(false)

    const pathBoard = require(`../pics/TACboard.jpg`).default

    React.useEffect(() => {
        if (!isReady && stateGameReduce.players[0].state === 'ready'){
            setIsReady(true)
        }
    }, [stateGameReduce.players[0].state] )

    return (<>
        <div id="table">
            <div id="boardWrapper" >
                <div id="board" >
                    <img className={stateGameReduce.players[0].posAbs % 2 === 0 ? "rotate_board" : ""} height='100%' width='100%' src={pathBoard  } alt={'Text'} />
                    <StatusOtherPlayer stateGameReduce={stateGameReduce.players.slice(1,4)} />
                    <Board {...{ isReady, setIsReady, gameStarted, setGameStarted }}/>
                </div>      
            </div>
        </div>
        {/* <div style={{marginLeft:'3rem'}}>
            <span> GameVariables:<br />{gameStatus.stateGameReduce.map(x => (<li>{JSON.stringify(x)}</li>))}  </span>
        </div> */}
        </>
    )
}

export default Table
