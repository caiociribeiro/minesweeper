const grid = document.querySelector('.board');
const reset = document.querySelector('.reset');
const root = document.documentElement;
const dificulty = document.querySelectorAll('option');
const select = document.querySelector('select');
const endGame = document.querySelector('.end-game');
const playAgain = document.getElementById('play--again');
let rows = 14;
let cols = 18;
let bombs = 40;
let clickFlag = true;
let checkedTiles = [];
let tiles = drawTiles();

let minute = 0;
let second = 0;
let count = 0;
let timer = false;

function stopWatch() {
  if (timer) {
    count += 1;

    if (count == 100) {
      second += 1;
      count = 0;
    }

    if (second == 60) {
      minute += 1;
      second = 0;
    }
    let minString = minute;
    let secString = second;

    if (minute < 10) {
      minString = `0${minString}:`;
    }

    if (second < 10) {
      secString = `0${secString}`;
    }

    document.getElementById('min').innerHTML = minString;
    document.getElementById('sec').innerHTML = secString;
    setTimeout(stopWatch, 10);
  }
}

function stopStopWatch() {
  timer = false;
  minute = 0;
  second = 0;
  count = 0;
  document.getElementById('min').innerHTML = '00:';
  document.getElementById('sec').innerHTML = '00';
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function drawTiles() {
  if (dificulty[0].selected) {
    rows = 8;
    cols = 10;
    bombs = 10;
  } else if (dificulty[1].selected) {
    rows = 14;
    cols = 18;
    bombs = 40;
  } else if (dificulty[2].selected) {
    rows = 20;
    cols = 24;
    bombs = 99;
  }
  root.style.setProperty('--col', cols);
  root.style.setProperty('--width', cols * 31);
  root.style.setProperty('--height', rows * 31);
  const tiles = [];
  let id = 0;
  for (let i = 0; i < rows; i++) {
    tiles.push([]);
    for (let j = 0; j < cols; j++) {
      const tile = document.createElement('button');
      tile.disabled = false;
      tile.classList.add('tile');
      tile.classList.add('begin');
      tile.classList.add(`c${j}`);
      tile.classList.add(`r${i}`);
      tile.setAttribute('oncontextmenu', 'return false;');
      grid.appendChild(tile);
      tiles[i].push({
        id: id,
        tile: tile,
        x: j,
        y: i,
        bomb: false,
        blank: false,
        bombsAround: 0,
      });
      id += 1;
    }
  }
  return tiles;
}

function drawBoard(tile, bombs) {
  const invalidPositions = [
    [tile.y, tile.x],
    [tile.y, tile.x - 1],
    [tile.y, tile.x + 1],
    [tile.y - 1, tile.x],
    [tile.y - 1, tile.x + 1],
    [tile.y - 1, tile.x - 1],
    [tile.y + 1, tile.x],
    [tile.y + 1, tile.x - 1],
    [tile.y + 1, tile.x + 1],
  ];

  while (bombs > 0) {
    const x = getRandomInt(0, cols - 1);
    const y = getRandomInt(0, rows - 1);

    let valid = true;

    for (let i = 0; i < invalidPositions.length; i++) {
      if (y == invalidPositions[i][0] && x == invalidPositions[i][1]) {
        valid = false;
        break;
      }
    }

    if (valid) {
      if (!tiles[y][x].bomb) {
        tiles[y][x].bomb = true;
        bombs -= 1;
      }
    }
  }

  for (let j = 0; j < cols; j++) {
    for (let i = 0; i < rows; i++) {
      if (!tiles[i][j].bomb) {
        let bombsAround = 0;
        if (i > 0 && i < rows - 1 && j > 0 && j < cols - 1) {
          if (tiles[i - 1][j - 1].bomb) bombsAround += 1;
          if (tiles[i - 1][j].bomb) bombsAround += 1;
          if (tiles[i - 1][j + 1].bomb) bombsAround += 1;
          if (tiles[i][j - 1].bomb) bombsAround += 1;
          if (tiles[i][j + 1].bomb) bombsAround += 1;
          if (tiles[i + 1][j - 1].bomb) bombsAround += 1;
          if (tiles[i + 1][j].bomb) bombsAround += 1;
          if (tiles[i + 1][j + 1].bomb) bombsAround += 1;
        } else {
          if (i == 0) {
            if (tiles[i + 1][j].bomb) bombsAround += 1;
            if (j == 0) {
              if (tiles[i][j + 1].bomb) bombsAround += 1;
              if (tiles[i + 1][j + 1].bomb) bombsAround += 1;
            } else if (j == cols - 1) {
              if (tiles[i][j - 1].bomb) bombsAround += 1;
              if (tiles[i + 1][j - 1].bomb) bombsAround += 1;
            } else {
              if (tiles[i][j - 1].bomb) bombsAround += 1;
              if (tiles[i][j + 1].bomb) bombsAround += 1;
              if (tiles[i + 1][j - 1].bomb) bombsAround += 1;
              if (tiles[i + 1][j + 1].bomb) bombsAround += 1;
            }
          } else if (i == rows - 1) {
            if (tiles[i - 1][j].bomb) bombsAround += 1;
            if (j == 0) {
              if (tiles[i][j + 1].bomb) bombsAround += 1;
              if (tiles[i - 1][j + 1].bomb) bombsAround += 1;
            } else if (j == cols - 1) {
              if (tiles[i][j - 1].bomb) bombsAround += 1;
              if (tiles[i - 1][j - 1].bomb) bombsAround += 1;
            } else {
              if (tiles[i][j - 1].bomb) bombsAround += 1;
              if (tiles[i][j + 1].bomb) bombsAround += 1;
              if (tiles[i - 1][j - 1].bomb) bombsAround += 1;
              if (tiles[i - 1][j + 1].bomb) bombsAround += 1;
            }
          } else {
            if (j == 0) {
              if (tiles[i][j + 1].bomb) bombsAround += 1;
              if (tiles[i + 1][j].bomb) bombsAround += 1;
              if (tiles[i + 1][j + 1].bomb) bombsAround += 1;
              if (tiles[i - 1][j].bomb) bombsAround += 1;
              if (tiles[i - 1][j + 1].bomb) bombsAround += 1;
            } else if (j == cols - 1) {
              if (tiles[i][j - 1].bomb) bombsAround += 1;
              if (tiles[i + 1][j].bomb) bombsAround += 1;
              if (tiles[i + 1][j - 1].bomb) bombsAround += 1;
              if (tiles[i - 1][j].bomb) bombsAround += 1;
              if (tiles[i - 1][j - 1].bomb) bombsAround += 1;
            }
          }
        }

        tiles[i][j].blank = bombsAround == 0 ? true : false;
        tiles[i][j].bombsAround = bombsAround;
        tiles[i][j].tile.classList.add(`n${bombsAround}`);
        // tiles[i][j].tile.setAttribute('displayed', 'true');
        // tiles[i][j].tile.innerHTML = bombsAround == 0 ? '' : bombsAround;
      }
    }
  }
}

function resetGrid() {
  while (grid.firstChild) {
    grid.removeChild(grid.firstChild);
  }
  tiles = drawTiles();
}

function showTiles(x, y) {
  if (checkedTiles.includes(tiles[x][y].id)) return;

  checkedTiles.push(tiles[x][y].id);
  if (!tiles[x][y].blank) {
    tiles[x][y].tile.innerHTML = tiles[x][y].bombsAround;
    tiles[x][y].tile.setAttribute('displayed', true);
    tiles[x][y].tile.disabled = true;

    return;
  }
  tiles[x][y].tile.setAttribute('displayed', true);
  tiles[x][y].tile.disabled = true;
  if (y + 1 < cols) showTiles(x, y + 1);
  if (y - 1 >= 0) showTiles(x, y - 1);
  if (x - 1 >= 0) showTiles(x - 1, y);
  if (x - 1 >= 0 && y + 1 < cols) showTiles(x - 1, y + 1);
  if (x - 1 >= 0 && y - 1 >= 0) showTiles(x - 1, y - 1);
  if (x + 1 < rows) showTiles(x + 1, y);
  if (x + 1 < rows && y + 1 < cols) showTiles(x + 1, y + 1);
  if (x + 1 < rows && y - 1 >= 0) showTiles(x + 1, y - 1);
}

function loadBoard() {
  tiles.forEach((col) => {
    col.forEach((tile) => {
      tile.tile.addEventListener('mouseup', (e) => {
        e.preventDefault();
        if (e.button === 0) {
          if (tile.tile.classList.contains('begin')) {
            handleFirstClick(tile);
            tiles.forEach((col) => {
              col.forEach((tile) => {
                tile.tile.classList.remove('begin');
              });
            });
          } else {
            handleClick(tile);
          }
        } else if (e.button === 2) {
          handleFlagClick(tile);
        }
      });
    });
  });
}

function resetBoard() {
  stopStopWatch();
  resetGrid();
  loadBoard();
  tiles.forEach((col) => {
    col.forEach((tile) => {
      tile.tile.classList.add('begin');
    });
  });
  stopStopWatch();
}

function handleFirstClick(tile) {
  const x = tile.x;
  const y = tile.y;

  drawBoard(tile, bombs);
  checkedTiles = [];
  showTiles(tile.y, tile.x);
  timer = true;
  stopWatch();
}

function showBombs() {
  let delay = 100;
  for (let i = 0; i < tiles.length; i++) {
    for (let j = 0; j < tiles[i].length; j++) {
      tiles[i][j].tile.disabled = true;
    }
  }
  // alert('game over');
  for (let i = 0; i < tiles.length; i++) {
    for (let j = 0; j < tiles[i].length; j++) {
      setTimeout(() => {
        if (tiles[i][j].bomb) {
          if (tiles[i][j].tile.firstChild) tiles[i][j].tile.firstChild.remove();
          const img = new Image();
          img.src = './images/bomb.png';
          tiles[i][j].tile.appendChild(img);
        }
      }, delay);
      delay += 5;
    }
  }
  return delay;
}

function handleClick(tile) {
  if (tile.bomb) {
    timer = false;
    const delay = showBombs();
    setTimeout(() => {
      displayEndGameMenu(1, second, minute);
    }, delay + 100);
  } else {
    if (tile.blank) {
      showTiles(tile.y, tile.x);
    } else {
      tile.tile.setAttribute('displayed', 'true');
      tile.tile.innerHTML = tile.bombsAround;
      tile.tile.disabled = true;
    }

    let gameOver = true;
    for (let i = 0; i < tiles.length; i++) {
      for (let j = 0; j < tiles[i].length; j++) {
        if (!tiles[i][j].bomb) {
          if (!tiles[i][j].tile.disabled) {
            gameOver = false;
          }
        }
      }
    }
    if (gameOver) {
      displayEndGameMenu(0, second, minute);
      showBombs();
      timer = false;
    }
  }
}

function handleFlagClick(tile) {
  if (!tile.tile.firstChild) {
    const img = new Image();
    img.src = './images/flag.png';
    tile.tile.appendChild(img);
  } else {
    tile.tile.firstChild.remove();
  }
}

function hideEndGameMenu() {
  endGame.style.zIndex = '0';
  grid.style.filter = 'blur(0px)';
  playAgain.disabled = true;
}

function displayEndGameMenu(result, sec, min) {
  let minString = min;
  let secString = sec;

  if (minute < 10) {
    minString = `0${minString}`;
  }

  if (second < 10) {
    secString = `0${secString}`;
  }
  const time = `Time: ${minString}:${secString}`;

  const endTime = document.getElementById('end--time');
  const resultDisplay = document.getElementById('result--display');

  resultDisplay.innerHTML = result === 0 ? 'YOU WON' : 'GAME OVER';

  endTime.innerHTML = time;
  endGame.style.zIndex = '1';
  grid.style.filter = 'blur(2px)';
  playAgain.disabled = false;
}

reset.addEventListener('click', (e) => {
  resetBoard();
  hideEndGameMenu();
});

select.addEventListener('change', (e) => {
  resetBoard();
  hideEndGameMenu();
});

playAgain.addEventListener('click', (e) => {
  resetBoard();
  hideEndGameMenu();
});

loadBoard();
