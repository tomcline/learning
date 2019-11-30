class Enemy extends Player {
    constructor(maze, height, width, enemyName, player) {
        super(maze, height, width);


        let origin = maze.getCell(this.i, this.j);
        let target = maze.getCell(player.i, player.j)

        this.type = 'ENEMY';
        this.speed = 0;
        this.enemyIndex = -1;
        this.imageIndex = -1;
        this.mode = enemyModes.Wait;
        this.modePrevious = enemyModes.Wait;
        this.isScared = false;
        this.isBlinking = false;
        this.enemyName = enemyName;
        this.currentPath = [];
        this.homePosition =  {
            i: 0,
            j: 0
        }
        this.previousMovement = {
            x: 0,
            y: 0
        }

        this.initializeEnemyType(enemyName);


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
                i: this.maze.rows-1,
                j: this.maze.columns-1
            }
        }
    }
    switchImage() {

        this.imageIndex = this.imageIndex === 1 ? 0 : 1;

    }
    pursue(player, maze, solver) {
1

        let newPosition;

        let directionPosition = {
            x:  0,
            y: 0
        };

        //If we are in the middle of a cell we may have a choice to make

        if (this.isInMiddleOfCell()) {
            //Get cell of current position.
            let cell = this.maze.getCell(this.i, this.j);

            //See if we have multiple routes to take.
            //Currently allow for reversing direction....
            //
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
            

            let iDiff = newPosition.i - this.i;
            let jDiff = newPosition.j - this.j;
            let prevX = this.previousMovement.x;
            let prevY = this.previousMovement.y;

            let willChangeDirection = false;
            console.log(iDiff,jDiff,prevX,prevY,iDiff+prevX,jDiff+prevY,this.enemyName);
            if (prevX != 0 || prevY != 0) {
                if (iDiff != 0 || jDiff != 0) {
                    if (prevX != 0 && iDiff+prevX == 0) {
                        willChangeDirection = true;
                    }
                    if (prevY != 0 && jDiff+prevY == 0) {
                        willChangeDirection = true;
                    }
                }
            }
            else {
                //console.log("No previous direction....");
            }

            

            

            if (!willChangeDirection) {
                directionPosition = {
                    x:  iDiff,
                    y: jDiff
                }
            }
            else {
                directionPosition = {
                    x: this.previousMovement.x,
                    y: this.previousMovement.y
                }
            }
           


        }
        else {
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
            case enemyModes.Chase:
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
                        target.x = target.x*4;
                        target.y = target.y*4;
                        solver.setOrigin(maze.getCell(this.i, this.j));
                        solver.setTarget(maze.getCell(player.i + target.x, player.j + target.y));
                        //debugger;
                        break;
                    case "INKY":
                            //Returns a direction base 1,0,-1 co-ordinate
                            var playerTarget = player.determineNewDirectionPosition(player.currentMovementDirection);
                            
                            //Determine offset to adjust targets cells by
                            //2 cells in front of players direction
                            playerTarget.x = player.i + playerTarget.x*2;
                            playerTarget.y = player.j + playerTarget.y*2;
                          
                            let inkyTargetPosition = {
                                x:blinky.i + 2*(playerTarget.x-blinky.i),
                                y:blinky.j + 2*(playerTarget.y-blinky.j)
                            } 
                            
                            solver.setOrigin(maze.getCell(this.i, this.j));
                            solver.setTarget(maze.getCell(inkyTargetPosition.x,inkyTargetPosition.y));
                        break;
                    case "CLYDE":
                        let playerVector = createVector(player.i,player.j);
                        let clydeVector = createVector(this.i,this.j);
                        let distanceToPlayer =  Math.floor(clydeVector.dist(playerVector));
                                                
                        solver.setOrigin(maze.getCell(this.i, this.j));
                        if (distanceToPlayer < 6) {
                            solver.setTarget(maze.getCell(this.homePosition.j,this.homePosition.i));
                        }
                        else {
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
            case enemyModes.Scatter:
                
                break;
            case enemyModes.Frightened:
                
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


        //Only attempt to turn when in middle of cell
        //Don't allow turning around.
        //if (this.isInMiddleOfCell()) {
            this.x += directionPosition.x;
            this.y += directionPosition.y;
            this.previousMovement = directionPosition;
        //}
        //  else {
        //     this.x += this.previousMovement.x;
        //     this.y += this.previousMovement.y;
        // }

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