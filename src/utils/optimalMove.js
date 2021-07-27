import canDrop from './canDrop';

function getListOfAvailableMoves(props) {
    let res = [];
    for(let i = 0; i < 64; i++) {
        if(canDrop({...props, id: i})) {
            res.push(i);
        }
    }
    return res;
}

function setDragging(id, val, piecesState, chainDraftHistory) {
    // let piecesState = piecesStateRef.current;
    // let chainDraftHistory = chainDraftHistoryRef.current;
    // console.log(`setDragging(${id}, ${val})`);
    // console.log('chainDraftHistory', chainDraftHistory.length);
    let newPiecesState = piecesState.map(p => p.id === id ? {...p, isDragging: val, startPos: val ? p.startPos : p.pos} : p);
    chainDraftHistory = chainDraftHistory.map((h, i) => i === chainDraftHistory.length - 1 ? newPiecesState : h);
    if(val === false && chainDraftHistory.length > 1) {
        console.log('end move');
        chainDraftHistory = [newPiecesState];
        // setWhoseMove(whoseMove === 'white' ? 'black' : 'white');
    }
    piecesState = chainDraftHistory[chainDraftHistory.length - 1];
    return [piecesState, chainDraftHistory];
}

function movePiece(id, pos, piecesState, chainDraftHistory) {
    // let piecesState = piecesStateRef.current;
    // let chainDraftHistory = chainDraftHistoryRef.current;
    console.log('input piecesState:', piecesState);
    let newPiecesState = piecesState.map(p => p.id === id ? {...p, pos, isDragging: true} : p);
    // decompose king's path into simple paths of size 1 (or 2 when capturing)
    // if(piecesState.find(p => p.id === id).isKing && mode !== 'atomic') {
    //     let xFrom = piecesState.find(p => p.id === id).pos % 8;
    //     let yFrom = Math.floor(piecesState.find(p => p.id === id).pos / 8);
    //     let xTo = pos % 8;
    //     let yTo = Math.floor(pos / 8);
    //     let dx = Math.sign(xTo - xFrom);
    //     let dy = Math.sign(yTo - yFrom);
    //     let t = 0;
    //     console.log('xFrom:', xFrom);
    //     console.log('yFrom:', yFrom);
    //     console.log('xTo:', xTo);
    //     console.log('yTo:', yTo);
    //     console.log('dx:', dx);
    //     console.log('dy:', dy);
    //     for(let x = xFrom+dx, y = yFrom+dy; x*dx <= xTo*dx && y*dy <= yTo*dy; x += dx, y += dy) {
    //         // console.log('canDrop:', canDrop({id: y*8 + x, piecesState, chainDraftHistory}));
    //         // console.log('x', x);
    //         // console.log('y', y);
    //         if(canDrop({id: y*8 + x, piecesState, chainDraftHistory})) {
    //             console.log('seq:', x, y);
    //             movePiece(id, y*8 + x, 'atomic');
    //             t++;
    //         }
    //     }
    //     return;
    // }
    if(newPiecesState.every(p => !p.isDragging)) {
        console.log('some shit happened');
    }
    // if this draft move is extended
    if([(+8 +1)*2, (+8 -1)*2, (-8 +1)*2, (-8 -1)*2].some(n => pos + n === piecesState.find(p => p.id === id).pos)) {
        if(pos + (+8 +1)*2 === piecesState.find(p => p.id === id).pos) {
            newPiecesState = newPiecesState.map(p => p.pos === pos + (+8 +1) ? {...p, pos: p.color === 'black' ? 100 : 200} : p)
        }
        if(pos + (+8 -1)*2 === piecesState.find(p => p.id === id).pos) {
            newPiecesState = newPiecesState.map(p => p.pos === pos + (+8 -1) ? {...p, pos: p.color === 'black' ? 100 : 200} : p)
        }
        if(pos + (-8 +1)*2 === piecesState.find(p => p.id === id).pos) {
            newPiecesState = newPiecesState.map(p => p.pos === pos + (-8 +1) ? {...p, pos: p.color === 'black' ? 100 : 200} : p)
        }
        if(pos + (-8 -1)*2 === piecesState.find(p => p.id === id).pos) {
            newPiecesState = newPiecesState.map(p => p.pos === pos + (-8 -1) ? {...p, pos: p.color === 'black' ? 100 : 200} : p)
        }
    }

    if(piecesState.find(p => p.id === id).color === 'black' && pos >= 56 && pos <= 63) {
        newPiecesState = newPiecesState.map(p => p.id === id ? {...p, isKing: true} : p);
    }
    if(piecesState.find(p => p.id === id).color === 'white' && pos >= 0 && pos <= 7) {
        newPiecesState = newPiecesState.map(p => p.id === id ? {...p, isKing: true} : p);
    }
    // if this draft move is rollback to the previous
    if(chainDraftHistory.length >= 2 && chainDraftHistory[chainDraftHistory.length - 2].find(p => p.id === id).pos === pos) {
        chainDraftHistory = chainDraftHistory.slice(0, -1);
    } else {
        console.log('so ok, concat happened');
        chainDraftHistory = chainDraftHistory.concat([newPiecesState]);
    }
    piecesState = chainDraftHistory[chainDraftHistory.length - 1];
    return [piecesState, chainDraftHistory];


    // if this draft move is extended
    // if([(+8 +1)*2, (+8 -1)*2, (-8 +1)*2, (-8 -1)*2].some(n => pos + n === piecesState.find(p => p.id === id).pos)) {
    //     console.log('extended!!!')
    //     // if this draft move is rollback to the previous
    //     if(chainDraftHistory.length >= 2 && chainDraftHistory[chainDraftHistory.length - 2].find(p => p.id === id).pos === pos) {
    //         setChainDraftHistory(chainDraftHistory.slice(0, -1));
    //     } else {
    //         setChainDraftHistory(chainDraftHistory.concat([newPiecesState]));
    //     }
    // } else {
    //     setChainDraftHistory(chainDraftHistory.concat([newPiecesState]));
    // }

}

function exploreDragging(piecesState, chainDraftHistory) {
    let availableMoves = getListOfAvailableMoves({piecesState, chainDraftHistory});

    // console.log('optimalMove::piecesState:', piecesState);
    let piece = piecesState.find(p => p.isDragging);
    //first in br direction
    let first_br = -1;
    for(let x = piece.pos % 8, y = Math.floor(piece.pos / 8); x >= 0 && x <= 7 && y >=0 && y <= 7; x++, y++) {
        // console.log('piece.pos:', piece.pos);
        // console.log('x:', x);
        // console.log('y:', y);
        // console.log('y*8 + x', y*8 + x);
        // console.log('avl Moves:', availableMoves);
        if(x === piece.pos % 8 && y === Math.floor(x / 8)) {continue;}
        if(availableMoves.some(m => m === y*8 + x)) {
            first_br = y*8 + x;
            break;
        }
    }
    //first in ur direction
    let first_ur = -1;
    for(let x = piece.pos % 8, y = Math.floor(piece.pos / 8); x >= 0 && x <= 7 && y >=0 && y <= 7; x++, y--) {
        if(x === piece.pos % 8 && y === Math.floor(x / 8)) {continue;}
        if(availableMoves.some(m => m === y*8 + x)) {
            first_ur = y*8 + x;
            break;
        }
    }
    //first in bl direction
    let first_bl = -1;
    for(let x = piece.pos % 8, y = Math.floor(piece.pos / 8); x >= 0 && x <= 7 && y >=0 && y <= 7; x--, y++) {
        if(x === piece.pos % 8 && y === Math.floor(x / 8)) {continue;}
        if(availableMoves.some(m => m === y*8 + x)) {
            first_bl = y*8 + x;
            break;
        }
    }
    //first in ul direction
    let first_ul = -1;
    for(let x = piece.pos % 8, y = Math.floor(piece.pos / 8); x >= 0 && x <= 7 && y >=0 && y <= 7; x--, y--) {
        if(x === piece.pos % 8 && y === Math.floor(x / 8)) {continue;}
        if(availableMoves.some(m => m === y*8 + x)) {
            first_ul = y*8 + x;
            break;
        }
    }
    let chains = [];
    if(first_br !== -1) {
        let piecesStateCopy = piecesState.map(p => ({...p}));
        let chainDraftHistoryCopy = chainDraftHistory.map(s => s.map(p => ({...p})));
        [piecesStateCopy, chainDraftHistoryCopy] = movePiece(piece.id, first_br, piecesStateCopy, chainDraftHistoryCopy);
        if(chainDraftHistoryCopy.length > chainDraftHistory.length) {
            chains = chains.concat(exploreDragging(piecesStateCopy, chainDraftHistoryCopy));
        }
    }
    if(first_ur !== -1) {
        let piecesStateCopy = piecesState.map(p => ({...p}));
        let chainDraftHistoryCopy = chainDraftHistory.map(s => s.map(p => ({...p})));
        [piecesStateCopy, chainDraftHistoryCopy] = movePiece(piece.id, first_ur, piecesStateCopy, chainDraftHistoryCopy);
        if(chainDraftHistoryCopy.length > chainDraftHistory.length) {
            chains = chains.concat(exploreDragging(piecesStateCopy, chainDraftHistoryCopy));
        }
    }
    if(first_bl !== -1) {
        let piecesStateCopy = piecesState.map(p => ({...p}));
        let chainDraftHistoryCopy = chainDraftHistory.map(s => s.map(p => ({...p})));
        [piecesStateCopy, chainDraftHistoryCopy] = movePiece(piece.id, first_bl, piecesStateCopy, chainDraftHistoryCopy);
        if(chainDraftHistoryCopy.length > chainDraftHistory.length) {
            chains = chains.concat(exploreDragging(piecesStateCopy, chainDraftHistoryCopy));
        }
    }
    if(first_ul !== -1) {
        let piecesStateCopy = piecesState.map(p => ({...p}));
        let chainDraftHistoryCopy = chainDraftHistory.map(s => s.map(p => ({...p})));
        [piecesStateCopy, chainDraftHistoryCopy] = movePiece(piece.id, first_ul, piecesStateCopy, chainDraftHistoryCopy);
        if(chainDraftHistoryCopy.length > chainDraftHistory.length) {
            chains = chains.concat(exploreDragging(piecesStateCopy, chainDraftHistoryCopy));
        }
    }
    //not allowed to stay in one place
    if(chainDraftHistory.length > 1) {
        let piecesStateCopy = piecesState.map(p => ({...p}));
        let chainDraftHistoryCopy = chainDraftHistory.map(s => s.map(p => ({...p})));
        setDragging(piece.id, false, piecesStateCopy, chainDraftHistoryCopy);
        // score if we play for black pieces
        // let blackScore = piecesStateCopy.count(p => p.pos === 200) - piecesStateCopy.count(p => p.pos === 100);
        chains = chains.concat([{
            piecesState: piecesStateCopy,
            chainDraftHistory: chainDraftHistoryCopy,
            chain: [],
        }]);
    }
    // console.log('first_br:', first_br);
    // console.log('first_bl:', first_bl);
    // console.log('first_ur:', first_ur);
    // console.log('first_ul:', first_ul);
    chains = chains.map(c => ({...c, chain: [piecesState.find(p => p.id === piece.id).pos].concat(c.chain)}));

    return chains;
}

function blackScore(piecesState) {
    return piecesState.filter(p => p.pos === 200).length - piecesState.filter(p => p.pos === 100).length;
}

export default function optimalMove(piecesState, chainDraftHistory, whoseMove, difficulty=1) {
    // consider all drafts
    let ourPieces = piecesState.filter(p => p.color === whoseMove);
    let opponentsPieces = piecesState.filter(p => p.color !== whoseMove);
    let moves = [];
    for(let i = 0; i < ourPieces.length; i++) {
        let piece = ourPieces[i];
        let piecesStateCopy = piecesState.map(p => ({...p}));
        let chainDraftHistoryCopy = chainDraftHistory.map(s => s.map(p => ({...p})));
        [piecesStateCopy, chainDraftHistoryCopy] = setDragging(piece.id, true, piecesStateCopy, chainDraftHistoryCopy);
        let chains = exploreDragging(piecesStateCopy, chainDraftHistoryCopy);
        moves = moves.concat(chains);
    }
    if(difficulty === 1) {
        moves.sort((a, b) => blackScore(a.piecesState) - blackScore(b.piecesState));
        console.log('bestMoves:', moves);
        let best = null;
        if(whoseMove === 'black') {
            best = moves[moves.length - 1];
        } else {
            best = moves[0];
        }
        return best;
    } else {
        let highestScore = -100;
        let highestScore_j = -1;
        for(let j = 0; j < moves.length; j++) {
            let bestOpponentsMove = optimalMove(moves[j].piecesState, moves[j].chainDraftHistory, whoseMove === 'black' ? 'white' : 'black', difficulty-1);
            let score = whoseMove === 'black' ? blackScore(bestOpponentsMove.piecesState) : -blackScore(bestOpponentsMove.piecesState);
            if(score > highestScore) {
                highestScore = score;
                highestScore_j = j;
            }
        }
        return moves[highestScore_j];
    }

}