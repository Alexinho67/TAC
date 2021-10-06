import React from 'react'
import Game from './Game'
// import App from './AppTest'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
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
        {/* <h1>+++ TAC +++</h1> */}
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
        <div style={{
            backgroundColor:'#002',
            color:'white',
            cursor: 'pointer',
            borderRadius:'50px', 
            width:'100px',
            textAlign:'center'}}
                    onDoubleClickCapture={handleButtonDblClick}
                >
                    <div onClick={handleButtonClick} >
                Hello World
            </div>
        </div>
        </Router>
        </>
    )
}


function triggerSingleClick() {
    console.log(`\t Single MouseClick`);
}
function triggerDoubleClick() {
    console.log(`\t Double MouseClick`);
}


let tof = undefined;

function handleButtonClick(e) {
    if (e.detail === 2) {
        return
    }
    tof = setTimeout(() => triggerSingleClick(), 200)
    // console.log(`created tof=${tof}`);
}

function handleButtonDblClick(e) {
    if (tof) {
        // console.log(`clearing tof=${tof}`);
        clearTimeout(tof)
        triggerDoubleClick()
    }
}
export default Root




