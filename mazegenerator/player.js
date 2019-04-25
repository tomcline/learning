class Player extends Cell {
    constructor(maze, height, width) {

        let i, j, w, h, tempCell;

        h = height;
        w = width;

        function determinePosition() {
            tempCell = maze.grid[floor(random(maze.grid.length - 1))];
            return tempCell;
        }

        tempCell = determinePosition();

        i = tempCell.i;
        j = tempCell.j;


        super(i, j, w, h, maze);

        this.type = 'PLAYER';
        this.color = color(255, 255, 0);
        this.isMoving = false;
        this.movementDirection = null;
        this.previousMovementDirection = null;
        this.speed = 1;
        this.newDirection = null;
        this.mouthAngle = 0;
        this.mouthOpening = true;

    }
    handleKeyPress(keyCode) {


        let newDirection = this.determineNewDirection(keyCode);
        //&& this.isInMiddleOfCell()
        if (this.movementDirection != keyCode ) {
            let canMove = this.canMoveTo(this.getNewPosition(newDirection));
            if (canMove) {
                //this.move(keyCode);
                this.movementDirection = keyCode;
                this.newDirection = newDirection;
            }
        }


    }
    determineNewDirection(keyCode) {
        let newI = 0;
        let newJ = 0;

        if (keyCode == LEFT_ARROW) {
            newI = -1;
        }

        if (keyCode == RIGHT_ARROW) {
            newI = 1;

        }

        if (keyCode == UP_ARROW) {
            newJ = -1;

        }

        if (keyCode == DOWN_ARROW) {
            newJ = 1;
        }

        return {
            i: newI,
            j: newJ
        };


    }
    getNewPosition(newDirection){
        return this.maze.getCell(this.i + newDirection.i, this.j + newDirection.j);
    }
    canMoveTo(newPosition) {

        let currentCell;

        currentCell = this.maze.getCell(this.i, this.j);
        return currentCell.visitableNeighbors.includes(newPosition);

    }
    normalizePosition(newDirection) {
        if (newDirection == null || newDirection == undefined) {
            newDirection = {
                i: 0,
                j: 0
            };
        }

        let normalizedI = this.x % this.w;
        //Math.round(Math.abs((-this.w + (2 * (this.x + newDirection.i))) / (2 * this.w)));

        let normalizedJ = this.y % this.h;
        //Math.round(Math.abs((-this.h + (2 * (this.y + newDirection.j))) / (2 * this.h)));

        return {
            i: normalizedI,
            j: normalizedJ
        };

    }
    isInMiddleOfCell() {
        return (this.x % this.w == this.w / 2 && this.y % this.h == this.h / 2);
    }
    move(keyCode) {

        if (keyCode !== null) {

            let newDirection = this.determineNewDirection(keyCode);

            let canMove = this.canMoveTo(this.getNewPosition(newDirection));

            if (canMove) {
                this.isMoving = true;
            } else {
                this.isMoving = false;
            }

            if (this.isMoving === true) {

                this.newDirection = newDirection;
                this.movementDirection = keyCode;

                if (newDirection.i != 0 || newDirection.j != 0) {
                    this.x += newDirection.i;
                    this.y += newDirection.j;

                    if (this.isInMiddleOfCell()) {
                        this.i += newDirection.i;
                        this.j += newDirection.j;
                    }
                }




            }
        }

    }

    eat(cell) {
        cell.type = null;
    }
    moveMouth() {

        if (this.mouthOpening) {
            this.mouthAngle += 30;
        } else {
            this.mouthAngle -= 30;
        }

        if (this.mouthAngle == 90) {
            this.mouthOpening = false;
        } else if (this.mouthAngle == 0) {
            this.mouthOpening = true;
        }

    }

    getDebugString() {
        return this.i + "," + this.j + " || " + this.x + "," + this.y;
    }

    getDebugPosition() {
        return {
            x: this.x - this.w,
            y: this.y + 20
        };
    }
    determineRotationAngle(){
        let rotationAngle = 0;
        switch (this.movementDirection) {
            case LEFT_ARROW:
                rotationAngle = 180;
                break;
            case RIGHT_ARROW:
                rotationAngle = 0;
                break;
            case UP_ARROW:
                rotationAngle = 270;
                break;
            case DOWN_ARROW:
                rotationAngle = 90;
                break;
    
            default:
                break;
        }
        return rotationAngle;
    }
    show() {

        let rotationAngle = this.determineRotationAngle();

        //Chomp Chomp!
        if (frameCount % 4 == 0) {
            this.moveMouth();
        }

        noStroke();
        fill(this.color);
        angleMode(DEGREES);



        if (this.mouthAngle > 0) {
            arc(this.x, this.y, this.w, this.h, rotationAngle + this.mouthAngle / 2, rotationAngle - this.mouthAngle / 2, PIE);
        } else {
            circle(this.x, this.y, this.w / 2);
        }



        let mazeCell = this.maze.getCell(this.i, this.j);

        if (mazeCell.type == 'DOT') {
            this.eat(mazeCell);
        }

    }
}