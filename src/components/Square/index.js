import Piece from '../Piece';
import { DropTarget } from 'react-dnd';
import styles from './index.module.css';
import canDrop from '../../utils/canDrop';



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
