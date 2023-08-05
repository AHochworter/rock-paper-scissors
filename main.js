document.addEventListener('DOMContentLoaded', function () {
  console.log('content loaded');
  createGame();
});

// Query Selectors👇
var rulesClassic = document.querySelector('.rules-classic');
var rulesDifficult = document.querySelector('.rules-difficult');
var tagline = document.querySelector('.tagline');
var battleGround = document.querySelector('.battle-ground');

// Emojis & Fighter Icons
var gameFighters = document.querySelectorAll('.game-fighter');

var rock = document.querySelector('#rock');
var paper = document.querySelector('#paper');
var scissors = document.querySelector('#scissors');
var cowboyHat = document.querySelector('#cowboyHat');
var cowboyBoots = document.querySelector('#cowboyBoots');

// Buttons
var chooseClassicBtn = document.querySelector('.choose-classic-btn');
var chooseDifficultBtn = document.querySelector('.choose-difficult-btn');

// Event Listeners👇
chooseClassicBtn.addEventListener('click', loadClassic);
chooseDifficultBtn.addEventListener('click', loadDifficult);
battleGround.addEventListener('click', takeTurn);

// Global Variables👇
var gameState;
var mainViewElements = [
  chooseClassicBtn,
  chooseDifficultBtn,
  rulesClassic,
  rulesDifficult,
];

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
      { name: 'rock', classic: true, difficult: true },
      { name: 'paper', classic: true, difficult: true },
      { name: 'scissors', classic: true, difficult: true },
      { name: 'cowboyHat', classic: false, difficult: true },
      { name: 'cowboyBoots', classic: false, difficult: true },
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
    '.user-human .show-score'
  ).innerHTML = `Wins: ${gameState.player1.wins}`;
  document.querySelector(
    '.user-cpu .show-score'
  ).innerHTML = `Wins: ${gameState.player2.wins}`;
}

function loadClassic() {
  //on click update gameState.version to equal 'classic'
  gameState.version = 'classic';
  var classicFighters = [];
  for (var i = 0; i < gameState.fighters.length; i++) {
    if (gameState.fighters[i].classic) {
      classicFighters.push(gameState.fighters[i]);
    }
  }
  //   console.log('classicFighters', classicFighters);
  gameState.currentVersionFighters = classicFighters;

  tagline.innerText = 'Choose Your Fighter!';
  toggleClass(mainViewElements);
  displayFighters();
}

function loadDifficult() {
  //on click update game.State.version to equal 'difficult'
  gameState.version = 'difficult';
  var difficultFighters = [];
  for (var i = 0; i < gameState.fighters.length; i++) {
    if (gameState.fighters[i].difficult) {
      difficultFighters.push(gameState.fighters[i]);
    }
  }
  console.log('difficultFighters', difficultFighters);
  gameState.currentVersionFighters = difficultFighters;

  tagline.innerText = 'Choose Your Fighter!';
  toggleClass(mainViewElements);
  displayFighters();
}

function displayFighters() {
  for (var i = 0; i < gameState.currentVersionFighters.length; i++) {
    toggleClass([gameFighters[i]]);
  }
}

function takeTurn(event) {
  // on click - save fighter name that user selected
  gameState.player1.fighter = event.target.id;
  console.log('Human Selected:', gameState.player1.fighter);

  // random generate the cpu's fighter - check rubric - need a separate function?
  gameState.player2.fighter = randomFighter(gameState.currentVersionFighters);
  console.log('cpu Selected:', gameState.player2.fighter);

  isDraw(gameState.player1.fighter, gameState.player2.fighter.name);
  console.log(getWinner(gameState.player1.fighter, gameState.player2.fighter));
}

function randomFighter(array) {
  var randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

function isDraw() {
  if (gameState.player1.fighter === gameState.player2.fighter.name) {
    console.log(
      'player1.wins',
      gameState.player1.wins,
      'player2.wins',
      gameState.player2.wins
    );
    tagline.innerText = "It's a Draw!";
  }
  getWinner();
}

function getWinner() {
  if (
    (gameState.player1.fighter === 'rock' &&
      gameState.player2.fighter.name === 'scissors') ||
    (gameState.player1.fighter === 'paper' &&
      gameState.player2.fighter.name === 'rock') ||
    (gameState.player1.fighter === 'scissors' &&
      gameState.player2.fighter.name === 'paper')
  ) {
    gameState.player1.wins++;
    console.log('gameState.player1.wins', gameState.player1.wins);
    tagline.innerText = 'Human wins!';
  } else if (
    (gameState.player1.fighter === 'rock' &&
      gameState.player2.fighter.name === 'paper') ||
    (gameState.player1.fighter === 'paper' &&
      gameState.player2.fighter.name === 'scissors') ||
    (gameState.player1.fighter === 'scissors' &&
      gameState.player2.fighter.name === 'rock')
  ) {
    //update winner's score
    gameState.player2.wins++;
    console.log('gameState.player2.wins', gameState.player2.wins);
    //update the DOM - playerInfo
    tagline.innerHTML = 'Computer Wins!';
  }
}

// Helper functions

//toggle 'hidden' classList function
function toggleClass(elements) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].classList.toggle('hidden');
  }
}
