class Maze {
    constructor(w, h, cols, rows) {
        this.isInitialized = false;
        this.start = null;
        this.end = null;
        this.grid = [];
        this.AStar = null;
        this.pathSolution = [];
        this.stack = [];
        this.cellSize = 24;
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
