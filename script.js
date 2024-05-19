const grid = document.querySelector('.board');
const reset = document.querySelector('.reset');
const rows = 16;
const cols = 16;
const bombs = 40;
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
        if (i > 0 && i < cols - 1 && j > 0 && j < rows - 1) {
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
            } else if (j == rows - 1) {
              if (tiles[i][j - 1].bomb) bombsAround += 1;
              if (tiles[i + 1][j - 1].bomb) bombsAround += 1;
            } else {
              if (tiles[i][j - 1].bomb) bombsAround += 1;
              if (tiles[i][j + 1].bomb) bombsAround += 1;
              if (tiles[i + 1][j - 1].bomb) bombsAround += 1;
              if (tiles[i + 1][j + 1].bomb) bombsAround += 1;
            }
          } else if (i == cols - 1) {
            if (tiles[i - 1][j].bomb) bombsAround += 1;
            if (j == 0) {
              if (tiles[i][j + 1].bomb) bombsAround += 1;
              if (tiles[i - 1][j + 1].bomb) bombsAround += 1;
            } else if (j == rows - 1) {
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
            } else if (j == rows - 1) {
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

function handleFirstClick(tile) {
  const x = tile.x;
  const y = tile.y;

  drawBoard(tile, bombs);
  checkedTiles = [];
  showTiles(tile.y, tile.x);
  timer = true;
  stopWatch();
}

function handleClick(tile) {
  let delay = 100;
  if (tile.bomb) {
    stopStopWatch();
    // alert('game over');
    for (let i = 0; i < tiles.length; i++) {
      for (let j = 0; j < tiles[i].length; j++) {
        setTimeout(() => {
          if (tiles[i][j].bomb) {
            if (tiles[i][j].tile.firstChild)
              tiles[i][j].tile.firstChild.remove();
            const img = new Image();
            img.src = './images/bomb.png';
            tiles[i][j].tile.appendChild(img);
          }
        }, delay);
        delay += 5;
      }
    }
  } else if (tile.blank) {
    showTiles(tile.y, tile.x);
  } else {
    tile.tile.setAttribute('displayed', 'true');
    tile.tile.innerHTML = tile.bombsAround;
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

reset.addEventListener('click', (e) => {
  resetGrid();
  loadBoard();
  tiles.forEach((col) => {
    col.forEach((tile) => {
      tile.tile.classList.add('begin');
    });
  });
  stopStopWatch();
});

loadBoard();

// prevent first tile clicked from being a bomb
// first tile clicked has to be a blank tile
// make it so only blank tiles and all tiles around them are shown on first click
// add flag right click
