export function addListenersForTac(socket, model) {
    // socket.on('playerStatus',(data )=>{console.log(`PLAYERSTATUS received`) })
    socket.on('playerStatus',(data )=>{
        console.log(`onPlayerStatus: data: ${JSON.stringify(data)} `);
        console.dir(data.message);
        // model.setGameStatus(obj => { return { ...obj, state: 'started' } })
        model.dispatcherTac({ type: 'updatePlayers', payload: { msg: data.message, playerData: model.playerData } })
    })
    // socket.on('playerStatus',(data)=>{ handlePlayerStatus(model, data) })
    // socket.on('info',(info)=>{ handleInfo(info) })
}


function handlePlayerStatus(model, data){
        console.log(`onPlayerStatus: data: ${JSON.stringify(data)} `);
        console.dir(data.message);
        model.setGameStatus(obj => { return { ...obj, state: 'started' } })
        model.dispatcherTac({ type: 'updatePlayers', payload: { msg: data.message, playerData: model.playerData } })
    }


function handleInfo(info) {
    console.log(`onInfo: Info: ${JSON.stringify(info)} `);
}