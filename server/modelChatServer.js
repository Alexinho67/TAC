class StateChatServer {
    constructor(){
        this.rooms = {}
        this.users = {}
    }

    addRoom( newRoom){
        this.rooms[newRoom.name]=  newRoom
    }

    addUser(user){
        this.users[user.id] = user
    }
    
    getRoom(name){
        let promise = new Promise((resolve, reject) => {
            if (name in this.rooms) {
                let room = this.rooms[name]
                resolve(room)
            } else {
                reject(`Room "${name}" does not exist.`)
            }
        })
        return promise
    }

    removeUser(userId){
        console.log(`Removing id:${userId} from list of users`);
        delete(this.users[userId])
    }

    printListUserIds(){
        console.log(`List of current clients on server: `);
        for (let key in this.users){
            let room = this.users[key]?.room ? this.users[key]?.room.name : "none"
            console.log(`\tid:${key} - name: ${this.users[key]?.name} - room:${room}`)
        }
    }

    findUserBySocketId(idSocket){
        // console.log(`findUserBySocketId:- idSocket=${idSocket}`);
        for (const userObj  of Object.values(this.users)){
            if (userObj.idSocket === idSocket){
                return userObj
            } 
        }
        return undefined // if not returned inside the forLoop -> return here
    }
}

class ChatRoom{
    /** Creates a chatRoom instance.
     * @param {string} name The name of the chat room
     * @param {number} limit The maximum allowed clients in that room.
     * @return {chatRoom}  returns a instance of ChatRoom.
     */
    constructor(name, limit = 4){
        this.name = name
        this.numberUsersAct = 0
        this.numberUsersMax = limit
        this.users = {}
        this.messageList = []
    }

    calcNumUserAct(){
        this.numberUsersAct = Object.keys(this.users).length
        return this.numberUsersAct
    }
    
    addUser(userObj){
        console.log(`Adding user(id=${userObj.id}) to room "${this.name}"`);
        if (this.numberUsersAct === this.numberUsersMax){
            console.log(`\tRoom "${this.name}" is FULL`.red)
            return {status:'fail', msg: 'Maximum number of users reached'}
        }
        // still capacty for more users in that room
        this.users[userObj.id] = userObj
        this.calcNumUserAct()
    }


    removeUser(idUser){
        delete (this.users[idUser])
        // find user in the 'List' this.userList and remove it
        this.calcNumUserAct()
        console.log(`${this.numberUsersAct} users left in room ${this.name}`);

        return this.numberUsersAct
    }

    addNewMessage(msg){
        this.messageList.push(msg)
    }

    getListOfMessages(){
        if(this.messageList.length === 0){
            return { status: 'no messages', data : []}
        }
        let listTemp = this.messageList.map( msg => {
            return msg
        })
        return { status: 'ok', data: listTemp }
    }
}


class User {
    constructor(id, name, idSocket){
        this.name = name
        this.idSocket = idSocket
        this.room = undefined
        // this.roomsSubscribed = {}
        this.roomOld = undefined
        this.fcnTimeOutRemoveUser = undefined
        this.status = 'connected'
    }

    addRoom(objRoom){
        this.room = objRoom 
    }

    toString(){
        return `[${this.id} - ${this.name}]`
    }

    leaveRoom(){
        if (this.room){
            let roomObj = this.room
            let roomName = roomObj.name
            console.log(`Leaving room: ${roomName}`);

            // 1. clear room from the userObj
            this.room = undefined

            // 2. clear userObj from the roomObj
            delete(roomObj.users[this.name])

            return roomName
        }else{
            return undefined
        }
    }

    // leaveAllRooms(){
    //     // in next line "this" = User
    //     let roomNames = Object.keys(this.roomsSubscribed)
    //     console.log(`User is following rooms: ${roomNames.join(",")}`);
    //     let roomsLeft = []
    //     Object.keys(this.roomsSubscribed).forEach( roomName => {
    //         // in next line "this" is still user
    //         this.leaveRoom(roomName)
    //         roomsLeft.push(roomName)
    //     })
    //     return roomsLeft
    // }

    clearRemoveTimeOut(){
        try{
            console.log(`Keeping userObj alive!! UserObj => name:${this.name},id:${this.id}`);
            clearTimeout(this.fcnTimeOutRemoveUser)
        }catch(err){
            console.log(`[clearRemoveTimeOut].Error: ${err}`);
            console.log(`this.fcnTimeOutRemoveUser:${this.fcnTimeOutRemoveUser}`);
        }
    }
    
    // removeRoom(roomToLeave){
    //     let idxRoom = this.roomsSubscribed.indexof(roomToLeave)
    //     this.roomsSubscribed.splice(idxRoom, 1)
    // }
}


class Message{
    constructor(content = undefined, senderName = undefined, senderId=undefined, time=undefined, roomName=undefined){
        this.content = content
        this.senderName = senderName
        this.senderId = senderId
        this.time = time
        this.roomName = roomName
    }

    toString(){
        return `${this.senderName} wrote at ${this.time} in room "${this.roomName}": \n\t${this.content}`
    }
}

module.exports = { StateChatServer, ChatRoom, User, Message }
