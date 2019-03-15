

let maze;
function preload() {
    
    
}

function setup() {

    let winWidth = window.innerWidth;
    let winHeight = window.innerHeight;
    
    if (winWidth > winHeight) winWidth = winHeight;
    else if (winHeight > winWidth) winHeight = winWidth;

    createCanvas(winWidth, winHeight);

    //frameRate(5);
    
    maze = new Maze(width,height);
    
    
    maze.initialize(width,height);
    maze.buildMaze();
}


function draw() {
    background(51);
            maze.solveMaze();

            maze.generateSolutionPath();

            // maze.drawOpenset();
            // maze.drawClosedSet();
           
            maze.drawPathSolution();

            maze.draw();

            
    
    
    
}


class Maze {
    constructor(w,h,cols,rows){
        this.isInitialized = false;
        this.openSet = [];
        this.closedSet = [];
        this.start = null;
        this.end = null;
        this.grid = [];
        this.pathSolution = [];
        this.stack  = [];
        this.cellSize = 30;
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
    
    setRowsAndCols(cols,rows) {
        this.columns = cols;
        this.rows = rows;
    }
    addCell(cell){
        this.grid.push(cell);
    }
    
    initialize(width,height){
        let cols = floor(width / this.cellSize);
        let rows = floor(height / this.cellSize);
        
        this.setRowsAndCols(rows,cols);
        
        
        for (let j = 0; j < rows; j++) {
            for (let i = 0; i < cols; i++) {
                this.addCell(new Cell(i, j, this.cellSize, this.cellSize,this));
            }
        }
        
        this.currentCell = maze.grid[0];
        

    }
    buildMaze(){
        
        while (!maze.isInitialized) {

            let nextCell = this.currentCell.checkNeighbors();
            
            if (nextCell) {
                
                nextCell.visited = true;
                
                this.stack.push(this.currentCell);
                
                this.removeWalls(this.currentCell,nextCell);
                
                this.currentCell = nextCell;
            }
            else if (this.stack.length > 0 ) {
                this.currentCell = maze.stack.pop();
            }
            else {
                this.prepareMazeToSolve();
            }


        }
        


    }
    solveMaze(){
        
        //No more items in stack to build maze.
        //Time to solve.
        if (this.openSet.length > 0) {
            console.log("Running Solve");
            this.solve();    
        }
        else {
            console.log("No solution?");
            noLoop();
        }
    }
    draw(){
        
        //this.currentCell.visited = true;
        //this.currentCell.highlight(true);
        
        
        this.grid.forEach(cell => {
            cell.show();
            cell.highlight(false);
        });
        
       
        
        
    }
    drawOpenset(){
        this.openSet.forEach(cell => {
            cell.color = color(0,255,0);
        });
    }
    drawClosedSet(){
        this.closedSet.forEach(cell => {
            cell.color = color(255,0,0);
        });
    }
    drawPathSolution(){
        
        noFill();
        beginShape();
        for (var i = 0; i < this.pathSolution.length; i++) {
            let cell = this.pathSolution[i];
            stroke(125, 125, 255);
            //strokeWeight(cell.w / 2);
            vertex(cell.i * cell.w + cell.w / 2, cell.j * cell.h + cell.h / 2);
        }
        endShape();
        
        
        
        // this.pathSolution.forEach(cell => {
        //     cell.color = color(200,200,0);
        // });
        
    }
    generateSolutionPath(){
        this.pathSolution = [];
        let temp = this.currentCell;
        this.pathSolution.push(temp);
        while(temp.previous !== undefined && temp.previous !== null) {
            this.pathSolution.push(temp.previous);
            temp = temp.previous;
        }
    }
    solve(){
        let winner = 0;
        


        for (let i = 0; i < this.openSet.length; i++) {
            const cell = this.openSet[i];
            const winnerCell = this.openSet[winner];
            if (cell.fScore < winnerCell.fScore) {
                winner = i;
            }
        }
        
        this.currentCell = this.openSet[winner];
        
        if (this.currentCell === this.end) {
            noLoop();
            console.log("Solved!");
        }

            this.openSet = this.openSet.filter(item => item !== this.currentCell);
            this.closedSet.push(this.currentCell);
            
            let neighbors = this.currentCell.visitableNeighbors;
            neighbors.forEach(neighbor => {
                if (!this.closedSet.includes(neighbor) && this.currentCell.visitableNeighbors.includes(neighbor)) {
                    
                    let tempGScore = this.currentCell.gScore + this.calculateHeuristic(neighbor,this.currentCell) ;
                    let newPath = false;
                    
                    if (this.openSet.includes(neighbor)  ) {
                        if (tempGScore < neighbor.gScore){
                            neighbor.gScore = tempGScore;
                            newPath = true;
                        }
                    }
                    else {
                        neighbor.gScore = tempGScore;
                        this.openSet.push(neighbor);
                        newPath = true;
                    }
    
                    if (newPath) {
                        neighbor.hScore = this.calculateHeuristic(neighbor,this.end);
                        neighbor.fScore = neighbor.gScore + neighbor.hScore;
                        neighbor.previous = this.currentCell;
                    }
    
                }
            });


       


    }
    calculateHeuristic(a,b){
        //let distance = abs(a.i-b.i) + abs(a.j-b.j);
        let distance = dist(a.i,a.j,b.i,b.j);   
        return distance;
    }
    prepareMazeToSolve(){
        function setStartAndEnd(maze){
            maze.start = maze.grid[floor(random(maze.grid.length-1))];
            maze.end = maze.grid[floor(random(maze.grid.length-1))];
            if (maze.start === maze.end) setStartAndEnd();
        }
        setStartAndEnd(this);
        this.start.type = 'START';
        this.end.type = 'END'; 
        this.isInitialized = true;
        this.openSet.push(this.start);
        
        console.log("A* Maze Solve");


    }

    removeWalls(currentCell,nextCell) {
        let maze = currentCell.maze;
        let x = currentCell.i - nextCell.i;
        let y = currentCell.j - nextCell.j;

        if (x === 1 ){
            currentCell.walls[maze.WallPositions.LEFT].visible = false;
            nextCell.walls[maze.WallPositions.RIGHT].visible = false;
            currentCell.visitableNeighbors.push(nextCell);
            nextCell.visitableNeighbors.push(currentCell);
        }
        else if (x === -1) {
            currentCell.walls[maze.WallPositions.RIGHT].visible = false;
            nextCell.walls[maze.WallPositions.LEFT].visible = false;
            currentCell.visitableNeighbors.push(nextCell);
            nextCell.visitableNeighbors.push(currentCell);
        }

        if (y === 1 ){
            currentCell.walls[maze.WallPositions.TOP].visible = false;
            nextCell.walls[maze.WallPositions.BOTTOM].visible = false;
            currentCell.visitableNeighbors.push(nextCell);
            nextCell.visitableNeighbors.push(currentCell);
        }
        else if (y === -1) {
            currentCell.walls[maze.WallPositions.BOTTOM].visible = false;
            nextCell.walls[maze.WallPositions.TOP].visible = false;
            currentCell.visitableNeighbors.push(nextCell);
            nextCell.visitableNeighbors.push(currentCell);
        }
    }

}


class Cell {
    constructor(i, j, w, h,maze) {
        this.i = i;
        this.j = j;
        this.w = w;
        this.h = h;
        this.previous = null;
        this.color = null;
        this.maze = maze;
        this.visited = false;
        this.type = null;
        this.fScore = 0;
        this.gScore = 0;
        this.hScore = 0;
        this.neighbors = null;
        this.visitableNeighbors = [];

        this.walls = [
            {
                position: this.maze.WallPositions.TOP,
                visible: true,
                show: function(x,y,w,h){
                    line(x, y, x + w, y);
                }
            },
            {
                position: this.maze.WallPositions.RIGHT,
                visible: true,
                show: function(x,y,w,h){
                    line(x + w, y, x + w, y + h);
                }
            },
            {
                position: this.maze.WallPositions.BOTTOM,
                visible: true,
                show: function(x,y,w,h){
                    line(x + w, y + h, x, y + h);
                }
            },
            {
                position: this.maze.WallPositions.LEFT,
                visible: true,
                show: function(x,y,w,h){
                    line(x, y + h, x, y);
                }
            }
        ];

}

getIndex(i,j) {

    if (i < 0 || j < 0 || i > this.maze.columns-1 || j > this.maze.rows-1) {
       return -1; 
    }
    //Single index array indexing trick....
    return i + j * this.maze.columns;
}
addNeighbors(){
        let neighbors = [];
        neighbors.push(this.maze.grid[this.getIndex(this.i,this.j+1)]);
        neighbors.push(this.maze.grid[this.getIndex(this.i+1,this.j)]);
        neighbors.push(this.maze.grid[this.getIndex(this.i,this.j-1)]);
        neighbors.push(this.maze.grid[this.getIndex(this.i-1,this.j)]);
        //Remove neighbor items which do not exist, i.e: edges
        this.neighbors = neighbors.filter(index => (index !== undefined && index !== null));

    }
checkNeighbors(){
    let notVisitedNeighbors = [];
    if (this.neighbors == null) this.addNeighbors();
    this.neighbors.forEach(neighbor => {
        if (neighbor.visited === false) {
            notVisitedNeighbors.push(neighbor);
        }
    });

    if (notVisitedNeighbors.length > 0) {
        let rando = floor(random(0,notVisitedNeighbors.length));
        return notVisitedNeighbors[rando];
    }
    else {
        return undefined;
    }

}
highlight(highlight){
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
        fill(0,0,255);
        rect(x,y,w,h);
    }

    if (this.type == "START") {
        fill(255,150,100);
        rect(x,y,w,h);
    }
    else if (this.type == "END") {
        fill(255,0,255);
        rect(x,y,w,h);
    }
    else if (this.color) {
        fill(this.color);
        rect(x,y,w,h);
    }

    noStroke();
    stroke(255);
    noFill();

    //Draw walls
    this.walls.forEach(wall => {
        if (wall.visible===true) {
            wall.show(x,y,w,h);
        }

        
    });

}



}