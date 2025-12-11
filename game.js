import { words, loadWords } from "./words.js";
import removeAccents from "./removeAccent.js";

let currentWord = '';
let guessedLetters = [];
let wrongLetters = [];
let mistakes = 0;
let maxMistakes = 6;

const difficultyLengths = {
    easy: {name: 'Facile', color:'text-green-600', min: 4, max: 6, maxMistakes: 8 },
    medium: {name: 'Moyen', color: 'text-yellow-600', min: 7, max: 10, maxMistakes: 6},
    hard: {name: 'Difficile', color: 'text-red-600', min: 11, max: 100, maxMistakes: 4}
};

function getRandomWordByDifficulty(difficulty) {
    const range = difficultyLengths[difficulty];
    console.log(range);
    const filteredWords = words.filter(word => {
        const cleanWord = removeAccents(word);
        return cleanWord.length >= range.min && cleanWord.length <= range.max;
    });
    
    if (filteredWords.length === 0) {
        console.warn(`Aucun mot trouvé pour la difficulté ${difficulty}`);
        return removeAccents(words[Math.floor(Math.random() * words.length)]);
    }
    
    return removeAccents(filteredWords[Math.floor(Math.random() * filteredWords.length)]);
}

async function initGame(difficulty = null) {
    if (words.length === 0) {
        await loadWords();
    }
    const difficultyParams = difficultyLengths[difficulty];
    maxMistakes = difficultyParams.maxMistakes;
    currentWord = getRandomWordByDifficulty(difficulty);
    guessedLetters = [];
    wrongLetters = [];
    mistakes = 0;
    document.getElementById('message').textContent = '';
    document.getElementById('message').className = '';
    updateDisplay();
    createKeyboard();
}

function createKeyboard() {
    const keyboard = document.getElementById('keyboard');
    keyboard.innerHTML = '';
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    
    letters.forEach(letter => {
        const button = document.createElement('button');
        button.textContent = letter;
        button.className = 'bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-3 rounded transition transform hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed';
        button.onclick = () => guessLetter(letter, button);
        keyboard.appendChild(button);
    });
}

function guessLetter(letter, button) {
    if (guessedLetters.includes(letter) || wrongLetters.includes(letter)) {
        return;
    }

    button.disabled = true;

    if (currentWord.includes(letter)) {
        guessedLetters.push(letter);
    } else {
        wrongLetters.push(letter);
        mistakes++;
    }

    updateDisplay();
    checkGameStatus();
}

function updateDisplay() {
    const display = currentWord
        .split('')
        .map(letter => guessedLetters.includes(letter) ? letter : '_')
        .join(' ');
    document.getElementById('word').textContent = display;

    const uniqueLetters = new Set(currentWord).size;
    document.getElementById('tries').textContent = maxMistakes - mistakes;
    document.getElementById('found-letters').textContent = guessedLetters.length;
    document.getElementById('total-letters').textContent = uniqueLetters;
    document.getElementById('wrong-list').textContent = wrongLetters.length > 0 ? wrongLetters.join(', ') : '-';
}

function checkGameStatus() {
    const wordComplete = currentWord
        .split('')
        .every(letter => guessedLetters.includes(letter));

    if (wordComplete) {
        endGame(true);
    } else if (mistakes >= maxMistakes) {
        endGame(false);
    }
}

function endGame(won) {
    const messageDiv = document.getElementById('message');
    const buttons = document.querySelectorAll('#keyboard button');

    buttons.forEach(button => button.disabled = true);

    if (won) {
        messageDiv.textContent = 'Vous avez gagné!';
        messageDiv.className = 'text-2xl font-bold text-center my-6 min-h-12 p-4 rounded-lg transition-all duration-300 bg-green-100 text-green-700 border-2 border-green-500';
    } else {
        messageDiv.textContent = `Vous avez perdu! Le mot était: ${currentWord}`;
        messageDiv.className = 'text-2xl font-bold text-center my-6 min-h-12 p-4 rounded-lg transition-all duration-300 bg-red-100 text-red-700 border-2 border-red-500';
    }
}

function newGame(difficulty = null) {
    initGame(difficulty);
    const difficultyParams = difficultyLengths[difficulty];
    document.getElementById('difficulty').textContent = `${difficultyParams.name}`;
    document.getElementById('difficulty').classList = `${difficultyParams.color}`;
}

document.getElementById('btneasy').addEventListener('click', () => newGame('easy'));
document.getElementById('btnmedium').addEventListener('click', () => newGame('medium'));
document.getElementById('btnhard').addEventListener('click', () => newGame('hard'));
window.addEventListener('load', initGame);
