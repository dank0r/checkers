import Piece from '../Piece';
import styles from './index.module.css';

function Square({isBlack, id, boardState}) {
    return (
        <div className={styles.wrapper} style={{backgroundColor: isBlack ? 'black' : 'white'}}>
            {/*{boardState[id] !== 0 ? <Piece id={boardState[id]} pos={id} /> : null}*/}
        </div>
    );
}

export default Square;
