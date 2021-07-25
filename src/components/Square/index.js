import styles from './index.module.css';

function Square({isBlack}) {
    return (
        <div className={styles.wrapper} style={{backgroundColor: isBlack ? 'black' : 'white'}}>
        </div>
    );
}

export default Square;
