import React from "react"
import { v4 as uuidv4 } from 'uuid';


function addError(err, setErrorList) {

    let errObjNew = { id: uuidv4(), msg: err }
    console.log(`adding ${JSON.stringify(errObjNew)}`);
    setErrorList(list => [...list, errObjNew])
    // setTimeout(() => { 
    //     console.log(`setting " errObj = undefined " `);
    //     setErrorList(list => list.filter(errObj => errObj !== errObjNew))}
    //     , 2500)
}

const ErrorItem = ({ error, setErrorList}) => {
    const [stlye, setStlye] = React.useState()

    React.useEffect (( )=>{ 
        setTimeout(() => {
            setStlye({ transition: 'font-size 1s, opacity 1s', fontSize:'0.1rem',  opacity:'30%'})
            setTimeout(( )=>{ 
                console.log(`opacity:0.3`);
                setErrorList(list => list.filter(errorItem => errorItem.id !== error.id))
            },500)
        }, 2500);
    },[])


    return <div className="error" style={stlye}> {error.msg}</div>
}

const ErrorList = ({ errors, setErrorList }) => {
    return (<div className="errorList">
        {errors.map(error => {
            return <ErrorItem key={error.id} error={error} setErrorList={setErrorList}/>
        })}
    </div>)
}

export {ErrorList, addError}
