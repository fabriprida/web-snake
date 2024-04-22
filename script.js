const board = document.getElementById('board')
const scoreBoard = document.getElementById('scoreBoard') 
const startButton = document.getElementById('start')
const gameOverSign = document.getElementById('gameOver')


const boardSize = 10;
const gameSpeed = 150;
const squareType = {
    emptySquare: 0,
    snakeSquare: 1,
    foodSquare: 2
} 
const directions = {
    ArrowUp: -10,
    ArrowRight: 1,
    ArrowDown: 10, 
    ArrowLeft: -1
}

//snake = ['00', '01', '02', '03', ...]
let snakeSquares;
let direction;
//boardSquares = [['snakeSquare', 'snakeSquare',...], ..., ['emptySquare', 'emptySquare', ...]]
let boardWithSquareTypes;
let emptySquares;
let moveInterval;


const startGame = () => {
    setUpGameForStarting();
    drawSnake();
    updateScoreInnerText();
    setFood();
    
    document.addEventListener('keydown', processKey);

    moveInterval = setInterval( () => moveSnake(), gameSpeed);
}


const setUpGameForStarting = () => {
    board.innerHTML = '' 
    initializeGameObjects();
    startButton.disabled = true;    
    gameOverSign.style.display = 'none';    

    createDivsForBoard()
}

const createDivsForBoard = () => {
    for (let i = 0; i < boardSize; i++){
        for (let j = 0; j < boardSize; j++){
            const squareDiv = document.createElement('div');
            squareDiv.setAttribute('class', 'square emptySquare');
            squareDiv.setAttribute('id', `${i}${j}`);
            board.appendChild(squareDiv);
        }
    }
}

const initializeGameObjects = () => {
    snakeSquares = ['00', '01', '02', '03'];
    direction = 'ArrowRight'
    initializeBoardSquaresAsEmpty();
    initializeEmptySquares();
}

const initializeBoardSquaresAsEmpty = () => {
    boardWithSquareTypes = [];
    for (let i = 0; i < boardSize; i++){
        let row = [];
        for (let j = 0; j < boardSize; j++){
            row.push(squareType.emptySquare);
        }
        boardWithSquareTypes.push(row)
    }
}

const initializeEmptySquares = () => {
    emptySquares = [];
    for (let i = 0; i < boardSize; i++){
        for (let j = 0; j < boardSize; j++){
            emptySquares.push(`${i}${j}`);
        }
    }
    emptySquares.filter(item => !snakeSquares.includes(item));
}

//---

const drawSnake = () => {
    snakeSquares.forEach(function(square){
        updateBoardSquaresAndDivGivenSquareAndType(square, 'snakeSquare')
    });        
}

const updateBoardSquaresAndDivGivenSquareAndType = (square, type) => {
    const [ i, j ] = square.split('');
    boardWithSquareTypes[i][j] = squareType[type];
    const squareDiv = document.getElementById(square);
    squareDiv.setAttribute('class', `square ${type}`)

    if(type === 'emptySquare') {
        emptySquares.push(square);
    } else {
        if(emptySquares.indexOf(square) !== -1) {
            emptySquares.splice(emptySquares.indexOf(square), 1);
        }
    }
}

//---

const updateScoreInnerText = () => {
    scoreBoard.innerText = snakeSquares.length
}

//---

const setFood = () => {
    randomIndex = Math.floor(Math.random() * emptySquares.length);
    foodSquare = emptySquares[randomIndex];
    emptySquares.splice(randomIndex, 1);
    updateBoardSquaresAndDivGivenSquareAndType(foodSquare, 'foodSquare');
}

//---

const processKey = key => {
    switch(key.code) {
        case 'ArrowUp':
            if (direction != 'ArrowDown')
                direction = 'ArrowUp'
            break;
        case 'ArrowRight':
            if (direction != 'ArrowLeft')
                direction = 'ArrowRight'
            break;
        case 'ArrowDown':
            if (direction != 'ArrowUp')
                direction = 'ArrowDown'
            break;
        case 'ArrowLeft':
            if (direction != 'ArrowRight')
                direction = 'ArrowLeft'
            break;
    }

}

//---

const moveSnake = () => {
    nextPosition = String(Number(snakeSquares[snakeSquares.length - 1]) + directions[direction]).padStart(2, '0');
    snakeSquares.push(nextPosition);
    if (isInvalidPositionForSnake(nextPosition))
        gameOver();
    else {
        if (boardWithSquareTypes[nextPosition[0]][nextPosition[1]] == squareType['foodSquare']){
            setFood();
            updateScoreInnerText();
        }else{
            emptySquare = snakeSquares.shift();
            updateBoardSquaresAndDivGivenSquareAndType(emptySquare, 'emptySquare')
        }
        drawSnake();
    }

        
}

const isInvalidPositionForSnake = (position) => {
    return (nextPosition < 0 || nextPosition >= boardSize * boardSize || 
    direction == 'ArrowRight' && nextPosition[1] == 0 ||
    direction == 'ArrowLeft' && nextPosition[1] == (boardWithSquareTypes.length - 1) || 
    boardWithSquareTypes[nextPosition[0]][nextPosition[1]] == squareType['snakeSquare'])
}

//---

const gameOver = () => {
    gameOverSign.style.display = 'block';
    clearInterval(moveInterval)
    startButton.disabled = false;
}


startButton.addEventListener('click', startGame)
