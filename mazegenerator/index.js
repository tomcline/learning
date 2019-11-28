
/////*********    TODO    **************////////////////////
/*
Convert to PIXELS for X,Y on cells
Player and enemy really don't need to extend cell
Switch calculations to async or webworker?
Sound
*/


let maze;
let enemies = [];
let player;
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


//P5 js key handler.
function keyPressed() {

    gameSounds.intro.stop();


    if (maze && maze.isInitialized) {
       player.handleKeyPress(keyCode);
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
    enemies.push(new Enemy(maze,maze.cellSize,maze.cellSize,'INKY',player));
    enemies.push(new Enemy(maze,maze.cellSize,maze.cellSize,'BLINKY',player));
    enemies.push(new Enemy(maze,maze.cellSize,maze.cellSize,'PINKY',player));
    enemies.push(new Enemy(maze,maze.cellSize,maze.cellSize,'CLYDE',player));




}

function drawDebugInfo(){
    player.drawDebugInfo();

    maze.grid.forEach(cell => {
        cell.drawDebugInfo();
    });

    enemies.forEach(enemy => {
        enemy.drawDebugInfo();
    });
}

function draw() {
        
        background(51);
    
        maze.draw();    

        player.move();
        
        player.show();      
        
        enemies.forEach(enemy => {
            enemy.pursue(player,maze,solver);
            enemy.show();
        });

        //drawDebugInfo();


}

