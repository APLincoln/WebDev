
let key = document.querySelectorAll('.key');
let charIndex = 0; //This is the index for the div that you are typing in
let currentGuess = 0; // This is the current work to be checked // list of checked words. 0=not checked 1=checked
const wordStart = [0,5,10,15,20,25];
const wordEnd = [4,9,14,19,24,29];
let wordGrid = document.getElementById('word_grid');
let enter = document.querySelector('.enter'); //Used for the on-screen keyboard
let back = document.querySelector('.return'); //Used for the on-scree keyboard
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
    winStreak: 0
}
const gameState = {
    guesses : ["","","","","",""],
    responses : [],
    currentIndex: 0,
    currentGuess: 0,
    date: (Math.floor(Date.now()/1000/60/60/24))
}

window.addEventListener('load', () => {
    localStorageInit();
    currentState = window.JSON.parse(localStorage.getItem('gameState'));
    currentStat = window.JSON.parse(localStorage.getItem('gameStats'));
    resumeGame(currentState);
})

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
        //console.log(state.guesses[i])
        //debugger;
        if(state.guesses[i] != ""){
            //debugger;
            for(let k = 0, j = 5*i; j<(wordEnd[i]+1); j++, k++){
                wordGrid.children[j].textContent = state.guesses[i][k];
         }
         console.log(state.responses[i])
         setColour(wordStart[i], wordEnd[i], wordGrid, state.responses[i]);
        }
    }
    charIndex = state.currentIndex
    currentGuess  = state.currentGuess
}

//This adds event listeners to all of the keys
for(let i = 0; i<key.length; i++){
    key[i].addEventListener('click', keyInput)
}

//This adds event listener to enter
enter.addEventListener('click', (event) => {
    if(canType){
    if(charIndex > wordEnd[currentGuess]){
        let start = wordStart[currentGuess];
        let end = wordEnd[currentGuess];
        let guessArr = getWord(wordStart[currentGuess], wordEnd[currentGuess], wordGrid);
        console.log(currentGuess);
        sendWord(guessArr, start, end, wordGrid);
    }
    else {console.log("This is not a full word please try again");}
}})

// This adds event listener to backspace
back.addEventListener('click', (event) => {
    if(canType){
    if(charIndex != wordStart[currentGuess]){
        charIndex --
        wordGrid.children[charIndex].textContent = "";
    }
}})

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
    //debugger;
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
                console.log(currentGuess);
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
    console.log(word);
    const payload = { guess: word };
    console.log(payload);
    const response = await fetch( 'http://localhost:8080/wordCheck' , {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
    });

    if(response.ok){
        data = await response.json();
        const count = data.filter(obj => obj == 2).length;
        console.log(count);
        if(data.length<1){
            notAWord();
        }
        else if(count == 5){
            setStates(word, currentGuess+1, data, currentGuess);
            setStats();
            winner(start, end, wordGrid, data);
        }
        else if (currentGuess == 5){
            currentStat.winStreak = 0;
            localStorage.setItem("gameStats",JSON.stringify(currentStat));
            notWinner(start, end, wordGrid, data);
            setStates(word, currentGuess, data, currentGuess);
        }
        else{
            notWinner(start, end, wordGrid, data);
            setStates(word, currentGuess, data, currentGuess)
        }
    }
    else{}
}

//This function handles saving the states to the users local browser storage
function setStates(word, currentGuess, response, index){
    console.log(currentState)
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
    localStorage.setItem("gameStats", JSON.stringify(currentStat));

}

//This is used if the user guesses the word correctly
function winner(start, end, wordGrid, data){
    setColour(start, end, wordGrid, data);
    console.log("Winner!");
    let win = document.querySelector(".winnerModal");
    let winButt = document.querySelector(".closeModal");
    win.style.display = "flex";
    winButt.addEventListener("click", () => {
        win.style.display = "none";
    });
    return canType=false;
}

//This is used if the word is valid but not correct
function notWinner (start, end, wordGrid, data){
    console.log(data.length);
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


//Hide word grid/keyboard

//set main style align iten center and justify content center

//amend