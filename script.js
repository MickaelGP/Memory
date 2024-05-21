const cards = [
    'https://picsum.photos/id/237/100/100',
    'https://picsum.photos/id/238/100/100',
    'https://picsum.photos/id/239/100/100',
    'https://picsum.photos/id/240/100/100',
    'https://picsum.photos/id/241/100/100',
    'https://picsum.photos/id/242/100/100',
    'https://picsum.photos/id/243/100/100',
    'https://picsum.photos/id/244/100/100'
];
const gameBoard = document.getElementById('game-board');
const resetGameButton = document.getElementById('resetGame');
const timerDisplay = document.getElementById('timer');
let selectedCards = [];
let clicksDisabled = false;
let timer;
let startTime;
let elapsedTime = 0;

function createCard(cardUrl) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.value = cardUrl;

    const cardContent = document.createElement('img');
    cardContent.classList.add('card-content');
    cardContent.src = cardUrl;

    card.appendChild(cardContent);

    card.addEventListener('click', onCardClick);
    return card;
}

function duplicateArray(arraySimple) {
    let arrayDouble = [];
    arrayDouble.push(...arraySimple);
    arrayDouble.push(...arraySimple);

    return arrayDouble;
}

function shuffleArray(arrayToshuffle) {
    const arrayShuffled = arrayToshuffle.sort(() => 0.5 - Math.random());
    return arrayShuffled;
}

function startTimer() {
    startTime = Date.now();
    timer = setInterval(() => {
        elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        timerDisplay.textContent = `Temps: ${elapsedTime}s`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

function onCardClick(e) {
    if (clicksDisabled) return;

    const card = e.target.parentElement;

    if (selectedCards.includes(card)) return;

    card.classList.add('flip');
    selectedCards.push(card);

    if (selectedCards.length == 2) {
        clicksDisabled = true;
        setTimeout(() => {
            if (selectedCards[0].dataset.value == selectedCards[1].dataset.value) {
                // on a trouvé une paire
                selectedCards[0].classList.add("matched");
                selectedCards[1].classList.add("matched");
                selectedCards[0].removeEventListener('click', onCardClick);
                selectedCards[1].removeEventListener('click', onCardClick);

                const allCardsNotMatched = document.querySelectorAll('.card:not(.matched)');
                if (allCardsNotMatched.length == 0) {
                    // Le joueur a gagné
                    stopTimer();
                    alert(`Bravo, vous avez gagné en ${elapsedTime} secondes!`);
                    saveScore(elapsedTime);
                    displayScores();
                }
            } else {
                // on s'est trompé
                selectedCards[0].classList.remove("flip");
                selectedCards[1].classList.remove("flip");
            }
            selectedCards = [];
            clicksDisabled = false;
        }, 1000);
    }
}

function initializeGame() {
    gameBoard.innerHTML = '';
    let allCards = duplicateArray(cards);
    allCards = shuffleArray(allCards);
    allCards.forEach(cardUrl => {
        const cardHtml = createCard(cardUrl);
        gameBoard.appendChild(cardHtml);
    });
    startTimer();
    timerDisplay.textContent = "Temps: 0s";
    elapsedTime = 0;
}

function saveScore(score) {
    let scores = getCookie("scores");
    if (scores) {
        scores = JSON.parse(scores);
    } else {
        scores = [];
    }
    scores.push(score);
    setCookie("scores", JSON.stringify(scores), 365);
}

function displayScores() {
    let scores = getCookie("scores");
    if (scores) {
        scores = JSON.parse(scores);
        const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        const bestScore = Math.min(...scores);
        alert(`Votre score moyen est de ${averageScore.toFixed(2)} secondes. Votre meilleur score est de ${bestScore} secondes.`);
    } else {
        alert("Aucun score enregistré pour l'instant.");
    }
}


resetGameButton.addEventListener('click', function () {
    selectedCards = [];
    clicksDisabled = false;
    stopTimer();
    initializeGame();
});


initializeGame();
displayScores();


function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
