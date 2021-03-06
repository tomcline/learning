class Player extends Cell {
    constructor(startPosition, maze, height, width) {

        let i, j, w, h, tempCell;

        h = height;
        w = width;


        super(startPosition.i, startPosition.j, w, h, maze);

       

        this.startPosition = startPosition;
        this.type = 'PLAYER';
        this.color = color(255, 255, 0);
        this.isMoving = false;
        this.desiredMovementDirection = null;
        this.currentMovementDirection = null;
        this.speed = 1;
        this.mouthAngle = 0;
        this.mouthOpening = true;
        
        this.moveToStartingPosition();

    }
    moveToStartingPosition(){
         //Start in middle of start cell region.
         this.x = ((this.startPosition.i * maze.cellSize) + (maze.cellSize / 2)) + (maze.cellSize / 2);
         this.y = (this.startPosition.j * maze.cellSize) + (maze.cellSize / 2);
    }
    reset(){
        this.isMoving = false;
        this.mouthAngle = 0;
        this.mouthOpening = true;
        this.desiredMovementDirection = null;
        this.currentMovementDirection = null;
        this.moveToStartingPosition();
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

        //Don't let player in ghost house.
        if (newPosition.type ==  maze.cellTypes.GhostDoor) {
            return false;
        }

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
        let newDesiredPosition = this.getNewPosition(directionPosition);
        let canMoveInDirection = this.canMoveTo(newDesiredPosition);


        if (canMoveInDirection || forceMove) {
            this.x += directionPosition.x;
            this.y += directionPosition.y;
            return true;
        }
        return false;
    }
    move() {

        player.isMoving = true;

        

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
            else {
                //Unable to make any further moves
                //See if we are at end of tunnel
                //If so, warp
                let currentCell = this.maze.getCell(this.i, this.j);
                if (currentCell.type == currentCell.maze.cellTypes.Tunnel){
                    let gameWidth =  maze.columns*maze.cellSize;
                    let newX = 0;
                    //If warping left, set to other side
                    //Otherwise, warps to right
                    if (this.currentMovementDirection == LEFT_ARROW) {
                        newX = gameWidth;
                    }
                    this.x = newX;
                    this.y = this.y;

                }
            }
        }



        //Update i and j position.
        let normalizedPosition = this.normalizePosition();
        this.i = normalizedPosition.i;
        this.j = normalizedPosition.j;

    }

    eat(cell) {

        let points = 0;
        /*
         Pac-Dot = 10 Pts
        Power Pellet = 50 Pts
        1st Ghost = 200 Pts
        2nd Ghost = 400 Pts
        3rd Ghost = 800 Pts
        4th Ghost = 1600 Pts
        Cherry = 100 Pts
        Strawberry = 300 Pts
        Orange = 500 Pts
        Apple = 700 Pts
        Melon = 1000 Pts
        Galaxian = 2000 Pts
        Bell = 3000 Pts
        Key = 5000 Pts
      */

        switch (cell.type) {
            case maze.cellTypes.Pellet:
                points = 10;
                cell.type = maze.cellTypes.EmptySpace;
                gameSounds.pacChomp.stop();
                gameSounds.pacChomp.play();
                game.dotWasEaten();
                break;
            case maze.cellTypes.PowerPellet:
                points = 50;
                cell.type = maze.cellTypes.EmptySpace;
                gameSounds.pacChomp.stop();
                gameSounds.pacChomp.play();
                game.dotWasEaten();
                //Pellett eaten, trigger frightened mode.
                game.enterFrightenedMode();
                break;

            default:
                break;
        }

        game.updateScore(points);

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
    getCurrentCell(){
        return this.maze.getCell(this.i, this.j);
    }
    checkPlayerState(mazeCell){
        
        for (let enemy of enemies) {
            if (player.getCurrentCell() == enemy.getCurrentCell() )
            {
                if (enemy.mode != game.enemyModes.Frightened) {
                    player.wasHit();
                }
                else {
                    game.enemyEaten(enemy);
                }
                break;
            }
        };

        if ((mazeCell.type == maze.cellTypes.Pellet || mazeCell.type == maze.cellTypes.PowerPellet)) {
            this.eat(mazeCell);
        }
    }
    wasHit(){
        gameSounds.pacDeath.play();
        game.playerWasHit();
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
        this.checkPlayerState(mazeCell);
        

    }
}