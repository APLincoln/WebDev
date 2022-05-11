import sqlite3 from 'sqlite3';
import * as sqlite from 'sqlite';
import wordFile from './words.js';


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
  return db.get('SELECT * FROM Words WHERE WordId = ?', id);
}

export async function addWord(word) {
  const db = await dbConn;
  await db.run('INSERT INTO Words (Word) VALUES (?)', [word]);

  return listWords();
}

export async function wordCount(){
  const db = await dbConn;
  return await db.all('SELECT COUNT(*) FROM Words');
}

console.log(await getWord(1));

// let words = []
// wordFile.forEach(element => {words.push(element.toUpperCase());});

// for (let i = 0; i<words.length; i++){
//   await addWord(words[i]);
// }

// console.log(words);