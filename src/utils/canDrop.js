export default function canDrop(props) {
    let piece = props.piecesState.find(p => p.isDragging);
    let pos = -1;
    if(!piece?.isKing && [+8 +1, +8 -1, -8 +1, -8 -1].some(n => piece?.pos + n === piece?.startPos)) {
        pos = piece?.startPos;
    } else {
        pos = piece?.pos;
    }
    let isChain = false;
    let prevExtended = false;
    if(props.chainDraftHistory?.length >= 2 && [(+8 +1)*2, (+8 -1)*2, (-8 +1)*2, (-8 -1)*2].some(n => piece?.pos + n === props.chainDraftHistory[props.chainDraftHistory.length - 2].find(p => p.id === piece?.id)?.pos)) {
        isChain = true;
        prevExtended = props.id === props.chainDraftHistory[props.chainDraftHistory.length - 2].find(p => p.id === piece.id).pos;
    }
    let kingDirection = 'no';
    if(piece?.isKing && props.chainDraftHistory?.length >= 2 && [(+8 +1), (+8 -1), (-8 +1), (-8 -1)].some(n => piece?.pos + n === props.chainDraftHistory[props.chainDraftHistory.length - 2].find(p => p.id === piece.id).pos)) {
        if(piece?.pos + (+8 +1) === props.chainDraftHistory[props.chainDraftHistory.length - 2].find(p => p.id === piece.id).pos) {
            kingDirection = 'ul';
        }
        if(piece?.pos + (+8 -1) === props.chainDraftHistory[props.chainDraftHistory.length - 2].find(p => p.id === piece.id).pos) {
            kingDirection = 'ur';
        }
        if(piece?.pos + (-8 +1) === props.chainDraftHistory[props.chainDraftHistory.length - 2].find(p => p.id === piece.id).pos) {
            kingDirection = 'bl';
        }
        if(piece?.pos + (-8 -1) === props.chainDraftHistory[props.chainDraftHistory.length - 2].find(p => p.id === piece.id).pos) {
            kingDirection = 'br';
        }
    }
    if(piece?.isKing && props.chainDraftHistory?.length >= 2 && [(+8 +1)*2, (+8 -1)*2, (-8 +1)*2, (-8 -1)*2].some(n => piece?.pos + n === props.chainDraftHistory[props.chainDraftHistory.length - 2].find(p => p.id === piece.id).pos)) {
        if(piece?.pos + (+8 +1)*2 === props.chainDraftHistory[props.chainDraftHistory.length - 2].find(p => p.id === piece.id).pos) {
            kingDirection = 'ul2';
        }
        if(piece?.pos + (+8 -1)*2 === props.chainDraftHistory[props.chainDraftHistory.length - 2].find(p => p.id === piece.id).pos) {
            kingDirection = 'ur2';
        }
        if(piece?.pos + (-8 +1)*2 === props.chainDraftHistory[props.chainDraftHistory.length - 2].find(p => p.id === piece.id).pos) {
            kingDirection = 'bl2';
        }
        if(piece?.pos + (-8 -1)*2 === props.chainDraftHistory[props.chainDraftHistory.length - 2].find(p => p.id === piece.id).pos) {
            kingDirection = 'br2';
        }
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
    let ul_king = [];
    let ur_king = [];
    let bl_king = [];
    let br_king = [];
    let metPieceOfDifferentColor = false;
    let skippedCaptured = false;
    for(let x = pos%8, y = Math.floor(pos/8); x >= 0 && y >= 0 && x < 8 && y < 8; x--, y--) {
        if(x === pos%8 && y === Math.floor(pos/8)) continue;
        // met piece of same color
        if(props.piecesState.some(p => p.pos === y*8 + x) && props.piecesState.find(p => p.pos === y*8 + x).color === piece?.color) {
            break;
        }
        // met piece of different color
        if(props.piecesState.some(p => p.pos === y*8 + x) && props.piecesState.find(p => p.pos === y*8 + x).color !== piece?.color) {
            metPieceOfDifferentColor = true;
            continue;
        }
        // we don't want recently captured square to be available for king
        if(kingDirection === 'br2' && !skippedCaptured) {
            skippedCaptured = true;
            continue;
        }
        if(metPieceOfDifferentColor) {
            if(!props.piecesState.some(p => p.pos === y*8 + x)) {
                ul_king.push(y*8 + x);
            }
            break;
        }
        if(kingDirection[kingDirection.length-1] !== '2')
            ul_king.push(y*8 + x);
    }
    metPieceOfDifferentColor = false;
    skippedCaptured = false;
    for(let x = pos%8, y = Math.floor(pos/8); x >= 0 && y >= 0 && x < 8 && y < 8; x++, y--) {
        if(x === pos%8 && y === Math.floor(pos/8)) continue;
        // met piece of same color
        if(props.piecesState.some(p => p.pos === y*8 + x) && props.piecesState.find(p => p.pos === y*8 + x).color === piece?.color) {
            break;
        }
        // met piece of different color
        if(props.piecesState.some(p => p.pos === y*8 + x) && props.piecesState.find(p => p.pos === y*8 + x).color !== piece?.color) {
            metPieceOfDifferentColor = true;
            continue;
        }
        // we don't want recently captured square to be available for king
        if(kingDirection === 'bl2' && !skippedCaptured) {
            skippedCaptured = true;
            continue;
        }
        if(metPieceOfDifferentColor) {
            if(!props.piecesState.some(p => p.pos === y*8 + x)) {
                ur_king.push(y*8 + x);
            }
            break;
        }
        if(kingDirection[kingDirection.length-1] !== '2')
            ur_king.push(y*8 + x);
    }
    metPieceOfDifferentColor = false;
    skippedCaptured = false;
    for(let x = pos%8, y = Math.floor(pos/8); x >= 0 && y >= 0 && x < 8 && y < 8; x--, y++) {
        if(x === pos%8 && y === Math.floor(pos/8)) continue;
        // met piece of same color
        if(props.piecesState.some(p => p.pos === y*8 + x) && props.piecesState.find(p => p.pos === y*8 + x).color === piece?.color) {
            break;
        }
        // met piece of different color
        if(props.piecesState.some(p => p.pos === y*8 + x) && props.piecesState.find(p => p.pos === y*8 + x).color !== piece?.color) {
            metPieceOfDifferentColor = true;
            continue;
        }
        // we don't want recently captured square to be available for king
        if(kingDirection === 'ur2' && !skippedCaptured) {
            skippedCaptured = true;
            continue;
        }
        if(metPieceOfDifferentColor) {
            if(!props.piecesState.some(p => p.pos === y*8 + x)) {
                bl_king.push(y*8 + x);
            }
            break;
        }
        if(kingDirection[kingDirection.length-1] !== '2')
            bl_king.push(y*8 + x);
    }
    metPieceOfDifferentColor = false;
    skippedCaptured = false;
    for(let x = pos%8, y = Math.floor(pos/8); x >= 0 && y >= 0 && x < 8 && y < 8; x++, y++) {
        if(x === pos%8 && y === Math.floor(pos/8)) continue;
        // met piece of same color
        if(props.piecesState.some(p => p.pos === y*8 + x) && props.piecesState.find(p => p.pos === y*8 + x).color === piece?.color) {
            break;
        }
        // met piece of different color
        if(props.piecesState.some(p => p.pos === y*8 + x) && props.piecesState.find(p => p.pos === y*8 + x).color !== piece?.color) {
            metPieceOfDifferentColor = true;
            continue;
        }
        // we don't want recently captured square to be available for king
        if(kingDirection === 'ul2' && !skippedCaptured) {
            skippedCaptured = true;
            continue;
        }
        if(metPieceOfDifferentColor) {
            if(!props.piecesState.some(p => p.pos === y*8 + x)) {
                br_king.push(y*8 + x);
            }
            break;
        }
        if(kingDirection[kingDirection.length-1] !== '2')
            br_king.push(y*8 + x);
    }
    let kingAttackCells;
    if(['ul', 'ur', 'bl', 'br'].every(d => d !== kingDirection)) {
        kingAttackCells = ul_king.concat(ur_king).concat(bl_king).concat(br_king);
    }
    if(kingDirection === 'ul') {
        kingAttackCells = ul_king.concat(br_king);
    }
    if(kingDirection === 'ur') {
        kingAttackCells = ur_king.concat(bl_king);
    }
    if(kingDirection === 'bl') {
        kingAttackCells = bl_king.concat(ur_king);
    }
    if(kingDirection === 'br') {
        kingAttackCells = br_king.concat(ul_king);
    }
    let kingAttack = piece?.isKing && kingAttackCells.some(c => c === props.id);
    return (((ul || ur || bl || br) && !isChain && !piece?.isKing) || start || kingAttack || prevExtended || ((ul_extended || ur_extended || bl_extended || br_extended) && !piece?.isKing)) && props.piecesState.some(p => p.isDragging);
}