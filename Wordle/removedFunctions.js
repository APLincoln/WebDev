//This is a file full of functions that were built through the process,
// but later removed and replaces with better solutions

// This checks to see if the day has changed every second
// If the day has changed then it will reset the day value and will reset the word of the day
setInterval(() => {
  var newDate = (Math.floor(Date.now()/1000/60/60/24));
  if (today <= newDate){
    today = newDate;
    word = wordOfDay(words, today);
    console.log(word);
    intervalTimer = 86400000 - (Date.now()%86400000)
    return word, today, intervalTimer;
  }}, intervalTimer);