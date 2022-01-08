import React from 'react'
import io from 'socket.io-client'
import { URLws, PINK } from '../utils/Constants';
import { GameModelContext } from './GameProvider';
import { addListenersForTac} from '../components/socketComps/TacListeners'

let urlIoSocket
if (process.env.NODE_ENV === 'development') {
    urlIoSocket = URLws + '/socket.io'
} else {
    urlIoSocket = '/socket.io'
}



const SocketContext = React.createContext()

const SocketProvider = (props) => {
    const [socket, setSocket] = React.useState(undefined)
    const [idSocket, setIdSocket] = React.useState(undefined)
    const model = React.useContext(GameModelContext)
    
    /* ================================================================================
    --------------------------     HOOKS      -----------------------------------------
    * ================================================================================ */


    React.useEffect(() => {
        console.log(`%c[SocketProvider] initial render.`,'color:cyan');
        // after the cookie is received --> try to establish the socket connection
        let cookieReceived = true
        if (cookieReceived === true) {
            console.log(`Received cookie. Establishing IO connection`);
            connectSocket()
        }
        return () => {
            console.log(`**** Dismounting SocketProvider **** `);
        }
    }, [])
    // }, [cookieReceived])

    React.useEffect(() => {
        console.log(`%cUseEffect @ socket. Socket.connected : ${socket?.connected}`, PINK);
        if (socket) {
            console.log(`adding listeners to Socket`);
            socket.on('hello', (msgHello)=>{
                console.log(`[onHello]: ${msgHello}`);
            })
            // socket.on('playerStatus', (data) => {
            //     console.log(`[onPlayerStatus]: %c received data`,'color:green');
            // })
            // addListenersToSocket(socket, setIdSocket)
            addListenersToSocket(socket)
            addListenersForTac(socket, model)
        } // end else
        return () => {
            console.log(`%c Run cleanUp of UseEffect@Socket`,'color:red');
            if (socket){
                socket?.removeAllListeners()
                disconnectSocket()
            } else { console.log(`\t\t ==> Nothing to be cleanedUp`);}
        }
    }, [socket])


    /* ================================================================================
    --------------------------     Fuctions      -----------------------------------------
    * ================================================================================ */


    function connectSocket() {
        console.log(`Requesting socket connection to url: "${urlIoSocket}"`);
        let socketTemp = io('/', {
            // transports: ['websocket'],
            withCredentials: true,
            path: urlIoSocket, // added this line of code
        })
        setSocket(socketTemp)
    }

    function disconnectSocket() {
        console.log(`Disconnecting socket ${socket?.id}`);
        socket?.disconnect()
    }

    function addListenersToSocket(socket) {
        socket.on('connect', () => {
            setIdSocket(socket.id)
            console.log(`You are connected. Your id is: %c${socket.id}`, 'color:#fa0');

            // socket.on("foundSession", ({ msg, nameUser, nameRoom }) => {
            //     console.log(`[msgServer]:Known User %c${msg}. RoomName:${nameRoom}`, ORANGE);
            //     setUserName(nameUser)

            //     if (nameRoom) { // if room name is defined --> join the room using the provided name
            //         console.log(`You have been in room "${nameRoom}"`);
            //         socket.emit('joinRoom', nameUser, nameRoom)
            //         setRoomName(nameRoom)
            //         setIsLoggedIn(true)
            //     }
            // })

            // socket.on("joinedRoom", (data) => {
            //     console.log(`[event"joinedRoom": success:${data.success},name:${data.nameRoom}]`);
            //     if (data.success === true) {
            //         setIsLoggedIn(true)
            //         setRoomName(data.nameRoom)
            //     } else {
            //         alert(`Room ${data.nameRoom} does not exist`)
            //         // setRoomName("")
            //     }
            // })

            // socket.on("listOfUsers", ({ nameRoom, userList }) => {
            //     console.log(`@[onlistOfUsers]:Users in room %c${nameRoom}%c are %c${userList.join(";")} `, ORANGE, WHITE, ORANGE);
            //     // move own name to the end of the list
            //     let idxOwnName = userList.indexOf(userName)
            //     userList.push(userList.splice(idxOwnName, 1)[0])
            //     setListUserInSameRoom(userList)
            // })

            // socket.on("reloadPage", () => {
            //     console.log(`Refreshing page...`);
            //     setTimeout(() => { window.location.reload() }, 100)
            // })
        }) // close on("connect",...)
    } //close function  addListenersToSocket


    /* ================================================================================
    --------------------------     RENDER      -----------------------------------------
    * ================================================================================ */

    return (
        <SocketContext.Provider value={{ socket, idSocket }}>
            {/* <h3>SocketContext.Provider</h3> */}
            {props.children}            
        </SocketContext.Provider>
    )
}

function useSocketContext(){
    const context = React.useContext(SocketContext)
    if (context === undefined) {
        throw new Error('useCount must be used within a CountProvider')
    }
    return context
}

export { SocketProvider as default, useSocketContext}
