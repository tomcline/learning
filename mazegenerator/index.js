
/////*********    TODO    **************////////////////////

/*

Convert A* to take a grid and solve it in isolation.
     - All solving logic is self contained.
     - Neighbors,etc.

*/ 


let maze;
let ememy;
let player;

function preload() {


}

function setup() {

    let winWidth = window.innerWidth;
    let winHeight = window.innerHeight;

    if (winWidth > winHeight) winWidth = winHeight;
    else if (winHeight > winWidth) winHeight = winWidth;

    createCanvas(winWidth, winHeight);

    frameRate(5);

    maze = new Maze(width, height);

    maze.initialize(width, height);
    maze.buildMaze();
    
    
    
    enemy = new Enemy(maze,maze.cellSize,maze.cellSize);
    player = new Player(maze,maze.cellSize,maze.cellSize);
    
    enemy.AStar = new AStar(maze.getCell(enemy.i,enemy.j),maze.getCell(player.i,player.j), color(255, 255, 0,175));


    maze.AStar.solve();
    maze.AStar.generateSolutionPath();


    //enemy.AStar.solve();
    //enemy.AStar.generateSolutionPath();

}


function draw() {
        
        background(51);
    
        maze.resetCellValues();
   
        
        maze.draw();       
        player.show();      
        enemy.show();
        maze.AStar.drawPathSolution();
        
        enemy.AStar.setOrigin(maze.getCell(enemy.i,enemy.j));
        enemy.AStar.setTarget(maze.getCell(player.i,player.j));
        
        
        enemy.AStar.solve();
        enemy.AStar.generateSolutionPath();
        
        
        enemy.AStar.drawPathSolution();
        let newCell = enemy.AStar.pathSolution[enemy.AStar.pathSolution.length-2];
        enemy.move(newCell.i,newCell.j);
        
        
        enemy.AStar.reset();


        
        
        if (maze.AStar.solved === true) {
            //noLoop();
        }


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

       // this.player = new Player(this.end.i, this.end.j, this.end.w, this.end.h, this);

        this.AStar = new AStar(this.start,this.end, color(0, 255, 255,175));

        this.isInitialized = true;
        //this.openSet.push(this.start);

        console.log("A* Maze Solve");


    }
    
    removeWalls(currentCell, nextCell) {
        let maze = currentCell.maze;
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
        this.maze = maze;
        this.visited = false;
        this.type = null;
        this.fScore = 0;
        this.gScore = 0;
        this.hScore = 0;
        this.previous = null;
        this.neighbors = null;
        this.visitableNeighbors = [];

        this.walls = [{
                position: this.maze.WallPositions.TOP,
                visible: true,
                show: function (x, y, w, h) {
                    line(x, y, x + w, y);
                }
            },
            {
                position: this.maze.WallPositions.RIGHT,
                visible: true,
                show: function (x, y, w, h) {
                    line(x + w, y, x + w, y + h);
                }
            },
            {
                position: this.maze.WallPositions.BOTTOM,
                visible: true,
                show: function (x, y, w, h) {
                    line(x + w, y + h, x, y + h);
                }
            },
            {
                position: this.maze.WallPositions.LEFT,
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
        neighbors.push(this.maze.grid[this.maze.getIndex(this.i, this.j + 1)]);
        neighbors.push(this.maze.grid[this.maze.getIndex(this.i + 1, this.j)]);
        neighbors.push(this.maze.grid[this.maze.getIndex(this.i, this.j - 1)]);
        neighbors.push(this.maze.grid[this.maze.getIndex(this.i - 1, this.j)]);
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
            return notVisitedNeighbors[rando];
        } else {
            return undefined;
        }

    }
    highlight(highlight) {
        this.highlighted = highlight;
    }
    show() {
        let x = this.i * this.maze.cellSize;
        let y = this.j * this.maze.cellSize;
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
        if (this.highlighted) {
            fill(0, 0, 255);
            rect(x, y, w, h);
        }

        if (this.type == "START") {
            fill(0, 255, 0);
            rect(x, y, w, h);
        }
        else if (this.type == "END") {
            fill(255,0,0);
            rect(x,y,w,h);
        }
        else if (this.color) {
            fill(this.color);
            rect(x, y, w, h);
        }

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

        futureCell = this.maze.getCell(newI, newJ);

        currentCell = this.maze.getCell(this.i,this.j);

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

        if (this.canMoveTo(newI,newJ)) {
            this.i = newI;
            this.j = newJ;
            // this.maze.updateEndPosiiton(this.i, this.j);

            // this.maze.AStar.reset();
            // this.maze.AStar.setOrigin(this.maze.start);
            // this.maze.AStar.setTarget(this.maze.end);

            // this.maze.AStar.solve();

        }

    }

    show() {
        let cell = this;
        
        //this.move();
        
        noStroke();
        fill(this.color);
        circle(cell.i * cell.w + cell.w / 2, cell.j * cell.h + cell.h / 2, cell.w / 2);
    }
}

class Enemy extends Player {
    constructor(maze,height,width) {
        super(maze,height,width);
        
        this.type = 'ENEMY';
        this.color = color(255,255,255,200);
        

        
    }

    move(newI,newJ){

            this.i = newI;
            this.j = newJ;
        
    }

}

class AStar {
    constructor(origin,target,color) {
        
        this.openSet = [];
        this.closedSet = [];
        this.pathSolution = [];
        this.currentCell = null;
        this.pathColor = color;
        this.solved = false;
        this.setOrigin(origin);
        this.setTarget(target);


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
    drawPathSolution() {
        noFill();
        beginShape();
        for (var i = 0; i < this.pathSolution.length; i++) {
            let cell = this.pathSolution[i];
            stroke(this.pathColor);
            //strokeWeight(cell.w / 2);
            vertex(cell.i * cell.w + cell.w / 2, cell.j * cell.h + cell.h / 2);
        }
        endShape();

    }
    generateSolutionPath() {
        this.pathSolution = [];
        let temp = this.currentCell;
        this.pathSolution.push(temp);
        while (temp.previous !== undefined && temp.previous !== null) {
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

            this.openSet = this.openSet.filter(item => item !== this.currentCell);



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