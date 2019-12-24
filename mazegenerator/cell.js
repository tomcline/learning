class Cell {
    constructor(i, j, w, h, maze, cellType) {
        this.i = i;
        this.j = j;
        this.w = w;
        this.h = h;
        this.x = (i * maze.cellSize) + (maze.cellSize / 2);
        this.y = (j * maze.cellSize) + (maze.cellSize / 2);
        this.color = color(255, 255, 255);
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
        this.corner = false;
        this.wallPosition = 'Z';


    }

    reset() {
        this.fScore = 0;
        this.gScore = 0;
        this.hScore = 0;
        this.previous = null;
    }
    addNeighbors() {
        let neighbors = [];
        //down = 0
        neighbors.push(maze.grid[maze.getIndex(this.i, this.j + 1)]);
        // right = 1
        neighbors.push(maze.grid[maze.getIndex(this.i + 1, this.j)]);
        //up = 2
        neighbors.push(maze.grid[maze.getIndex(this.i, this.j - 1)]);
        //right = 3
        neighbors.push(maze.grid[maze.getIndex(this.i - 1, this.j)]);
        //Remove neighbor items which do not exist, i.e: edges
        this.neighbors = neighbors.filter(index => (index !== undefined && index !== null));

        this.neighbors.forEach(cell => {
            if (cell.type != maze.cellTypes.VerticalWall && cell.type != maze.cellTypes.HorizontalWall) {
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
        //return this.type;
        return this.i + "," + this.j;
        //return this.wallPosition;
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
        textSize(8);
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
        //stroke(255);
        noFill();


        //Ghost door
        if (this.type == maze.cellTypes.GhostDoor) {
            push();
            fill(100, 50, 100);
            //rect(this.i * this.maze.cellSize,this.j * this.maze.cellSize,this.maze.cellSize,this.maze.cellSize);
            pop();
        }


        //Ghost house
        if (this.type == maze.cellTypes.GhostHouse) {
            push();
            fill(50, 50, 255);
            //rect(this.i * this.maze.cellSize,this.j * this.maze.cellSize,this.maze.cellSize,this.maze.cellSize);
            pop();
        }

        //Tunnel
        if (this.type == maze.cellTypes.Tunnel) {
            push();
            fill(255, 50, 100);
            //rect(this.i * this.maze.cellSize,this.j * this.maze.cellSize,this.maze.cellSize,this.maze.cellSize);
            pop();
        }


        //Empty space
        if (this.type == maze.cellTypes.EmptySpace) {
            push();
            fill(100, 100, 255);
            //rect(this.i * this.maze.cellSize,this.j * this.maze.cellSize,this.maze.cellSize,this.maze.cellSize);
            pop();
        }


        //Vertical wall
        if (!this.corner && (this.type == maze.cellTypes.VerticalWall || this.type == maze.cellTypes.GhostHouse)) {
            fill(255, 100, 255);
            //rect(this.i * this.maze.cellSize, this.j * this.maze.cellSize, this.maze.cellSize, this.maze.cellSize);
            stroke(0, 0, 255);
            
            switch (this.wallPosition) {
                case 'L':
                    line(x + w / 2, y, x + w / 2, y+h);
                    break;
                case 'R':
                    line(x + w / 2, y, x + w / 2, y+h);
                    break;
                case 'T':
                    //H
                    line(x, y + h / 2, x + w, y + h / 2);
                    break;
                case 'B':
                    line(x, y + h / 2, x + w, y + h / 2);
                    break;
                    case 'Z':
                        //fill(0,0,255);
                        //rect(this.i * this.maze.cellSize, this.j * this.maze.cellSize, this.maze.cellSize, this.maze.cellSize);

                    break;
                default:
                    break;

            }


        }

        //Horizontal wall
        //!this.corner && 
        if (!this.corner && this.type == maze.cellTypes.HorizontalWall) {
            
            //Only draw horizontal lines which are the outside bounds
            if (this.j == 0 || this.j >= 35){
                fill(255, 0, 0);
                //rect(this.i * this.maze.cellSize, this.j * this.maze.cellSize, this.maze.cellSize, this.maze.cellSize);
                stroke(0, 0, 255);
                //line(x, y + h / 2, x + w, y + h / 2);
            }


        }


        if (this.corner) {
            fill(0, 255, 0);
            //rect(this.i * this.maze.cellSize, this.j * this.maze.cellSize, this.maze.cellSize, this.maze.cellSize);
            stroke(0, 0, 255);

            switch (this.wallPosition) {
                case 'TL':
                    //H
                    line(x, y + h / 2, x + w / 2, y + h / 2);
                    //V
                    line(x + w / 2, y + h / 2, x + w / 2, y);
                    break;

                case 'TR':
                    //H
                    line(x + w / 2, y + h / 2, x + w, y + h / 2);
                    //V
                    line(x + w / 2, y + h / 2, x + w / 2, y);

                    break;

                case 'BL':

                    //H
                    line(x, y + h / 2, x + w / 2, y + h / 2);
                    //V
                    line(x + w / 2, y + h / 2, x + w / 2, y + h);
                    break;

                case 'BR':
                    //H
                    line(x + w / 2, y + h / 2, x + w, y + h / 2);
                    //V
                    line(x + w / 2, y + h / 2, x + w / 2, y + h);
                    break;

                default:
                    break;
            }

            //line(x+this.wallHorizontalOffset, y, x+this.wallHorizontalOffset, y + h);

            //line(x, y+this.wallVerticalOffset, x + w, y+this.wallVerticalOffset);

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


        //Draw frame
        if (this.j == 0 ) {
            stroke(0, 0, 255);
            line(x, y, x+w, y);
        }
        if (this.j == 35 ) {
            stroke(0, 0, 255);
            line(x, y+h, x+w, y+h);
        }

      
    }



}