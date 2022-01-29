class GameScene extends Phaser.Scene{
    constructor() {
        super('Game');

    }
    create() {
        this.choisenBalls = [];
        this.ballsCount = 0;
        this.onDraged = false;
        this.createBackgtound();
        this.createBalls()
        this.start();
    }

    // Функція запускає гру
    start() {
        this.initBallsPositions();
        this.initBalls()
        this.showBalls()
        this.createText()
        
    }

    update() {
        this.lookingForDeletedBalls()
           
    }

    // Функція створює бекграунд
    createBackgtound() {
            this.bg = this.add.tileSprite(0, 0, config.width, config.height, 'bg').setOrigin(0);

    }

    // Функція створює текст з лічильником очок
    createText() {
        this.ScoreText = this.add.text(config.width / 1.3 , 100, 'Score:', {
            font: '40px CurseCasual',
            fill: '#ffffff'
        }).setOrigin(0.5)
    }


    // Функція створює всі шари при запуску гри
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
        this.input.on('dragend', this.deleteBalls, this);

        
    }

    // Функція створюе координати для кульок
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

    // Функція створює кульки вже з позиціями
    initBalls() {
        let positions = Phaser.Utils.Array.Shuffle(this.positions);
        this.balls.forEach(ball => {

            ball.init(positions.pop())
        })
        
    }

    // Функція переміщує кульки на свої місця
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


    // Функція перебирае массив з кульками та шукає видаленні
    lookingForDeletedBalls() {
        let sortedBalls = this.balls.sort(((a, b) => {
            if (a.position.y > b.position.y) {
                return 1
            }
            if (a.position.y < b.position.y) {
                return -1
            }
            return 0
        }))
        this.balls = sortedBalls.reverse()
        this.balls.forEach((ball, indexBall) => {
            if (ball.deletedBall === true) { 
                    let increment = 0;
                    let upperBall = { deletedBall: true}
                do {
                    let nextY = ball.position.y - increment
                    if (nextY <= 217.5) {
                        upperBall = { deletedBall: false }
                        this.createNewBall(ball, indexBall)
                        return 
                    } else {
                        upperBall = this.findBallUpper(ball.position.x, nextY)
                        increment = increment + 57
                    }
                } while (upperBall.deletedBall === true);
                    upperBall.setAlive(false)
                    this.balls.splice(indexBall, 1, new Ball(this, upperBall.frame.name.match(/\d+/)))
                    this.balls[indexBall].initFromUp(ball.position, upperBall.position)
                    this.balls[indexBall].move(ball.position)
                    this.input.setDraggable(this.balls[indexBall])
                    this.balls.splice(this.balls.indexOf(upperBall), 1, { position: upperBall.position, frame: upperBall.frame, deletedBall: true })
                    return 
               
            } return

        })
    }

    // Функція створює новий шар та кидає його з верху на першу відсутню позицію
    createNewBall(ball, indexBall) {
        const id = Phaser.Math.Between(1, 5);
        let newBall = new Ball(this, id)
        this.balls.splice(indexBall, 1)
        this.balls.push(newBall)
        this.balls[this.balls.length-1].initFromUp(ball.position, {
            x: ball.position.x,
            y: -51,
            delay: ball.position.delay
        })
        this.balls[this.balls.length-1].move(ball.position)
        this.input.setDraggable(this.balls[this.balls.length-1])
        return newBall
    }

    // Функція шукає шар який знаходиться на рівень з верху
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

    // Функція запускае дію Drag та додає перший обраний шар у перелік шарів на видалення
    dragged(pointer, ball) {
        let frameName = ball.frame.name;
        let { x, y } = ball.position;
        this.onDraged = true
        if (this.choisenBalls.length === 0) {
            ball.choisenBall();
            this.choisenBalls.push({ position: ball.position, frame: { name: frameName }});
            return
        }
        return
    }

    // Функція перевіряе чи наступний шар знаходиться поруч з останнім
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

    // Функція яка додає нові шари в перелік на видалення якщо ті задовольняють вимогам
    onBallPointerover(pointer, ball) {
        if (this.onDraged === true) {
        let frameName = ball[0].frame.name;
        let { x, y } = ball[0].position;
            let findballs = this.choisenBalls.find((findBall) => {
            if(x === findBall.position.x && y === findBall.position.y){
                return true
                }
                return false
            });
            if (this.choisenBalls[0].frame.name === frameName && this.isBallBehind(this.choisenBalls[this.choisenBalls.length - 1].position, ball[0].position)) {
                if (findballs === undefined) {
                    ball[0].choisenBall();
                    this.choisenBalls.push({ position: ball[0].position, frame: { name: frameName } })
                }
                else {
                    let deletedBallFromChoise = this.choisenBalls.pop();
                    let deletedBall = this.balls.find((findBall) => {
                        if(deletedBallFromChoise.position === findBall.position){
                        return true
                        }
                        return false
                    });
                    deletedBall.stopChoise()
                }
            }
            return
        }
        
    }

    // Функція відаляе кульки з переліку а в основному массиві замінюе обєект кульки на видалений об'єкт, зкидує перелік, оновлює лічильник
    deleteBalls(pointer, ball) {
        let OldBalls = [...this.balls];
        this.choisenBalls.forEach((choisenBall) => {
            let findBall = OldBalls.find((ball, ballIndex, array) => {
                if (ball.position.x === choisenBall.position.x &&
                    ball.position.y === choisenBall.position.y) {
                    this.balls.splice(ballIndex, 1, { position: ball.position, frame: ball.frame, deletedBall: true })
                    return true
                }
                return false
            })
            
            findBall.setAlive(false)
        })
        this.ballsCount = this.ballsCount + this.choisenBalls.length
        this.ScoreText.setText('Score: ' + this.ballsCount)
        this.choisenBalls = [];
        this.onDraged = false;
    }

    
}