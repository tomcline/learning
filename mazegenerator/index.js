//TODO Enemies can still CHANGE DIRECTION
// TODO Proper speed on movements, eating, etc.
//TODO Implement scatter chase wave logic - https://gameinternals.com/understanding-pac-man-ghost-behavior
//TODO Optimize enemy turn checking - only check at intersections - i.e. not every time in middle of cell with forward backward options
//TODO Move resources into game class
//https://gameinternals.com/understanding-pac-man-ghost-behavior
//http://www.designoriented.net/blog/tag/pac-man/
// TODO Player enemy collisions
// DONE New map generation? https://github.com/shaunlebron/pacman-mazegen
//https://github.com/shaunlebron/pacman-mazegen/blob/gh-pages/tetris/Map.js
// FIXME Player warps through walls and gets out of sync

let game;
let disableAllWalls = true;
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



//P5 js key handler.
function keyPressed() {
    game.handleKeyPress(keyCode);
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

    initGame();


}

function initGame(){
    
    game = new Game();
    
    solver = new AStar();
    
    maze = new Maze();
    
    maze.initialize();
    
    let multiplier = 1;

    createCanvas(maze.columns*maze.cellSize, maze.rows*maze.cellSize);
    player = new Player({i:13,j:26},maze,maze.cellSize*multiplier,maze.cellSize*multiplier);
    inky = new Enemy({i:12,j:17},maze,maze.cellSize*multiplier,maze.cellSize*multiplier,'INKY',player);
    blinky = new Enemy({i:13,j:17},maze,maze.cellSize*multiplier,maze.cellSize*multiplier,'BLINKY',player);
    pinky = new Enemy({i:14,j:17},maze,maze.cellSize*multiplier,maze.cellSize*multiplier,'PINKY',player);
    clyde = new Enemy({i:15,j:17},maze,maze.cellSize*multiplier,maze.cellSize*multiplier,'CLYDE',player);
    enemies.push(inky);
    enemies.push(blinky);
    enemies.push(pinky);
    enemies.push(clyde);

    game.player = player;
    game.maze = maze;
    game.enemies = enemies;
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


function chunkArray(myArray, chunk_size){
    var index = 0;
    var arrayLength = myArray.length;
    var tempArray = [];
    
    for (index = 0; index < arrayLength; index += chunk_size) {
        myChunk = myArray.slice(index, index+chunk_size);
        // Do something if you want with the group
        tempArray.push(myChunk);
    }

    return tempArray;
}


function draw() {
        
        background(25);

        maze.draw();    
                
        if (!game.paused) {
            player.move();
            
        }
        
        if (game.started && !gameSounds.pacSiren.isPlaying()) {
            gameSounds.pacSiren.loop(0, 1, .5);
        }
        else {
            //  gameSounds.pacSiren.stop();
        }

        player.show();      
        
        enemies.forEach(enemy => {
            if (!game.paused) {
                 enemy.pursue(player,maze,solver);
            }
            enemy.show();
        });
        
        if (game.debug){
            drawDebugInfo();
        }
        
        game.show();

}

