let cols, rows;

let maze;
function preload() {
    
    
}

function setup() {

    createCanvas(400, 400);

    frameRate(5);
    
    maze = new Maze(width,height);
    
    cols = floor(width / maze.cellSize);
    rows = floor(height / maze.cellSize);

    maze.setRowsAndCols(rows,cols);

    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
            maze.addCell(new Cell(i, j, maze.cellSize, maze.cellSize,maze));
        }
    }

    maze.currentCell = maze.grid[0];

}


function draw() {
    background(51);
    
    maze.currentCell.visited = true;
    maze.currentCell.highlight(true);
    
    maze.grid.forEach(cell => {
        cell.show();
        cell.highlight(false);
    });

    let nextCell = maze.currentCell.checkNeighbors();

    if (nextCell) {
        
        //nextCell.visited = true;
        
        maze.stack.push(maze.currentCell);

        maze.removeWalls(maze.currentCell,nextCell);
        
        maze.currentCell = nextCell;
    }
    else if (maze.stack.length > 0 ) {
        maze.currentCell = maze.stack.pop();
    }


}







class Maze {
    constructor(w,h,cols,rows){
        this.grid = [];
        this.stack  = [];
        this.cellSize = 20;
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
    removeWalls(currentCell,nextCell) {
        let maze = currentCell.maze;
        let x = currentCell.i - nextCell.i;
        let y = currentCell.j - nextCell.j;

        if (x === 1 ){
            currentCell.walls[maze.WallPositions.LEFT].visible = false;
            nextCell.walls[maze.WallPositions.RIGHT].visible = false;
        }
        else if (x === -1) {
            currentCell.walls[maze.WallPositions.RIGHT].visible = false;
            nextCell.walls[maze.WallPositions.LEFT].visible = false;
        }

        if (y === 1 ){
            currentCell.walls[maze.WallPositions.TOP].visible = false;
            nextCell.walls[maze.WallPositions.BOTTOM].visible = false;
        }
        else if (y === -1) {
            currentCell.walls[maze.WallPositions.BOTTOM].visible = false;
            nextCell.walls[maze.WallPositions.TOP].visible = false;
        }
    }

}


class Cell {
    constructor(i, j, w, h,maze) {
        this.i = i;
        this.j = j;
        this.w = w;
        this.h = h;
        this.maze = maze;
        this.visited = false;


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

    return i + j * this.maze.columns;
}
checkNeighbors(){
    let neighbors = [];
    let notVisitedNeighbors = [];
    neighbors.push(maze.grid[this.getIndex(this.i,this.j+1)]);
    neighbors.push(maze.grid[this.getIndex(this.i+1,this.j)]);
    neighbors.push(maze.grid[this.getIndex(this.i,this.j-1)]);
    neighbors.push(maze.grid[this.getIndex(this.i-1,this.j)]);

    neighbors.forEach(neighbor => {
        //Neighbor could be null from abovei f outside of index bounds.
        if (neighbor != null && neighbor!= undefined && neighbor.visited === false) {
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


    stroke(255);
    noFill();
    

    //Draw walls
    this.walls.forEach(wall => {
        if (wall.visible===true) {
            wall.show(x,y,w,h);
        }

        
    });
    
    //Draw visited state;
    noStroke();
    if (this.visited === true) {
        fill(0,255,0,255);
        rect(x,y,w,h);
    }
    if (this.maze.stack.indexOf(this) > -1){
        fill(255,0,0,255);
        rect(x,y,w,h);
    }
    if (this.highlighted) {
        fill(0,0,255,255);
        rect(x,y,w,h);
    }

}



}