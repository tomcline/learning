
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

    if (enemyName == 'INKY') {
        this.color = color(0,255,255);
        this.speed = 40;
        this.enemyIndex = 0;
    }
    else if (enemyName == 'BLINKY') {
        this.color = color(255,0,0);
        this.speed = 60;
        this.enemyIndex = 1;
    }
    else if (enemyName == 'PINKY') {
        this.color = color(255,192,203);
        this.speed = 30;
        this.enemyIndex = 2;
    }
    else if (enemyName == 'CLYDE') {
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
        this.move(newPosition.i,newPosition.j);
    }
   
    solver.reset();

}
move(newI,newJ){
        
        if (frameCount % this.speed == 0) {
            
            this.i = newI;
            this.j = newJ;
        }
        
        if (frameCount % 15 == 0) {
            this.switchImage();
        }

    }
    show(){

        push();

        var ghostIndex = this.isScared ? 4 : this.enemyIndex; // the vert ghost image
        var imageIndex = this.isBlinking ? 2 : this.imageIndex; // horiz image

      
        image(ghosties_img, this.i*maze.cellSize, this.j*maze.cellSize, this.w, this.h, (42 * imageIndex), 43 * ghostIndex, 45, 45);
        pop();

  

    

    }

}
