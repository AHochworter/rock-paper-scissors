document.addEventListener('DOMContentLoaded', function () {
  console.log('content loaded');
  createGame();
});

// Query Selectors👇
var rulesClassic = document.querySelector('.rules-classic');
var rulesDifficult = document.querySelector('.rules-difficult');

// Emojis & Fighter Icons
var gameFighters = document.querySelector('.game-fighter');
//toggleClass is only giving me one of the fighters - querySelectorAll??
//forEach or a loop?

// Buttons
var chooseClassicBtn = document.querySelector('.choose-classic-btn');
var chooseDifficultBtn = document.querySelector('.choose-difficult-btn');

// Event Listeners👇
chooseClassicBtn.addEventListener('click', loadClassic);
chooseDifficultBtn.addEventListener('click', loadDifficult);

// Global Variables👇
var gameState;
var mainViewElements = [
  chooseClassicBtn,
  chooseDifficultBtn,
  rulesClassic,
  rulesDifficult,
  gameFighters,
];

// Event Handlers and Functions👇

function createPlayer(name, token, wins) {
  var player = {
    name: name,
    token: token,
    wins: wins,
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
  };
  // Set innerHTML for player1 and player2
  // Should this be here inside createGame?  or parsed out to another function?
  document.querySelector('.user-human .player-emoji').innerHTML =
    gameState.player1.token;
  document.querySelector(
    '.user-human .show-score'
  ).innerHTML = `Wins: ${gameState.player1.wins}`;
  document.querySelector('.user-cpu .player-emoji').innerHTML =
    gameState.player2.token;
  document.querySelector(
    '.user-cpu .show-score'
  ).innerHTML = `Wins: ${gameState.player2.wins}`;

  return gameState;
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
  toggleClass(mainViewElements);

  console.log('classicFighters', classicFighters);
  return classicFighters;
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
  toggleClass(mainViewElements);

  console.log('difficultFighters', difficultFighters);
  return difficultFighters;
}

// function getWinner(user, cpu) {
//     if (user === cpu) {
//       return `It's a draw`;
//     } else if (
//       (user === 'rock' && cpu === 'scissors') ||
//       (user === 'paper' && cpu === 'rock') ||
//       (user === 'scissors' && cpu === 'paper')
//     ) {
//       return `User wins!`;
//     } else if (
//       (user === 'rock' && cpu === 'paper') ||
//       (user === 'paper' && cpu === 'scissors') ||
//       (user === 'scissors' && cpu === 'rock')
//     ) {
//       return `CPU wins!`;
//     }
//   }
// Helper functions

//toggle 'hidden' classList function
function toggleClass(elements) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].classList.toggle('hidden');
  }
}
