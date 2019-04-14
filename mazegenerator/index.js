
/////*********    TODO    **************////////////////////

/*

Convert A* to take a grid and solve it in isolation.
- All solving logic is self contained.
- Neighbors,etc.

*/ 


let maze;
let enemies = [];
let player;
let solver;    

function preload() {
    

}

function setup() {

    let winWidth = window.innerWidth;
    let winHeight = window.innerHeight;

    if (winWidth > winHeight) winWidth = winHeight;
    else if (winHeight > winWidth) winHeight = winWidth;

    createCanvas(winWidth, winHeight);

    //frameRate(60);

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


function draw() {
        
        background(51);
    
        maze.draw();    

        player.move(player.movementDirection);
        
        player.show();      
        
        enemies.forEach(enemy => {
            enemy.pursue(player,maze,solver);
            enemy.show();
        });


}


function keyPressed() {
    if (maze && maze.isInitialized) {
       player.handleKeyPress(keyCode);
    }

}