class GameScene extends Phaser.Scene{
    constructor() {
        super('Game');

    }
    create() {
        this.choisenBalls = [];
        this.finishMyChoise = false;
        this.createBackgtound();
        this.createBalls()
        this.start();
    }

    update() {
        if (this.finishMyChoise) {
            this.choisenBalls.forEach((choisenBall) => {
                let findBall = this.balls.find((ball, ballIndex, array) => {
                    if (ballIndex === choisenBall.index) {
                        return true
                    } else return false
                })
                findBall.move({
                   x: this.sys.game.config.width + findBall.width,
                    y: this.sys.game.config.height + findBall.height,
                    delay: findBall.position.delay,
            })
            })
            this.finishMyChoise = false
            this.choisenBalls = [];
        }
       
    }
    createBackgtound() {
            this.bg = this.add.tileSprite(0, 0, config.width, config.height, 'bg').setOrigin(0);

    }
    start() {
        this.initBallsPositions();
        this.initBalls()
        this.showBalls()
        
    }
    createBalls() {
        this.balls =[]
        for (let value of config.balls) {
            for (let i = 0; i < 6; i++){
                const id = Phaser.Math.Between(1, 5);
                this.balls.push(new Ball(this, id))
            }
        }
        this.input.on("gameobjectdown", this.onBallClicked, this)
        this.input.on("pointerover", this.onBallPointerover, this)
    }

    onBallPointerover(pointer, ball) {
        let frameName = ball[0].frame.name;
        let { x, y } = ball[0].position;
        

        if (this.choisenBalls.length === 0) { return }
        let findballs = this.choisenBalls.find((ballclick) => ballclick.x === x && ballclick.y === y);
        let indexOfBall = this.balls.findIndex((ballclick) => ballclick.x === x && ballclick.y === y);
        if (this.choisenBalls[0].frame.name === frameName && findballs === undefined) {
            if (this.choisenBalls[this.choisenBalls.length - 1].position.y + 57 === y &&
                this.choisenBalls[this.choisenBalls.length - 1].position.x === x ||
                this.choisenBalls[this.choisenBalls.length - 1].position.y - 57 === y &&
                this.choisenBalls[this.choisenBalls.length - 1].position.x === x
            ) {
                this.choisenBalls.push({ position: { x, y }, frame:{ name: frameName }, index: indexOfBall})
            }
            if (this.choisenBalls[this.choisenBalls.length - 1].position.x + 57 === x &&
                this.choisenBalls[this.choisenBalls.length - 1].position.y === y ||
                this.choisenBalls[this.choisenBalls.length - 1].position.x - 57 === x &&
                this.choisenBalls[this.choisenBalls.length - 1].position.y === y)
            {
                this.choisenBalls.push({ position: { x, y }, frame:{ name: frameName }, index: indexOfBall })
            }
        }
        if (this.choisenBalls.length === 1) {
            return
        }
        if (this.choisenBalls[this.choisenBalls.length - 2].position.x === x &&
            this.choisenBalls[this.choisenBalls.length - 2].position.y === y) {
            this.choisenBalls.pop();
        }
         else { return }
        
    }



    onBallClicked(pointer, ball) {
        let frameName = ball.frame.name;
        let { x, y } = ball.position;
        let indexOfBall = this.balls.findIndex((ballclick) => ballclick.x === x && ballclick.y === y);
       
        if (this.choisenBalls.length === 0) {
            this.choisenBalls.push({ position: { x, y }, frame:{ name: frameName }, index: indexOfBall });
            return
        }
        if (this.choisenBalls[this.choisenBalls.length - 1].position.x === x &&
            this.choisenBalls[this.choisenBalls.length - 1].position.y === y) {
            this.finishMyChoise = true;
            return
            }
    }

    initBallsPositions() {
        let positions = [];
        let ballTexture = this.textures.get('sphere1').getSourceImage();

        let ballWidth = ballTexture.width + 25;
        let ballHeight = ballTexture.height + 25;
        let offsetX = (this.sys.game.config.width - ballWidth * config.cols)/2+ballWidth/2;
        let offsetY = (this.sys.game.config.height - ballHeight * config.rows) / 2 + ballHeight / 2;
        let id=0
        for (let row = 0; row < config.rows; row++) {
            for (let col = 0; col < config.cols; col++){
                ++id;
                positions.push({
                    delay: id*50,
                    x: offsetX+ col*ballWidth,
                    y: offsetY+ row*ballHeight,
                })
            }
    }
        this.positions = Phaser.Utils.Array.Shuffle(positions);
    }

    initBalls() {
        let positions = Phaser.Utils.Array.Shuffle(this.positions);
        
        this.balls.forEach(ball => {

            ball.init(positions.pop())
        })
        console.log(this.balls)
    }

    showBalls() {
        this.balls.forEach(ball => {
            ball.depth = ball.position.delay;
            ball.move({
                    x: ball.position.x,
                    y: ball.position.y,
                    delay: ball.position.delay
            })
            })
    }

    
}