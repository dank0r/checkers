import Piece from '../Piece';
import { DropTarget } from 'react-dnd';
import styles from './index.module.css';

function canDrop(props) {
    let piece = props.piecesState.find(p => p.isDragging);
    let pos = -1;
    if([+8 +1, +8 -1, -8 +1, -8 -1].some(n => piece?.pos + n === piece?.startPos)) {
        pos = piece?.startPos;

    } else {
        pos = piece?.pos;
    }
    let start = pos === props.id && !props.piecesState.some(p => p.pos === props.id);
    let ul = props.id % 8 !== 7 && pos === props.id + 8 + 1 && !props.piecesState.some(p => p.pos === props.id);
    let ur = props.id % 8 !== 0 && pos === props.id + 8 - 1 && !props.piecesState.some(p => p.pos === props.id);
    let bl = props.id % 8 !== 7 && pos === props.id - 8 + 1 && !props.piecesState.some(p => p.pos === props.id);
    let br = props.id % 8 !== 0 && pos === props.id - 8 - 1 && !props.piecesState.some(p => p.pos === props.id);
    return (ul || ur || bl || br || start) && props.piecesState.some(p => p.isDragging);
}

function Square({isBlack, id, movePiece, boardState, piecesState, isOver, connectDropTarget, monitor, isDragging}) {
    // console.log(isDragging);
    return connectDropTarget(
        <div
            ref={connectDropTarget}
            className={styles.wrapper}
            style={{backgroundColor: canDrop({id, piecesState}) ? 'green' : (isBlack ? 'black' : 'white')}}>
            {/*{boardState[id] !== 0 ? <Piece id={boardState[id]} pos={id} /> : null}*/}
        </div>);
}

export default DropTarget('piece2square', {
    canDrop: (props, monitor) => {
        let pos = monitor.getItem().pos;
        let ul = pos === props.id + 8 + 1 && !props.piecesState.some(p => p.pos === props.id);
        let ur = pos === props.id + 8 - 1 && !props.piecesState.some(p => p.pos === props.id);
        let bl = pos === props.id - 8 + 1 && !props.piecesState.some(p => p.pos === props.id);
        let br = pos === props.id - 8 - 1 && !props.piecesState.some(p => p.pos === props.id);
        // return ul || ur || bl || br;
        return true;
    },
    drop: (props) => ({ pos: props.id }),
    hover: (props, monitor) => {
        // console.log('hovering');
        if(props.piecesState.find(p => p.id === monitor.getItem().id).pos !== props.id && canDrop(props)) {
            props.movePiece(monitor.getItem().id, props.id)
        }
    },
}, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    // isDragging: monitor.isDragging(),
    monitor,
}))(Square);
