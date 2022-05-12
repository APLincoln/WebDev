
//Renders the word grid
// export function setGrid (render){
//   let grid = document.querySelector(".word-grid");
//   grid.style.display = render;
// };

// //Renders the keyboard
// export function setKeyboard (render) {
//   let keyboard = document.querySelector(".key-board");
//   keyboard.style.display = render;
// };

// //Renders stats page
// export function setStatsPage (render, currentStat){
//   let stats = document.querySelector(".stats");
//   let winStr = document.getElementById("winStreak");
//   var statValues = Object.values(currentStat);
//   winStr.textContent = currentStat.winStreak;
//   winPercentage(currentStat);
//   let statsBars = document.querySelector(".statsContainer");
//   let maxGuess = 0;
//   var statValues = Object.values(currentStat);
//   for (let i = 0; i<statsBars.children.length; i++){
//       if(statValues[i]>maxGuess){maxGuess = statValues[i]}
//   }
//   var maxBarLength = 100/maxGuess;
//   for(let i = 0; i<statsBars.children.length; i++){
//       statsBars.children[i].children[1].textContent = statValues[i]
//       if (statValues[i]>0){
//           statsBars.children[i].children[1].textContent = statValues[i]
//           statsBars.children[i].children[1].style.width = ((statValues[i])*maxBarLength).toString() + "%";
//       }
//   }
//   stats.style.display = render;
// };

// export function winPercentage(currentStat){
//   let winPer = document.getElementById("winPercentage");
//   let maxPercent = currentStat.wins+currentStat.loses;
//   if (maxPercent!=0){
//   let percentage = (Math.floor((((currentStat.wins/maxPercent)*100))).toString() + "%");
//   winPer.textContent = percentage;
//   }
// };

// //Renders home page
// export function homePage(currentStat) {
//   setGrid("grid");
//   setKeyboard("flex");
//   setStatsPage("none", currentStat);
// };
// //Renders stats page
// export function statsPage(currentStat){
//   setGrid("none");
//   setKeyboard("none");
//   setStatsPage("flex", currentStat);
// };