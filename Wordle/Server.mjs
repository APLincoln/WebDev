import express from 'express';
//This is the import of the guess handler
import * as gh from './guessHandler.js';

const word = "hello"
let ans = [0,0,0,0,0];
let guess = ["","","","",""];

const app = express();

app.post('/checkWord', (req, res) => {
    console.log(req);
    //wordChecker(word, guess, ans);
    //res.send(ans);
});

function wordChecker(guess, wordOfDay, ans){
    ans = [0,0,0,0,0];
    let wordOfDay = [word];
    //first check for correct position
    for(let i = 0; i<wordOfDay.length(); i++){
      if(wordOfDay[i] == guess[i]){
        ans[i] = 2;
        wordOfDay[i] = "";
        guess[i] = "";
        }
    }
    //second loop for contains
    for(let i = 0; i<wordOfDay.length(); i++){
    if(guess[i]!= "" && wordOfday.includes(guess[i])){
        ans[i] = 1;
        let char = guess[i];
        let index = wordOfChar.indexOf(char, 0);
        wordOfDay[index] = "";
        guess[i] = "";
        }
    }
    return ans;
  }