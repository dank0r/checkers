import {useState, useEffect, useRef} from 'react';
import {useSynchronousState} from '@toolz/use-synchronous-state';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import styles from './App.module.css';
import Board from './components/Board'
import Square from "./components/Square";
import canDrop from './utils/canDrop';
import optimalMove from './utils/optimalMove';

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
            piecesInitState.push({id, pos: i, isDragging: false, startPos: i, color: 'black', isKing: false});
            id++;
        }
    }
    for(let i = 40; i < 64; i++) {
        if((i + Math.floor(i/8))%2 === 1) {
            piecesInitState.push({id, pos: i, isDragging: false, startPos: i, color: 'white', isKing: false});
            id++;
        }
    }

    const [piecesState, setPiecesState] = useState(piecesInitState);
    const [chainDraftHistory, setChainDraftHistory] = useState([piecesInitState]);
    const [whoseMove, setWhoseMove] = useState('white');
    const [opponent, setOpponent] = useState('computer');
    const chainDraftHistoryRef = useRef();
    const piecesStateRef = useRef();

    useEffect(() => {
        console.log('chainDraftHistory', chainDraftHistory);
        chainDraftHistoryRef.current = chainDraftHistory;
    }, [chainDraftHistory]);
    useEffect(() => {
        piecesStateRef.current = piecesState;
        console.log('piecesState', piecesState);
    }, [piecesState]);

    useEffect(() => {
        setPiecesState(chainDraftHistory[chainDraftHistory.length - 1]);
    }, [chainDraftHistory]);

    useEffect(() => {
        if(whoseMove === 'black' && opponent === 'computer') {
            let opMove = optimalMove(piecesState, chainDraftHistory, whoseMove);
            console.log(opMove);
            let pieceId = piecesStateRef.current.find(p => p.pos === opMove[0]).id;

            setDragging(pieceId, true);
            setTimeout(() => {
                for(let i = 1; i < opMove.length; i++) {
                    setTimeout(() => {
                        movePiece(pieceId, opMove[i]);
                    }, i*200);
                }
            }, 200)
            setTimeout(() => {
                setDragging(pieceId, false);
            }, 200 + opMove.length*200);

            // console.log('start dragging');
            // setTimeout(function() {
            //     movePiece(12, 30);
            //     console.log('move piece');
            //     setTimeout(function() {
            //         setDragging(12, false);
            //         console.log('end dragging');
            //     }.bind(this), 20);
            // }.bind(this), 20);


        }
    }, [whoseMove]);

    function movePiece(id, pos, mode) {
        let piecesState = piecesStateRef.current;
        let chainDraftHistory = chainDraftHistoryRef.current;
        console.log('input piecesState:', piecesState);
        let newPiecesState = piecesState.map(p => p.id === id ? {...p, pos, isDragging: true} : p);
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
        if(newPiecesState.every(p => !p.isDragging)) {
            console.log('some shit happened');
        }
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
            setChainDraftHistory(chainDraftHistory => chainDraftHistory.slice(0, -1));
        } else {
            console.log('so ok, concat happened');
            setChainDraftHistory(chainDraftHistory => chainDraftHistory.concat([newPiecesState]));
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
        let piecesState = piecesStateRef.current;
        let chainDraftHistory = chainDraftHistoryRef.current;
        console.log(`setDragging(${id}, ${val})`);
        console.log('chainDraftHistory', chainDraftHistory.length);
        let newPiecesState = piecesState.map(p => p.id === id ? {...p, isDragging: val, startPos: val ? p.startPos : p.pos} : p);
        setChainDraftHistory(chainDraftHistory => chainDraftHistory.map((h, i) => i === chainDraftHistory.length - 1 ? newPiecesState : h));
        if(val === false && chainDraftHistory.length > 1) {
            console.log('end move');
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
