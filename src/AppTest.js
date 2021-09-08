import './App.css';
import {useRef, useEffect, useState} from 'react'

function initCards() {

    let cards = []
    for (let i = 0; i < 5; i++) {
        let newCard = Math.floor(Math.random() * 10) + 1
        cards.push(newCard)
    }
    console.log(`[initCards()] cards: ${cards}`);
    return cards
}

const CardsTest = ({setCnt}) => {

    const valRand = useRef(initCards())
    const [varA, setVarA] = useState(0)
    const [varB, setVarB] = useState(0)


    useEffect(() => {
        console.log(`[CARDS] - INIT useEffect`);
    }, [])


    useEffect(() => {
        console.log(`[CARDS] - useEffect = f([varA, varB] )`);
    }, [varA, varB])


    
    console.log(`RENDER`);



    const itemsOrderdList = 
        valRand.current.map((value) => {
            return <li>value &rarr; {value}</li>
        })
    

    return (<>
            <div>
                <ol>
                    {itemsOrderdList}
                </ol>
            </div>
            <p> a = {varA}</p>
            <p> b = {varB}</p>
            <input type='number' value={varA} onChange={(e) => { setVarA(e.target.value) }} />
            <input type='number' value={varB} onChange={(e) => { setVarB(e.target.value) }} />
            </>)

}




function App() {
    const [cnt, setCnt] = useState(0)


  return (<>
            <div >
              Hello World
                <CardsTest setCnt={setCnt} />

            </div>
          </> 
  );
}

export default App;
