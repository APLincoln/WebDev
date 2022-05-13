import express from 'express';
// import cors from 'cors';
import * as db from './wordService.js';

// This serves the client folder
const app = express();
app.use(express.static('client'));
// app.use(cors({origin: "http://localhost:8080/"}))
app.listen(8080);

// These are my global values
let today = getToday();
let word;
const ans = [0, 0, 0, 0, 0];
const intervalTime = (86400000 - (Date.now() % 86400000));


// Handles the request for the guess to be checked and returns the response
app.post('/wordCheck', express.json(), async (req, res) => {
  const result = await wordChecker(req.body.guess, word, ans);
  res.setHeader('Content-Type', 'application/json');
  res.send(result);
});

// This checks the guess against the word of the day
async function wordChecker(guess, word, ans) {
  ans = [0, 0, 0, 0, 0];
  const wordOfDay = word.split('');

  // This is for the word does not exist in the list of words
  if (await db.isWord(concatGuess(guess))) {
    // first check for characters in correct position
    for (let i = 0; i < wordOfDay.length; i++) {
      if (wordOfDay[i] === guess[i]) {
        ans[i] = 2;
        wordOfDay[i] = '';
        guess[i] = '';
      }
    }
    // second loop for checking if there are characters in the word but not in correct position
    for (let i = 0; i < wordOfDay.length; i++) {
      if (guess[i] !== '' && wordOfDay.includes(guess[i])) {
        ans[i] = 1;
        const char = guess[i];
        const index = wordOfDay.indexOf(char, 0);
        wordOfDay[index] = '';
        guess[i] = '';
      }
    }
    return ans;
  } else {
    ans = [];
    return ans;
  }
}


// gets today from unix millisecods
function getToday() {
  return (Math.floor(Date.now() / 1000 / 60 / 60 / 24));
}


// This sets the word of the day by working out the day from unix milliseconds
// The remainder from dividing the day by list length gives the days index
async function wordOfDay(today) {
  const words = await db.wordCount();
  const currentWord = (today % words);
  word = await db.getWord(currentWord);
  console.log(word);
  return word;
}
wordOfDay(today);
// Makes an array of characters a string
function concatGuess(guess) {
  let concatWord = '';
  for (let i = 0; i < guess.length; i++) {
    concatWord = concatWord.concat(guess[i]);
  }
  return concatWord;
}


// This function sets the word at midnight every night
// It is called once and then is called recursively
function wordTimer(interval) {
  setTimeout(async () => {
    const timer = (86400000 - (Date.now() % 86400000));
    today = getToday();
    word = await wordOfDay(today);
    console.log(timer, Date.now());
    wordTimer(timer);
  }, interval);
}
wordTimer(intervalTime);
