class Cell {
    constructor(i, j, w, h, maze,cell) {
        this.i = i;
        this.j = j;
        this.w = w;
        this.h = h;
        this.x = (i * maze.cellSize) + (maze.cellSize / 2);
        this.y = (j * maze.cellSize) + (maze.cellSize / 2);
        this.color = color(255,255,255);
        this.visited = false;
        this.type = cell;
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
                position: maze.WallPositions.TOP,
                visible: false,
                show: function (x, y, w, h) {
                    line(x, y+h, x + w, y+h);
                }
            },
            {
                position: maze.WallPositions.RIGHT,
                visible: false,
                show: function (x, y, w, h) {
                    line(x + w, y, x + w, y + h);
                }
            },
            {
                position: maze.WallPositions.BOTTOM,
                visible: false,
                show: function (x, y, w, h) {
                    line(x + w, y + h, x, y + h);
                }
            },
            {
                position: maze.WallPositions.LEFT,
                visible: false,
                show: function (x, y, w, h) {
                    line(x, y + h, x, y);
                }
            }
        ];


         //Vertical wall
         if (this.type == '|') {
           this.walls[maze.WallPositions.LEFT].visible = true;
           this.walls[maze.WallPositions.RIGHT].visible = true;
           this.walls[maze.WallPositions.TOP].visible = false;
           this.walls[maze.WallPositions.BOTTOM].visible = false;

        }
        
        //Horizontal wall
        if (this.type == '_') {
            this.walls[maze.WallPositions.TOP].visible = true;
            this.walls[maze.WallPositions.BOTTOM].visible = true;
            this.walls[maze.WallPositions.LEFT].visible = false;
            this.walls[maze.WallPositions.RIGHT].visible = false;
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
            if (cell.type != '|' && cell.type != '_' ) {
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
        if (this.type == '-') {
            push();
            fill(255, 255, 100);
            rect(this.i * this.maze.cellSize,this.j * this.maze.cellSize,this.maze.cellSize,this.maze.cellSize);
            pop();
        }

        //Empty space
        if (this.type == ' ') {
            push();
            fill(100, 100, 255);
            rect(this.i * this.maze.cellSize,this.j * this.maze.cellSize,this.maze.cellSize,this.maze.cellSize);
            pop();
        }

        //Food
        if (this.type == '.') {
            push();
            fill(255, 255, 255);
            circle((this.i * this.maze.cellSize) + this.maze.cellSize / 2, (this.j * this.maze.cellSize) + this.maze.cellSize / 2, this.maze.cellSize / 12);
            pop();
        }

        //Power pellet
        if (this.type == 'o') {
            push();
            fill(255, 255, 255);
            circle((this.i * this.maze.cellSize) + this.maze.cellSize / 2, (this.j * this.maze.cellSize) + this.maze.cellSize / 2, this.maze.cellSize / 4);
            pop();
        }

        //Vertical wall
        if (this.type == '|') {
            fill(255, 100, 255);
            rect(this.i * this.maze.cellSize,this.j * this.maze.cellSize,this.maze.cellSize,this.maze.cellSize);
           this.walls[maze.WallPositions.LEFT].show(x,y,w,h);
           this.walls[maze.WallPositions.RIGHT].show(x,y,w,h);
        }
        
        //Horizontal wall
        if (this.type == '_') {
            fill(255, 100, 255);
            rect(this.i * this.maze.cellSize,this.j * this.maze.cellSize,this.maze.cellSize,this.maze.cellSize);
            this.walls[maze.WallPositions.TOP].show(x,y,w,h);
            this.walls[maze.WallPositions.BOTTOM].show(x,y,w,h);
        }
        

   

    }



}