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
    var TYPES = ['red', 'yellow', 'green', 'orange', 'blue', 'purple', 'pink'];
    var COLORS = [RED, YELLOW, GREEN, ORANGE, BLUE, PURPLE, PINK];
    
    canvas = createCanvas(windowWidth, windowHeight);

    player = {
        x: 0,
        y: 0,
        life: 5,
        scent: 'none'
    };
    
    // Initialize the puzzle state
    puzzle = new Array(PUZZLE_WIDTH);
    for(var x=0;x<PUZZLE_WIDTH;x++) {
        puzzle[x] = new Array(PUZZLE_HEIGHT);
        for(var y=0;y<PUZZLE_HEIGHT;y++) {
            var index = round(random(COLORS.length - 1));
            puzzle[x][y] = {
                type: TYPES[index],
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
    ellipse((player.x + 0.5) * TILE_SIZE, player.y * TILE_SIZE + TILE_SIZE/2, PLAYER_SIZE, PLAYER_SIZE);
    // Draw the player's life
    for(var i=0;i<player.life;i++) {
        ellipse(TILE_SIZE + i * 32, PUZZLE_HEIGHT * TILE_SIZE, 32, 32);
    }
}

function movePlayer(x, y) {
    // Check that this is not out of bounds
    if (x < 0 || x > PUZZLE_WIDTH+1 || y < 0 || y > PUZZLE_HEIGHT-1) {
        return;
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
            break;
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
    player.x = x;
    player.y = y;
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
