export function addListenersToSocket(socket, setIdSocket) {
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