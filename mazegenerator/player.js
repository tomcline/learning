class Player extends Cell {
    constructor(maze, height, width) {

        let i, j, w, h, tempCell;

        h = height;
        w = width;

        function determineStartPosition() {
            tempCell = maze.grid[floor(random(maze.grid.length - 1))];
            return tempCell;
        }

        tempCell = determineStartPosition();

        i = tempCell.i;
        j = tempCell.j;


        super(i, j, w, h, maze);

        this.type = 'PLAYER';
        this.color = color(255, 255, 0);
        this.isMoving = false;
        this.desiredMovementDirection = null;
        this.currentMovementDirection = null;
        this.speed = 1;
        this.mouthAngle = 0;
        this.mouthOpening = true;

    }
    handleKeyPress(keyCode) {


        //let newDirection = this.determineNewDirection(keyCode);
        //&& this.isInMiddleOfCell()
        if (this.currentMovementDirection != keyCode) {
            //let canMove = this.canMoveTo(this.getNewPosition(newDirection));
            //if (canMove) {
            //this.move(keyCode);
            this.willChangeDirection = this.isChangingDirection(keyCode);
            this.desiredMovementDirection = keyCode;
            //this.newDirection = newDirection;
            //}
        }


    }
    isChangingDirection(desiredDirection) {
        //if (this.currentMovementDirection != null && this.desiredMovementDirection != null) {

        let currentPos = this.determineNewDirectionPosition(this.currentMovementDirection);
        let desiredPos = this.determineNewDirectionPosition(desiredDirection);

        if ((this.currentMovementDirection == LEFT_ARROW || this.currentMovementDirection == RIGHT_ARROW) && (desiredDirection == UP_ARROW || desiredDirection == DOWN_ARROW)) {
            return true;
        } else if ((this.currentMovementDirection == UP_ARROW || this.currentMovementDirection == DOWN_ARROW) && (desiredDirection == LEFT_ARROW || desiredDirection == RIGHT_ARROW)) {
            return true;
        } else {
            return false;
        }

        //}
        //let difference = createVector(currentPos.x,currentPos.y).sub(createVector(desiredPos.x,desiredPos.y));
        //console.log(difference);
        //this.desiredMovementDirection


    }
    determineNewDirectionPosition(keyCode) {
        let newX = 0;
        let newY = 0;

        if (keyCode == LEFT_ARROW) {
            newX = -1;
        }

        if (keyCode == RIGHT_ARROW) {
            newX = 1;

        }

        if (keyCode == UP_ARROW) {
            newY = -1;

        }

        if (keyCode == DOWN_ARROW) {
            newY = 1;
        }

        return {
            x: newX,
            y: newY
        };


    }
    getNewPosition(newDirection) {
        return this.maze.getCell(this.i + newDirection.x, this.j + newDirection.y);
    }
    canMoveTo(newPosition) {

        let currentCell;

        currentCell = this.maze.getCell(this.i, this.j);
        return currentCell.visitableNeighbors.includes(newPosition);
    

    }
    normalizePosition() {


        let normalizedI = Math.round(Math.abs((-this.w + (2 * this.x)) / (2 * this.w)));;

        let normalizedJ = Math.round(Math.abs((-this.h + (2 * this.y)) / (2 * this.h)));


        return {
            i: normalizedI,
            j: normalizedJ
        };

    }
    isInMiddleOfCell(cell) {
        if (cell === undefined || cell === null) {
            return (this.x % this.w == this.w / 2 && this.y % this.h == this.h / 2);
        } else {
            return (this.x == cell.x && this.y == cell.y);
        }
    }
    moveInDirection(direction, forceMove) {
        let directionPosition = this.determineNewDirectionPosition(direction);
        let canMoveInDirection = this.canMoveTo(this.getNewPosition(directionPosition));
        if (canMoveInDirection || forceMove) {
            this.x += directionPosition.x;
            this.y += directionPosition.y;
            return true;
        }
        return false;
    }
    move() {
        let didMove = false;
        //Not changing direction, attempt to move to desired direction
        if (!this.willChangeDirection && this.moveInDirection(this.desiredMovementDirection)) {
            //If we were able to move in desired direction, set it to current direction and return.
            this.currentMovementDirection = this.desiredMovementDirection;
            this.desiredMovementDirection = null;
            didMove = true;
        }


        //Changing directions, if in middle of cell, attempt to turn
        if (this.willChangeDirection) {
            if (this.isInMiddleOfCell()) {
                if (this.moveInDirection(this.desiredMovementDirection)) {
                    //If we turned, remove turn signal.
                    this.willChangeDirection = false;
                    didMove = true;
                }

            }
        }

        if (!didMove) {
            //We were not able to make the desired move, nor were we able to turn
            //Continue on in current direction if we can
            if (this.moveInDirection(this.currentMovementDirection)) {}
            //If we are at the last cell of our journey, see if we have made it to the center
            //If not in the center, keep moving.
            else if (!this.isInMiddleOfCell(this.maze.getCell(this.i, this.j))) {
                this.moveInDirection(this.currentMovementDirection, true);
            }
        }



        //Update i and j position.
        let normalizedPosition = this.normalizePosition();
        this.i = normalizedPosition.i;
        this.j = normalizedPosition.j;





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
            y: this.y + 30
        };
    }
    determineRotationAngle() {
        let rotationAngle = 0;
        switch (this.currentMovementDirection) {
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