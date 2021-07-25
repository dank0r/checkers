import Square from '../Square';
import Piece from '../Piece';
import styles from './index.module.css';

function Board({boardState, piecesState, movePiece, setDragging}) {
    let squares = [];
    for(let i = 0; i < 64; i++) {
        squares.push(<Square key={i} id={i} movePiece={movePiece} piecesState={piecesState} boardState={boardState} isBlack={(i + Math.floor(i/8))%2 === 1} />);
    }
    let pieces = piecesState.map((ps, i) => <Piece key={'piece' + i} {...ps} setDragging={setDragging} />)
    return (
        <div className={styles.wrapper}>{squares.concat(pieces)}</div>
    );
}

export default Board;