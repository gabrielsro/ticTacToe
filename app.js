const btn1vs1 = document.querySelector(".btn-1vs1");
const btnAI = document.querySelector(".btn-ai");
const btnRestart = document.querySelector(".btn-restart");
const btnNew = document.querySelector(".btn-new-game");
const btnNext = document.querySelector(".btn-next");
const infoCurrentRound = document.querySelector(".round");
const infoCurrentStatus = document.querySelector(".status");
const infoScore = document.querySelector(".score");
const tableBody = document.querySelector(".table-content");

const gameboard = (() => {
  let enabled = false;
  let status = "";
  let mark = "X";
  let squares = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  const board = document.querySelector(".board");
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const square = document.createElement("div");
      square.setAttribute("data-x", `${i}`);
      square.setAttribute("data-y", `${j}`);
      square.classList.add("square", "square-free");
      square.addEventListener("click", (e) => {
        if (enabled) {
          if (squares[e.target.dataset.x][e.target.dataset.y] == "") {
            squares[e.target.dataset.x][e.target.dataset.y] = mark;
            square.innerText = mark;
            square.classList.toggle("square-free");
            mark == "X" ? (mark = "O") : (mark = "X");
            gameControl.evaluate(squares);
          }
        } else {
          if (status !== "") {
            window.alert(status);
          } else {
            window.alert("Please select game mode");
          }
        }
      });
      board.appendChild(square);
    }
  }
  const enable = () => {
    enabled = true;
  };
  const disable = (news) => {
    enabled = false;
    news == "new" ? (status = "") : (status = news);
  };
  const reset = () => {
    squares = squares.map((line) => line.map((square) => (square = "")));
    let squaresDOM = document.querySelectorAll(".square");
    squaresDOM.forEach((square) => (square.innerText = ""));
  };
  return {
    enable,
    disable,
    reset,
  };
})();

const gameControl = (() => {
  let type = "";
  let status = "";
  let result = "";
  let round = 1;
  let waitingFor = "";
  let moves = [];
  let history = [];
  const evaluate = (squares) => {
    //status = "";
    moves.push(squares);
    //check lines
    for (let i = 0; i < 3; i++) {
      if (squares[i].every((square) => square == "X")) {
        status = "X Won";
      }
      if (squares[i].every((square) => square == "O")) {
        status = "O Won";
      }
    }
    //check columns
    for (let i = 0; i < 3; i++) {
      if (squares.every((line) => line[i] == "X")) {
        status = "X Won";
      }
      if (squares.every((line) => line[i] == "O")) {
        status = "O Won";
      }
    }
    //check diagonals
    if (squares[0][0] !== "") {
      let mark = squares[0][0];
      let count = 0;
      for (let i = 1; i < 3; i++) {
        if (squares[i][i] == mark) {
          count++;
        }
      }
      if (count == 2) {
        status = `${mark} Won`;
      }
    }
    if (squares[0][2] !== "") {
      let mark = squares[0][2];
      let count = 0;
      for (let i = 1; i < 3; i++) {
        if (squares[i][2 - i] == mark) {
          count++;
        }
      }
      if (count == 2) {
        status = `${mark} Won`;
      }
    }
    //Check for Draw
    if (squares.every((line) => line.every((square) => square !== ""))) {
      status = "Draw";
    }
    if (status !== "") {
      if (status == "Draw") {
        infoCurrentStatus.innerText = `It's a ${status}!`;
        result = status;
        gameboard.disable(
          `It's a ${status}. Restart the game or go to next round`
        );
      } else {
        infoCurrentStatus.innerText = `${waitingFor} Won!`;
        result = waitingFor;
        gameboard.disable(
          `${waitingFor} won. Restart the game or go to next round`
        );
      }
    }
    if (status == "") {
      if (type == "players") {
        if (waitingFor == "Player 1") {
          waitingFor = "Player 2";
        } else {
          waitingFor = "Player 1";
        }
      } else {
        if (waitingFor == "AI") {
          waitingFor = "Player";
        } else {
          waitingFor = "AI";
        }
      }
      infoCurrentStatus.innerText = `Playing Now: ${waitingFor}`;
    }
  };
  const setType = (newType) => {
    type = newType;
    if (type == "players" && waitingFor == "") {
      waitingFor = "Player 1";
    }
    if (type == "AI" && waitingFor == "") {
      waitingFor = "Player";
    }
    infoCurrentRound.innerText = `Round ${round}`;
    infoCurrentStatus.innerText = `Playing Now: ${waitingFor}`;
  };

  const startNewGame = () => {};
  const getFirstPlayer = () => {
    if ((type = "players")) {
      if (round % 2 == 0) {
        waitingFor = "Player 2";
      } else {
        waitingFor = "Player 1";
      }
    } else {
      if (round % 2 == 0) {
        waitingFor = "AI";
      } else {
        waitingFor = "Player";
      }
    }
  };
  const restartRound = () => {
    moves = [];
    status = "";
    result = "";
    getFirstPlayer();
    infoCurrentStatus.innerText = `Playing now: ${waitingFor}`;
  };
  const nextRound = () => {
    history.push({
      roundNumber: round,
      winner: result,
      movements: moves,
    });
    round++;
    result = "";
    status = "";
    infoCurrentRound.innerText = `Round ${round}`;
    getFirstPlayer();
    infoCurrentStatus.innerText = `Playing now: ${waitingFor}`;
    moves = [];
    gameboard.reset();
    let p1Score = 0;
    let p2Score = 0;
    for (let i = 0; i < history.length; i++) {
      if (history[i].winner == "Player 1") {
        p1Score++;
      }
      if (history[i].winner == "Player 2") {
        p2Score++;
      }
    }
    infoScore.innerText = `Player 1: ${p1Score} - Player 2: ${p2Score}`;
    let newRow = document.createElement("tr");
    let rowRound = document.createElement("td");
    let rowResult = document.createElement("td");
    rowRound.innerText = `${history.length}`;
    rowResult.innerText = `${history[history.length - 1].winner}`;
    newRow.appendChild(rowRound);
    newRow.appendChild(rowResult);
    tableBody.appendChild(newRow);
  };

  const newGame = () => {
    type = "";
    status = "";
    result = "";
    round = 1;
    waitingFor = "";
    moves = [];
    history = [];
    infoCurrentRound.innerText = "";
    infoCurrentStatus.innerText = "";
    infoScore.innerText = "";
    while (tableBody.firstChild) {
      tableBody.removeChild(tableBody.firstChild);
    }
  };
  return {
    evaluate,
    setType,
    restartRound,
    startNewGame,
    nextRound,
    newGame,
  };
})();

btn1vs1.addEventListener("click", () => {
  gameboard.enable();
  gameControl.setType("players");
});

btnAI.addEventListener("click", () => {
  gameboard.enable();
  gameControl.setType("AI");
});

btnNext.addEventListener("click", () => {
  gameControl.nextRound();
  gameboard.enable();
});

btnRestart.addEventListener("click", () => {
  gameboard.enable();
  gameControl.restartRound();
  gameboard.reset();
});

btnNew.addEventListener("click", () => {
  gameControl.newGame();
  gameboard.reset();
  gameboard.disable("new");
});
