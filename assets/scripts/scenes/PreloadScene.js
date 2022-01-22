class PreloadScene extends Phaser.Scene{
    constructor() {
        super('Preload');
    }
    preload() {
        this.load.atlas('balls', 'assets/sprites/balls.png', 'assets/sprites/balls.json');
    }
    create() {

        this.scene.start('Start')
    }

}