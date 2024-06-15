const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
const shapesArray = ['circle', 'triangle', 'square', 'star'];
const picturesData = [];

for (let color of colors) {
    for (let shape of shapesArray) {
        picturesData.push({ color, shape });
    }
}

let currentGame = 0;
let results = [];
let score = 0;
let selectedPicture = '';
let attempts = 0;
let totalGames = 5;

function startGame(difficulty) {
    const gameBoard = document.getElementById('game-board');
    const arrowDown = document.getElementById('arrow-down');
    const easyBtn = document.getElementById('easy-btn');
    const sosoBtn = document.getElementById('soso-btn');
    const hardBtn = document.getElementById('hard-btn');
    const resultBoard = document.getElementById('result-board');
    const representativePictureContainer = document.getElementById('representative-picture-container');
    const representativePicture = document.getElementById('representative-picture');

    easyBtn.classList.remove('blink');
    sosoBtn.classList.remove('blink');
    hardBtn.classList.remove('blink');

    if (difficulty === 'easy') {
        arrowDown.style.marginLeft = 'calc(15% - 10px)';
        easyBtn.classList.add('blink');
        gameBoard.style.gridTemplateColumns = 'repeat(3, 1fr)';
        totalGames = 5;
    } else if (difficulty === 'soso') {
        arrowDown.style.marginLeft = 'calc(50% - 10px)';
        sosoBtn.classList.add('blink');
        gameBoard.style.gridTemplateColumns = 'repeat(4, 1fr)';
        totalGames = 7;
    } else if (difficulty === 'hard') {
        arrowDown.style.marginLeft = 'calc(85% - 10px)';
        hardBtn.classList.add('blink');
        gameBoard.style.gridTemplateColumns = 'repeat(4, 1fr)';
        totalGames = 10;
    }

    gameBoard.innerHTML = '';
    resultBoard.style.display = 'none';
    representativePictureContainer.style.display = 'block';
    currentGame = 0;
    results = [];
    score = 0;
    nextRound(difficulty);
}

function nextRound(difficulty) {
    const gameBoard = document.getElementById('game-board');
    const representativePicture = document.getElementById('representative-picture');
    const numCards = difficulty === 'easy' ? 6 : (difficulty === 'soso' ? 8 : 12);
    const numShapes = difficulty === 'easy' ? 1 : (difficulty === 'soso' ? 2 : 4);
    const selectedCard = getRandomPicture(numShapes);
    selectedPicture = selectedCard;
    representativePicture.style.backgroundColor = selectedCard.color;
    representativePicture.dataset.shapes = JSON.stringify(selectedCard.shapes);
    representativePicture.innerHTML = createShapes(selectedCard.shapes);

    let pictures = [selectedCard];
    while (pictures.length < numCards) {
        const randomPicture = getRandomPicture(numShapes);
        if (!pictures.some(picture => picture.color === randomPicture.color && JSON.stringify(picture.shapes) === JSON.stringify(randomPicture.shapes))) {
            pictures.push(randomPicture);
        }
    }

    const shuffledPictures = shuffle(pictures);

    gameBoard.innerHTML = '';
    shuffledPictures.forEach(picture => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.style.backgroundColor = picture.color;
        cardElement.dataset.shapes = JSON.stringify(picture.shapes);
        cardElement.innerHTML = createShapes(picture.shapes);
        cardElement.addEventListener('click', () => selectCard(cardElement, difficulty));
        gameBoard.appendChild(cardElement);
    });
}

function selectCard(card, difficulty) {
    if (card.dataset.shapes === JSON.stringify(selectedPicture.shapes) && card.style.backgroundColor === selectedPicture.color) {
        playClapSound();
        if (attempts === 0) {
            results.push('O');
            score += 2;
        } else {
            results.push('△');
            score += 1;
        }
        setTimeout(() => {
            if (currentGame < totalGames - 1) {
                currentGame++;
                attempts = 0;
                nextRound(difficulty);
            } else {
                showResults();
            }
        }, 1000);
    } else {
        playWrongSound();
        attempts++;
        if (attempts > 1) {
            results.push('X');
            setTimeout(() => {
                if (currentGame < totalGames - 1) {
                    currentGame++;
                    attempts = 0;
                    nextRound(difficulty);
                } else {
                    showResults();
                }
            }, 1000);
        }
    }
}

function showResults() {
    const resultBoard = document.getElementById('result-board');
    resultBoard.innerHTML = `
        <p>Results: ${results.join(', ')}</p>
        <p>Total Score: ${score}</p>
    `;
    resultBoard.style.display = 'block';
    setTimeout(resetGame, 5000);
}

function resetGame() {
    const gameBoard = document.getElementById('game-board');
    const representativePictureContainer = document.getElementById('representative-picture-container');
    const resultBoard = document.getElementById('result-board');
    const arrowDown = document.getElementById('arrow-down');
    const difficulty = document.getElementById('difficulty');
    
    gameBoard.innerHTML = '';
    resultBoard.style.display = 'none';
    representativePictureContainer.style.display = 'none';
    difficulty.style.display = 'flex';
    arrowDown.style.display = 'block';
    
    const easyBtn = document.getElementById('easy-btn');
    const sosoBtn = document.getElementById('soso-btn');
    const hardBtn = document.getElementById('hard-btn');
    easyBtn.classList.remove('blink');
    sosoBtn.classList.remove('blink');
    hardBtn.classList.remove('blink');
}

function playClapSound() {
    const clapSound = document.getElementById('clapSound');
    clapSound.play();
}

function playWrongSound() {
    const wrongSound = document.getElementById('wrongSound');
    wrongSound.play();
}

function getRandomPicture(numShapes) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    let shapes = [];
    for (let i = 0; i < numShapes; i++) {
        const shape = shapesArray[Math.floor(Math.random() * shapesArray.length)];
        const size = Math.floor(Math.random() * 20) + 10;
        shapes.push({ shape, size });
    }
    return { color, shapes };
}

function createShapes(shapes) {
    return shapes.map(shapeObj => {
        switch (shapeObj.shape) {
            case 'circle':
                return `<div style="width: ${shapeObj.size}px; height: ${shapeObj.size}px; border-radius: 50%; background-color: black; margin: 2px;"></div>`;
            case 'triangle':
                return `<div style="width: 0; height: 0; border-left: ${shapeObj.size / 2}px solid transparent; border-right: ${shapeObj.size / 2}px solid transparent; border-bottom: ${shapeObj.size}px solid black; margin: 2px;"></div>`;
            case 'square':
                return `<div style="width: ${shapeObj.size}px; height: ${shapeObj.size}px; background-color: black; margin: 2px;"></div>`;
            case 'star':
                return `<div style="width: 0; height: 0; border-left: ${shapeObj.size / 2}px solid transparent; border-right: ${shapeObj.size / 2}px solid transparent; border-bottom: ${shapeObj.size}px solid black; position: relative; top: -${shapeObj.size / 2}px; margin: 2px;"></div>`;
            default:
                return '';
        }
    }).join('');
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
