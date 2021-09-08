import { useParams } from 'react-router-dom';
import './css/master.css';
import Table from './components/Table';
function App() {

  let {gameId} = useParams()

  return (<> 
            
            <h2> game: {gameId}</h2>
            <div className="container">
                <Table/>
            </div>
          </> 
  );
}

export default App;
