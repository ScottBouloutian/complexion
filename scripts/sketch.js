var TILE_SIZE = 64;
var PLAYER_SIZE = 50;
var PUZZLE_WIDTH = 16;
var PUZZLE_HEIGHT = 8;
var TYPES = ['red', 'yellow', 'green', 'orange', 'blue', 'purple', 'pink'];
var COLORS;
var TILES;
var HEART;

var canvas;
var player;
var puzzle;
var startTime;
var elapsedTime;

function generatePuzzle() {
    puzzle = new Array(PUZZLE_WIDTH);
    for(var x=0;x<PUZZLE_WIDTH;x++) {
        puzzle[x] = new Array(PUZZLE_HEIGHT);
        for(var y=0;y<PUZZLE_HEIGHT;y++) {
            var index = round(random(TYPES.length - 1));
            puzzle[x][y] = TILES[TYPES[index]];
        }
    }
}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('game');
    // Initialize the player
    player = {
        x: 0,
        y: 0,
        life: 5,
        scent: 'none'
    };
    elapsedTime = 0;
    // Load assets
    HEART = loadImage('assets/heart.png');
    // Initialize the possible tiles
    var RED = color(231, 76, 60);
    var YELLOW = color(241, 196, 15);
    var GREEN = color(46, 204, 113);
    var ORANGE = color(230, 126, 34);
    var BLUE = color(52, 152, 219);
    var PURPLE = color(155, 89, 182);
    var PINK = color(244, 114, 208);
    COLORS = [RED, YELLOW, GREEN, ORANGE, BLUE, PURPLE, PINK];
    TILES = {};
    TYPES.forEach(function(type, index) {
        TILES[type] = {
            type: type,
            index: index
        };
    });
    // Initialize the puzzle state
    generatePuzzle();
    // Prevent page scrolling on arrow key press
    window.addEventListener("keydown", function(e) {
        // arrow keys
        if([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    }, false);
}

function draw() {
    // Clear the canvas
    canvas.clear();
    // Draw the puzzle area
    for(var x=0;x<PUZZLE_WIDTH;x++) {
        for(var y=0;y<PUZZLE_HEIGHT;y++) {
            var tile = puzzle[x][y];
            switch(tile.type) {
            case 'red':
                var baseX = (x + 1) * TILE_SIZE;
                var baseY = y * TILE_SIZE;
                var LIGHT_RED = color(255, 76, 60);
                fill(LIGHT_RED);
                rect(baseX, baseY, TILE_SIZE, TILE_SIZE);
                fill(COLORS[tile.index]);
                rect(baseX + 10, baseY + 10, TILE_SIZE-20, TILE_SIZE-20);
                stroke(0);
                break;
            default:
                fill(COLORS[tile.index]);
                rect((x + 1) * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
    }
    // Draw the player
    fill(255);
    ellipse((player.x + 0.5) * TILE_SIZE, player.y * TILE_SIZE + TILE_SIZE/2, PLAYER_SIZE, PLAYER_SIZE);
    // Draw the player's life
    for(var i=0;i<player.life;i++) {
        image(HEART, TILE_SIZE + i * 32, PUZZLE_HEIGHT * TILE_SIZE, 32, 32);
    }
    // Draw the time
    fill(0);
    if(player.x > 0 && player.x < PUZZLE_WIDTH + 1) {
        var now = new Date();
        var time = now.getTime();
        elapsedTime = time - startTime;
    }
    text(elapsedTime / 1000, TILE_SIZE + 6 * 32, PUZZLE_HEIGHT * TILE_SIZE + 16);
}

function movePlayer(x, y) {
    // Check that this is not out of bounds
    if (x < 0 || x > PUZZLE_WIDTH+1 || y < 0 || y > PUZZLE_HEIGHT-1) {
        return;
    }
    // Start the clock if movign onto the puzzle
    if(player.x === 0 && x === 1) {
        startTime = Date.now();
    }
    // Handle stepping on the puzzle
    if(x !== 0 && x !== PUZZLE_WIDTH+1) {
        var pzlX = x-1;
        var pzlY = y;
        switch(puzzle[pzlX][pzlY].type) {
        case 'red':
            return;
        case 'yellow':
            player.life--;
            break;
        case 'green':
            generatePuzzle();
            movePlayer(x, y);
            return;
        case 'orange':
            player.scent = 'oranges';
            break;
        case 'blue':
            if(player.scent === 'oranges') {
                player.life--;
            }
            player.scent = 'none';
            var adjacentYellow = ((pzlX > 0 && puzzle[pzlX-1][pzlY].type === 'yellow') ||
                (pzlX < PUZZLE_WIDTH - 1 && puzzle[pzlX+1][pzlY].type === 'yellow') ||
                (pzlY > 0 && puzzle[pzlX][pzlY-1].type === 'yellow') ||
                (pzlY < PUZZLE_HEIGHT - 1 && puzzle[pzlX][pzlY+1].type === 'yellow'));
            if(adjacentYellow) {
                player.life--;
            }
            break;
        case 'purple':
            var directionX = x - player.x;
            var directionY = y - player.y;
            player.x = x;
            player.y = y;
            player.scent = 'lemons';
            x += directionX;
            y += directionY;
            movePlayer(x, y);
            return;
        }
    }
    if(player.life <= 0) {
        player = {
            x: 0,
            y: 0,
            life: 5,
            scent: 'none'
        };
        elapsedTime = 0;
        startTime = Date.now();
        generatePuzzle();
    } else {
        player.x = x;
        player.y = y;
    }
}

function keyPressed() {
    // Determine where the player is trying to move to
    var x = player.x;
    var y = player.y;
    switch(keyCode) {
    case LEFT_ARROW:
        x--;
        break;
    case RIGHT_ARROW:
        x++;
        break;
    case UP_ARROW:
        y--;
        break;
    case DOWN_ARROW:
        y++;
        break;
    }
    movePlayer(x, y);
}
