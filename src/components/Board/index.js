import Square from '../Square';
import styles from './index.module.css';

function Board() {
    let squares = [];
    for(let i = 0; i < 64; i++) {
        squares.push(<Square isBlack={(i + Math.floor(i/8))%2 === 1} />);
    }
    return (
        <div className={styles.wrapper}>{squares}</div>
    );
}

export default Board;