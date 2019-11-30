
// TODO Enemy speed....
// TODO Implement better enemy turn around prevention.....
//TODO Optimize enemy turn checking - only check at intersections - i.e. not every time in middle of cell with forward backward options
// TODO Need a game class. index.js is getting messy.
//https://gameinternals.com/understanding-pac-man-ghost-behavior
// TODO Player enemy collisions
//TODO Keep Score
// TODO New map generation? https://github.com/shaunlebron/pacman-mazegen
// FIXME Player warps through walls and gets out of syncp5.BandPass()

let debug = false;
let disableAllWalls = false;
let maze;
let enemies = [];
let player;
let inky,pinky,blinky,clyde;
let solver;    
let ghosties_img;
let gameSounds = {
    intro:null,
    pacChomp: null,
    pacDeath: null,
    pacEatFruit: null,
    pacEatGhost: null,
    pacExtraPac: null,
    pacIntermission: null,
    pacSiren: null
}

let keyCodes = {
    D: 68,
    SPACEBAR: 32
}

let enemyModes = {
    Wait: 0,
    Chase: 1,
    Scatter: 2,
    Frightened: 3
}
let game = {};
game.started = false;
game.paused = false;
game.enemyMode = enemyModes.Chase;

//P5 js key handler.
function keyPressed() {

    //Turn on debugging
    //D KEY
    if (keyCode == keyCodes.D) {
        debug = !debug;
    }




    //Start game.
    if (!game.started && keyCode == ENTER){
        game.started = true;
        gameSounds.intro.stop();
        enemies.forEach(enemy => {
            enemy.mode = enemyModes.Chase;
        });
    }
    
    //Only response to key presses after game has started
    if (game.started && !game.paused && (keyCode == UP_ARROW ||  keyCode == DOWN_ARROW || keyCode == RIGHT_ARROW || keyCode == LEFT_ARROW) && maze && maze.isInitialized) {
       player.handleKeyPress(keyCode);
    }

    //SPACE BAR
    if (game.started && keyCode == keyCodes.SPACEBAR) {
        game.paused = !game.paused;
        if (game.paused) {
            enemies.forEach(enemy => {
                enemy.modePrevious = enemy.mode;
                enemy.mode = enemyModes.Wait;
            });
        }
        else {
            enemies.forEach(enemy => {
                enemy.mode = enemy.modePrevious;

            });
        }
    }

}


function preload() {

    gameSounds.intro = loadSound('sounds/pacman_beginning.wav');
    gameSounds.pacChomp = loadSound('sounds/pacman_chomp.wav');
    gameSounds.pacDeath = loadSound('sounds/pacman_death.wav');
    gameSounds.pacEatFruit = loadSound('sounds/pacman_eatfruit.wav');
    gameSounds.pacEatGhost = loadSound('sounds/pacman_eatghost.wav');
    gameSounds.pacExtraPac = loadSound('sounds/pacman_extrapac.wav');
    gameSounds.pacIntermission = loadSound('sounds/pacman_intermission.wav');
    gameSounds.pacSiren = loadSound('sounds/pacman_siren_loop.ogg');

    ghosties_img = loadImage('images/ghosts.png');
}

function setup() {

    gameSounds.intro.play();

    let winWidth = window.innerWidth;
    let winHeight = window.innerHeight;

    if (winWidth > winHeight) winWidth = winHeight;
    else if (winHeight > winWidth) winHeight = winWidth;

    createCanvas(winWidth, winHeight);

    solver = new AStar();

    maze = new Maze(width, height);

    maze.initialize(width, height);
    maze.buildMaze();
    
    
    player = new Player(maze,maze.cellSize,maze.cellSize);
    inky = new Enemy(maze,maze.cellSize,maze.cellSize,'INKY',player);
    blinky = new Enemy(maze,maze.cellSize,maze.cellSize,'BLINKY',player);
    pinky = new Enemy(maze,maze.cellSize,maze.cellSize,'PINKY',player);
    clyde = new Enemy(maze,maze.cellSize,maze.cellSize,'CLYDE',player);
    enemies.push(inky);
    enemies.push(blinky);
    enemies.push(pinky);
    enemies.push(clyde);
}

function drawDebugInfo(){
    //player.drawDebugInfo();

    maze.grid.forEach(cell => {
        //cell.drawDebugInfo();
    });

    enemies.forEach(enemy => {
        //enemy.drawDebugInfo();
        solver.drawPathSolution(enemy.color,enemy.currentPath);
    });
}

function draw() {
        
        background(51);

        
        maze.draw();    
        
        
        if (!game.paused) {
            player.move();
        }
        
        player.show();      
        
        enemies.forEach(enemy => {
            enemy.pursue(player,maze,solver);
            enemy.show();
        });
        
        if (debug){
            drawDebugInfo();
        }
        

        if (!game.started) {
            push();
            textSize(width*.1);
            fill(235,255,0);
            textAlign(CENTER, CENTER);
             text("ENTER TO START", width/2, height/2);
             pop();
        }

        if (game.paused) {
            push();
            textSize(width*.1);
            fill(235,255,0);
            textAlign(CENTER, CENTER);
             text("PAUSED", width/2, height/2);
             pop();
        }

}

