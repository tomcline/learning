
class Enemy extends Player {
    constructor(maze,height,width,enemyName,player) {
        super(maze,height,width);

    
    let origin = maze.getCell(this.i,this.j);
    let target = maze.getCell(player.i,player.j)
    
    this.type = 'ENEMY';
    this.speed = 0;

    if (enemyName == 'INKY') {
        this.color = color(0,255,255);
        this.speed = 40;
    }
    else if (enemyName == 'BLINKY') {
        this.color = color(255,0,0);
        this.speed = 60;
    }
    else if (enemyName == 'PINKY') {
        this.color = color(255,192,203);
        this.speed = 30;
    }
    else if (enemyName == 'CLYDE') {
        this.color = color(249,166,2);
        this.speed = 50;
    }
    
    
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
    
    }
    show(){

        //super.show();
        let x = this.i * maze.cellSize;
        let y = this.j * maze.cellSize;
        let w = this.w*.8;
        let h = this.h*.8;
        noStroke();
        fill(this.color);
        rect(x,y,w,h);

    

    }

}
