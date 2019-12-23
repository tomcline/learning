class Cell {
    constructor(i, j, w, h, maze,cellType) {
        this.i = i;
        this.j = j;
        this.w = w;
        this.h = h;
        this.x = (i * maze.cellSize) + (maze.cellSize / 2);
        this.y = (j * maze.cellSize) + (maze.cellSize / 2);
        this.color = color(255,255,255);
        this.visited = false;
        this.type = cellType;
        this.fScore = 0;
        this.gScore = 0;
        this.hScore = 0;
        this.previous = null;
        this.neighbors = null;
        this.visitableNeighbors = [];
        this.maze = maze;
        this.movementFrame = 0;
        this.debug = false;

        this.walls = [
            {
                position: maze.wallPositions.TOP,
                visible: false,
                show: function (x, y, w, h) {
                    line(x, y+h, x + w, y+h);
                }
            },
            {
                position: maze.wallPositions.RIGHT,
                visible: false,
                show: function (x, y, w, h) {
                    line(x + w, y, x + w, y + h);
                }
            },
            {
                position: maze.wallPositions.BOTTOM,
                visible: false,
                show: function (x, y, w, h) {
                    line(x + w, y + h, x, y + h);
                }
            },
            {
                position: maze.wallPositions.LEFT,
                visible: false,
                show: function (x, y, w, h) {
                    line(x, y + h, x, y);
                }
            }
        ];


         //Vertical wall
         if (this.type == maze.cellTypes.VerticalWall) {
           this.walls[maze.wallPositions.LEFT].visible = true;
           this.walls[maze.wallPositions.RIGHT].visible = true;
           this.walls[maze.wallPositions.TOP].visible = false;
           this.walls[maze.wallPositions.BOTTOM].visible = false;

        }
        
        //Horizontal wall
        if (this.type == maze.cellTypes.HorizontalWall) {
            this.walls[maze.wallPositions.TOP].visible = true;
            this.walls[maze.wallPositions.BOTTOM].visible = true;
            this.walls[maze.wallPositions.LEFT].visible = false;
            this.walls[maze.wallPositions.RIGHT].visible = false;
        }


    }

    reset() {
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

        this.neighbors.forEach(cell => {
            if (cell.type != maze.cellTypes.VerticalWall && cell.type != maze.cellTypes.HorizontalWall ) {
                this.visitableNeighbors.push(cell);
            }


        });

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
    getDebugString() {
        return this.i + "," + this.j;
    }
    getDebugPosition() {
        return {
            x: this.x - 5,
            y: this.y - 5
        }
    }
    drawDebugInfo() {
        push();
        //if (this.type == "PLAYER") debugger;
        fill(this.color.levels);
        noStroke();
        textSize(7);
        let position = this.getDebugPosition();
        text(this.getDebugString(), position.x, position.y);
        pop();
    }
    show() {
        let x = this.i * maze.cellSize;
        let y = this.j * maze.cellSize;
        let w = this.w;
        let h = this.h;


        noStroke();
        stroke(255);
        noFill();


        //Ghost door
        if (this.type == maze.cellTypes.GhostDoor) {
            push();
            fill(100, 50, 100);
            rect(this.i * this.maze.cellSize,this.j * this.maze.cellSize,this.maze.cellSize,this.maze.cellSize);
            pop();
        }


        //Ghost house
        if (this.type == maze.cellTypes.GhostHouse) {
            push();
            fill(50, 50, 255);
            rect(this.i * this.maze.cellSize,this.j * this.maze.cellSize,this.maze.cellSize,this.maze.cellSize);
            pop();
        }

    //Tunnel
    if (this.type == maze.cellTypes.Tunnel) {
        push();
        fill(255, 50, 100);
        rect(this.i * this.maze.cellSize,this.j * this.maze.cellSize,this.maze.cellSize,this.maze.cellSize);
        pop();
    }


        //Empty space
        if (this.type == maze.cellTypes.EmptySpace) {
            push();
            fill(100, 100, 255);
            rect(this.i * this.maze.cellSize,this.j * this.maze.cellSize,this.maze.cellSize,this.maze.cellSize);
            pop();
        }

        //Food
        if (this.type == maze.cellTypes.Pellet) {
            push();
            fill(255, 255, 255);
            circle((this.i * this.maze.cellSize) + this.maze.cellSize / 2, (this.j * this.maze.cellSize) + this.maze.cellSize / 2, this.maze.cellSize / 12);
            pop();
        }

        //Power pellet
        if (this.type == maze.cellTypes.PowerPellet) {
            push();
            fill(255, 255, 255);
            circle((this.i * this.maze.cellSize) + this.maze.cellSize / 2, (this.j * this.maze.cellSize) + this.maze.cellSize / 2, this.maze.cellSize / 4);
            pop();
        }

        //Vertical wall
        if (this.type == maze.cellTypes.VerticalWall) {
            fill(255, 100, 255);
            rect(this.i * this.maze.cellSize,this.j * this.maze.cellSize,this.maze.cellSize,this.maze.cellSize);
           this.walls[maze.wallPositions.LEFT].show(x,y,w,h);
           this.walls[maze.wallPositions.RIGHT].show(x,y,w,h);
        }
        
        //Horizontal wall
        if (this.type == maze.cellTypes.HorizontalWall) {
            fill(255, 100, 255);
            rect(this.i * this.maze.cellSize,this.j * this.maze.cellSize,this.maze.cellSize,this.maze.cellSize);
            this.walls[maze.wallPositions.TOP].show(x,y,w,h);
            this.walls[maze.wallPositions.BOTTOM].show(x,y,w,h);
        }
        

   

    }



}