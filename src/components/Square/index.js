import Piece from '../Piece';
import { DropTarget } from 'react-dnd';
import styles from './index.module.css';

function Square({isBlack, id, movePiece, boardState, canDrop, isOver, connectDropTarget}) {
    return connectDropTarget(
        <div
            ref={connectDropTarget}
            className={styles.wrapper}
            style={{backgroundColor: canDrop ? 'green' : (isBlack ? 'black' : 'white')}}>
            {/*{boardState[id] !== 0 ? <Piece id={boardState[id]} pos={id} /> : null}*/}
        </div>);
}

export default DropTarget('piece2square', {
    canDrop: (props) => {

    },
    drop: (props) => ({ pos: props.id }),
    hover: (props, monitor) => {
        props.movePiece(monitor.getItem().id, props.id);
    },
}, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
}))(Square);
