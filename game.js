const words = [
    //Importer une bibliothèque de mots 
];

let currentWord = '';
let guessedLetters = [];
let wrongLetters = [];
let mistakes = 0;
const maxMistakes = 6; // A gérer avec la difficulté

function initGame() {
    currentWord = "TEST"// A gérer avec la difficulté + faire un import de mots;
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

function newGame() {
    initGame();
}

window.addEventListener('load', initGame);
