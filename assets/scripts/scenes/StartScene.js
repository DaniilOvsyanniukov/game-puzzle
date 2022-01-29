class StartScene extends Phaser.Scene{
    constructor() {
        super('Start');
    }

    // Запускаємо бекграунд, початковий текст старту гри та вішаем клік на екрані
    create() {
        this.createBackgtound();
        this.createText()
        this.setEvents()
    }
    // Створюем беграунд
    createBackgtound() {
        this.add.sprite(0, 0, 'bg').setOrigin(0);

    }

    // Створюем текст запуску гри
    createText() {
        this.add.text(config.width / 2, 500, 'Tap to start', {
            font: '40px CurseCasual',
            fill: '#ffffff'
        }).setOrigin(0.5)
    }
    // Створюем слухача кліку
    setEvents() {
        this.input.on('pointerdown', ()=>{this.scene.start('Game')})
    }
}