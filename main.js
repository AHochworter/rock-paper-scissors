document.addEventListener('DOMContentLoaded', function () {
  console.log('content loaded');
  createGame();
});

// Query Selectors👇
var rulesClassic = document.querySelector('.rules-classic');
var rulesDifficult = document.querySelector('.rules-difficult');
var tagline = document.querySelector('.tagline');
var battleGround = document.querySelector('.battle-ground');
var humanScore = document.querySelector('#humanWon');
var cpuScore = document.querySelector('#cpuWon');

// Emojis & Fighter Icons
var gameFighters = document.querySelectorAll('.game-fighter');

// Buttons
var chooseClassicBtn = document.querySelector('.choose-classic-btn');
var chooseDifficultBtn = document.querySelector('.choose-difficult-btn');
var changeGameBtn = document.querySelector('.change-game-btn');

// Event Listeners👇
chooseClassicBtn.addEventListener('click', loadClassic);
chooseDifficultBtn.addEventListener('click', loadDifficult);
changeGameBtn.addEventListener('click', changeGame);
battleGround.addEventListener('click', function (event) {
  if (event.target.classList.contains('game-fighter')) {
    gameState.player1.fighter = event.target.id;
    console.log('human fighter', gameState.player1.fighter);
    takeTurn();
  }
});

// Global Variables👇
var gameState;
var takeTurnTimeOut;
var mainViewElements = [
  chooseClassicBtn,
  chooseDifficultBtn,
  rulesClassic,
  rulesDifficult,
  changeGameBtn,
  battleGround,
];
var battleGroundStatus;

// Event Handlers and Functions👇

function createPlayer(name, token, wins) {
  var player = {
    name: name,
    token: token,
    wins: wins,
    fighter: '',
  };
  return player;
}

function createGame(gameChoice) {
  gameState = {
    player1: createPlayer('Human', '🤠', 0),
    player2: createPlayer('CPU', '💻', 0),
    fighters: [
      { id: 'rock', classic: true, difficult: true },
      { id: 'paper', classic: true, difficult: true },
      { id: 'scissors', classic: true, difficult: true },
      { id: 'cowboyHat', classic: false, difficult: true },
      { id: 'cowboyBoots', classic: false, difficult: true },
    ],
    version: gameChoice,
    currentVersionFighters: [],
  };
  document.querySelector('.user-human .player-emoji').innerHTML =
    gameState.player1.token;
  document.querySelector('.user-cpu .player-emoji').innerHTML =
    gameState.player2.token;

  displayUserScores(gameState);

  return gameState;
}

function displayUserScores(gameState) {
  // Set innerHTML for player1 and player2
  // moved here to its own function - more modular, DRY?
  document.querySelector(
    '#humanWon'
  ).textContent = `Wins: ${gameState.player1.wins}`;
  document.querySelector(
    '#cpuWon'
  ).textContent = `Wins: ${gameState.player2.wins}`;
}

function getFightersByVersion(fighters, version) {
  var choosenFighters = [];
  for (var i = 0; i < fighters.length; i++) {
    //use bracket notation here for version
    if (fighters[i][version]) choosenFighters.push(fighters[i]);
  }
  return choosenFighters;
}

function loadClassic() {
  console.log('Classic Button Clicked!');
  gameState.version = 'classic';
  gameState.currentVersionFighters = getFightersByVersion(
    gameState.fighters,
    gameState.version
  );

  tagline.innerText = 'Choose Your Fighter!';
  toggleClass(mainViewElements);
  displayFighters();
  console.log({ gameState });
}

function loadDifficult() {
  console.log('Difficult Button Clicked!');
  gameState.version = 'difficult';
  gameState.currentVersionFighters = getFightersByVersion(
    gameState.fighters,
    gameState.version
  );

  tagline.innerHTML = 'Choose Your Fighter!';
  toggleClass(mainViewElements);
  displayFighters();
}

//moved this to the event listener on battleGround
// function userSelectedFighter(event) {
//on click - save fighter name that the user selected
//   gameState.player1.fighter = event.target.id;
//   console.log('Human Selected', gameState.player1.fighter);
// }

// randomly generate the computer selected fighter
function cpuSelectedFighter() {
  gameState.player2.fighter = randomFighter(gameState.currentVersionFighters);
  console.log('CPU Selected', gameState.player2.fighter.id);
}

function takeTurn(event) {
  //refactored takeTurn function calls the functions that get player1 and player2 fighters
  //contains the logic that checks for a "draw" condition
  //if no "draw" calls getWinner()
  // userSelectedFighter(event);
  cpuSelectedFighter();

  var player1Fighter = gameState.player1.fighter;
  var player2Fighter = gameState.player2.fighter.id;

  if (player1Fighter === player2Fighter) {
    tagline.innerText = "It's a Draw!";
    //no points!

    //reset icons
    displayFightResults();
  } else {
    getWinner();
  }
}

function getWinner() {
  //mentor suggested simplifying my game logic.
  // the array following each fighter contains who it can defeat
  // when player1Fighter is selected the logic checks to see if the array hold the player2 fighter - if yes, player1 wins, if no player2 wins
  var whoWinsLogic = {
    rock: ['scissors', 'cowboyBoots'],
    paper: ['rock', 'cowboyHat'],
    scissors: ['paper', 'cowboyBoots'],
    cowboyBoots: ['paper', 'cowboyHat'],
    cowboyHat: ['scissors', 'rock'],
  };
  var player1Fighter = gameState.player1.fighter;
  var player2Fighter = gameState.player2.fighter.id;

  if (whoWinsLogic[player1Fighter].includes(player2Fighter)) {
    gameState.player1.wins++;
    humanScore.innerText = `Wins: ${gameState.player1.wins}`;
    tagline.innerText = `You Won! ${player1Fighter.toUpperCase()} beats ${player2Fighter.toUpperCase()}.`;
  } else {
    gameState.player2.wins++;
    cpuScore.innerText = `Wins: ${gameState.player2.wins}`;
    tagline.innerText = `You Lost. ${player1Fighter.toUpperCase()} loses to ${player2Fighter.toUpperCase()}`;
  }
  displayFightResults();
}

function displayFightResults() {
  var humanFighter = document.getElementById(gameState.player1.fighter);
  var cpuFighter = document.getElementById(gameState.player2.fighter.id);

  humanFighter.classList.remove('hidden');
  cpuFighter.classList.remove('hidden');

  // save the battleGround.innerHTML state
  battleGroundStatus = battleGround.innerHTML;

  // Construct the innerHTML content
  var newHTML = `
    <div class="display-fight-results">
      <div class="fighter-container">
        <img src="assets/${humanFighter.id}.png" alt="${humanFighter.id}" class="game-fighter" />
      </div>
      <div class="fighter-container">
        <img src="assets/${cpuFighter.id}.png" alt="${cpuFighter.id}" class="game-fighter" />
      </div>
    </div>
  `;

  //sets the innerHTML to show the fight results!
  battleGround.innerHTML = newHTML;

  takeTurnTimeOut = setTimeout(function () {
    //now we use the battleGroundStatus variable that we set before we inserted the newHTML to reset our battleGround.innerHTML to what it was prior to newHTML
    battleGround.innerHTML = battleGroundStatus;
    //this gameFighters = freshens the querySelector.  Bret looked at this with me.  Talked about the fact that the nodeList was updating but we weren't seeing it on the DOM.
    //We were specifically looking at toggling hidden from the game fighters.  Working on the nodeList, not working on the DOM
    gameFighters = document.querySelectorAll('.game-fighter');

    tagline.innerText = 'Choose Your Fighter!';
  }, 3000);
}

function changeGame() {
  console.log('Change Game was Clicked');
  //turns off the timer
  clearTimeout(takeTurnTimeOut);
  //updates the tagline
  tagline.innerText = 'Choose Your Game!';
  //turns the main view back on
  // hideFighters();
  toggleClass(mainViewElements);
  hideFighters();
}

// Helper functions👇

//toggle 'hidden' classList function
function toggleClass(elements) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].classList.toggle('hidden');
  }
}

//toggle 'hidden' on the fighters
function displayFighters() {
  for (var i = 0; i < gameState.currentVersionFighters.length; i++) {
    toggleClass([gameFighters[i]]);
  }
}

// hide fighters!
function hideFighters() {
  for (var i = 0; i < gameFighters.length; i++) {
    gameFighters[i].classList.add('hidden');
  }
}

//ramdomly generate
function randomFighter(array) {
  var randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}
