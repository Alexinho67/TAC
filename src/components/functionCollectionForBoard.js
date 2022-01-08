function getNewBallObject(ballReRenderModel, posPlayerAbs, flagIsReady){
            // console.log(`....[Board-useEffect@getNewBallObject]: ballReRenderModel:${JSON.stringify(ballReRenderModel)} `);
            let xBallGlobCentered, yBallGlobCentered
            if (ballReRenderModel.posGlobal <= 63) {
                let phi = Math.PI * 2 / 64 // angle between to ring slots
                let alpha = phi * ballReRenderModel.posGlobal + Math.PI / 2
                let radius = 45.25
                xBallGlobCentered = Math.cos(alpha) * radius
                yBallGlobCentered = Math.sin(alpha) * radius

            } else { // either start or home slot
                let lastDigit = ballReRenderModel.posGlobal % 10
                if (lastDigit <= 4) {// startSlot
                    //  corner right bottom:
                    //           #1 - O x   #2:  x O   #3: x x  #4: x x
                    //                x x        x x       O x      x O
                    let factxy
                    if (ballReRenderModel.posAbsOwner === 1) { factxy = [1, 1] }
                    else if (ballReRenderModel.posAbsOwner === 2) { factxy = [-1, 1] }
                    else if (ballReRenderModel.posAbsOwner === 3) { factxy = [-1, -1] }
                    else if (ballReRenderModel.posAbsOwner === 4) { factxy = [+1, -1] }
                    else { factxy = [0, 0] }
                    console.log(`factxy: ${factxy}`);
                    xBallGlobCentered = factxy[0] * (40 + (lastDigit - 1) % 2 * 5)
                    /* ==> lastDigit=1 -> factxy[0]* (40)
                       ==> lastDigit=2 -> factxy[0] * (40 + 5) =  factxy [0] * 45
                     */
                    yBallGlobCentered = factxy[1] * (40 + parseInt((lastDigit - 1) / 2) * 5)
                } else { // homeSlot
                    let idxHomeSlot = lastDigit - 5 // [5,6,7,8] --> [0,1,2,3]
                    let leadingDigit = parseInt(ballReRenderModel.posGlobal/10)
                    switch (leadingDigit){
                        case 7: //player 1
                            // idxHomeSlot=[0,2] are with xCenter = 0
                            // idxHomeSlot=[1,3] are with yCenter = 20.25
                            xBallGlobCentered = 0 + idxHomeSlot % 2 * (idxHomeSlot - 2) * 6.8 // for idxHomeSlot=[0,2] -> x=50, for i = [1] -> fact gets "-1" with "idxHomeSlot-2"
                            yBallGlobCentered = 20.25 + 0 * Math.pow(idxHomeSlot, 3) + 4 * Math.pow(idxHomeSlot, 2) - 16 * idxHomeSlot + 12
                            break
                        case 8://player 2
                            // idxHomeSlot= [0,3] same pos of xCenter= - 28
                            // idxHomeSlot= [1,2] same pos of xCenter= - 21.25
                            xBallGlobCentered = -28 + (idxHomeSlot % 2 + parseInt(idxHomeSlot / 2)) % 2 * 6.75 // for i=[0,3] the factor will be "0"
                            yBallGlobCentered = -8 + 4 * idxHomeSlot + parseInt(idxHomeSlot / 2) * 4 // each gap 4%, but lower two additionally 4 %
                            break
                        case 9: //player 3 (Front)
                            // idxHomeSlot = [0,2] are with xCenter = 0
                            // idxHomeSlot = [1,3] are with yCenter = -20.5
                            xBallGlobCentered =  idxHomeSlot % 2 * (idxHomeSlot - 2) * (-1) * 6.8 // for idxHomeSlot=[0,2] -> x=50, for i = [1] -> fact gets "-1" with                        "idxHomeSlot-2"
                            yBallGlobCentered = -20.5 + 0 * Math.pow(idxHomeSlot, 3) - 4 * Math.pow(idxHomeSlot, 2) + 16 * idxHomeSlot - 12
                            break
                        case 10://player 4
                            // idxHomeSlot= [0,3] same pos of xCenter= + 28
  
                            xBallGlobCentered = 28 - (idxHomeSlot % 2 + parseInt(idxHomeSlot / 2)) % 2 * 6.75 // for i=[0,3] the factor will be "0"
                            yBallGlobCentered = 7.8 - 4 * idxHomeSlot - parseInt(idxHomeSlot / 2) * 4 // each gap 4%, but lower two additionally 4 %
                            break
                        default:
                            xBallGlobCentered = 0
                            yBallGlobCentered = 0
                    }
                }
            }

            let alphaRot = - (posPlayerAbs - 1) * Math.PI / 2 // player1-> posAbs = 1 --> no Rotation; player4 --> rotation by 270°/ 1.5pi ; "-" because anti-clockwise
            let xBallRel = xBallGlobCentered * Math.cos(alphaRot) - yBallGlobCentered * Math.sin(alphaRot) + 50
            let yBallRel = xBallGlobCentered * Math.sin(alphaRot) + yBallGlobCentered * Math.cos(alphaRot) + 50

            // console.log(`%cTRANSFORMATION`,'color:red');
            // console.log(`%c alphaRot:${alphaRot},xBallGlobCentered:${xBallGlobCentered},yBallGlobCentered:${yBallGlobCentered}  `,'color:red');
            // console.log(`%c    ===> xBallRel:${xBallRel},yBallRel:${yBallRel}  `,'color:red');

            let newBall = { id: ballReRenderModel.id,
                            posGlobal: ballReRenderModel.posGlobal,
                            left: Math.round(xBallRel * 100) / 100, 
                            top: Math.round(yBallRel * 100) / 100 ,
                            color: ballReRenderModel.color,
                            isSelected: false, 
                            show: true, 
                            isSelectable: flagIsReady }
            return newBall
        }

function updateBallsList(listBalls, ballsListRerender, dispatcherTac, posPlayerAbs, flagIsReady){
            /* parameters: listBalls - old values of "ballsAllData"
                           ballsListRerender - list of balls from the model containing informations about balls which 
                                 shall be rerendered
                description: 
                    function loops through the list of ball which shall be rendered and 
            */
            // console.log(`    Lvl3-[Board-useEffect@stateGameReduce.players[0..4].balls] updateBallsList.`);
                                  
            ballsListRerender.forEach(ballReRenderModel => {
            //     // console.log(`    Lvl3-[Board-useEffect@stateGameReduce.players[0..4].balls] updateBallsList. Looping through list \n. Rerendering ball ${JSON.stringify(ballReRenderModel)}`);
                    // find ball in list "listBall"
                let ballTobeUpdated = listBalls.find(ball => ball.id === ballReRenderModel.id) 
                let newBall = getNewBallObject(ballReRenderModel, posPlayerAbs, flagIsReady)
                if (!ballTobeUpdated){ // ball not created yet 
                    listBalls.push(newBall)
                } else {
                    Object.assign(ballTobeUpdated, { left: newBall.left, top: newBall.top, posGlobal: newBall.posGlobal})
                }

                dispatcherTac({ type: 'setBallToHasBeenRendered', payload: ballReRenderModel })
            })
            
            return listBalls 

        }

export function updateBallsForRender(playersMdl, setBallsAllData, dispatcherTac, posAbs, isReady){
    /* function checks the model data and gets the list of balls which have the 
        property "rerender === true"
        These balls shall be created/updated in the state variable "ballsAllData"
    */
    let ballsListRerender = playersMdl.reduce((oldList, player) => {
        oldList.push(...player.balls.filter(ball => ball.rerender === true))
        return oldList
    }, [])
    
    // console.log(`  Lvl2-[Board-useEffect@stateGameReduce.players[0..4].balls] updateBallsForRender. ballsToRender: ${JSON.stringify(ballsListRerender)}`);
    setBallsAllData( listBalls => {
        return updateBallsList(listBalls, ballsListRerender, dispatcherTac, posAbs, isReady)
    })
}


        export function unselectBallOnClickToVoid(e, ballsAllData, setBallsAllData){
            /* function: 
                - unselect ball if user clicks somewhere into the "void"
            */
            // console.log(`%c[Board]-MouseClick`,'background-color:#a0f; color:white');
            let elemTgt = e.target
            let ballSelected = ballsAllData.find(ball => {
                return ball.isSelected === true
            })
            // console.log(`....ballSelected:${JSON.stringify(ballSelected)}`);
            // console.log(`......elemTgt: id:${elemTgt.id}-class:${elemTgt.className}`);
            if (ballSelected !== undefined & elemTgt.className !== 'ballSlot') {
                // console.log(`....unselect ball`);
                setBallsAllData(list => list.map(b => {
                     return { ...b, isSelected: false }} ) )
            } else if (elemTgt.name === 'imgCard') {
                // console.log(`....clicked "imgCard"`);
                return
            }
        }

export function initCards(cardsFromModel, WIDTHCARD, ASPECT_RAT_CARD, numCards, cardForSwap) {
        let cardObjects = []
      
        for (let i = 0; i < cardsFromModel.length; i++) {
            let idExtCardSwap = cardForSwap?.idExt
            let newCard = {
                id: cardsFromModel[i].idInternal,
                idExt: cardsFromModel[i].idExt,
                isPlayed: false,   // card is set to "isPlayed" to set position "top=50%" and "left=50%" while using a transition
                isCardForSwap: idExtCardSwap === cardsFromModel[i].idExt,   // card is set to "isCardForSwap" to set position approx. "top=70%" and "left=70%" while using a transition
                isSelected: false,  // use can (pre) select or unselect each card. Selection get highlighted 
                width: WIDTHCARD,
                // value: Math.floor(Math.random() * 9) + 1,
                value: cardsFromModel[i].value,
                left: (100 - WIDTHCARD * numCards) * 0.5 + WIDTHCARD * i + WIDTHCARD/2,
                top: 100 + ASPECT_RAT_CARD * WIDTHCARD } // left edge of each card
            cardObjects.push(newCard)
        }
        console.log(`[initCards()] cards: ${JSON.stringify(cardObjects)}`);
        return cardObjects
    }


export function triggerSelectedCardForSwap(idCardSelected, cardsHand, setCardsHand, dispatcherTac, socket){
        console.log(`[Board - triggerSelectedCardForSwap ]`);
        let idCardDblClicked = undefined // can be used to enabel double click card for select swapping card
        let idCardSwaping = idCardDblClicked ? idCardDblClicked : idCardSelected
        let cardSwaping = cardsHand.find(card => card.id === idCardSwaping)
        if (!cardSwaping) {
            console.log('cardSwaping not defined')
        }
        let cardToServer = { value: cardSwaping.value, id: cardSwaping.idExt }
        console.log(`[Board - triggerSelectedCardForSwap ].cardSwaping:${JSON.stringify(cardSwaping)}`);
        dispatcherTac({ type: 'cardForSwapSelectedSelf', payload: cardSwaping.idExt })
        socket.emit('swappingCard', cardToServer)

        setCardsHand( cardsListOld => {
            cardsListOld = cardsListOld.map(card => {
                if (card.id === idCardSwaping) { Object.assign(card, {isCardForSwap:true})} 
                return card 
            })
            return cardsListOld
        })
    }


    export function triggerCardPlayed(cardsHand, setCardsHand, idCardSelected, socket, dispatcherTac,  idCardDblClicked = undefined){
        /* function simply looks for the card in "the hand" and set't it's status "isPlayed=true"
        */
        if(cardsHand.find(c => c.isPlayed)){
            /* if one card in the hand has currently the status "isPlayed", then no other card can be played */
            console.log('Please wait till previous card has been played.')
            return
        }

        let idCardPlaying
        if (idCardDblClicked){
            idCardPlaying = idCardDblClicked
        } else {
            idCardPlaying = idCardSelected
        }

        // setIdCardPlayed(idCardPlaying)
        console.log(`%c[Board=>triggerCardPlayed] User wants to play card #${idCardPlaying}`, 'color:#fa0');
        let cardPlaying = cardsHand.find(card => card.id === idCardPlaying)
        if(!cardPlaying){
            console.log('CardPlaying not defined')
        }

        // inform the server of the card which is played
        let cardToServer = { value: cardPlaying.value, id: cardPlaying.idExt }
        console.log(`...Playing cardToServer:${JSON.stringify(cardToServer)}`);
        socket.emit('playingCard', cardToServer)


        
        setCardsHand( (list)=>{return list.map((card )=>{
            // console.log(`\t Current card: #${card.id} - value: ${card.value}. Compare to idCardSelected = ${idCardSelected}`);
            if (card.id !== idCardPlaying) { return card}
            else { 
                return Object.assign(card, { isPlayed: true} ) //setting card to "isPlayed : true"
            } // closing if-else
        }) // closing- list.map()
        }) // closing setCards()

        let timeAnimation = 800
        setTimeout(() => transitionCardHandToTray(cardsHand, setCardsHand, dispatcherTac, idCardPlaying), timeAnimation)

    } // closing triggerCardPlayed()

function transitionCardHandToTray(cardsHand, setCardsHand, dispatcherTac, idCardPlaying){
    /*
    * after transition has ended, the card shall move from the array "cardsHand" to "cardsPlayed"
    */
    // console.log(`[Board=>transitionCardHandToTray] execute. idCardPlaying=${idCardPlaying}`);
    setCardsHand( (list) => {return list.filter(card => {
        return card.isPlayed !== true
    })})

    // remove card from the model
    let style = 'color:yellow;background-color: #00f'
    console.log(`issue_%c[Board/transitionCardHandToTray] card played with id: ${idCardPlaying}`, style);
    dispatcherTac({ type: 'removeHandCard', payload: idCardPlaying })
    // setIdCardPlayed(-1)
}