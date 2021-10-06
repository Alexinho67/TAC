import React from 'react'
import { reducerFcnGameModel, initGameModel } from './modelReducer';


const GameModelContext = React.createContext()
const GameProvider = (props) => {

    const [stateGameReduce, dispatcherTac] = React.useReducer(reducerFcnGameModel, initGameModel() );
    const dataProvided = { stateGameReduce, dispatcherTac}

    return (
        <GameModelContext.Provider value={dataProvided}>
            {props.children}
        </GameModelContext.Provider>
    )
}

export { GameProvider, GameModelContext }

