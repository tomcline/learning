
/////*********    TODO    **************////////////////////
/*
Convert to PIXELS for X,Y on cells
Player and enemy really don't need to extend cell
Switch calculations to async?
*/


let maze;
let enemies = [];
let player;
let solver;    
let ghosties_img;


//P5 js key handler.
function keyPressed() {
    if (maze && maze.isInitialized) {
       player.handleKeyPress(keyCode);
    }
}


function preload() {
    ghosties_img = loadImage('images/ghosts.png');
}

function setup() {

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

        drawDebugInfo();


}

