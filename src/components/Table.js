import React from 'react'
import Board from './Board'
import { UserDataContext } from '../Root'
import { GameModelContext } from '../GameProvider';
import StatusOtherPlayer from './subComponents/StatusOtherPlayer';
// import Cards from './Cards'

const Table = () => {
    const userData = React.useContext(UserDataContext)
    const gameStatus = React.useContext(GameModelContext)
    

    const [isReady, setIsReady] = React.useState(false)
    const [gameStarted, setGameStarted] = React.useState(false)
    const [playersStatus, setPlayersStatus] = React.useState({})



    function handleDispatch(variable){
        // console.trace(`clicked`);
        gameStatus.dispatcherTac({ type: 'increment', payload: variable})
    }

    function handleIncrement(state){
        // gameStatus.dispatcherTac({type:'increment', payload: variable})
        console.log(`[Table.js] clicked button. Calling dispatcherTac`);
        gameStatus.dispatcherTac({type:'increment', payload:{ref: state[0],  inc:1}})
    }

    return (<>
        <div id="table">
            <span style={{color:'white', fontWeight:'bold'}}>GAME state: {gameStatus?.gameStatus?.state}</span>
            <div id="boardWrapper" >
                <div id="board"  >
                    <Board {...{ isReady, setIsReady, gameStarted, setGameStarted }}/>
                    <StatusOtherPlayer stateGameReduce={gameStatus.stateGameReduce} />
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
