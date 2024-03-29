// Imports
import { homePage, statsPage } from './renderManager.js';
// Global variables
const key = document.querySelectorAll('.key');
let charIndex = 0; // This is the index for the div that you are typing in
let currentGuess = 0; // This is the current work to be checked // list of checked words. 0=not checked 1=checked
const wordStart = [0, 5, 10, 15, 20, 25];
const wordEnd = [4, 9, 14, 19, 24, 29];
let canType = true; // This boolean is set so the user is allowed to type into the boxes
let currentState = null;
let currentStat = null;
// These are the local storage default objects
const gameStats = {
  one: 0,
  two: 0,
  three: 0,
  four: 0,
  five: 0,
  six: 0,
  wins: 0,
  loses: 0,
  winStreak: 0,

};
const gameState = {
  guesses: ['', '', '', '', '', ''],
  responses: [],
  currentIndex: 0,
  currentGuess: 0,
  date: (Math.floor(Date.now() / 1000 / 60 / 60 / 24)),
  winStatus: false,
};

// Global page elements

const wordGrid = document.getElementById('word_grid');
const enter = document.querySelector('.enter'); // Used for the on-screen keyboard
const back = document.querySelector('.return'); // Used for the on-scree keyboard
const closeModal = document.querySelector('.closeModal');
const statsButton = document.getElementById('statsButton');
const homeButton = document.getElementById('homeButton');

// Event listeners

// This adds event listener to enter
enter.addEventListener('click', () => {
  if (canType) {
    if (charIndex > wordEnd[currentGuess]) {
      const start = wordStart[currentGuess];
      const end = wordEnd[currentGuess];
      const guessArr = getWord(wordStart[currentGuess], wordEnd[currentGuess], wordGrid);
      sendWord(guessArr, start, end, wordGrid);
    } else { console.log('This is not a full word please try again'); }
  }
});

statsButton.addEventListener('click', () => { statsPage(currentStat); });

homeButton.addEventListener('click', () => { homePage(currentStat); });

// This adds event listener to backspace
back.addEventListener('click', () => {
  if (canType) {
    if (charIndex !== wordStart[currentGuess]) {
      if (charIndex <= wordEnd[currentGuess]) {
        wordGrid.children[charIndex].classList.remove('selected-box');
      }
      charIndex--;
      wordGrid.children[charIndex].classList.add('selected-box');
      wordGrid.children[charIndex].textContent = '';
    }
  }
});

closeModal.addEventListener('click', () => {
  homePage(currentStat);
});

window.addEventListener('load', () => {
  localStorageInit();
  currentState = window.JSON.parse(localStorage.getItem('gameState'));
  currentStat = window.JSON.parse(localStorage.getItem('gameStats'));
  resumeGame(currentState);
  if (charIndex < wordGrid.children.length && currentState.winStatus === false) {
    wordGrid.children[charIndex].classList.add('selected-box');
  }
});

// This adds event listeners to all of the keys
for (let i = 0; i < key.length; i++) {
  key[i].addEventListener('click', keyInput);
}

// Functions

// This function checks the local storage is initialized and then adds fields that need adding.
function localStorageInit() {
  if (localStorage.getItem('gameStats') === null) {
    localStorage.setItem('gameStats', JSON.stringify(gameStats));
  }
  const state = window.JSON.parse(localStorage.getItem('gameState'));
  if (state === null || state.date < (Math.floor(Date.now() / 1000 / 60 / 60 / 24))) {
    localStorage.setItem('gameState', JSON.stringify(gameState));
  }
}

// Returs the game to the state it was when the user left
function resumeGame(state) {
  for (let i = 0; i < state.guesses.length; i++) {
    if (state.guesses[i] !== '') {
      setKeyColour(state.guesses[i], state.responses[i]);
      for (let k = 0; k < 5; k++) {
        wordGrid.children[(wordStart[i] + k)].textContent = state.guesses[i][k];
      }
      setColour(wordStart[i], wordEnd[i], wordGrid, state.responses[i]);
    }
  }
  charIndex = state.currentIndex;
  currentGuess = state.currentGuess;
  canType = !state.winStatus;
}

// This changes text content based on key pressed on screen
function keyInput(event) {
  if (canType) {
    const char = event.target.textContent;
    if (charIndex > wordEnd[currentGuess]) {
      console.log('please check word');
      return;
    }
    wordGrid.children[charIndex].textContent = char.toUpperCase();
    wordGrid.children[charIndex].classList.remove('selected-box');
    charIndex += 1;
    if (charIndex <= wordEnd[currentGuess]) {
      wordGrid.children[charIndex].classList.add('selected-box');
    }
  }
}

// This checks an input and returns a string for the switch case
function validKey(a) {
  if (a >= 65 && a < 91) { return 'letter'; } else if (a === 13) { return 'check'; } else if (a === 8) { return 'back'; } else { return 'invalid'; }
}

// This gets the word from the boxes on the word grid and returns as an array
function getWord(start, end, wordGrid) {
  const guessArr = ['', '', '', '', ''];
  for (let i = 0; start <= end; i++) {
    guessArr[i] = wordGrid.children[start].textContent;
    start++;
  }
  return guessArr;
}

// This handles the user keyboard input and manages the game as it progresses
window.onkeydown = function (event) {
  if (canType) {
    switch (validKey(event.keyCode)) {
      case 'letter':
        if (charIndex > wordEnd[currentGuess]) {
          console.log('please check word');
          break;
        }
        wordGrid.children[charIndex].textContent = event.key.toUpperCase();
        wordGrid.children[charIndex].classList.remove('selected-box');
        charIndex += 1;
        if (charIndex <= wordEnd[currentGuess]) {
          wordGrid.children[charIndex].classList.add('selected-box');
        }
        break;
      case 'check':
        if (charIndex > wordEnd[currentGuess]) {
          const start = wordStart[currentGuess];
          const end = wordEnd[currentGuess];
          const guessArr = getWord(wordStart[currentGuess], wordEnd[currentGuess], wordGrid);
          sendWord(guessArr, start, end, currentState, canType);
        } else { console.log('This is not a full word please try again'); }
        break;
      case 'back':
        if (charIndex !== wordStart[currentGuess]) {
          if (charIndex <= wordEnd[currentGuess]) {
            wordGrid.children[charIndex].classList.remove('selected-box');
          }
          charIndex--;
          wordGrid.children[charIndex].classList.add('selected-box');
          wordGrid.children[charIndex].textContent = '';
        }
        break;
      case 'invalid':
        console.log('this is an invalid key');
        break;
    }
  }
};


// This sets the colour of the letter boxes depending on location in the actual word
function setColour(start, end, wordGrid, letterPos) {
  for (let i = 0; start <= end; i++) {
    switch (letterPos[i]) {
      case 2:
        wordGrid.children[start].classList.add('green-box');
        wordGrid.children[start].classList.add('letter-box-flip');
        start++;
        break;
      case 1:
        wordGrid.children[start].classList.add('orange-box');
        wordGrid.children[start].classList.add('letter-box-flip');
        start++;
        break;
      default:
        wordGrid.children[start].classList.add('content-flip');
        wordGrid.children[start].classList.add('letter-box-flip');
        start++;
        break;
    }
  }
}

// This function sends word to the server and returns the response
async function sendWord(word, start, end) {
  const payload = { guess: word };
  const response = await fetch('/wordCheck', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    const data = await response.json();
    const count = data.filter(obj => obj === 2).length;
    if (data.length < 1) {
      notAWord();
      for (let i = wordStart[currentGuess]; i <= wordEnd[currentGuess]; i++) {
        wordGrid.children[i].classList.add('wrong-shake');
      }
      setTimeout(() => {
        for (let i = wordStart[currentGuess]; i <= wordEnd[currentGuess]; i++) {
          wordGrid.children[i].classList.remove('wrong-shake');
        }
      }, 1000);
    } else if (count === 5) {
      setStats(0);
      setKeyColour(word, data);
      winner(start, end, wordGrid, data);
      setStates(word, currentGuess + 1, data, currentGuess);
    } else if (currentGuess === 5) {
      currentStat.winStreak = 0;
      currentStat.loses = currentStat.loses + 1;
      localStorage.setItem('gameStats', JSON.stringify(currentStat));
      notWinner(start, end, wordGrid, data);
      setStates(word, currentGuess, data, currentGuess);
      statsPage(currentStat);
    } else {
      notWinner(start, end, wordGrid, data);
      setKeyColour(word, data);
      setStates(word, currentGuess, data, currentGuess);
    }
  }
}

function setKeyColour(guess, response) {
  for (let i = 0; i < guess.length; i++) {
    const letter = guess[i].toLowerCase();
    const key = document.getElementById(letter);
    switch (response[i]) {
      case 0: key.classList.add('grey-key'); break;
      case 1: key.classList.add('orange-key'); break;
      case 2: key.classList.add('green-key'); break;
    }
  }
}

// This function handles saving the states to the users local browser storage
function setStates(word, currentGuess, response) {
  currentState.guesses[currentGuess - 1] = word;
  currentState.currentGuess = currentGuess;
  currentState.responses.push(response);
  currentState.currentIndex = wordStart[currentGuess];
  localStorage.setItem('gameState', JSON.stringify(currentState));
}

// Sets the users stats when they guess correct
function setStats() {
  switch (currentGuess) {
    case 0:
      currentStat.one += 1;
      currentStat.winStreak += 1;
      break;
    case 1:
      currentStat.two += 1;
      currentStat.winStreak += 1;
      break;
    case 2:
      currentStat.three += 1;
      currentStat.winStreak += 1;

      break;
    case 3:
      currentStat.four += 1;
      currentStat.winStreak += 1;
      break;
    case 4:
      currentStat.five += 1;
      currentStat.winStreak += 1;
      break;
    case 5:
      currentStat.six += 1;
      currentStat.winStreak += 1;
      break;
  }
  localStorage.setItem('gameStats', JSON.stringify(currentStat));
}

// This is used if the user guesses the word correctly
function winner(start, end, wordGrid, data) {
  setColour(start, end, wordGrid, data);
  console.log('Winner!');
  statsPage(currentStat);
  const wins = currentStat.wins + 1;
  currentState.winStatus = true;
  currentStat.wins = wins;
  localStorage.setItem('gameState', JSON.stringify(currentState));
  localStorage.setItem('gameStats', JSON.stringify(currentStat));
  canType = false;
  return canType;
}

// This is used if the word is valid but not correct
function notWinner(start, end, wordGrid, data) {
  setColour(start, end, wordGrid, data);
  currentGuess++;
  console.log('word checked');
  if (charIndex <= wordEnd[currentGuess]) {
    wordGrid.children[charIndex].classList.add('selected-box');
  }
}

// This is used if word is not a word in the list
function notAWord() {
  console.log('word is not in list');
  const notif = document.querySelector('.notif');
  notif.textContent = 'Not a word';
  notif.classList.remove('fade-out');
  notif.className += ' fade-in';
  setTimeout(() => {
    notif.classList.remove('fade-in');
    notif.className += ' fade-out';
  }, 1200);
}
