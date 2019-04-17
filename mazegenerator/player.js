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
        this.newPosition = null;
        this.mouthAngle = 0;
        this.mouthOpening = true;

    }
    handleKeyPress(keyCode){
         let newPosition = this.determineNewPosition(keyCode);
            
         let canMove = this.canMoveTo(newPosition.i,newPosition.j);
         if (canMove){
            this.movementDirection = keyCode;
            this.newPosition = newPosition; 
         }
         
    }
    determineNewPosition(keyCode) {
            let newI = 0;
            let newJ = 0;
            
            if (keyIsDown(LEFT_ARROW) || keyCode == LEFT_ARROW) {
                 newI = -1;    
             }
     
             if (keyIsDown(RIGHT_ARROW) || keyCode == RIGHT_ARROW) {
                 newI = 1;
                 
             }
     
             if (keyIsDown(UP_ARROW) || keyCode == UP_ARROW) {
                 newJ = -1;
                 
             }
     
             if (keyIsDown(DOWN_ARROW) || keyCode == DOWN_ARROW) {
                 newJ = 1;
             }

            //  return {
            //     i: this.i + newI,
            //     j: this.j + newJ
            // };

            return {
                i: newI,
                j: newJ
            };


    }
    canMoveTo(newI,newJ) {

        let futureCell;
        let currentCell;

        //(this.i + newPosition.i) * this.speed,(this.j + newPosition.j) * this.speed
        futureCell = maze.getCell((this.i + newI), (this.j + newJ));

        currentCell = maze.getCell(this.i,this.j);
        
        return currentCell.visitableNeighbors.includes(futureCell);
    }
    move(keyCode) {
     
        
        if (frameCount % this.speed == 0) {
            
                let newPosition = this.determineNewPosition(keyCode);
            
                let canMove = this.canMoveTo(newPosition.i,newPosition.j);
                
                if (canMove){
                    this.isMoving = true;
                    this.newPosition = newPosition;
                    this.i += this.newPosition.i * this.speed;
                    this.j += this.newPosition.j * this.speed;
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
        let cell = this;
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
            arc(cell.i * cell.w + cell.w / 2,  cell.j * cell.h + cell.h / 2, cell.w, cell.h, rotationAngle+this.mouthAngle/2, rotationAngle - this.mouthAngle/2, PIE);
        }
        else {
            circle(cell.i * cell.w + cell.w / 2, cell.j * cell.h + cell.h / 2, cell.w / 2);
        }


        let mazeCell = this.maze.getCell(this.i,this.j);
        
        if (mazeCell.type == 'DOT') {
            this.eat(mazeCell);
        }

    }
}
