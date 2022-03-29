


let charIndex = 0; //This is the index for the div that you are typing in
let currentGuess = 0; // This is the current work to be checked // list of checked words. 0=not checked 1=checked
const wordStart = [0,5,10,15,20,25];
const wordEnd = [4,9,14,19,24,29];


function pageLoaded(){
    
}

//This checks an input and returns a string for the switch case
function validKey(a){
    //debugger;
    if (a>=65 && a<91){return "letter";}
    else if (a == 13){return "check";}
    else if (a == 8){return "back";}
    else {return "invalid";}
}

function getWord(start, end, wordGrid){
    guessArr = ["","","","",""];
    for(let i = 0; start<=end; i++){
        guessArr[i] = wordGrid.children[start].textContent;
        start++;
    }
    return guessArr;
}

//This takes keyboard input and writed character to uppercase
window.onkeydown = function(event){

    wordGrid = document.getElementById('word_grid');
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
                let guessArr = getWord(wordStart[currentGuess], wordEnd[currentGuess], wordGrid);
                setColour(wordStart[currentGuess], wordEnd[currentGuess], wordGrid, sendWord(guessArr));
                currentGuess ++;
                console.log("word checked");
            }
            else {console.log("This is not a full word please try again");}
            break;//run word checker
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

function setColour(start, end, wordGrid, response){
    for(let i = 0; start<end; i++){
        switch (response[i]){
            case 2:
                wordGrid.children[i].classList.add("green-box");
                start++;
                break;
            case 1:
                wordGrid.children[i].classList.add("orange-box");
                start++;
                break; 
        }
    }
}

//This fuction sends word to the server and returns the response
async function sendWord(word){
    console.log(word);
    const payload = { guess: word };
    let result = await fetch( 'http://localhost:8080/wordCheck' , {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ guess: word })
    })
    .then(response => {
        response.json()
        .then(data => {
            vals = data;
            return vals;
        });
    });
}

window.addEventListener('load', pageLoaded)