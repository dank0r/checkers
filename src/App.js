import {useState, useEffect} from 'react';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
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
            piecesInitState.push({id, pos: i, isDragging: false, startPos: i});
            id++;
        }
    }
    for(let i = 40; i < 64; i++) {
        if((i + Math.floor(i/8))%2 === 1) {
            piecesInitState.push({id, pos: i, isDragging: false, startPos: i});
            id++;
        }
    }

    const [piecesState, setPiecesState] = useState(piecesInitState);

    // useEffect(() => {
    //     setTimeout(() => {
    //         setPiecesState(piecesState.map(ps => ps.id === 1 ? {...ps, pos: ps.pos+1} : ps));
    //     }, 3000)
    // }, [piecesState]);

    function movePiece(id, pos) {
        setPiecesState(piecesState.map(p => p.id === id ? {...p, pos} : p));
    }

    function setDragging(id, val) {
        setPiecesState(piecesState.map(p => p.id === id ? {...p, isDragging: val, startPos: val ? p.startPos : p.pos} : p));
        // if(val === false) {
        //     setPiecesState(piecesState.map(p => p.id === id ? {...p, prevPos: -100} : p));
        // }
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className={styles.wrapper}>
                <Board movePiece={movePiece} setDragging={setDragging} boardState={boardState} piecesState={piecesState} />
            </div>
        </DndProvider>
    );
}

export default App;
