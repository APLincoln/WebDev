# Wordle

## Installation instructions

```shell
npm install
```

```shell
npm start
```

app will run on port 8080.

## Core requirements

The word of the day is selected on start of the server. This is then stored as a global variable on the server side for when the front end sends through a check request using the /wordCheck api end point.

**word checking process:**

- The front end sends the server an array of all the letters the user has guessed.
- This is then iterated through twice firstly to check for letters in the correct position, then to check for letters that still exist in the word. Through this process the letters are removed from the word of the day array and the guess array and a response array is constructed. The response array will respond with 0 as not in word 1 as in word but in wrong place and 2 in correct place.
- This response is sent to front end is then used to colour the keyboard and the letter boxes in the grid

Following this process means that the user will never be able to see the word as the api will only return a response as an integer array.

**Database**
The words list is stored in an sqlite db. There are currently 2499 words in this data base with the list of actual words are also stored in the words2.js file. I chose do all validation for valid words on my database as I felt this would be better for longevity reasons and also allowed me to learn and create my own methods for checking if a word is valid.

**Local Storage**
I chose to use local storage on the users browser to store game information as I felt this was more appropriate than cookies and allowed me more flexibility when storing information for the game

gameState:
| key | Description |
| --- | ----------- |
| currenGuess | This is the current guess the user is on and is used when resuming the game after page reload |
| currentIndex | This is the current index the user is typing on ans is used when resuming game after page reload |
| date | This is the date the local storage is refreshed or initialized in milliseconds divided down to days|
| guesses | All of the guesses the user has created for that day. Is used when reloading game |
| responses | All of the responses from having words checked. Used when reloading the game|
| winStatus| If user has won the game this is used to trigger whether the user can type or not on page reload |

The date is checked every time the user reloads the page and if the day is less than the current day then gameState will be re initialized.

gameStats:
| key | Description |
| --- | ----------- |
| one | How many times user has guessed in one try |
| two | How many times user has guessed in two tries |
| three | How many times user has guessed in one tries |
| four | How many times user has guessed in one tries |
| five | How many times user has guessed in one tries |
| six | How many times user has guessed in one tries |
| winStreak | Users current win steak |
| wins | The total amount of wins. Used to calculate win percentage |
| loses | The total amount of loses. Used to calculate win percentage |

**Files**
| name | Description |
| --- | ----------- |
| server.js | This is the sever and serves client folder and handles checking the word |
| wordService.js | This is the database management service. It has a lot of functions that are used to interact with the database|
| words2.js | This is a list of all the words that are stored in the database and is what was used to populate the database initially|
| words.db | This is the database for the application |
| migrations-sqlite| This is was originally going to be used to migrate information but never got used |
| index.js | Handles all of the interaction with the application |
| renderManager.js | This was created to split functions away from index.js that didn't need to be in index.js |

## Key features

- **Double-tap zoom on ios:** I have double disabled double tap zoom on ios devices as I found this was an issue when testing my application on mobile. I did this using `touch-action: manipulation;`

- **Word Selection:** Word section is done using an algorithm. I first get the day from unix milliseconds. I then divide the day by the length of the list of words as this is shorter than the day. I use the remainder as the word ID.