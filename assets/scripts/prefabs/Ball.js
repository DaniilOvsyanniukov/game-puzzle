class Ball extends Phaser.GameObjects.Sprite{
    constructor(scene, id) {
        super(scene, 0, 0, 'balls', `sphere${id}` );
        this.scene.add.existing(this);
        this.setInteractive();
        this.choisen = false
        this.init()
    }
    init(position) {
        this.position = position;
            this.setPosition(-this.width, -this.height)
    }
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

}