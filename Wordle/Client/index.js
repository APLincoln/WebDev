
let key = document.querySelectorAll('.key');
let charIndex = 0; //This is the index for the div that you are typing in
let currentGuess = 0; // This is the current work to be checked // list of checked words. 0=not checked 1=checked
const wordStart = [0,5,10,15,20,25];
const wordEnd = [4,9,14,19,24,29];
let wordGrid = document.getElementById('word_grid');
let enter = document.querySelector('.enter');
let back = document.querySelector('.return');
let canType = true;
let currentState = null;
//These are the local storage default objects
const gameStats = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    winStreak: 0
}
const gameState = {
    guesses : ["","","","","",""],
    responses : [],
    currentIndex: 0,
    currentGuess: 0
}

window.addEventListener('load', () => {
    localStorageInit();
    let currentGameStats = window.JSON.parse(localStorage.getItem('gameStats'));
    currentState = window.JSON.parse(localStorage.getItem('gameState'));
    resumeGame(currentState);
})

//This function checks the local storage is initialized and then adds fields that need adding.
function localStorageInit(){
    if (localStorage.getItem('gameStats') === null){
        localStorage.setItem('gameStats', JSON.stringify(gameStats))
    }
    if (localStorage.getItem('gameState') === null){
        localStorage.setItem('gameState', JSON.stringify(gameState))
    }

}

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

//this adds event listeners to all of the keys
for(let i = 0; i<key.length; i++){
    key[i].addEventListener('click', keyInput)
}

// This adds event listener to enter
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
            winner(start, end, wordGrid, data);
            setStates(word, currentGuess, data, currentGuess)
        }
        else{
            notWinner(start, end, wordGrid, data);
            setStates(word, currentGuess, data, currentGuess)
        }
    }
    else{}
}

function setStates(word, currentGuess, response, index){
    console.log(currentState)
    currentState.guesses[currentGuess-1] = word;
    currentState.currentGuess = currentGuess;
    currentState.responses.push(data);
    currentState.currentIndex = wordStart[currentGuess];
    localStorage.setItem('gameState', JSON.stringify(currentState));
}
function winner(start, end, wordGrid, data){
    setColour(start, end, wordGrid, data);
    console.log("Winner!");
    let win = document.querySelector(".winnerModal");
    let winButt = document.querySelector(".closeModal");
    win.style.display = "flex";
    winButt.addEventListener("click", () => {
        win.style.display = "none";
        console.log("your mums fat");
    });
    return canType=false;
}

function notWinner (start, end, wordGrid, data){
    console.log(data.length);
    setColour(start, end, wordGrid, data);
    currentGuess ++;
    console.log("word checked");
}

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