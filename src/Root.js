import React from 'react'
import Game from './Game'
// import App from './AppTest'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'
import LoginPage from './LoginPage'
import SocketProvider from './components/socketComps/SocketProvider'
import {GameProvider} from './GameProvider'
import ReducerTest from './ReducerTest'
import NavBar from './components/NavBar'


async function fetchGetCookie(url) {
    let data = await fetch(url).then(resp => { return resp.json() })
        .then(resp => {
            // callbackUpdate(resp?.msg)
            return resp
        })
    console.log(`Received from "${url}"=> ${JSON.stringify(data)}`); 
}

export const UserDataContext = React.createContext()

const Root = () => {
    

    React.useEffect(() => {
        fetchGetCookie('/api/initSession')
        
    }, [])

    return (
        <>       
        <Router>
        <GameProvider>    
        <NavBar/>
        <h1>+++ TAC +++</h1>
            <Switch>
            < Route path='/test'>
                <ReducerTest />
            </Route>
            < Route path='/' exact> 
                <LoginPage />
            </Route>
            < Route path='/game/:gameId' >
                {/* <GameProvider> */}
                    <SocketProvider>
                        <Game />
                    </SocketProvider>
                {/* </GameProvider> */}
            </Route> 
            </Switch>
            </GameProvider>
        </Router>
        </>
    )
}

export default Root




