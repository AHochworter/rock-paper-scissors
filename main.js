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
battleGround.addEventListener('click', takeTurn);
changeGameBtn.addEventListener('click', changeGame);

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
  // instead of using return here, assign classicFighters to the key:value pair for currentVersionFighters
  gameState.currentVersionFighters = classicFighters;
  // update tagline to read "Choose Your Fighter"
  tagline.innerText = 'Choose Your Fighter!';
  // toggle classList hidden for elements on the main view
  toggleClass(mainViewElements);
  // display the fighters based on the gameState.currentVersionFighters
  displayFighters();
  console.log({ gameState });
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

  gameState.currentVersionFighters = difficultFighters;

  tagline.innerText = 'Choose Your Fighter!';
  toggleClass(mainViewElements);
  displayFighters();
}

function takeTurn(event) {
  // on click - save fighter name that user selected
  gameState.player1.fighter = event.target.id;
  console.log('Human Selected:', gameState.player1.fighter);
  // random generate the cpu's fighter - check rubric - need a separate function?
  gameState.player2.fighter = randomFighter(gameState.currentVersionFighters);
  console.log('cpu Selected:', gameState.player2.fighter);

  if (gameState.player1.fighter === gameState.player2.fighter.id) {
    tagline.innerText = "It's a Draw!";
    //no points!
    displayFightResults();
    //reset icons
  } else {
    console.log(
      'Human Fighter',
      gameState.player1.fighter,
      'cpu Fighter',
      gameState.player2.fighter.id
    );
    getWinner();
  }
}

function randomFighter(array) {
  var randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

function getWinner() {
  if (
    (gameState.player1.fighter === 'rock' &&
      gameState.player2.fighter.id === 'scissors') || //End rock
    (gameState.player1.fighter === 'rock' &&
      gameState.player2.fighter.id === 'cowboyBoots') ||
    (gameState.player1.fighter === 'paper' &&
      gameState.player2.fighter.id === 'rock') || //End paper
    (gameState.player1.fighter === 'paper' &&
      gameState.player2.fighter.id === 'cowboyHat') ||
    (gameState.player1.fighter === 'scissors' &&
      gameState.player2.fighter.id === 'paper') ||
    (gameState.player1.fighter === 'scissors' &&
      gameState.player2.fighter.id === 'cowboyBoots') ||
    (gameState.player1.fighter === 'cowboyBoots' &&
      gameState.player2.fighter.id === 'paper') ||
    (gameState.player1.fighter === 'cowboyBoots' &&
      gameState.player2.fighter.id === 'cowboyHat') ||
    (gameState.player1.fighter === 'cowboyHat' &&
      gameState.player2.fighter.id === 'scissors') ||
    (gameState.player1.fighter === 'cowboyHat' &&
      gameState.player2.fighter.id === 'rock')
  ) {
    gameState.player1.wins = gameState.player1.wins + 1;
    humanScore.innerText = gameState.player1.wins;
    console.log('gameState.player1.wins', gameState.player1.wins);
    tagline.innerText = 'Human wins!';
  } else {
    //update winner's score
    gameState.player2.wins = gameState.player2.wins + 1;
    cpuScore.innerText = gameState.player2.wins;
    console.log('gameState.player2.wins', gameState.player2.wins);
    //update the DOM - playerInfo
    tagline.innerHTML = 'Computer Wins!';
  }
  displayFightResults();
}

function displayFightResults() {
  var humanFighter = document.getElementById(gameState.player1.fighter);
  var cpuFighter = document.getElementById(gameState.player2.fighter.id);

  humanFighter.classList.remove('hidden');
  cpuFighter.classList.remove('hidden');

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

  battleGround.innerHTML = newHTML;

  takeTurnTimeOut = setTimeout(() => {
    battleGround.innerHTML = battleGroundStatus;
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
