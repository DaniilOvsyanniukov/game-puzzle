class StartScene extends Phaser.Scene{
    constructor() {
        super('Start');
    }

    create() {
        this.createBackgtound();
        this.createText()
        this.setEvents()
    }
    createBackgtound() {
        this.add.sprite(0, 0, 'bg').setOrigin(0);

    }
    createText() {
        this.add.text(config.width / 2, 500, 'Tap to start', {
            font: '40px CurseCasual',
            fill: '#ffffff'
        }).setOrigin(0.5)
    }
    setEvents() {
        this.input.on('pointerdown', ()=>{this.scene.start('Game')})
    }
}