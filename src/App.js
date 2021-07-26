import {useState, useEffect} from 'react';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import styles from './App.module.css';
import Board from './components/Board'
import Square from "./components/Square";
import canDrop from './utils';

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
            piecesInitState.push({id, pos: i, isDragging: false, startPos: i, color: 'black', isKing: true});
            id++;
        }
    }
    for(let i = 40; i < 64; i++) {
        if((i + Math.floor(i/8))%2 === 1) {
            piecesInitState.push({id, pos: i, isDragging: false, startPos: i, color: 'white', isKing: true});
            id++;
        }
    }

    const [piecesState, setPiecesState] = useState(piecesInitState);
    const [chainDraftHistory, setChainDraftHistory] = useState([piecesInitState]);
    const [whoseMove, setWhoseMove] = useState('white');

    useEffect(() => {
        setPiecesState(chainDraftHistory[chainDraftHistory.length - 1]);
    }, [chainDraftHistory]);

    function movePiece(id, pos, mode) {
        let newPiecesState = piecesState.map(p => p.id === id ? {...p, pos} : p);
        // decompose king's path into simple paths of size 1 (or 2 when capturing)
        // if(piecesState.find(p => p.id === id).isKing && mode !== 'atomic') {
        //     let xFrom = piecesState.find(p => p.id === id).pos % 8;
        //     let yFrom = Math.floor(piecesState.find(p => p.id === id).pos / 8);
        //     let xTo = pos % 8;
        //     let yTo = Math.floor(pos / 8);
        //     let dx = Math.sign(xTo - xFrom);
        //     let dy = Math.sign(yTo - yFrom);
        //     let t = 0;
        //     console.log('xFrom:', xFrom);
        //     console.log('yFrom:', yFrom);
        //     console.log('xTo:', xTo);
        //     console.log('yTo:', yTo);
        //     console.log('dx:', dx);
        //     console.log('dy:', dy);
        //     for(let x = xFrom+dx, y = yFrom+dy; x*dx <= xTo*dx && y*dy <= yTo*dy; x += dx, y += dy) {
        //         // console.log('canDrop:', canDrop({id: y*8 + x, piecesState, chainDraftHistory}));
        //         // console.log('x', x);
        //         // console.log('y', y);
        //         if(canDrop({id: y*8 + x, piecesState, chainDraftHistory})) {
        //             console.log('seq:', x, y);
        //             movePiece(id, y*8 + x, 'atomic');
        //             t++;
        //         }
        //     }
        //     return;
        // }

        // if this draft move is extended
        if([(+8 +1)*2, (+8 -1)*2, (-8 +1)*2, (-8 -1)*2].some(n => pos + n === piecesState.find(p => p.id === id).pos)) {
            if(pos + (+8 +1)*2 === piecesState.find(p => p.id === id).pos) {
                newPiecesState = newPiecesState.map(p => p.pos === pos + (+8 +1) ? {...p, pos: p.color === 'black' ? 100 : 200} : p)
            }
            if(pos + (+8 -1)*2 === piecesState.find(p => p.id === id).pos) {
                newPiecesState = newPiecesState.map(p => p.pos === pos + (+8 -1) ? {...p, pos: p.color === 'black' ? 100 : 200} : p)
            }
            if(pos + (-8 +1)*2 === piecesState.find(p => p.id === id).pos) {
                newPiecesState = newPiecesState.map(p => p.pos === pos + (-8 +1) ? {...p, pos: p.color === 'black' ? 100 : 200} : p)
            }
            if(pos + (-8 -1)*2 === piecesState.find(p => p.id === id).pos) {
                newPiecesState = newPiecesState.map(p => p.pos === pos + (-8 -1) ? {...p, pos: p.color === 'black' ? 100 : 200} : p)
            }
        }
        if(piecesState.find(p => p.id === id).color === 'black' && pos >= 56 && pos <= 63) {
            newPiecesState = newPiecesState.map(p => p.id === id ? {...p, isKing: true} : p);
        }
        if(piecesState.find(p => p.id === id).color === 'white' && pos >= 0 && pos <= 7) {
            newPiecesState = newPiecesState.map(p => p.id === id ? {...p, isKing: true} : p);
        }
        // if this draft move is rollback to the previous
        if(chainDraftHistory.length >= 2 && chainDraftHistory[chainDraftHistory.length - 2].find(p => p.id === id).pos === pos) {
            setChainDraftHistory(chainDraftHistory.slice(0, -1));
        } else {
            setChainDraftHistory(chainDraftHistory.concat([newPiecesState]));
        }
        // if this draft move is extended
        // if([(+8 +1)*2, (+8 -1)*2, (-8 +1)*2, (-8 -1)*2].some(n => pos + n === piecesState.find(p => p.id === id).pos)) {
        //     console.log('extended!!!')
        //     // if this draft move is rollback to the previous
        //     if(chainDraftHistory.length >= 2 && chainDraftHistory[chainDraftHistory.length - 2].find(p => p.id === id).pos === pos) {
        //         setChainDraftHistory(chainDraftHistory.slice(0, -1));
        //     } else {
        //         setChainDraftHistory(chainDraftHistory.concat([newPiecesState]));
        //     }
        // } else {
        //     setChainDraftHistory(chainDraftHistory.concat([newPiecesState]));
        // }

    }

    function setDragging(id, val) {
        let newPiecesState = piecesState.map(p => p.id === id ? {...p, isDragging: val, startPos: val ? p.startPos : p.pos} : p);
        setChainDraftHistory(chainDraftHistory.map((h, i) => i === chainDraftHistory.length - 1 ? newPiecesState : h));
        if(val === false && chainDraftHistory.length > 1) {
            setChainDraftHistory([newPiecesState]);
            setWhoseMove(whoseMove === 'white' ? 'black' : 'white');
        }
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className={styles.wrapper}>
                <Board whoseMove={whoseMove} chainDraftHistory={chainDraftHistory} movePiece={movePiece} setDragging={setDragging} boardState={boardState} piecesState={piecesState} />
            </div>
        </DndProvider>
    );
}

export default App;
