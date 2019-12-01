
class AStar {
    constructor() {
        
        this.openSet = [];
        this.closedSet = [];
        this.pathSolution = [];
        this.currentCell = null;
        this.solved = false;
        this.origin = null;
        this.target = null;

    }
    reset(){
        this.openSet = [];
        this.closedSet = [];
        this.pathSolution = [];
        this.currentCell = null;
        this.origin = null;
        this.target = null;
    }
    setOrigin(origin){
        
        this.origin = origin;

        this.openSet.push(this.origin);

    }
    setTarget(target){
        this.target = target;
    }
    drawOpenset() {
        this.openSet.forEach(cell => {
        });
    }
    drawClosedSet() {
        
        this.closedSet.forEach(cell => {
        });

    }
    drawPathSolution(color,path) {
        noFill();
        beginShape();
        for (var i = 0; i < path.length; i++) {
            let cell = path[i];
            stroke(color);
            //strokeWeight(cell.w / 2);
            vertex(cell.i * cell.w + cell.w / 2, cell.j * cell.h + cell.h / 2);
        }
        endShape();


        if (path.length > 0) {
            let firstCell = path[0];
            let lastCell = path[path.length-1];
            push();
            color.setAlpha(75);
            fill(color);
            circle( (lastCell.i * lastCell.maze.cellSize) + lastCell.maze.cellSize/2, (lastCell.j * lastCell.maze.cellSize)  + lastCell.maze.cellSize/2 , lastCell.maze.cellSize/4);
            circle( (firstCell.i * firstCell.maze.cellSize) + firstCell.maze.cellSize/2, (firstCell.j * firstCell.maze.cellSize)  + firstCell.maze.cellSize/2 , firstCell.maze.cellSize/2);
            color.setAlpha(200);
            pop();
        }
        
    }
    generateSolutionPath() {
        this.pathSolution = [];
        let temp = this.currentCell;
        this.pathSolution.push(temp);
        while (temp.previous != null) {
            this.pathSolution.push(temp.previous);
            temp = temp.previous;
        }
    }
    solve() {

        while (this.openSet.length > 0) {

            let winner = 0;

            for (let i = 0; i < this.openSet.length; i++) {
                const cell = this.openSet[i];
                const winnerCell = this.openSet[winner];
                if (cell.fScore < winnerCell.fScore) {
                    winner = i;
                }
            }

            this.currentCell = this.openSet[winner];


            if (this.currentCell === this.target) {
                this.solved = true;
                return true;
            }

            let prevOpenLength = this.openSet.length;
            this.openSet = this.openSet.filter(item => item !== this.currentCell);
            

            this.closedSet.push(this.currentCell);


            let neighbors = this.currentCell.visitableNeighbors;
            neighbors.forEach(neighbor => {
                //Neighbor has not been ruled out, and neighbor is allowed to be visited
                if (!this.closedSet.includes(neighbor) && this.currentCell.visitableNeighbors.includes(neighbor)) {
                    let tempGScore = this.currentCell.gScore + this.calculateHeuristic(neighbor, this.currentCell);
                    let newPath = false;

                    if (this.openSet.includes(neighbor)) {
                        if (tempGScore < neighbor.gScore) {
                            neighbor.gScore = tempGScore;
                            newPath = true;
                        }
                    } else {
                        neighbor.gScore = tempGScore;
                        this.openSet.push(neighbor);
                        newPath = true;
                    }

                    if (newPath) {
                        neighbor.hScore = this.calculateHeuristic(neighbor, this.target);
                        neighbor.fScore = neighbor.gScore + neighbor.hScore;
                        neighbor.previous = this.currentCell;
                    }

                }
            });
        }


    }
    calculateHeuristic(a, b) {
        //let distance = abs(a.i-b.i) + abs(a.j-b.j);
        let distance = dist(a.i, a.j, b.i, b.j);
        return distance;
    }


}
