class Maze {
    constructor(w, h, cols, rows) {
        this.isInitialized = false;
        this.start = null;
        this.end = null;
        this.grid = [];
        this.AStar = null;
        this.pathSolution = [];
        this.stack = [];
        this.cellSize = 20;
        this.currentCell = null;
        this.map = null;

        this.cellTypes = {
            VerticalWall: '|',
            HorizontalWall: '_',
            EmptySpace: ' ',
            Pellet: '.',
            PowerPellet: 'o',
            GhostDoor: '-',
            GhostHouse: '*',
            Tunnel: '='
            
        }

        this.wallPositions = {
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
    createMap(){
        //return mapgen();
    }
    initialize(map) {
        if (!map) {
            map = mapgen();
        }
        this.map = map;
        let cols = map[0].length;
        let rows = map.length;
        this.grid = [];
        this.setRowsAndCols(cols, rows);

        for (let j = 0; j < rows; j++) {
            for (let i = 0; i < cols; i++) {
                this.addCell(new Cell(i, j, this.cellSize, this.cellSize, this,map[j][i]));
            }
        }

        
        this.grid.forEach(cell => {
            cell.addNeighbors();
            let maze = cell.maze;


            //Keep track of how many dots are on gameboard
            if (cell.type == maze.cellTypes.Pellet || cell.type == maze.cellTypes.PowerPellet) {
                game.dotsToEat++;
            }

            //Brute force ghost house
            if (cell.type == maze.cellTypes.GhostHouse) {
                if (cell.i == 11 && cell.j == 16) {
                    cell.wallPosition = 'TT';
                }
                if (cell.i == 11 && cell.j == 17) {
                    cell.wallPosition = 'TTL';
                }
            }

            if (cell.type == maze.cellTypes.VerticalWall || cell.type == maze.cellTypes.HorizontalWall) {
                let down = maze.grid[maze.getIndex(cell.i, cell.j + 1)];
                let up = maze.grid[maze.getIndex(cell.i, cell.j - 1)];
                let left = maze.grid[maze.getIndex(cell.i - 1, cell.j)];
                let right = maze.grid[maze.getIndex(cell.i + 1, cell.j)];
                let leftEdge = false, rightEdge = false, topEdge = false, bottomEdge = false;

                if (left && left.type != maze.cellTypes.VerticalWall && left.type != maze.cellTypes.HorizontalWall) {
                    leftEdge = true;
                }

                if (right && right.type != maze.cellTypes.VerticalWall && right.type != maze.cellTypes.HorizontalWall) {
                    rightEdge = true;
                }

                 if (up && up.type != maze.cellTypes.VerticalWall && up.type != maze.cellTypes.HorizontalWall) {
                    topEdge = true;
                }

                 if (down && down.type != maze.cellTypes.VerticalWall && down.type != maze.cellTypes.HorizontalWall) {
                    bottomEdge = true;
                }

                //Corner check
                if ((leftEdge || rightEdge) && (topEdge || bottomEdge)) {
                    cell.corner = true;
                    if (leftEdge && topEdge) {
                        cell.wallPosition = 'BR';
                    } else if (leftEdge && bottomEdge) {
                        cell.wallPosition = 'TR';
                    } else if (rightEdge && topEdge) {
                        cell.wallPosition = 'BL';
                    } else if (rightEdge && bottomEdge) {
                        cell.wallPosition = 'TL';
                    }
                    
                } else {

                    if (topEdge) {
                        cell.wallPosition = 'T';
                    } else if (bottomEdge) {
                        cell.wallPosition = 'B';
                    }
                    else if (leftEdge) {
                        cell.wallPosition = 'L';
                    } else if (rightEdge) {
                        cell.wallPosition = 'R';
                    }
                }
                
                //Interior corner check
               if (cell.wallPosition == 'Z' && cell.type == maze.cellTypes.VerticalWall) {
                let upleft = maze.grid[maze.getIndex(cell.i-1, cell.j - 1)];
                let upright = maze.grid[maze.getIndex(cell.i+1, cell.j - 1)];
                let downleft = maze.grid[maze.getIndex(cell.i - 1, cell.j+1)];
                let downright = maze.grid[maze.getIndex(cell.i + 1, cell.j+1)];
                
                if (upleft && upleft.type != maze.cellTypes.VerticalWall && upleft.type != maze.cellTypes.HorizontalWall) {
                    cell.corner = true;
                    cell.wallPosition = 'TL';
                    
                }
                
                else if (upright && upright.type != maze.cellTypes.VerticalWall && upright.type != maze.cellTypes.HorizontalWall) {
                    cell.corner = true;
                    cell.wallPosition = 'TR';
                    
                }
                
                else if (downleft && downleft.type != maze.cellTypes.VerticalWall && downleft.type != maze.cellTypes.HorizontalWall) {
                    cell.corner = true;
                    cell.wallPosition = 'BL';
                }
                
                else if (downright && downright.type != maze.cellTypes.VerticalWall && downright.type != maze.cellTypes.HorizontalWall) {
                    cell.corner = true;
                    cell.wallPosition = 'BR';

                }



               }
 
            }

        });

        this.prepareMazeToSolve();

        //Start building maze in top left corner
        //this.currentCell = maze.grid[0];
        
        
    }
    draw() {

        this.grid.forEach(cell => {
            cell.show();
            cell.highlight(false);
        });

    }
    newLevel(){
        this.map = null;
        this.initialize();
    }
    replayCurrentMap(){
        //
        this.initialize(this.map);
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

}
