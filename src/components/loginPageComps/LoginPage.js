import React from 'react'
import { nameList } from '../utilities/nameList'
import {ErrorList, addError} from '../subComponents/ErrorList'
import { useHistory } from "react-router-dom";
import { GameModelContext } from '../../providers/GameProvider';
import { UserSessionDataContext } from '../../Root';

let urlServerPrefix
if (process.env.NODE_ENV === 'development') {
    urlServerPrefix = '/api' 
} else {
    urlServerPrefix = ''
}


function getInitName(userSessionData){
    console.log(`[LoginPage - getInitName(plyObj)] plyObj:${JSON.stringify(userSessionData)}`);
    if (userSessionData){
        return userSessionData.name
    }else if(process.env.NODE_ENV==='development'){
        return nameList[Math.floor(Math.random() * nameList.length)]
    }else {
        return undefined
    }
}

const LoginPage = () => {
    const { dispatcherTac } = React.useContext(GameModelContext)
    const userSessionData = React.useContext(UserSessionDataContext)
    let history = useHistory();
    const [userName, setUserName] = React.useState((userSessionData) => { return getInitName(userSessionData)})
    const [userColor, setUserColor] = React.useState("red")
    const [userPosition, setUserPosition] = React.useState(1)
    const [gameId, setGameId] = React.useState("")
    const [errorList, setErrorList] = React.useState([])

    const idGameRef = React.useRef()

    /* ================================================================================
    --------------------------     HOOKS      -----------------------------------------
    * ================================================================================ */

    React.useEffect(() => {
        console.log(`%c[LoginPage.js - INIT]`,'color:#fa0');
        if (process.env.NODE_ENV === 'development'){
            window.addEventListener("keydown", keyDownHandler);
        }
        return () => {
            window.removeEventListener("keydown",keyDownHandler);
        }
    }, [])

    React.useEffect(() => {
        console.log(`%c[LoginPage.js - useEffect@userSessionData]`, 'color:#fa0');
        if (userSessionData?.name){
            setUserName(userSessionData.name)
        }
        if (userSessionData?.color){
            setUserColor(userSessionData.color)
        }
        if (userSessionData?.posAbs){
            setUserPosition(userSessionData.posAbs)
        }       
        if (userSessionData?.gameId){
            setGameId(userSessionData.gameId)
        }
    }, [userSessionData])

    React.useEffect(() => {
        /* DO NOT DELETE. Sending a single GET request to the server
           will lead to receiving a cookie-id
           without it the proxy middleware is not capable of establishing
           a webSocket connection ( don't know why ...)
        */

        // let urlFetchCookie = urlServerPrefix + '/initSession'
        // fetchGetCookie(urlFetchCookie, setFetchData, setCookieReceived)
    }, [])



    /* ================================================================================
    --------------------------     Fuctions      -----------------------------------------
    * ================================================================================ */

    function keyDownHandler(e) {
        // console.log(`ctrl: ${e.ctrlKey} - key: ${e.key}`)
        let ignoreCtrlKey = true
        // console.log(`e.target.id:${e.target.id } `);
        if (e.target.id === "userName"){return}
        if (ignoreCtrlKey || e.ctrlKey) {
            if (e.key === '1') {
                // console.log('Selected player #1')
                setUserPosition(1)
                setUserColor("red")
                setUserName('Alex')
            } else if (e.key === '2') {
                // console.log('Selected player #2')
                setUserPosition(2)
                setUserColor("yellow")
                setUserName('Bea')
            } else if (e.key === '3') {
                // console.log('Selected player #3')
                setUserPosition(3)
                setUserColor("green")
                setUserName('Clemens')
            }
            else if (e.key === '4') {
                // console.log('Selected player #4')
                setUserPosition(4)
                setUserColor("blue")
                setUserName('Dani')
            }
        }
        
        setTimeout(()=>{
            idGameRef?.current?.focus()
        }, 10)
    }

    async function handleJoinGame() {
        let data = { userName, userColor, userPosition, gameId }
        dispatcherTac({type: 'setGameID', payload: gameId})
        
        console.log(`%c[LoginPage - handleJoinGame] data: ${JSON.stringify(data)}`,'color:red');

        
        // model.setPlayerData(dataReactState)
        fetch(urlServerPrefix + '/joinGame',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(resp => {
                let status = resp.status
                return Promise.all([status, resp.json()])
            })
            .then(([status, resp] )=> {
                console.log(`${status}: Received resp: ${JSON.stringify(resp)}`);
                if (status === 404){
                    throw resp.msg
                } else {
                    let dataReactState = {
                        userName: data.userName,
                        userColor: data.userColor,
                        userPosition: data.userPosition
                    }
                    dispatcherTac({ type: 'updateSelfData', payload: dataReactState })
                    let gameId = resp.room
                    let newUrl = `/game/${gameId}`
                    document.title = `TAC #${gameId}`
                    console.log(`going to : ${newUrl}`);
                    // got to new url
                    history.push(newUrl)
                    // window.location.href = newUrl
                }
            })
            .catch(err => {
                console.log(`ERROR! "${err}"`);
                addError(err, setErrorList)
            }) 
    }

    function handleCreateGame() {
        let data = { userName, userColor, userPosition}
        console.log(`%cFetching from server. Data:${JSON.stringify(data)}`,'color:red');
        // send a get request to the server to create a new game of TAC
        dispatcherTac({ type: 'updateSelfData', payload: data })
        // model.setPlayerData(data)
        fetch(urlServerPrefix + '/newGame',
            {method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
            })
            .then(resp => resp.json()).then(resp => {
                console.log(`resp: ${JSON.stringify(resp)}`);
                let gameId = resp["room"]
                let newUrl = `/game/${gameId}`
                console.log(`going to room : "${gameId}""`);
                history.push(newUrl)
                navigator.clipboard.writeText(gameId)
                document.title = `TAC #${gameId}`
                dispatcherTac({ type: 'setGameID', payload: gameId })
                // window.location.href = newUrl
            }) 
            .catch(err =>{
                console.log(`${err}`);
            })
        // console.log(`new gameId: ${gameId}`);
    }


    /* ================================================================================
    --------------------------     RENDER      -----------------------------------------
    * ================================================================================ */


    return (
        <div className="container"  >    
            <div id="table">
                {errorList.length > 0 ? <ErrorList errors={errorList} setErrorList={setErrorList}/> : "" }
                <form  id="loginForm" onSubmit={(e) => { e.preventDefault() }}>
                    <h3>LOGIN </h3>
                    <label htmlFor="userName"> Name player: </label> 
                    <input id="userName" type="text" value={userName} 
                        onChange={(e) => { setUserName(e.target.value) }} ></input>
                    <div className="d-flex">
                        <div >
                            <label htmlFor="nrPlayer">Position player</label> 
                            <select id="nrPlayer" name="nrPlayer" value={userPosition}
                            onChange={(e) => { setUserPosition(e.target.value)}}>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="colorPlayer">Color player</label>
                            <select id="colorPlayer" name="colorPlayer" 
                                value={userColor}
                                onChange={(e)=>{setUserColor(e.target.value)}}>
                                <option value="blue">blue</option>
                                <option value="red"> red</option>
                                <option value="yellow">yellow</option>
                                <option value="green">green</option>
                                <option value="black">black</option>
                            </select>
                        </div>
                    </div>
                    <p>Want to join a existing game ?</p>
                    <div className="indent">
                        <label htmlFor="inputGameId"> </label>
                        <input ref={idGameRef} id="inputGameId" type="text" value={gameId} onChange={(e) => { setGameId(e.target.value) }} placeholder="1234abc"></input>
                        <button id="btnJoinGame" onClick={handleJoinGame}> Join Game </button>
                    </div>
                    <p>Or create a new game ?</p>
                    <div className="indent">
                        <button id="btnCreateGame" onClick={handleCreateGame}> Create Game</button> 
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoginPage
