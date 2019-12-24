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
        this.corner = false;
        this.wallPosition = '';


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
            if (cell.type != maze.cellTypes.VerticalWall && cell.type != maze.cellTypes.HorizontalWall ) {
                this.visitableNeighbors.push(cell);
            }

            if (this.type ==  maze.cellTypes.VerticalWall || this.type ==  maze.cellTypes.HorizontalWall) {
                let down = maze.grid[maze.getIndex(this.i, this.j + 1)];
                let up = maze.grid[maze.getIndex(this.i, this.j - 1)];
                let left = maze.grid[maze.getIndex(this.i - 1, this.j)];
                let right = maze.grid[maze.getIndex(this.i + 1, this.j)];
                let leftEdge,rightEdge,topEdge,bottomEdge = false;

                if (left && left.type != maze.cellTypes.VerticalWall && left.type != maze.cellTypes.HorizontalWall ) {
                    leftEdge = true;
                }

                if (right && right.type != maze.cellTypes.VerticalWall && right.type != maze.cellTypes.HorizontalWall ) {
                    rightEdge = true;
                }

                if (up && up.type != maze.cellTypes.VerticalWall && up.type != maze.cellTypes.HorizontalWall ) {
                    topEdge = true;
                }

                if (down && down.type != maze.cellTypes.VerticalWall && down.type != maze.cellTypes.HorizontalWall ) {
                    bottomEdge = true;
                }

                if ( (leftEdge || rightEdge) && (topEdge || bottomEdge)   ){
                   this.corner = true;
                    if (leftEdge && topEdge) {
                        this.wallPosition = 'BR';
                    }
                    else if (leftEdge && bottomEdge) {
                        this.wallPosition = 'TR';
                    }
                    else if (rightEdge && topEdge) {
                        this.wallPosition = 'BL';
                    }
                    else if (rightEdge && bottomEdge) {
                        this.wallPosition = 'TL';
                    }
                }
                else {

                    if (this.type ==  maze.cellTypes.HorizontalWall) {
                        if (topEdge) {
                            this.wallPosition = 'T';
                        }
                        else if (bottomEdge) {
                            this.wallPosition = 'B';
                        }
                    }

                    if (this.type ==  maze.cellTypes.VerticalWall) {
                        if (leftEdge) {
                            this.wallPosition = 'L';
                        }
                        else if (rightEdge) {
                            this.wallPosition = 'R';
                        }
                    }
                }

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
       return this.i + "," + this.j + ", " + this.wallPosition;
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
        if (!this.corner && this.type == maze.cellTypes.VerticalWall) {
            fill(255, 100, 255);
            //rect(this.i * this.maze.cellSize,this.j * this.maze.cellSize,this.maze.cellSize,this.maze.cellSize);
            stroke(0,0,255);
           // line(x+w/2, y, x+w/2, y + h/2);
            //line(x, y+h/2, x + w, y+h/2);

        }
        
        //Horizontal wall
        //!this.corner && 
        if ( !this.corner && this.type == maze.cellTypes.HorizontalWall) {
            fill(255, 100, 255);
            //rect(this.i * this.maze.cellSize,this.j * this.maze.cellSize,this.maze.cellSize,this.maze.cellSize);
            stroke(0,0,255);
            line(x, y+h/2, x + w, y+h/2);
            
            
        }
        
        
        if (this.corner) {
             fill(0, 255, 0);
             //rect(this.i * this.maze.cellSize,this.j * this.maze.cellSize,this.maze.cellSize,this.maze.cellSize);
             stroke(0,0,255);

            switch (this.wallPosition) {
                case 'TL':
                    //H
                    line(x, y+h/2, x + w/2, y+h/2);
                    //V
                    line(x+w/2, y+h/2, x+w/2, y);
                    break;
            
                case 'TR':
                    //H
                    line(x+w/2, y+h/2, x + w, y+h/2);
                    //V
                    line(x+w/2, y+h/2, x+w/2, y);

                    break;
            
                case 'BL':
                    
                      //H
                    line(x, y+h/2, x + w/2, y+h/2);
                    //V
                    line(x+w/2, y+h/2, x+w/2, y+h);
                    break;
            
                case 'BR':
                    //H
                    line(x+w/2, y+h/2, x + w, y+h/2);
                    //V
                    line(x+w/2, y+h/2, x+w/2, y+h);
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
   

    }



}