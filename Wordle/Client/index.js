let charIndex = 0; //This is the index for the div that you are typing in
let currentGuess = 0; // This is the current work to be checked // list of checked words. 0=not checked 1=checked
const wordStart = [0,5,10,15,20,25]
const wordEnd = [4,9,14,19,24,29]; // This is the maximum Char for each word

//key codes for a-z are 65-90
//key code for enter is 13
//key code for backspace 8


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


window.onkeydown = function(event){

    wordGrid = document.getElementById('word_grid');
    switch(validKey(event.keyCode)){
        case "letter":
            if(charIndex > wordEnd[currentGuess]){
                console.log("please check word");
                break;}
            wordGrid.children[charIndex].textContent = event.key;
            charIndex += 1;
            break;
        case "check":
            if(charIndex > wordEnd[currentGuess]){
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


window.addEventListener('load', pageLoaded)