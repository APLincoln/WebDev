import sqlite3 from 'sqlite3';
import * as sqlite from 'sqlite';
import wordFile from './words2.js';


async function init() {
  return new Promise(function(res, rej){
    res(sqlite.open({filename: './words.db', driver: sqlite3.Database}))
  })
};

const dbConn = init();

export async function listWords() {
  const db = await dbConn;
  return db.all('SELECT * FROM Words');
}

export async function getWord(id) {
  const db = await dbConn;
  const word = await db.get('SELECT * FROM Words WHERE WordId = ?', id);
  return Object.values(word)[1];
}

export async function addWord(word) {
  const db = await dbConn;
  await db.run('INSERT INTO Words (Word) VALUES (?)', [word]);
}

export async function isWord(inpWord){
  const db = await dbConn;
  const word = await db.all('SELECT COUNT(*) FROM Words WHERE Word = ?', inpWord);
  let flag = false;
  if((Object.values(word[0])[0])>0){flag = true;};
  return flag;
}

export async function wordCount(){
  const db = await dbConn;
  const count = await db.all('SELECT COUNT(*) FROM Words');
  return Object.values(count[0])[0];
}
// let words = []
// wordFile.forEach(element => {words.push(element.toUpperCase());});

// for (let i = 0; i<words.length; i++){
//   await addWord(words[i]);
// }

console.log();