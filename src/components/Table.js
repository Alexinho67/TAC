import React from 'react'
import Board from './Board'
import { GameModelContext } from '../GameProvider';
import StatusOtherPlayer from './subComponents/StatusOtherPlayer';

const Table = () => {
    const { stateGameReduce} = React.useContext(GameModelContext)
    const [isReady, setIsReady] = React.useState(false)
    const [gameStarted, setGameStarted] = React.useState(false)

    return (<>
        <div id="table">
            <div id="boardWrapper" >
                <div id="board"  >
                    <StatusOtherPlayer stateGameReduce={stateGameReduce.statusOtherPlayers} />
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
