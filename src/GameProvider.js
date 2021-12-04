import React from 'react'
import { reducerFcnGameModel, initGameModel } from './modelReducer';


const GameModelContext = React.createContext()
const GameProvider = (props) => {

    const [stateGameReduce, dispatcherTac] = React.useReducer(reducerFcnGameModel, initGameModel() );
    const dataProvided = { stateGameReduce, dispatcherTac}


    // React.useEffect(() => {
    //     let urlServerPrefix = process.env.NODE_ENV === 'production' ? '' : '/api'

    //     fetchGetCookie(urlServerPrefix + '/initSession')
    //     // axiosGetCookie('/api/initSession', setSessionData)

    // }, [])


    /* ================================================================================
    --------------------------     Fuctions      -----------------------------------------
    * ================================================================================ */

    async function fetchGetCookie(url) {
        let data = await fetch(url, {
            method: "GET"
        })
            .then(resp => {
                return resp.json()
            })
            .then(resp => {
                // callbackUpdate(resp?.msg)
                console.log(``);
                return resp
            })
        console.log(`Received from "${url}"=> ${JSON.stringify(data)}`);
        if ('name' in data) {
            dispatcherTac({ type: 'setUserName', payload: data.name })
        }
    }

    return (
        <GameModelContext.Provider value={dataProvided}>
            {props.children}
        </GameModelContext.Provider>
    )
}

export { GameProvider, GameModelContext }

