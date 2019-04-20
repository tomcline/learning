class Player extends Cell {
    constructor(maze,height,width) {
        
        let i,j,w,h,tempCell;

        h = height;
        w = width;

        function determinePosition(){
            tempCell = maze.grid[floor(random(maze.grid.length - 1))];
            if (tempCell === maze.start || tempCell === maze.end) {
            }
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
    handleKeyPress(keyCode){

        //this.move(keyCode);


         let newDirection = this.determineNewDirection(keyCode);
        // let normalizedPosition = this.normalizePosition(newDirection);
         let canMove = this.canMoveTo(newDirection);
         if (canMove){
            this.movementDirection = keyCode;
            this.newDirection = newDirection; 
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
    canMoveTo(newDirection) {

        let futureCell;
        let currentCell;



        //futureCell = maze.getCell(newI,newJ);

        currentCell = maze.getCell(this.i,this.j);
               
       //left
        if (newDirection.i == -1) {
            if (currentCell.walls[this.maze.WallPositions.LEFT].visible == false) {
                return true;
            }
            else {
                return false;
            }
        }
        //right
        else if (newDirection.i == 1) {
            if (currentCell.walls[this.maze.WallPositions.RIGHT].visible == false) {
                return true;
            }
            else {
                return false;
            }
        }
        //up
        else if (newDirection.j == -1) {
            if (currentCell.walls[this.maze.WallPositions.TOP].visible == false) {
                return true;
            }
        }
        //down
        else if (newDirection.j == 1) {
            if (currentCell.walls[this.maze.WallPositions.BOTTOM].visible == false) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            
            return false;
        }
        //return currentCell.visitableNeighbors.includes(futureCell);
    }
    normalizePosition(newDirection) {
         
        let normalizedI =  Math.round(Math.abs((-this.w + (2*(this.x+newDirection.i))) / (2 * this.w)));

        let normalizedJ = Math.round(Math.abs((-this.h + (2*(this.y+ newDirection.j))) / (2 * this.h)));
        


        if (newDirection.i < 0 || newDirection.j < 0) {
        }
        // if (newDirection.i == 0) {
        //     normalizedI = this.i;
        // }
        // if (newDirection.j == 0) {
        //     normalizedJ = this.j;
        // }

        return {
            i: normalizedI,
            j:normalizedJ
        };
                   
    }
    move(keyCode) {
     
        if (keyCode !== null) {



            //if (frameCount % this.speed == 0) {
                
                    let newDirection = this.determineNewDirection(keyCode);
                                    
                    
                    
                    
                    let canMove = this.canMoveTo(newDirection);
    
                    if (canMove){
                        this.isMoving = true;
                    }   
                    else {
                        this.isMoving = false;
                    } 
    
                    if (this.isMoving === true) {
                    
                        this.newDirection = newDirection;
                        
                        this.movementDirection = keyCode;
                        
                        if (this.movementFrames == this.maze.cellSize) {
                            this.i += newDirection.i;
                            this.j += newDirection.j;    
                            this.movementFrames = 0;    
                        }
                        
                        this.x += newDirection.i;
                        this.y += newDirection.j;
                        this.movementFrames++;
                        
                        console.log(this.movementFrames);
                        
                    }
    

        }       

    }

    eat(cell) {
        cell.type = null;
    }
    moveMouth(){

        if (this.mouthOpening){
            this.mouthAngle+=30;
        }
        else {
            this.mouthAngle-=30;
        }

        if (this.mouthAngle == 90) {
            this.mouthOpening = false;
        }
        else if (this.mouthAngle == 0 ) {
            this.mouthOpening = true;
        }

    }

    show() {
        let rotationAngle = 0;
        //Move mouth twice as fast as movement speed
         if (frameCount % 4 == 0 ){
             this.moveMouth();
         }

        noStroke();
        fill(this.color);
        angleMode(DEGREES);
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
        


        if (this.mouthAngle > 0 ) {
            //* cell.w + cell.w / 2
            // * cell.h + cell.h / 2
            arc(this.x,this.y, this.w, this.h, rotationAngle+this.mouthAngle/2, rotationAngle - this.mouthAngle/2, PIE);
        }
        else {
            circle(this.x,this.y, this.w / 2);
        }


        let mazeCell = this.maze.getCell(this.i,this.j);
        
        if (mazeCell.type == 'DOT') {
            this.eat(mazeCell);
        }

    }
}
