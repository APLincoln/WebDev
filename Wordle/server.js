import express from 'express';
import path from 'path';
import cors from 'cors';
import words from './words.js';
//This is the import of the guess handler
import * as gh from './guessHandler.js';
import { stringify } from 'querystring';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.static('Client'));
app.use(cors({origin: "http://localhost:8080/"}))
app.listen(8080);

let word = wordOfDay(words);
let ans = [0,0,0,0,0];
let guess = ["","","","",""];

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'Client/index.html'));
});

app.post('/wordCheck', express.json(), (req, res) => {
  let result = wordChecker(req.body.guess, word, ans);
  res.setHeader('Content-Type', 'application/json');
  console.log(result);
  res.send(result);
});

function wordChecker(guess, word, ans){
    ans = [0,0,0,0,0];
    let wordOfDay = word.split("");
    //first check for correct position
    for(let i = 0; i<wordOfDay.length; i++){
      debugger;
      if(wordOfDay[i] == guess[i]){
        ans[i] = 2;
        wordOfDay[i] = "";
        guess[i] = "";
        }
    }
    //second loop for contains
    for(let i = 0; i<wordOfDay.length; i++){
    if(guess[i]!= "" && wordOfDay.includes(guess[i])){
        ans[i] = 1;
        let char = guess[i];
        let index = wordOfDay.indexOf(char, 0);
        wordOfDay[index] = "";
        guess[i] = "";
        }
    }
    console.log(ans);
    return ans;
  }

function wordOfDay(words){
  let word = words[(Math.floor(Math.random()*words.length))].toUpperCase();
  console.log(word);
  return word;
}