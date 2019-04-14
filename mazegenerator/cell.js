class Cell {
    constructor(i, j, w, h, maze) {
        this.i = i;
        this.j = j;
        this.w = w;
        this.h = h;
        this.color = null;
        this.visited = false;
        this.type = null;
        this.fScore = 0;
        this.gScore = 0;
        this.hScore = 0;
        this.previous = null;
        this.neighbors = null;
        this.visitableNeighbors = [];

        this.walls = [{
                position: maze.WallPositions.TOP,
                visible: true,
                show: function (x, y, w, h) {
                    line(x, y, x + w, y);
                }
            },
            {
                position: maze.WallPositions.RIGHT,
                visible: true,
                show: function (x, y, w, h) {
                    line(x + w, y, x + w, y + h);
                }
            },
            {
                position: maze.WallPositions.BOTTOM,
                visible: true,
                show: function (x, y, w, h) {
                    line(x + w, y + h, x, y + h);
                }
            },
            {
                position: maze.WallPositions.LEFT,
                visible: true,
                show: function (x, y, w, h) {
                    line(x, y + h, x, y);
                }
            }
        ];

    }
    
    reset(){
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
    show() {
        let x = this.i * maze.cellSize;
        let y = this.j * maze.cellSize;
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
        // if (this.highlighted) {
        //     fill(0, 0, 255);
        //     rect(x, y, w, h);
        // }

        // if (this.type == "START") {
        //     fill(0, 255, 0);
        //     rect(x, y, w, h);
        // }
        // else if (this.type == "END") {
        //     fill(255,0,0);
        //     rect(x,y,w,h);
        // }




        // else if (this.color) {
        //     fill(this.color);
        //     rect(x, y, w, h);
        // }

        noStroke();
        stroke(255);
        noFill();

        //Draw walls
        this.walls.forEach(wall => {
            if (wall.visible === true) {
                wall.show(x, y, w, h);
            }


        });

    }



}
