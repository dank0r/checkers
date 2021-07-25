import {useState, useEffect} from 'react';
import styles from './App.module.css';
import Board from './components/Board'
import Square from "./components/Square";

function App() {
  let boardState = [];
  // let id = 1;
  // for(let i = 0; i < 24; i++) {
  //     if((i + Math.floor(i/8))%2 === 1) {
  //         boardState.push(id);
  //         id++;
  //     } else {
  //         boardState.push(0);
  //     }
  // }
  // for(let i = 0; i < 16; i++) {
  //     boardState.push(0);
  // }
  // for(let i = 0; i < 24; i++) {
  //     if((i + Math.floor(i/8) + 1)%2 === 1) {
  //         boardState.push(id);
  //         id++;
  //     } else {
  //         boardState.push(0);
  //     }
  // }



    let piecesInitState = [];
    let id = 1;
    for(let i = 0; i < 24; i++) {
        if((i + Math.floor(i/8))%2 === 1) {
            piecesInitState.push({id, pos: i});
            id++;
        }
    }
    for(let i = 40; i < 64; i++) {
        if((i + Math.floor(i/8) + 1)%2 === 1) {
            piecesInitState.push({id, pos: i});
            id++;
        }
    }

    const [piecesState, setPiecesState] = useState(piecesInitState);

    useEffect(() => {
        setTimeout(() => {
            setPiecesState(piecesState.map(ps => ps.id === 1 ? {...ps, pos: ps.pos+1} : ps));
        }, 3000)
    }, [piecesState]);



  return (
    <div className={styles.wrapper}>
        <Board boardState={boardState} piecesState={piecesState} />
    </div>
  );
}

export default App;
