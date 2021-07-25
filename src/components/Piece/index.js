import {useState} from 'react';
import styles from './index.module.css';
import {Motion, spring} from 'react-motion';

function Piece({id, pos}) {
    // const [x, setX] = useState(10);
    // setInterval(() => setX(x+10), 1000)
    // console.log(id, pos);
    let x = (pos % 8)*82 + 15;
    let y = Math.floor(pos / 8)*82 + 15;
    // x = 100;
    // y = 100;
    return (
        <Motion style={{x: spring(x), y: spring(y), z: 10}}>
            {({x, y, z}) =>
                <div
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
                </div>
            }
        </Motion>
    );
}

export default Piece;
