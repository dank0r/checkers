import {useState, useEffect} from 'react';
import styles from './index.module.css';
import {Motion, spring} from 'react-motion';
import { DragSource, DropTarget } from 'react-dnd';

function Piece({id, pos, color, isKing, move, isDragging, connectDragSource, connectDropTarget, setDragging, piecesState, whoseMove}) {
    // console.log(isDragging);
    // useEffect(() => {
    //     setDragging(id);
    // }, [isDragging]);
    // const [x, setX] = useState(10);
    // setInterval(() => setX(x+10), 1000)
    // console.log(id, pos);
    let x, y, scale;
    if(pos !== 100 && pos !== 200) {
        x = (pos % 8)*82 + 15;
        y = Math.floor(pos / 8)*82 + 15;
        scale = 1;
    }
    if(pos === 100) {
        x = (piecesState.filter(p => p.pos === 100).map(p => p.id).indexOf(id))*30;
        y = 8*82;
        scale = 0.5;
    }
    if(pos === 200) {
        x = (piecesState.filter(p => p.pos === 200).map(p => p.id).indexOf(id))*30;
        y = -50;
        scale = 0.5;
    }

    // x = 100;
    // y = 100;
    return (<Motion style={{x: spring(x), y: spring(y), scale: spring(scale)}}>
            {({x, y, scale}) =>
                connectDropTarget(connectDragSource(<div
                    className={styles.wrapper}
                    style={{
                        backgroundColor: id > 12 ? 'white' : 'black',
                        borderColor: id > 12 ? 'black' : 'white',
                        cursor: whoseMove === color ? 'grab' : 'not-allowed',
                        // top: `${x}px`,
                        WebkitTransform: `translate3d(${x}px, 0, 0) scale(${scale})`,
                        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
                    }}>
                    <div
                        className={styles.inner}
                        style={{
                            backgroundColor: id > 12 ? 'white' : 'black',
                            borderColor: isKing ? 'red' : (color === 'white' ? 'black' : 'white')
                        }}/>
                </div>))
            }
        </Motion>
    );
}

const Wrapper = DragSource('piece2square', {
    beginDrag: (props) => {
        // console.log('begin');
        props.setDragging(props.id, true);
        // console.log('position:', props.pos);
        return { id: props.id, pos: props.pos };
    },
    canDrag: (props) => {
        return props.whoseMove === props.color;
    },
    endDrag(props, monitor) {
        props.setDragging(props.id, false);
        const item = monitor.getItem();
        const dropResult = monitor.getDropResult();
        if (dropResult) {
                // props.movePiece(monitor.getItem().id, dropResult.pos);
            // alert(`You dropped ${item.id} into ${dropResult.pos}!`);
        }
    },
}, (connect, monitor) => {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    };
})(Piece);

export default DropTarget('piece2square', {},
    (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
}))(Wrapper);