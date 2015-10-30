var canvas;
var player;

var TILE_SIZE = 64;
var PLAYER_SIZE = 50;

var PUZZLE_WIDTH = 16;
var PUZZLE_HEIGHT = 8;


var puzzle;

function setup() {
    var RED = color(231, 76, 60);
    var YELLOW = color(241, 196, 15);
    var GREEN = color(46, 204, 113);
    var ORANGE = color(230, 126, 34);
    var BLUE = color(52, 152, 219);
    var PURPLE = color(155, 89, 182);
    var PINK = color(244, 114, 208);
    var COLORS = [RED, YELLOW, GREEN, ORANGE, BLUE, PURPLE, PINK];
    
    canvas = createCanvas(windowWidth, windowHeight);

    player = {
        x: 0,
        y: 0
    };
    
    // Initialize the puzzle state
    puzzle = new Array(PUZZLE_WIDTH);
    for(var x=0;x<PUZZLE_WIDTH;x++) {
        puzzle[x] = new Array(PUZZLE_HEIGHT);
        for(var y=0;y<PUZZLE_HEIGHT;y++) {
            var index = round(random(COLORS.length - 1));
            puzzle[x][y] = {
                color: COLORS[index]
            };
        }
    }
}

function draw() {
    // Clear the canvas
    canvas.clear();
    // Draw the puzzle area
    for(var x=0;x<PUZZLE_WIDTH;x++) {
        for(var y=0;y<PUZZLE_HEIGHT;y++) {
            fill(puzzle[x][y].color);
            rect((x + 1) * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }
    // Draw the player
    fill(255);
    ellipse(player.x * TILE_SIZE + TILE_SIZE/2, player.y * TILE_SIZE + TILE_SIZE/2, PLAYER_SIZE, PLAYER_SIZE);
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
    // Check that this is not out of bounds
    if (x >=0 && x<PUZZLE_WIDTH+2) {
        player.x = x;
    }
    if (y >=0 && y<PUZZLE_HEIGHT) {
        player.y = y;
    }
}
