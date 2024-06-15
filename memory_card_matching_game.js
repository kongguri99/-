const colorsData = [
    'red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown'
];

let cards = [];
let firstCard, secondCard;
let hasFlippedCard = false;
let lockBoard = false;
let matchedCards = 0;
let clickCount = 0;

function startGame(difficulty) {
    const gameBoard = document.getElementById('game-board');
    const arrowDown = document.getElementById('arrow-down');
    const easyBtn = document.getElementById('easy-btn');
    const sosoBtn = document.getElementById('soso-btn');
    const hardBtn = document.getElementById('hard-btn');
    
    // 모든 버튼에서 깜빡이는 애니메이션 제거
    easyBtn.classList.remove('blink');
    sosoBtn.classList.remove('blink');
    hardBtn.classList.remove('blink');
    
    // 선택한 버튼에 깜빡이는 애니메이션 추가
    if (difficulty === 'easy') {
        arrowDown.style.marginLeft = 'calc(15% - 10px)'; // Easy button position
        easyBtn.classList.add('blink');
        gameBoard.style.gridTemplateColumns = 'repeat(4, 1fr)';
    } else if (difficulty === 'soso') {
        arrowDown.style.marginLeft = 'calc(50% - 10px)'; // Soso button position
        sosoBtn.classList.add('blink');
        gameBoard.style.gridTemplateColumns = 'repeat(4, 1fr)';
    } else if (difficulty === 'hard') {
        arrowDown.style.marginLeft = 'calc(85% - 10px)'; // Hard button position
        hardBtn.classList.add('blink');
        gameBoard.style.gridTemplateColumns = 'repeat(4, 1fr)';
    }

    gameBoard.innerHTML = '';
    matchedCards = 0;
    clickCount = 0;
    updateClickCounter();

    let numPairs;
    if (difficulty === 'easy') {
        numPairs = 4;
    } else if (difficulty === 'soso') {
        numPairs = 6;
    } else if (difficulty === 'hard') {
        numPairs = 8;
    }

    cards = [...colorsData.slice(0, numPairs), ...colorsData.slice(0, numPairs)];
    cards.sort(() => 0.5 - Math.random());

    cards.forEach((color) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.color = color;
        cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-front" style="background-color: ${color};"></div>
                <div class="card-back"></div>
            </div>
        `;
        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');
    clickCount++;
    updateClickCounter();

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;

    checkForMatch();
}

function checkForMatch() {
    if (firstCard.dataset.color === secondCard.dataset.color) {
        disableCards();
        return;
    }

    unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    firstCard.querySelector('.card-inner').classList.add('matched');
    secondCard.querySelector('.card-inner').classList.add('matched');
    resetBoard();
    matchedCards += 2;

    if (matchedCards === cards.length) {
        playClapSound();
        setTimeout(() => {
            alert(`Congratulations! You won!\nTotal Clicks: ${clickCount}`);
            resetGame();
        }, 500);
    }
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1500);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function updateClickCounter() {
    document.getElementById('click-counter').textContent = `Click: ${clickCount} 회`;
}

function playClapSound() {
    const clapSound = document.getElementById('clapSound');
    clapSound.play();
}

function resetGame() {
    setTimeout(() => {
        location.reload();
    }, 1000);
}
