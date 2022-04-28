import express from 'express';
import path from 'path';
import cors from 'cors';
import wordFile from './words.js';
//This is the import of the guess handler
import * as gh from './guessHandler.js';
import { stringify } from 'querystring';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
app.use(express.static('Client'));
app.use(cors({origin: "http://localhost:8080/"}))
app.listen(8080);

let words = []
wordFile.forEach(element => {words.push(element.toUpperCase());});
let today = (Math.floor(Date.now()/1000/60/60/24));
let word = wordOfDay(words, today);
let ans = [0,0,0,0,0];
let guess = ["","","","",""];


//Handles the request for the guess to be checked and returns the response
app.post('/wordCheck', express.json(), (req, res) => {
  let result = wordChecker(req.body.guess, word, ans);
  res.setHeader('Content-Type', 'application/json');
  console.log(result);
  res.send(result);
});

//This checks the guess against the word of the day
function wordChecker(guess, word, ans){
    ans = [0,0,0,0,0];
    let wordOfDay = word.split("");

    //This is for the word does not exist in the list of words
    if(words.includes(concatGuess(guess))){

    //first check for characters in correct position
      for(let i = 0; i<wordOfDay.length; i++){
        if(wordOfDay[i] == guess[i]){
          ans[i] = 2;
          wordOfDay[i] = "";
          guess[i] = "";
          }
      }
      //second loop for checking if there are characters in the word but not in correct position
      for(let i = 0; i<wordOfDay.length; i++){
      if(guess[i]!= "" && wordOfDay.includes(guess[i])){
          ans[i] = 1;
          let char = guess[i];
          let index = wordOfDay.indexOf(char, 0);
          wordOfDay[index] = "";
          guess[i] = "";
          }
      }
      return ans;
    }
    else{
      ans=[];
      return ans;
    }
  }

//This sets the word of the day by working out the day from unix milliseconds
//The remainder from dividing the day by list length gives the days index
function wordOfDay(words, today){
  let word = words[(today%words.length)].toUpperCase();
  console.log(word);
  return word;
}

//Makes an array of characters a string
function concatGuess(guess){
  let concatWord = "";
  for(let i = 0; i<guess.length; i++){
    concatWord = concatWord.concat(guess[i]);
  }
  return concatWord;
}

//This checks to see if the day has changed every second
//If the day has changed then it will reset the day value and will reset the word of the day
setInterval(() => {
  var newDate = (Math.floor(Date.now()/1000/60/60/24));
  if (today < newDate){
    today = newDate;
    word = wordOfDay(words, today);
    console.log(word);
    return word, today;
  }}, 1000);