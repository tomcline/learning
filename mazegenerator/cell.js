class Cell {
    constructor(i, j, w, h, maze) {
        this.i = i;
        this.j = j;
        this.w = w;
        this.h = h;
        this.x = (i * maze.cellSize) + (maze.cellSize / 2);
        this.y = (j * maze.cellSize) + (maze.cellSize / 2);
        this.color = color(255,255,255);
        this.visited = false;
        this.type = 'DOT';
        this.fScore = 0;
        this.gScore = 0;
        this.hScore = 0;
        this.previous = null;
        this.neighbors = null;
        this.visitableNeighbors = [];
        this.maze = maze;
        this.movementFrame = 0;
        this.debug = false;

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

        if (this.type == 'DOT') {
            push();
            fill(255, 255, 255);
            circle((this.i * this.maze.cellSize) + this.maze.cellSize / 2, (this.j * this.maze.cellSize) + this.maze.cellSize / 2, this.maze.cellSize / 12);
            pop();
        }

        if (this.type == 'POWERPELLET') {
            push();
            fill(255, 255, 255);
            circle((this.i * this.maze.cellSize) + this.maze.cellSize / 2, (this.j * this.maze.cellSize) + this.maze.cellSize / 2, this.maze.cellSize / 7);
            pop();
        }

        //Draw walls
        this.walls.forEach(wall => {
            if (wall.visible === true) {
                wall.show(x, y, w, h);
            }


        });

    }



}