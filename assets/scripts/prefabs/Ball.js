class Ball extends Phaser.GameObjects.Sprite{
    constructor(scene, id) {
        super(scene, 0, 0, 'balls', `sphere${id}`);
        this.deletedBall = false;
        this.scene.add.existing(this);
        this.setInteractive();
        this.init()
    }

    // Надає позиціі кулькам які падають з верху у процессі гри
    initFromUp(positionTo, positionFrom) {
        this.position = positionTo
        this.setPosition(positionFrom.x, positionFrom.y)
    }

    // Надає похиції кульки при ініціації
    init(position) {
        this.position = position;
        this.setPosition(-this.width, -this.height)
    }

    // Надає анімаціі кулькам які попадають у перелік на видалення
    choisenBall() {
            this.scene.tweens.add({
            targets: this,
            scaleX: 1.2,
            scaleY: 1.2,
            ease: 'Sine.easeInOut',
            duration: 400,
            delay: 50,
            repeat: -1,
            yoyo: true
             });
    }

    //Убирає анімаціі кулькам які попадають у перелік на видалення
    stopChoise() {
        this.scene.tweens._active.pop()
    }

    //Рухає кульки в залежності від координат Params
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

    //Видаляє кульки з рендерінгу
    setAlive(status) {
        this.setVisible(status);
        this.setActive(status);
    }

}