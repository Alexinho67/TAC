import React from 'react'
import {addMessage, ExpireMsg} from './ExpireMsg'


const InnerCenter = ({ state, triggerCardPlayed}) => {
    const [debugMsg, setDebugMsg] = React.useState(undefined)
    // let debugMsg = <ExpireMsg> Clicked me</ExpireMsg>
    const classInnerCenter = 
        state === 'active'? "highlight": ""

    function _handleClick(){
        // console.log(`clicked [innerCenter]`);
        addMessage('juhuuuuuu', setDebugMsg)
        if (state === 'active'){
            triggerCardPlayed()
        }
    }



    // console.log(`rendering [InnerCenter]: stateInnerCenter:${state}`);
    return (<>
        <div id="innerCenter" onClick={_handleClick} className={classInnerCenter}>
            {/* {state} */}
        </div>
        {debugMsg}
        {/* <ExpireMsg> Clicked me</ExpireMsg> */}
        </>
    )
}

export default InnerCenter
