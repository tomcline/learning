
class Enemy extends Player {
    constructor(maze,height,width,enemyName,player) {
        super(maze,height,width);

    
    let origin = maze.getCell(this.i,this.j);
    let target = maze.getCell(player.i,player.j)
    
    this.type = 'ENEMY';
    this.speed = 0;
    this.enemyIndex = -1;
    this.imageIndex = -1;
    this.isScared = false;
    this.isBlinking = false;
    this.enemyName = enemyName;
    
    this.initializeEnemyType(enemyName);
    
    
}
initializeEnemyType(enemyName) {
    if (this.enemyName == 'INKY') {
        this.color = color(0,255,255);
        this.speed = 40;
        this.enemyIndex = 0;
    }
    else if (this.enemyName == 'BLINKY') {
        this.color = color(255,0,0);
        this.speed = 60;
        this.enemyIndex = 1;
    }
    else if (this.enemyName == 'PINKY') {
        this.color = color(255,192,203);
        this.speed = 30;
        this.enemyIndex = 2;
    }
    else if (this.enemyName == 'CLYDE') {
        this.color = color(249,166,2);
        this.speed = 50;
        this.enemyIndex = 3;
    }
}
switchImage() {

    this.imageIndex = this.imageIndex === 1 ? 0 : 1;

}
pursue(player,maze,solver) {
    
    maze.resetCellValues();

    solver.setOrigin(maze.getCell(this.i,this.j));
    solver.setTarget(maze.getCell(player.i,player.j));
    
    solver.solve();
    
    solver.generateSolutionPath();
    solver.drawPathSolution(this.color);

    let newPosition = solver.pathSolution[solver.pathSolution.length-2];
    if (newPosition) {
        this.calculateDirection(newPosition.i,newPosition.j);
        //this.move(newPosition.i,newPosition.j);
    }
    
    this.move();
   
    solver.reset();

}
/*
move(newI,newJ){
        
        if (frameCount % this.speed == 0) {
            //this.i = newI;
            //this.j = newJ;
            //Update i and j position.
            let normalizedPosition = this.normalizePosition();
            this.i = normalizedPosition.i;
            this.j = normalizedPosition.j;
        }
        
        

    }
    */
    calculateDirection(newI,newJ){
            
                var directionI = newI - this.i;
                var directionJ = newJ - this.j;
                var keyCode = this.desiredMovementDirection;
                
                if (directionI != 0) {
                    switch (directionI) {
                        case -1:
                            keyCode = LEFT_ARROW;
                            break;
                        case 1:
                            keyCode = RIGHT_ARROW;
                            break;
                        default:
                            break;
                    }
                }

                if (directionJ != 0) {
                    switch (directionJ) {
                        case -1:
                            keyCode = UP_ARROW;
                            break;
                        case 1:
                            keyCode = DOWN_ARROW;
                            break;
                        default:
                            break;
                    }
                }


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
    show(){

        if (frameCount % 15 == 0) {
            this.switchImage();
        }

        push();
        //Thanks to human on the interwebz for building the enemy sprite.
        var ghostIndex = this.isScared ? 4 : this.enemyIndex; // the vert ghost image
        var imageIndex = this.isBlinking ? 2 : this.imageIndex; // horiz image

      
        //image(ghosties_img, this.i*maze.cellSize, this.j*maze.cellSize, this.w, this.h, (42 * imageIndex), 43 * ghostIndex, 45, 45);
        image(ghosties_img, this.x-this.w/2, this.y-this.h/2, this.w, this.h, (42 * imageIndex), 43 * ghostIndex, 45, 45);

        pop();

  

    

    }

}
