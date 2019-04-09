
/////*********    TODO    **************////////////////////

/*

Convert A* to take a grid and solve it in isolation.
     - All solving logic is self contained.
     - Neighbors,etc.

*/ 


let maze;
let enemies = [];
let player;
function preload() {


}

function setup() {

    let winWidth = window.innerWidth;
    let winHeight = window.innerHeight;

    if (winWidth > winHeight) winWidth = winHeight;
    else if (winHeight > winWidth) winHeight = winWidth;

    createCanvas(winWidth, winHeight);

    //frameRate(30);

    maze = new Maze(width, height);

    maze.initialize(width, height);
    maze.buildMaze();
    
    
    player = new Player(maze,maze.cellSize,maze.cellSize);
    enemies.push(new Enemy(maze,maze.cellSize,maze.cellSize,'GREEN',player));
    enemies.push(new Enemy(maze,maze.cellSize,maze.cellSize,'GREY',player));
    enemies.push(new Enemy(maze,maze.cellSize,maze.cellSize,'YELLOW',player));
    enemies.push(new Enemy(maze,maze.cellSize,maze.cellSize,'RED',player));
    enemies.push(new Enemy(maze,maze.cellSize,maze.cellSize,'',player));

    // maze.AStar.solve();
    // maze.AStar.generateSolutionPath();


    //enemy.AStar.solve();
    //enemy.AStar.generateSolutionPath();

}


function draw() {
        
        background(51);
    
   
        
        maze.draw();       
        player.show();      
        
        enemies.forEach(enemy => {

            maze.resetCellValues();


            let solver = new AStar();    

            enemy.show();
            
            solver.setOrigin(maze.getCell(enemy.i,enemy.j));
            solver.setTarget(maze.getCell(player.i,player.j));
            
            solver.solve();
            
            solver.generateSolutionPath();
            solver.drawPathSolution(enemy.color);

            let newPosition = solver.pathSolution[solver.pathSolution.length-2];
            //let newPosition = solver.pathSolution[solver.pathSolution.length];
            if (newPosition) {
                enemy.move(newPosition.i,newPosition.j);
            }
           

        });

       // maze.AStar.drawPathSolution();
        

        
        


}


class Maze {
    constructor(w, h, cols, rows) {
        this.isInitialized = false;
        this.start = null;
        this.end = null;
        this.grid = [];
        this.AStar = null;
        this.pathSolution = [];
        this.stack = [];
        this.cellSize = 25;
        this.currentCell = null;
        this.WallPositions = {
            TOP: 0,
            RIGHT: 1,
            BOTTOM: 2,
            LEFT: 3
        }
        this.columns = null;
        this.rows = null;
    }

    setRowsAndCols(cols, rows) {
        this.columns = cols;
        this.rows = rows;
    }
    addCell(cell) {
        this.grid.push(cell);
    }
    reset() {
        maze = new Maze(width, height);
        maze.initialize(width, height);
        maze.buildMaze();
    }
    initialize(width, height) {
        let cols = floor(width / this.cellSize);
        let rows = floor(height / this.cellSize);

        this.grid = [];

        this.setRowsAndCols(rows, cols);


        for (let j = 0; j < rows; j++) {
            for (let i = 0; i < cols; i++) {
                this.addCell(new Cell(i, j, this.cellSize, this.cellSize, this));
            }
        }

        //Start building maze in top left corner
        this.currentCell = maze.grid[0];
        
        
    }
    draw() {

        this.grid.forEach(cell => {
            cell.show();
            cell.highlight(false);
        });

    }
    resetCellValues(){

        this.grid.forEach(cell => {
            cell.reset();
        });

    }
    buildMaze() {

        while (!maze.isInitialized) {

            let nextCell = this.currentCell.checkNeighbors();

            if (nextCell) {

                nextCell.visited = true;

                this.stack.push(this.currentCell);
                this.removeWalls(this.currentCell, nextCell);



                this.currentCell = nextCell;
            } else if (this.stack.length > 0) {
                this.currentCell = maze.stack.pop();
            } else {
                //Maze is built.
                this.prepareMazeToSolve();
            }


        }

    }

    solveMaze() {

        //No more items in stack to build maze.
        //Time to solve.
        
        // if (this.AStar.openSet.length > 0) {
        //     console.log("Running Solve");
        // } else {
        //     console.log("No solution?");
        //     //noLoop();
        //     let cell = this.grid[this.getIndex(this.player.i,this.player.j)];
        //     this.AStar.openSet.push(cell);
        //     this.AStar.solve();
        // }
    }
    
    setStartAndEnd(onlySetEnd) {
        let maze = this;

        if (maze.end) {
            maze.end.type = null
        }

        if (onlySetEnd == undefined || onlySetEnd === false) {
            if (maze.start) {
                maze.start.type = null;
            }
            maze.start = maze.grid[floor(random(maze.grid.length - 1))];
        }

        maze.end = maze.grid[floor(random(maze.grid.length - 1))];

        if (maze.start === maze.end) maze.setStartAndEnd(true);

        maze.start.type = 'START';
        maze.end.type = 'END';
    }
    getIndex(i, j) {

        if (i < 0 || j < 0 || i > this.columns - 1 || j > this.rows - 1) {
            return -1;
        }
        //Single index array indexing trick....
        return i + j * this.columns;
    }
    getCell(i,j){
        return this.grid[this.getIndex(i, j)];
    }
    updateEndPosiiton(i, j) {
        this.end = this.grid[this.getIndex(i, j)];
    }
    prepareMazeToSolve() {
        this.setStartAndEnd();


        this.AStar = new AStar(this.start,this.end, color(255, 0, 0,200));

        this.isInitialized = true;


    }
    
    removeWalls(currentCell, nextCell) {
        let x = currentCell.i - nextCell.i;
        let y = currentCell.j - nextCell.j;
       

            if (x === 1) {
                currentCell.walls[maze.WallPositions.LEFT].visible = false;
                nextCell.walls[maze.WallPositions.RIGHT].visible = false;
                currentCell.visitableNeighbors.push(nextCell);
                nextCell.visitableNeighbors.push(currentCell);
            } else if (x === -1) {
                currentCell.walls[maze.WallPositions.RIGHT].visible = false;
                nextCell.walls[maze.WallPositions.LEFT].visible = false;
                currentCell.visitableNeighbors.push(nextCell);
                nextCell.visitableNeighbors.push(currentCell);
            }
    
            if (y === 1) {
                currentCell.walls[maze.WallPositions.TOP].visible = false;
                nextCell.walls[maze.WallPositions.BOTTOM].visible = false;
                currentCell.visitableNeighbors.push(nextCell);
                nextCell.visitableNeighbors.push(currentCell);
            } else if (y === -1) {
                currentCell.walls[maze.WallPositions.BOTTOM].visible = false;
                nextCell.walls[maze.WallPositions.TOP].visible = false;
                currentCell.visitableNeighbors.push(nextCell);
                nextCell.visitableNeighbors.push(currentCell);
            }
       
    }

}


class Cell {
    constructor(i, j, w, h, maze) {
        this.i = i;
        this.j = j;
        this.w = w;
        this.h = h;
        this.color = null;
        this.visited = false;
        this.type = null;
        this.fScore = 0;
        this.gScore = 0;
        this.hScore = 0;
        this.previous = null;
        this.neighbors = null;
        this.visitableNeighbors = [];

        this.walls = [{
                position: maze.WallPositions.TOP,
                visible: true,
                show: function (x, y, w, h) {
                    line(x, y, x + w, y);
                }
            },
            {
                position: maze.WallPositions.RIGHT,
                visible: true,
                show: function (x, y, w, h) {
                    line(x + w, y, x + w, y + h);
                }
            },
            {
                position: maze.WallPositions.BOTTOM,
                visible: true,
                show: function (x, y, w, h) {
                    line(x + w, y + h, x, y + h);
                }
            },
            {
                position: maze.WallPositions.LEFT,
                visible: true,
                show: function (x, y, w, h) {
                    line(x, y + h, x, y);
                }
            }
        ];

    }
    
    reset(){
        this.fScore = 0;
        this.gScore = 0;
        this.hScore = 0;
        this.previous = null;
    }
    addNeighbors() {
        let neighbors = [];
        neighbors.push(maze.grid[maze.getIndex(this.i, this.j + 1)]);
        neighbors.push(maze.grid[maze.getIndex(this.i + 1, this.j)]);
        neighbors.push(maze.grid[maze.getIndex(this.i, this.j - 1)]);
        neighbors.push(maze.grid[maze.getIndex(this.i - 1, this.j)]);
        //Remove neighbor items which do not exist, i.e: edges
        this.neighbors = neighbors.filter(index => (index !== undefined && index !== null));

    }
    
    checkNeighbors() {
        let notVisitedNeighbors = [];
        if (this.neighbors == null) this.addNeighbors();

        

        this.neighbors.forEach(neighbor => {
            if (neighbor.visited === false) {
                notVisitedNeighbors.push(neighbor);
            }
        });

        if (notVisitedNeighbors.length > 0) {
            


            let rando = floor(random(0, notVisitedNeighbors.length));
            
            //console.log(this);
            //console.log(notVisitedNeighbors);
            
            return notVisitedNeighbors[rando];
        } else {
            return undefined;
        }

    }
    highlight(highlight) {
        this.highlighted = highlight;
    }
    show() {
        let x = this.i * maze.cellSize;
        let y = this.j * maze.cellSize;
        let w = this.w;
        let h = this.h;




        //Draw visited state;
        noStroke();
        // if (this.maze.stack.indexOf(this) > -1){
        //     fill(0,0,100,100);
        //     rect(x,y,w,h);
        // }
        // else if (this.visited === true) {
        //     fill(0,255,0,255);
        //     rect(x,y,w,h);
        // }
        // if (this.highlighted) {
        //     fill(0, 0, 255);
        //     rect(x, y, w, h);
        // }

        // if (this.type == "START") {
        //     fill(0, 255, 0);
        //     rect(x, y, w, h);
        // }
        // else if (this.type == "END") {
        //     fill(255,0,0);
        //     rect(x,y,w,h);
        // }




        // else if (this.color) {
        //     fill(this.color);
        //     rect(x, y, w, h);
        // }

        noStroke();
        stroke(255);
        noFill();

        //Draw walls
        this.walls.forEach(wall => {
            if (wall.visible === true) {
                wall.show(x, y, w, h);
            }


        });

    }



}


class Player extends Cell {
    constructor(maze,height,width) {
        
        let i,j,w,h,tempCell;

        h = height;
        w = width;

        function determinePosition(){
            tempCell = maze.grid[floor(random(maze.grid.length - 1))];
            if (tempCell === maze.start || tempCell === maze.end) {
                //determinePosition();
            }
            return tempCell;
        }
        
        tempCell = determinePosition();
        
        i = tempCell.i;
        j = tempCell.j;
        
        
        super(i, j, w, h, maze);
        this.type = 'PLAYER';
        this.color = color(0, 0, 255);



    }
    canMoveTo(newI,newJ) {
        let futureCell;
        let currentCell;

        futureCell = maze.getCell(newI, newJ);

        currentCell = maze.getCell(this.i,this.j);

        //Check if we can move here....
        return currentCell.visitableNeighbors.includes(futureCell);
    }
    move() {
        let newI = 0;
        let newJ = 0;
        


        if (keyIsDown(LEFT_ARROW)) {
            newI = -1;
            
        }

        if (keyIsDown(RIGHT_ARROW)) {
            newI = 1;
            
        }

        if (keyIsDown(UP_ARROW)) {
            newJ = -1;
            
        }

        if (keyIsDown(DOWN_ARROW)) {
            newJ = 1;
        }



        newI = this.i + newI;
        newJ = this.j + newJ;

        //if (this.canMoveTo(newI,newJ)) {
            this.i = newI;
            this.j = newJ;
          
       // }

    }

    show() {
        let cell = this;
                
        noStroke();
        fill(this.color);
        circle(cell.i * cell.w + cell.w / 2, cell.j * cell.h + cell.h / 2, cell.w / 2);
    }
}

class Enemy extends Player {
    constructor(maze,height,width,enemyName,player) {
        super(maze,height,width);

    
    let origin = maze.getCell(this.i,this.j);
    let target = maze.getCell(player.i,player.j)
    
    this.type = 'ENEMY';
    
    if (enemyName == 'RED') {
        this.color = color(255,0,0);
        this.speed = 30;
    }
    
    else if (enemyName == 'GREY') {
        this.color = color(175,175,175);
        this.speed = 20;
    }
    
    else if (enemyName == 'GREEN') {
        this.color = color(0,255,0);
        this.speed = 10;
    }
    
    else if (enemyName == 'YELLOW') {
        this.color = color(255,255,0);
        this.speed = 5;
    }
    else {
        this.color = color(255,150,150);
        this.speed = 5;
    }
    
}

move(newI,newJ){
    if (frameCount % this.speed == 0) {

        this.i = newI;
        this.j = newJ;
    }
    
    }
    show(){

        //super.show();
        let x = this.i * maze.cellSize;
        let y = this.j * maze.cellSize;
        let w = this.w*.8;
        let h = this.h*.8;
        noStroke();
        fill(this.color);
        rect(x,y,w,h);

    

    }

}

class AStar {
    constructor() {
        
        this.openSet = [];
        this.closedSet = [];
        this.pathSolution = [];
        this.currentCell = null;
        this.solved = false;
        this.origin = null;
        this.target = null;

    }
    reset(){
        this.openSet = [];
        this.closedSet = [];
        this.pathSolution = [];
        this.currentCell = null;
        this.origin = null;
        this.target = null;
    }
    setOrigin(origin){
        
        this.origin = origin;

        this.openSet.push(this.origin);

    }
    setTarget(target){
        this.target = target;
    }
    drawOpenset() {
        this.openSet.forEach(cell => {
        });
    }
    drawClosedSet() {
        
        this.closedSet.forEach(cell => {
        });

    }
    drawPathSolution(color) {
        noFill();
        beginShape();
        for (var i = 0; i < this.pathSolution.length; i++) {
            let cell = this.pathSolution[i];
            stroke(color);
            //strokeWeight(cell.w / 2);
            vertex(cell.i * cell.w + cell.w / 2, cell.j * cell.h + cell.h / 2);
        }
        endShape();

    }
    generateSolutionPath() {
        this.pathSolution = [];
        let temp = this.currentCell;
        this.pathSolution.push(temp);
        while (temp.previous != null) {
            this.pathSolution.push(temp.previous);
            temp = temp.previous;
        }
    }
    solve() {

        while (this.openSet.length > 0) {

            let winner = 0;

            for (let i = 0; i < this.openSet.length; i++) {
                const cell = this.openSet[i];
                const winnerCell = this.openSet[winner];
                if (cell.fScore < winnerCell.fScore) {
                    winner = i;
                }
            }

            this.currentCell = this.openSet[winner];


            if (this.currentCell === this.target) {
                this.solved = true;
                return true;
            }

            let prevOpenLength = this.openSet.length;
            this.openSet = this.openSet.filter(item => item !== this.currentCell);
            if (this.openSet.length == prevOpenLength) {
                debugger;
            }


            this.closedSet.push(this.currentCell);


            let neighbors = this.currentCell.visitableNeighbors;
            neighbors.forEach(neighbor => {
                //Neighbor has not been ruled out, and neighbor is allowed to be visited
                if (!this.closedSet.includes(neighbor) && this.currentCell.visitableNeighbors.includes(neighbor)) {
                    let tempGScore = this.currentCell.gScore + this.calculateHeuristic(neighbor, this.currentCell);
                    let newPath = false;

                    if (this.openSet.includes(neighbor)) {
                        if (tempGScore < neighbor.gScore) {
                            neighbor.gScore = tempGScore;
                            newPath = true;
                        }
                    } else {
                        neighbor.gScore = tempGScore;
                        this.openSet.push(neighbor);
                        newPath = true;
                    }

                    if (newPath) {
                        neighbor.hScore = this.calculateHeuristic(neighbor, this.target);
                        neighbor.fScore = neighbor.gScore + neighbor.hScore;
                        neighbor.previous = this.currentCell;
                    }

                }
            });
        }


    }
    calculateHeuristic(a, b) {
        //let distance = abs(a.i-b.i) + abs(a.j-b.j);
        let distance = dist(a.i, a.j, b.i, b.j);
        return distance;
    }


}



function keyPressed() {
    if (maze && maze.isInitialized) {
        player.move(keyCode);
    }

}