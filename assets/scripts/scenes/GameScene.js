class GameScene extends Phaser.Scene{
    constructor() {
        super('Game');

    }
    create() {
        this.choisenBalls = [];
        this.finishDelete = false;
        this.onDraged = false;
        this.createBackgtound();
        this.createBalls()
        this.start();
     }

    update() {
        this.lookingForDeletedBalls()
           
    }


    lookingForDeletedBalls() {
        this.balls.forEach((ball) => {
            if (ball.deletedBall === true) {
                let counter = 0;
                let upperBall = {deletedBall:true}    
                do {
                    let nextY = ball.position.y - counter
                    upperBall = this.findBallUpper(ball.position.x, nextY)
                    if (nextY <= 217.5) {
                         let lastBall =this.balls.find((findBall) => {
                            if (ball.position.x === findBall.position.x && ball.position.y === findBall.position.y) {
                                return true
                            }
                            return false
                         })
                         upperBall = this.createNewBall(lastBall, this.balls.indexOf(lastBall))
                        return
                    }
                    counter = counter + 57
                } while (upperBall.deletedBall === true || upperBall === null);
                if (upperBall.deletedBall === false) {
                    let downBall =this.balls.find((findBall) => {
                            if (upperBall.position.x === findBall.position.x && upperBall.position.y + 57 === findBall.position.y) {
                                return true
                            }
                            return false
                    })
                    let indexDownBall = this.balls.indexOf(downBall);
                    upperBall.setAlive(false)
                    this.balls.splice(indexDownBall, 1, new Ball(this, upperBall.frame.name.match(/\d+/)))
                    this.balls[indexDownBall].initFromUp(downBall.position, upperBall.position)
                    this.balls[indexDownBall].move(downBall.position)
                    this.input.setDraggable(this.balls[indexDownBall])

                    this.balls.splice(this.balls.indexOf(upperBall), 1, { position: upperBall.position, frame: upperBall.frame, deletedBall: true })
                    return
                }
            }
        
        })
    }

    createNewBall(ball, ballIndex) {
        const id = Phaser.Math.Between(1, 5);
        let newBall = new Ball(this, id)
        this.balls.splice(ballIndex, 1, newBall)
        this.balls[ballIndex].initFromUp(ball.position, {
            x: ball.position.x,
            y: -51,
            delay: ball.position.delay
        })
        
        this.balls[ballIndex].move(ball.position)
        this.input.setDraggable(this.balls[ballIndex])
        return newBall
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
                const ball = new Ball(this, id)
                this.balls.push(ball)
                this.input.setDraggable(ball)
            }
        }
        this.input.on('dragstart',this.dragged, this);
        this.input.on('drag', this.onDrag, this);
        this.input.on("pointerover", this.onBallPointerover, this)
        this.input.on('dragend',this.deleteBalls, this);
        
    }

    findBallUpper(x, y) {
        const upperBall = this.balls.find((findBall) => {
                        if (x === findBall.position.x &&
                            y - 57 === findBall.position.y) {
                            return true
                        }
                        return false
        })
        return upperBall
        
    }

    dragged(pointer, ball) {
        console.log('dragstart')
        let frameName = ball.frame.name;
        let { x, y } = ball.position;
        this.onDraged = true
        if (this.choisenBalls.length === 0) {
            this.choisenBalls.push({ position: ball.position, frame: { name: frameName }});
            return
        }
        return
    }

    isBallBehind(lastAddedBall, nextBall) {
        const lastBallX = lastAddedBall.x;
        const lastBallY = lastAddedBall.y;
        const nextBallX = nextBall.x;
        const nextBallY = nextBall.y;
        if (lastBallY + 57 === nextBallY &&
                lastBallX ===  nextBallX ||
                lastBallY - 57 === nextBallY &&
                lastBallX ===  nextBallX
        ) { return true }
        if (lastBallX + 57 === nextBallX &&
                lastBallY === nextBallY ||
                lastBallX - 57 === nextBallX &&
            lastBallY === nextBallY
        ) { return true }
        return false
    }

    onDrag() {
        console.log('drag')
    }


    onBallPointerover(pointer, ball) {
        if (this.onDraged === true) {
        let frameName = ball[0].frame.name;
        let { x, y } = ball[0].position;
        let findballs = this.choisenBalls.find((ballclick) => ballclick.x === x && ballclick.y === y);
            if (this.choisenBalls[0].frame.name === frameName && this.isBallBehind(this.choisenBalls[this.choisenBalls.length - 1].position, ball[0].position)) {
                if (findballs === undefined) {
                    this.choisenBalls.push({ position: ball[0].position, frame: { name: frameName } })
                }
            }
            return
        }
        
    }

    deleteBalls() {
        let OldBalls = [...this.balls];
        console.log(this.choisenBalls)
        this.choisenBalls.forEach((choisenBall) => {
            let findBall = OldBalls.find((ball, ballIndex, array) => {
                if (ball.position.x === choisenBall.position.x &&
                    ball.position.y === choisenBall.position.y) {
                    this.balls.splice(ballIndex,1, { position: ball.position, frame: ball.frame, deletedBall:true })
                    return true
                }
                return false
            })
            
            findBall.setAlive(false)
        })
        this.choisenBalls = [];
        this.onDraged = false;
        console.log('dragEnd')
    }

    initBallsPositions() {
        let positions = [];
        let ballTexture = this.textures.get('sphere1').getSourceImage();

        let ballWidth = ballTexture.width + 25;
        let ballHeight = - ballTexture.height - 25;
        let offsetX = (this.sys.game.config.width - ballWidth * config.cols) / 2 + ballWidth / 2;
        let offsetY = (this.sys.game.config.height - ballHeight * config.rows) / 2 + ballHeight / 2;
        let id = 0
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