
let key = document.querySelectorAll('.key');
let charIndex = 0; //This is the index for the div that you are typing in
let currentGuess = 0; // This is the current work to be checked // list of checked words. 0=not checked 1=checked
const wordStart = [0,5,10,15,20,25];
const wordEnd = [4,9,14,19,24,29];
let wordGrid = document.getElementById('word_grid');
let enter = document.querySelector('.enter');
let back = document.querySelector('.return');

//this adds event listeners to all of the keys
for(let i = 0; i<key.length; i++){
    key[i].addEventListener('click', keyInput)
}

// This adds event listener to enter
enter.addEventListener('click', (event) => {
    if(charIndex > wordEnd[currentGuess]){
        let start = wordStart[currentGuess];
        let end = wordEnd[currentGuess];
        let guessArr = getWord(wordStart[currentGuess], wordEnd[currentGuess], wordGrid);
        console.log(currentGuess);
        sendWord(guessArr, start, end, wordGrid);
    }
    else {console.log("This is not a full word please try again");}
})

// This adds event listener to backspace
back.addEventListener('click', (event) => {
    if(charIndex != wordStart[currentGuess]){
        charIndex --
        wordGrid.children[charIndex].textContent = "";
    }
})

//This changes text content based on key pressed on screen
function keyInput(event){
    let char = event.target.textContent;
    if(charIndex > wordEnd[currentGuess]){
        console.log("please check word");
        return;
    }
    wordGrid.children[charIndex].textContent = char.toUpperCase();
    charIndex += 1;
}

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
                sendWord(guessArr, start, end, wordGrid);
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
async function sendWord(word, start, end, wordGrid){
    //debugger;
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
        if(data.length<1){
            console.log("word is not in list");
            let notif = document.querySelector(".notif");
            notif.textContent = "Not a word";
            return;
        }
        else if(data == [2,2,2,2,2]){
            setColour(start, end, wordGrid, data);
            console.log("Winner!")
            let notif = document.querySelector(".notif");
            notif.textContent = "Winner!";
        }
        else{
            console.log(data.length);
            setColour(start, end, wordGrid, data);
            currentGuess ++;
            console.log("word checked");
        }
    }
    else{}
}

