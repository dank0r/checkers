import {useState, useEffect} from 'react';
import styles from './index.module.css';
import {Motion, spring} from 'react-motion';
import { DragSource, DropTarget } from 'react-dnd';

function Piece({id, pos, move, isDragging, connectDragSource, connectDropTarget, setDragging}) {
    console.log(isDragging);
    // useEffect(() => {
    //     setDragging(id);
    // }, [isDragging]);
    // const [x, setX] = useState(10);
    // setInterval(() => setX(x+10), 1000)
    // console.log(id, pos);
    let x = (pos % 8)*82 + 15;
    let y = Math.floor(pos / 8)*82 + 15;
    // x = 100;
    // y = 100;
    return (<Motion style={{x: spring(x), y: spring(y), z: 10}}>
            {({x, y, z}) =>
                connectDropTarget(connectDragSource(<div
                    className={styles.wrapper}
                    style={{
                        backgroundColor: id > 12 ? 'white' : 'black',
                        borderColor: id > 12 ? 'black' : 'white',
                        // top: `${x}px`,
                        WebkitTransform: `translate3d(${x}px, 0, 0)`,
                        transform: `translate3d(${x}px, ${y}px, 0)`,
                    }}>
                    <div
                        className={styles.inner}
                        style={{
                            backgroundColor: id > 12 ? 'white' : 'black',
                            borderColor: id > 12 ? 'black' : 'white'
                        }}/>
                </div>))
            }
        </Motion>
    );
}

const Wrapper = DragSource('piece2square', {
    beginDrag: (props) => {
        console.log('begin');
        props.setDragging(props.id, true);
        console.log('position:', props.pos);
        return { id: props.id, pos: props.pos };
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