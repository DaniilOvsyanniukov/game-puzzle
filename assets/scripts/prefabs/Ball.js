class Ball extends Phaser.GameObjects.Sprite{
    constructor(scene, id) {
        super(scene, 0, 0, 'balls', `sphere${id}`);
        this.deletedBall = false;
        this.scene.add.existing(this);
        this.setInteractive();
        this.init()
        // this.console(x,y)
    }

    initFromUp(positionTo, positionFrom) {
        this.position = positionTo
        this.setPosition(positionFrom.x, positionFrom.y)
    }

    init(position) {
        this.position = position;
        this.setPosition(-this.width, -this.height)
    }
    // console(x, y) {
    //     console.log(x,y)
    // }
    
    move(params) {
        this.scene.tweens.add({
            targets: this,
            x: params.x,
            y: params.y,
            delay: params.delay,
            ease: 'Linear',
            duration: 250,
            onComplete: () => {    
                if (params.callback) {
                    params.callback()
                }
            }
        })
    }
       
    setAlive(status) {
        this.setVisible(status);
        this.setActive(status);
    }

}