import React from 'react'
import Game from './components/Game'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import LoginPage from './components/loginPageComps/LoginPage'
import SocketProvider from './providers/SocketProvider'
import { GameProvider} from './providers/GameProvider'
import NavBar from './components/NavBar'
import axios from "axios"
import DebugNew from './components/debugComps/DebugNew'


async function axiosGetCookie(url, setSessionData) {
    let data = await axios.get(url)
        .then(resp => {
            return resp.json()
        })
        .then(resp => {
            // callbackUpdate(resp?.msg)
            console.log(``);
            return resp
        })
    console.log(`Received from "${url}"=> ${JSON.stringify(data)}`);
  
    setSessionData()
}

export const UserSessionDataContext = React.createContext()

const Root = () => {
    const [sessionData, setSessionData] = React.useState()
    // const { stateGameReduce, dispatcherTac } = React.useContext(GameModelContext)


    React.useEffect(() => {
        let urlServerPrefix = process.env.NODE_ENV === 'production' ? '' : '/api'
        console.log(`[ROOT-fetchCookie] Starting`);
        fetchGetCookie(urlServerPrefix + '/initSession', setSessionData)
        // axiosGetCookie('/api/initSession', setSessionData)
        
    }, [])


    // /* ================================================================================
    // --------------------------     Fuctions      -----------------------------------------
    // * ================================================================================ */

    async function fetchGetCookie(url, setSessionData) {
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
            setSessionData({
                name: data.name,
                color: data.color,
                posAbs: data.posAbs,
                gameId:data.gameId
            })
            // dispatcherTac({type:'setUserName', payload: data.name})
        }
    }


        /* ================================================================================
        --------------------------     RENDER      -----------------------------------------
        * ================================================================================ */


    return (
        <>       
            <UserSessionDataContext.Provider value={sessionData} >
            <Router>
            <GameProvider>    
                {/* <p>REACT_APP_CLIENT_ID:{process.env.REACT_APP_CLIENT_ID}</p>
                <p>NODE_ENV:{process.env.NODE_ENV}</p> */}
                <NavBar/>
                {/* <h1>+++ TAC +++</h1> */}
                <Switch>
                < Route path='/' exact> 
                    <LoginPage />
                </Route>
                < Route path='/game/:gameId' >
                        <SocketProvider>
                            <Game />
                        </SocketProvider>
                </Route> 
                </Switch>
                <DebugNew />
            </GameProvider>
            </Router>
        </UserSessionDataContext.Provider>
        </>
    )
}
export default Root




