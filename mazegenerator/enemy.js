
class Enemy extends Player {
    constructor(maze,height,width,enemyName,player) {
        super(maze,height,width);

    
    let origin = maze.getCell(this.i,this.j);
    let target = maze.getCell(player.i,player.j)
    
    this.type = 'ENEMY';
    this.speed = 0;


    if (enemyName == 'RED') {
        this.color = color(255,0,0);
        this.speed = 60;
    }
    
    else if (enemyName == 'GREY') {
        this.color = color(175,175,175);
        this.speed = 50;
    }
    
    else if (enemyName == 'GREEN') {
        this.color = color(0,255,0);
        this.speed = 40;
    }
    
    else if (enemyName == 'BLUE') {
        this.color = color(0,0,255);
        this.speed = 30;
    }
    else {
        this.color = color(255,150,150);
        this.speed = 20;
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
