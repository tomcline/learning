
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
    this.currentPath = [];
    
    this.initializeEnemyType(enemyName);
    
    
}
initializeEnemyType(enemyName) {
    if (this.enemyName == 'INKY') {
        this.color = color(0,255,255);
        this.speed = 1;
        this.enemyIndex = 0;
    }
    else if (this.enemyName == 'BLINKY') {
        this.color = color(255,0,0);
        this.speed = 1;
        this.enemyIndex = 1;
    }
    else if (this.enemyName == 'PINKY') {
        this.color = color(255,192,203);
        this.speed = 1;
        this.enemyIndex = 2;
    }
    else if (this.enemyName == 'CLYDE') {
        this.color = color(249,166,2);
        this.speed = 1;
        this.enemyIndex = 3;
    }
}
switchImage() {

    this.imageIndex = this.imageIndex === 1 ? 0 : 1;

}
pursue(player,maze,solver) {
    
    
    this.maze.resetCellValues();
    let newPosition = null;

    //If we are in the middle of a cell we may have a choice to make
    if (this.isInMiddleOfCell()) {
        //Get cell of current position.
        let cell = this.maze.getCell(this.i,this.j);
        //See if we have multiple routes to take.
        //Currently allow for reversing direction....
        if (cell.visitableNeighbors.length > 1){
            solver.setOrigin(maze.getCell(this.i,this.j));
            solver.setTarget(maze.getCell(player.i,player.j));
            
            solver.solve();
            
            solver.generateSolutionPath();

            this.currentPath = solver.pathSolution;
            
            
            newPosition = solver.pathSolution[solver.pathSolution.length-2];
            
            solver.reset();
        }
        else {
            //Only one route is availale, let's go there.
            if (cell.visitableNeighbors.length == 1) {
                newPosition = {   
                        i: cell.visitableNeighbors[0].i,
                        j: cell.visitableNeighbors[0].j
                    }
            }
        }
    }
    
    
    
    if (frameCount % this.speed == 0) {

        if (newPosition) {
            this.move(newPosition.i,newPosition.j);
        }
        else {
            this.move(this.i,this.j);
        }
    }
   

}
    move(newI,newJ){
            
                var directionI = newI - this.i;
                var directionJ = newJ - this.j;
                var directionPosition = {
                    x: directionI,
                    y: directionJ
                };

                if (this.isInMiddleOfCell()) {
                    this.x += directionPosition.x;
                    this.y += directionPosition.y;
                    this.previousMovement = directionPosition;
                }
                else {
                    this.x += this.previousMovement.x;
                    this.y += this.previousMovement.y;
                }

                //Update i and j position.
                let normalizedPosition = this.normalizePosition();
                this.i = normalizedPosition.i;
                this.j = normalizedPosition.j;

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
