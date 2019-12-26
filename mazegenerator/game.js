class Game {
    constructor() {
        this.maze = null;
        this.player = null;
        this.enemies = null;
        this.started = false;
        this.debug = false;
        this.paused = false;
        this.lives = 3;
        this.score = 0;
        this.highScore = 0;
        
        this.keyCodes = {
            D: 68,
            R: 82,
            SPACEBAR: 32
        }
        
        this.enemyModes = {
            Wait: 0,
            Chase: 1,
            Scatter: 2,
            Frightened: 3
        }
        
        this.enemyMode = this.enemyModes.Chase;
    }

    drawHeader(){
        let gameWidth =  maze.columns*maze.cellSize;

        push();
        //if (this.type == "PLAYER") debugger;
        fill(255,255,255);
        noStroke();
        textSize(20);
        textFont("PressStart");

        textAlign(CENTER, CENTER);
        
        text(this.score,100 , this.maze.cellSize*2.25);

        text("HIGH SCORE",gameWidth/2 , this.maze.cellSize*1.15);

        text(this.highScore,gameWidth/2 , this.maze.cellSize*2.25);


        pop();



    }

    drawFooter(){
        let gameWidth =  maze.columns*maze.cellSize;
        let gameHeight =  maze.rows*maze.cellSize;
       

        for (let i = 1; i < this.lives; i++) {
            noStroke();
            fill(color(255, 255, 0));
            angleMode(DEGREES);  
            arc((maze.cellSize+maze.cellSize*i), gameHeight-this.maze.cellSize, maze.cellSize, maze.cellSize, 30, 330, PIE);    
        }

    }

    handleKeyPress(keyCode) {
        
    //Turn on debugging
    //D KEY
    if (keyCode == this.keyCodes.D) {
        this.debug = !this.debug;
    }


    if (keyCode == this.keyCodes.R) {
        this.gameOver();
    }

    //Start game.
    if (!this.started && keyCode == ENTER){
        this.started = true;
        gameSounds.intro.stop();
        this.enemies.forEach(enemy => {
            enemy.mode = this.enemyModes.Chase;
        });
    }
    
    //Only response to key presses after game has started
    if (this.started && !this.paused && (keyCode == UP_ARROW ||  keyCode == DOWN_ARROW || keyCode == RIGHT_ARROW || keyCode == LEFT_ARROW) && this.maze && this.maze.isInitialized) {
       this.player.handleKeyPress(keyCode);
    }

        //SPACE BAR
        if (this.started && keyCode == this.keyCodes.SPACEBAR) {
            this.paused = !this.paused;
            if (game.paused) {
                this.enemies.forEach(enemy => {
                    enemy.modePrevious = enemy.mode;
                    enemy.mode = this.enemyModes.Wait;
                });
            }
            else {
                this.enemies.forEach(enemy => {
                    enemy.mode = enemy.modePrevious;
                });
            }
        }
    }
    updateScore(points){

        this.score+=points;

        if (this.score >= this.highScore) {
            this.highScore = this.score;
        }

    
    }
    playerWasHit(){
        this.lives--;
        if (this.lives<=0) {
            this.gameOver();
        }
        this.resetToStartingPositions();
    }
    resetToStartingPositions(){
        player.reset();
        enemies.forEach(enemy => {
            enemy.reset();
        });
        this.started = false;
    }
    gameOver(){
        maze.isInitialized = false;
        game.started = false;
        this.score = 0;
        this.lives = 3;
        this.resetToStartingPositions();
        gameSounds.pacSiren.stop();
        gameSounds.intro.play();
        maze.initialize(mapgen());
    }
    show(){
        
        if (!this.started) {
            push();
            textSize(30);
            fill(235,255,0);
            textAlign(CENTER, TOP);
            textFont("PressStart");
             text("ENTER TO START", width/2, height/2);
             pop();
        }

        if (this.paused) {
            push();
            textSize(30);
            fill(235,255,0);
            textAlign(CENTER, TOP);
            textFont("PressStart");
             text("PAUSED", width/2, height/2);
             pop();
        }


        game.drawFooter();
        game.drawHeader();
    }
}
