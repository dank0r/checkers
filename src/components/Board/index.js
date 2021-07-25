import Square from '../Square';
import Piece from '../Piece';
import styles from './index.module.css';

function Board({boardState, piecesState}) {
    let squares = [];
    for(let i = 0; i < 64; i++) {
        squares.push(<Square key={i} id={i} boardState={boardState} isBlack={(i + Math.floor(i/8))%2 === 1} />);
    }
    let pieces = piecesState.map(ps => <Piece {...ps} />)
    return (
        <div className={styles.wrapper}>{squares.concat(pieces)}</div>
    );
}

export default Board;