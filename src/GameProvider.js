import React from 'react'


function initPlayerSelf(){
    return { userName: "", userColor: "", userPosition: "" }
}

function initPlayersStatus() {
    return [{pos:'left',  posAbs:0, name: 'empty', status: undefined},
            { pos: 'front', posAbs: 0, name: 'empty', status: undefined},
            { pos: 'right', posAbs: 0, name: 'empty', status: undefined}]
}

function deepCloneOfList(listOrg){
    let newList =[]
    listOrg.forEach(obj => {
        newList.push(Object.assign({}, obj))
    })
    return newList
}

function reducerPlayers(state, action ){
    const {type, payload} = action
    let returnState = deepCloneOfList(state)
    if (type === 'updatePlayers'){
        console.log(`[Reducer-type-UpdatePlayers].Payload`);
        console.table(action.payload)
        let self = payload.playerData
        payload.msg.forEach( player => {
            //{name: 'Raelynn Cline', pos: '2', color: 'red', state: 'false', balls: Array(4)}
            let posRel = (parseInt(player.pos) + 4 - self.userPosition) % 4
            let idxState;
            if (posRel === 0) {
                return
            }
            switch (posRel){
                case 1: 
                    // e.g. me=2, playerPos=3 --(+4)-> posNew =7; diff = 5 --(%4)-> result in "1"
                    console.log(`This is your LEFT neighbour`) 
                    idxState = 0            
                    break
                case 2: 
                    // e.g. me=2, playerPos=4 --(+4)-> posNew =8; diff = 6 --(%4)-> result in "2"
                    console.log(`This is player sits in front of you `)
                    idxState = 1
                    break
                case 3: 
                    // e.g. me=2, playerPos=4 --(+4)-> posNew =8; diff = 6 --(%4)-> result in "2"
                    console.log(`This is your RIGHT neighbour`)
                    idxState = 2
                    break
                default:
                    throw new Error('[reducerPlayers]. something went wrong');
            }
            returnState[idxState].name = player.name
            returnState[idxState].status = player.state ? 'is ready' : 'getting a beer. Will be ready soon.'
            returnState[idxState].posAbs = player.pos
        }) // end forEach
        return returnState
    } else if (type === 'clearState'){
        return initPlayersStatus()
    }
}


const GameModelContext = React.createContext()
const GameProvider = (props) => {
    // const [gameStatus, setGameStatus] = -React.useState(initGameStatus())
    const [gameStatus, setGameStatus] = React.useState({ id: '123abc' })
    const [playersStatusOthers, setPlayerStatusOthers] = React.useState(initPlayersStatus())
    const [playerData, setPlayerData] = React.useState(initPlayerSelf())

    const [stateGameReduce, dispatcherTac] = React.useReducer(reducerPlayers, initPlayersStatus() );
    

    return (
        <GameModelContext.Provider value={{ gameStatus, setGameStatus, playersStatusOthers, setPlayerStatusOthers, stateGameReduce, dispatcherTac, playerData, setPlayerData }}>
            {props.children}
        </GameModelContext.Provider>
    )
}

export { GameProvider, GameModelContext }

