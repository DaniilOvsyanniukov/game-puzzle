class BootScene extends Phaser.Scene{
    constructor() {
        super('Boot');

    }
    // Завантажуєм картинку бекграунду
    preload() {

        this.load.image('bg', 'assets/sprites/background.png');
    }

    // Переходим на наступний етап
    create() {

        this.scene.start('Preload')
    }

}