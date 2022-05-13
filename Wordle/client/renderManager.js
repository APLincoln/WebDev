
// Renders the word grid
export function setGrid(render) {
  const grid = document.querySelector('.word-grid');
  grid.style.display = render;
}

// Renders the keyboard
export function setKeyboard(render) {
  const keyboard = document.querySelector('.key-board');
  keyboard.style.display = render;
}

// Renders stats page
export function setStatsPage(render, currentStat) {
  const stats = document.querySelector('.stats');
  const winStr = document.getElementById('winStreak');
  const statValues = Object.values(currentStat);
  winStr.textContent = currentStat.winStreak;
  winPercentage(currentStat);
  const statsBars = document.querySelector('.statsContainer');
  let maxGuess = 0;
  for (let i = 0; i < statsBars.children.length; i++) {
    if (statValues[i] > maxGuess) { maxGuess = statValues[i]; }
  }
  const maxBarLength = 100 / maxGuess;
  for (let i = 0; i < statsBars.children.length; i++) {
    statsBars.children[i].children[1].textContent = statValues[i];
    if (statValues[i] > 0) {
      statsBars.children[i].children[1].textContent = statValues[i];
      statsBars.children[i].children[1].style.width = ((statValues[i]) * maxBarLength).toString() + '%';
    }
  }
  stats.style.display = render;
}

export function winPercentage(currentStat) {
  const winPer = document.getElementById('winPercentage');
  const maxPercent = currentStat.wins + currentStat.loses;
  if (maxPercent !== 0) {
    const percentage = (Math.floor((((currentStat.wins / maxPercent) * 100))).toString() + '%');
    winPer.textContent = percentage;
  }
}

// Renders home page
export function homePage(currentStat) {
  setGrid('grid');
  setKeyboard('flex');
  setStatsPage('none', currentStat);
}
// Renders stats page
export function statsPage(currentStat) {
  setGrid('none');
  setKeyboard('none');
  setStatsPage('flex', currentStat);
}
