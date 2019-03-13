let cols, rows;

let maze;
function preload() {
    
    
}

function setup() {

    createCanvas(400, 400);
    maze = new Maze(width,height);

    cols = floor(width / maze.cellSize);
    rows = floor(height / maze.cellSize);


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
    
    maze.grid.forEach(cell => {
        cell.show();
    });


}







class Maze {
    constructor(w,h){
        this.grid = [];
        this.cellSize = 40;
        this.currentCell = null;
        this.WallPositions = {
            TOP: 0,
            RIGHT: 1,
            BOTTOM: 2,
            LEFT: 3
        }
    }

    addCell(cell){
        this.grid.push(cell);
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
    if (this.visited === true) {
        fill(255,0,255,100);
        rect(x,y,w,h);
    }

}



}