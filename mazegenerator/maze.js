class Maze {
    constructor(w, h, cols, rows) {
        this.isInitialized = false;
        this.start = null;
        this.end = null;
        this.grid = [];
        this.AStar = null;
        this.pathSolution = [];
        this.stack = [];
        this.cellSize = 22;
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
    initialize(map) {
        let cols = map[0].length;
        let rows = map.length;
        this.grid = [];
        this.setRowsAndCols(cols, rows);


        for (let j = 0; j < rows; j++) {
            for (let i = 0; i < cols; i++) {
                this.addCell(new Cell(i, j, this.cellSize, this.cellSize, this,map[j][i]));
            }
        }

        //Start building maze in top left corner
        //this.currentCell = maze.grid[0];
        
        
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

        // while (!maze.isInitialized) {

        //     let nextCell = this.currentCell.checkNeighbors();

        //     if (nextCell) {

        //         nextCell.visited = true;

        //         this.stack.push(this.currentCell);
        //         this.removeWalls(this.currentCell, nextCell);

        //         this.currentCell = nextCell;
        //     } else if (this.stack.length > 0) {
        //         this.currentCell = maze.stack.pop();
        //     } else {
        //         //Maze is built.
        //         this.prepareMazeToSolve();
        //     }


        // }

        //Turns off all walls
        if (disableAllWalls){
            this.grid.forEach(cell => {
                    cell.neighbors.forEach (neighbor => {
                        cell.visitableNeighbors.push(neighbor);
                });
    
                cell.walls.forEach(wall => {
                    wall.visible = false;
                });
            });
        }

    }

    solveMaze() {

    }
    
    
    getIndex(i, j) {

        if (i < 0 || j < 0 || i > this.columns - 1 || j > this.rows - 1) {
            return -1;
        }
        //Single index array indexing trick....
        return i + j * this.columns;
    }
    getCell(i,j){
        //Normalize bounds so we don't exceed the tabel
        if (i >= this.columns) {
            i = this.columns-1;
        }
        else if (i < 0) {
            i = 0;
        }   
        if (j >= this.rows) {
            j = this.rows-1;
        }
        else if (j < 0 ){
            j = 0;
        }
        return this.grid[this.getIndex(i, j)];
    }
    updateEndPosiiton(i, j) {
        this.end = this.grid[this.getIndex(i, j)];
    }
    prepareMazeToSolve() {
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
