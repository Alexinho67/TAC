import React from 'react'


const myReducerFcn = (state, action) =>{
    const {type, payload} = action
    let cnt = state.count
    switch (type){
        case 'increment':
            console.log(`incrementing`);
            return { count: cnt + parseInt(payload)}
        default:
            throw new Error();
    }

 }

const ReducerTest = () => {
    const [addValue, setAddValue] = React.useState(0)

    const [state, dispatch] = React.useReducer(myReducerFcn, {count:0})


    function handleCalc(){
        dispatch({type:'increment', payload: addValue})
    }


    return (
        <div>
            Hello World
            <div>
                state: {JSON.stringify(state)}
            </div>
            <form>
                <input type="number" value={addValue} onChange={(e)=>{setAddValue(e.target.value)}} />
                <input type="button" onClick={handleCalc} value="Berechnen!" /> 
            </form>
        </div>
    )
}

export default ReducerTest
