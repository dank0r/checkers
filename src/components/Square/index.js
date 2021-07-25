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
    let isChain = false;
    let prevExtended = false;
    if(props.chainDraftHistory?.length >= 2 && [(+8 +1)*2, (+8 -1)*2, (-8 +1)*2, (-8 -1)*2].some(n => piece?.pos + n === props.chainDraftHistory[props.chainDraftHistory.length - 2].find(p => p.id === piece.id).pos)) {
        isChain = true;
        prevExtended = props.id === props.chainDraftHistory[props.chainDraftHistory.length - 2].find(p => p.id === piece.id).pos;
    }
    let start = pos === props.id && !props.piecesState.some(p => p.pos === props.id);
    let ul = props.id % 8 !== 7 && pos === props.id + 8 + 1 && !props.piecesState.some(p => p.pos === props.id);
    let ur = props.id % 8 !== 0 && pos === props.id + 8 - 1 && !props.piecesState.some(p => p.pos === props.id);
    let bl = props.id % 8 !== 7 && pos === props.id - 8 + 1 && !props.piecesState.some(p => p.pos === props.id);
    let br = props.id % 8 !== 0 && pos === props.id - 8 - 1 && !props.piecesState.some(p => p.pos === props.id);
    let ul_extended = props.id % 8 !== 7 && props.id % 8 !== 6 && pos === props.id + (+ 8 + 1)*2 && props.piecesState.some(p => p.pos === props.id + (+ 8 + 1) && p.color !== piece.color) && !props.piecesState.some(p => p.pos === props.id);
    let ur_extended = props.id % 8 !== 0 && props.id % 8 !== 1 && pos === props.id + (+ 8 - 1)*2 && props.piecesState.some(p => p.pos === props.id + (+ 8 - 1) && p.color !== piece.color) && !props.piecesState.some(p => p.pos === props.id);
    let bl_extended = props.id % 8 !== 7 && props.id % 8 !== 6 && pos === props.id + (- 8 + 1)*2 && props.piecesState.some(p => p.pos === props.id + (- 8 + 1) && p.color !== piece.color) && !props.piecesState.some(p => p.pos === props.id);
    let br_extended = props.id % 8 !== 0 && props.id % 8 !== 1 && pos === props.id + (- 8 - 1)*2 && props.piecesState.some(p => p.pos === props.id + (- 8 - 1) && p.color !== piece.color) && !props.piecesState.some(p => p.pos === props.id);
    return (((ul || ur || bl || br) && !isChain) || start || prevExtended || ul_extended || ur_extended || bl_extended || br_extended) && props.piecesState.some(p => p.isDragging);
}

function Square({isBlack, id, movePiece, boardState, piecesState, isOver, connectDropTarget, monitor, isDragging, chainDraftHistory}) {
    // console.log(isDragging);
    return connectDropTarget(
        <div
            ref={connectDropTarget}
            className={styles.wrapper}
            style={{backgroundColor: canDrop({id, piecesState, chainDraftHistory}) ? 'green' : (isBlack ? 'black' : 'white')}}>
            {/*{boardState[id] !== 0 ? <Piece id={boardState[id]} pos={id} /> : null}*/}
        </div>);
}

export default DropTarget('piece2square', {
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
