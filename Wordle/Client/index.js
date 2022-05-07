//Imports

//Global variables
let key = document.querySelectorAll('.key');
let charIndex = 0; //This is the index for the div that you are typing in
let currentGuess = 0; // This is the current work to be checked // list of checked words. 0=not checked 1=checked
const wordStart = [0,5,10,15,20,25];
const wordEnd = [4,9,14,19,24,29];
let canType = true; //This boolean is set so the user is allowed to type into the boxes
let currentState = null;
let currentStat = null;
//These are the local storage default objects
const gameStats = {
    one: 0,
    two: 0,
    three: 0,
    four: 0,
    five: 0,
    six: 0,
    wins: 0,
    loses: 0,
    winStreak: 0

}
const gameState = {
    guesses : ["","","","","",""],
    responses : [],
    currentIndex: 0,
    currentGuess: 0,
    date: (Math.floor(Date.now()/1000/60/60/24)),
    winStatus: false
}

//Global page elements

const wordGrid = document.getElementById('word_grid');
const enter = document.querySelector('.enter'); //Used for the on-screen keyboard
const back = document.querySelector('.return'); //Used for the on-scree keyboard
const closeModal = document.querySelector('.closeModal');
const statsButton = document.getElementById('statsButton');
const homeButton = document.getElementById('homeButton');

//Event listeners

//This adds event listener to enter
enter.addEventListener('click', (event) => {
    if(canType){
    if(charIndex > wordEnd[currentGuess]){
        let start = wordStart[currentGuess];
        let end = wordEnd[currentGuess];
        let guessArr = getWord(wordStart[currentGuess], wordEnd[currentGuess], wordGrid);
        sendWord(guessArr, start, end, wordGrid);
    }
    else {console.log("This is not a full word please try again");}
}})

statsButton.addEventListener('click', () => {statsPage();});

homeButton.addEventListener('click', () => {homePage();});

// This adds event listener to backspace
back.addEventListener('click', (event) => {
    if(canType){
    if(charIndex != wordStart[currentGuess]){
        charIndex --
        wordGrid.children[charIndex].textContent = "";
    }
}})

closeModal.addEventListener('click', () => {
    homePage();
})

window.addEventListener('load', () => {
    localStorageInit();
    currentState = window.JSON.parse(localStorage.getItem('gameState'));
    currentStat = window.JSON.parse(localStorage.getItem('gameStats'));
    resumeGame(currentState);
})

//This adds event listeners to all of the keys
for(let i = 0; i<key.length; i++){
    key[i].addEventListener('click', keyInput)
}

//Functions

//This function checks the local storage is initialized and then adds fields that need adding.
function localStorageInit(){
    if (localStorage.getItem('gameStats') === null){
        localStorage.setItem('gameStats', JSON.stringify(gameStats))
    }
    state = window.JSON.parse(localStorage.getItem('gameState'));
    if (state === null || state.date < (Math.floor(Date.now()/1000/60/60/24))){
        localStorage.setItem('gameState', JSON.stringify(gameState))
    }

}

//Returs the game to the state it was when the user left
function resumeGame(state){
    for(let i = 0; i<state.guesses.length; i++){
        if(state.guesses[i] != ""){
            setKeyColour(state.guesses[i], state.responses[i])
            for(let k = 0, j = 5*i; j<(wordEnd[i]+1); j++, k++){
                wordGrid.children[j].textContent = state.guesses[i][k];
         }
         setColour(wordStart[i], wordEnd[i], wordGrid, state.responses[i]);
        }
    }
    charIndex = state.currentIndex
    currentGuess  = state.currentGuess
    canType = !state.winStatus
}

//This changes text content based on key pressed on screen
function keyInput(event){
    if(canType){
    let char = event.target.textContent;
    if(charIndex > wordEnd[currentGuess]){
        console.log("please check word");
        return;
    }
    wordGrid.children[charIndex].textContent = char.toUpperCase();
    charIndex += 1;
}}

//This checks an input and returns a string for the switch case
function validKey(a){
    if (a>=65 && a<91){return "letter";}
    else if (a == 13){return "check";}
    else if (a == 8){return "back";}
    else {return "invalid";}
}

//This gets the word from the boxes on the word grid and returns as an array
function getWord(start, end, wordGrid){
    guessArr = ["","","","",""];
    for(let i = 0; start<=end; i++){
        guessArr[i] = wordGrid.children[start].textContent;
            start++;
        }
        return guessArr;
    }

//This handles the user keyboard input and manages the game as it progresses
window.onkeydown = function(event){
    if (canType){
    switch(validKey(event.keyCode)){
        case "letter":
            if(charIndex > wordEnd[currentGuess]){
                console.log("please check word");
                break;}
            wordGrid.children[charIndex].textContent = event.key.toUpperCase();
            charIndex += 1;
            break;
        case "check":
            if(charIndex > wordEnd[currentGuess]){
                let start = wordStart[currentGuess];
                let end = wordEnd[currentGuess];
                let guessArr = getWord(wordStart[currentGuess], wordEnd[currentGuess], wordGrid);
                sendWord(guessArr, start, end, currentState, canType);
            }
            else {console.log("This is not a full word please try again");}
            break;
        case "back":
            if(charIndex != wordStart[currentGuess]){
                charIndex --
                wordGrid.children[charIndex].textContent = "";
            }
            break;
        case "invalid":
            console.log("this is an invalid key");
            break;
    }
}
}


//This sets the colour of the letter boxes depending on location in the actual word
function setColour(start, end, wordGrid, letterPos){
    for(let i = 0; start<=end; i++){
        switch (letterPos[i]){
            case 2:
                wordGrid.children[start].classList.add("green-box");
                start++;
                break;
            case 1:
                wordGrid.children[start].classList.add("orange-box");
                start++;
                break;
            default:
                start++;
                break;
        }
    }
}

//This function sends word to the server and returns the response
async function sendWord(word, start, end, currentState,canType){
    const payload = { guess: word };
    const response = await fetch( 'http://localhost:8080/wordCheck' , {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
    });

    if(response.ok){
        data = await response.json();
        const count = data.filter(obj => obj == 2).length;
        if(data.length<1){
            notAWord();
        }
        else if(count == 5){
            setStats(0);
            setKeyColour(word, data);
            winner(start, end, wordGrid, data);
            setStates(word, currentGuess+1, data, currentGuess);
        }
        else if (currentGuess == 5){
            currentStat.winStreak = 0;
            currentStat.loses = currentStat.loses + 1;
            localStorage.setItem("gameStats",JSON.stringify(currentStat));
            notWinner(start, end, wordGrid, data);
            setStates(word, currentGuess, data, currentGuess);
            canType = false;
            statsPage();
        }
        else{
            notWinner(start, end, wordGrid, data);
            setKeyColour(word, data);
            setStates(word, currentGuess, data, currentGuess);
        }
    }
    else{}
}

function setKeyColour(guess, response){
    for(let i = 0; i<guess.length; i++){
        let letter =  guess[i].toLowerCase();
        let key = document.getElementById(letter);
        switch(response[i]){
            case 0: key.classList.add("grey-key"); break;
            case 1: key.classList.add("orange-key"); break;
            case 2: key.classList.add("green-key"); break;
        }
    }
}

//This function handles saving the states to the users local browser storage
function setStates(word, currentGuess, response, index){
    currentState.guesses[currentGuess-1] = word;
    currentState.currentGuess = currentGuess;
    currentState.responses.push(data);
    currentState.currentIndex = wordStart[currentGuess];
    localStorage.setItem('gameState', JSON.stringify(currentState));
}

//Sets the users stats when they guess correct
function setStats(){
    switch(currentGuess){
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

//This is used if the user guesses the word correctly
function winner(start, end, wordGrid, data){
    setColour(start, end, wordGrid, data);
    console.log("Winner!");
    statsPage();
    let wins = currentStat.wins + 1
    currentState.winStatus = true;
    currentStat.wins = wins;
    localStorage.setItem('gameState', JSON.stringify(currentState))
    localStorage.setItem('gameStats', JSON.stringify(currentStat))
    return canType=false;
}

//This is used if the word is valid but not correct
function notWinner (start, end, wordGrid, data){
    setColour(start, end, wordGrid, data);
    currentGuess ++;
    console.log("word checked");
}

//This is used if word is not a word in the list
function notAWord(){
    console.log("word is not in list");
    let notif = document.querySelector(".notif");
    notif.textContent = "Not a word";
    notif.classList.remove("fade-out")
    notif.className += " fade-in";
    setTimeout(() => {
        notif.classList.remove("fade-in");
        notif.className += " fade-out"
    }, 1200);
    return;
}


//Renders the word grid
function setGrid (render){
    let grid = document.querySelector(".word-grid");
    grid.style.display = render;
}

//Renders the keyboard
function setKeyboard (render) {
    let keyboard = document.querySelector(".key-board");
    keyboard.style.display = render;
}

//Renders stats page
function setStatsPage (render){
    let stats = document.querySelector(".stats");
    let winStr = document.getElementById("winStreak");
    var statValues = Object.values(currentStat);
    winStr.textContent = currentStat.winStreak;
    let winPer = document.getElementById("winPercentage");
    let maxPercent = currentStat.wins+currentStat.loses;
    if(currentStat.loses!=0 && currentStat.wins != currentStat.loses){
        let percentage = (Math.floor((((currentStat.wins/maxPercent)*100))).toString() + "%");
        winPer.textContent = percentage;
    }
    else if(currentStat.wins == currentStat.loses){winPer.textContent = "50%"}
    else{winPer.textContent = "100%";}
    let statsBars = document.querySelector(".statsContainer");
    let maxGuess = 0;
    var statValues = Object.values(currentStat);
    for (let i = 0; i<statsBars.children.length; i++){
        if(statValues[i]>maxGuess){maxGuess = statValues[i]}
    }
    var maxBarLength = 100/maxGuess;
    for(let i = 0; i<statsBars.children.length; i++){
        statsBars.children[i].children[1].textContent = statValues[i]
        if (statValues[i]>0){
            statsBars.children[i].children[1].textContent = statValues[i]
            statsBars.children[i].children[1].style.width = ((statValues[i])*maxBarLength).toString() + "%";
        }
    }
    stats.style.display = render;
}
//Renders home page
function homePage() {
    setGrid("grid");
    setKeyboard("flex");
    setStatsPage("none");
}
//Renders stats page
function statsPage(){
    setGrid("none");
    setKeyboard("none");
    setStatsPage("flex");
}