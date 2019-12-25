class Enemy extends Player {
    constructor(startPosition,maze, height, width, enemyName, player) {
        
        
        super(startPosition,maze, height, width);
        
        
        let origin = maze.getCell(this.i, this.j);
        let target = maze.getCell(player.i, player.j);

        
        
        this.type = 'ENEMY';
        this.speed = 0;
        this.enemyIndex = -1;
        this.imageIndex = -1;
        this.mode = game.enemyModes.Wait;
        this.modePrevious = game.enemyModes.Wait;
        this.isScared = false;
        this.isBlinking = false;
        this.enemyName = enemyName;
        this.currentPath = [];
        this.homePosition = {
            i: 0,
            j: 0
        }
        this.previousMovement = {
            x: 0,
            y: 0
        }

        this.initializeEnemyType(enemyName);


    }
    reset(){
        this.currentPath = [];
        this.mode = game.enemyModes.Wait;
        this.modePrevious = game.enemyModes.Wait;
        this.isScared = false;
        this.isBlinking = false;
        this.previousMovement = {
            x: 0,
            y: 0
        }

        this.moveToStartingPosition();
    }
    moveToStartingPosition(){
        this.x = (this.startPosition.i * maze.cellSize) + (maze.cellSize / 2);
        this.y = (this.startPosition.j * maze.cellSize) + (maze.cellSize / 2);
    }
    initializeEnemyType(enemyName) {
        if (this.enemyName == 'INKY') {
            this.color = color(0, 255, 255);
            this.speed = 1;
            this.enemyIndex = 2;
        } else if (this.enemyName == 'BLINKY') {
            this.color = color(255, 0, 0);
            this.speed = 1;
            this.enemyIndex = 0;
        } else if (this.enemyName == 'PINKY') {
            this.color = color(255, 192, 203);
            this.speed = 1;
            this.enemyIndex = 1;
        } else if (this.enemyName == 'CLYDE') {
            this.color = color(249, 166, 2);
            this.speed = 1;
            this.enemyIndex = 3;
            this.homePosition = {
                i: this.maze.rows - 1,
                j: this.maze.columns - 1
            }
        }
    }
    switchImage() {

        this.imageIndex = this.imageIndex === 1 ? 0 : 1;

    }
    pursue(player, maze, solver) {

        let newPosition;
        let willReverseDirection = false;

        let directionPosition;

        //If we are in the middle of a cell we may have a choice to make
        //Otherwise, carry on in previous directions
        let cell = this.maze.getCell(this.i, this.j);
        
        if (this.isInMiddleOfCell()) {
            //Get cell of current position.
            //See if we have multiple routes to take.
            if (cell.visitableNeighbors.length > 1) {
                newPosition = this.calculateNewPosition(player, maze, solver);
            } else {
                //Only one route is availale, let's go there.
                if (cell.visitableNeighbors.length == 1) {
                    newPosition = {
                        i: cell.visitableNeighbors[0].i,
                        j: cell.visitableNeighbors[0].j
                    }
                }
            }

            //Calc our movement co-ords offset
            let iDiff = newPosition.i - this.i;
            let jDiff = newPosition.j - this.j;


            //If our new offset is in the x direction 
            //and our previous movement was in the x direction
            //and our values are different it means we are trying to turn around
            //Same for y
            if ((iDiff != 0 && this.previousMovement.x != 0) && iDiff != this.previousMovement.x) {
                willReverseDirection = true;
            }
            if ((jDiff != 0 && this.previousMovement.y != 0) && jDiff != this.previousMovement.y) {
                willReverseDirection = true;
            }

            //Not turning around
            //set offset accordingly
            if (!willReverseDirection) {
                directionPosition = {
                    x: iDiff,
                    y: jDiff
                }

            }
            else {
                //If best path would reverse our direction,
                //Pick a different neighbor
                //Or, attempt to continue in current path
                let bestCell =  this.maze.getCell(newPosition.i, newPosition.j);
                let possibleRoutes = cell.visitableNeighbors.filter(item => item !== bestCell);
                if (possibleRoutes.length > 0) {
                    //Randomly select route - not how OG pacman does it...
                    let randomDirection = floor(random(0,possibleRoutes.length-1));
                    directionPosition = {
                        x: possibleRoutes[randomDirection].i - this.i,
                        y: possibleRoutes[randomDirection].j - this.j
                    }
                }
                else {
                        //Force direction reversal
                        let newX = 0;
                        let newY = 0;

                        if (this.previousMovement.x != 0) {
                            newX = this.previousMovement.x * -1;
                        }

                        if (this.previousMovement.y != 0) {
                            newY = this.previousMovement.y * -1;
                        }

                        directionPosition = {
                            x: newX,
                            y: newY
                        }

                        console.warn(this.enemyName,directionPosition, "Cant go anywhere because maze is dumb... Prevent this in the future but allow for now.");
                }
            }
        } else {
           directionPosition = {
                x: this.previousMovement.x,
                y: this.previousMovement.y
            }
        }


        if (frameCount % this.speed == 0) {
            this.move(directionPosition);
        }

    }

    calculateNewPosition(player, maze, solver) {

        let newPosition;
        this.maze.resetCellValues();

        switch (this.mode) {
            case game.enemyModes.Chase:
                //Blinky - Target Pacman
                //Pinky - Target 4 tiles in front of current direction
                //Inky - 2 tiles in front of Pac man, with a vector from Blinky to that position, doubled.
                //Clyde - If > 8 tiles from pacman, keep targeting, if within <= 8 tiles, return to home target.

                switch (this.enemyName) {
                    case "BLINKY":
                        solver.setOrigin(maze.getCell(this.i, this.j));
                        solver.setTarget(maze.getCell(player.i, player.j));
                        break;
                    case "PINKY":
                        //Returns a direction base 1,0,-1 co-ordinate
                        var target = player.determineNewDirectionPosition(player.currentMovementDirection);
                        //Determine offset to adjust targets cells by
                        target.x = target.x * 4;
                        target.y = target.y * 4;
                        solver.setOrigin(maze.getCell(this.i, this.j));
                        solver.setTarget(maze.getCell(player.i + target.x, player.j + target.y));
                        //debugger;
                        break;
                    case "INKY":
                        //Returns a direction base 1,0,-1 co-ordinate
                        var playerTarget = player.determineNewDirectionPosition(player.currentMovementDirection);

                        //Determine offset to adjust targets cells by
                        //2 cells in front of players direction
                        playerTarget.x = player.i + playerTarget.x * 2;
                        playerTarget.y = player.j + playerTarget.y * 2;

                        let inkyTargetPosition = {
                            x: blinky.i + 2 * (playerTarget.x - blinky.i),
                            y: blinky.j + 2 * (playerTarget.y - blinky.j)
                        }

                        solver.setOrigin(maze.getCell(this.i, this.j));
                        solver.setTarget(maze.getCell(inkyTargetPosition.x, inkyTargetPosition.y));
                        break;
                    case "CLYDE":
                        let playerVector = createVector(player.i, player.j);
                        let clydeVector = createVector(this.i, this.j);
                        let distanceToPlayer = Math.floor(clydeVector.dist(playerVector));

                        solver.setOrigin(maze.getCell(this.i, this.j));
                        if (distanceToPlayer < 6) {
                            solver.setTarget(maze.getCell(this.homePosition.j, this.homePosition.i));
                        } else {
                            solver.setTarget(maze.getCell(player.i, player.j));
                        }
                        break;

                    default:
                        solver.setOrigin(maze.getCell(this.i, this.j));
                        solver.setTarget(maze.getCell(player.i, player.j));
                        break;
                }




                solver.solve();
                solver.generateSolutionPath();
                this.currentPath = solver.pathSolution;
                newPosition = solver.pathSolution[solver.pathSolution.length - 2];
                solver.reset();
                break;
            case game.enemyModes.Scatter:

                break;
            case game.enemyModes.Frightened:

                break;

            default:
                break;
        }

        //No positions were foud, assume ourself
        if (newPosition == undefined) {
            newPosition = {
                i: this.i,
                j: this.j
            }
        }

        return newPosition;
    }

    move(directionPosition) {

                
                    this.previousMovement = {
                        x: directionPosition.x,
                        y: directionPosition.y
                    };

                    this.x += directionPosition.x;
                    this.y += directionPosition.y;

                    //Update i and j position.
                    let normalizedPosition = this.normalizePosition();
                    this.i = normalizedPosition.i;
                    this.j = normalizedPosition.j;


        }
        show() {

            if (frameCount % 15 == 0) {
                this.switchImage();
            }

            push();
            //Thanks to human on the interwebz for building the enemy sprite.
            var ghostIndex = this.isScared ? 4 : this.enemyIndex; // the vert ghost image
            var imageIndex = this.isBlinking ? 2 : this.imageIndex; // horiz image


            //image(ghosties_img, this.i*maze.cellSize, this.j*maze.cellSize, this.w, this.h, (42 * imageIndex), 43 * ghostIndex, 45, 45);
            image(ghosties_img, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h, (42 * imageIndex), 43 * ghostIndex, 45, 45);

            pop();





        }

    }