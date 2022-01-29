class PreloadScene extends Phaser.Scene{
    constructor() {
        super('Preload');
    }
    // Завантажуєм спрайти кульок
    preload() {
        this.load.atlas('balls', 'assets/sprites/balls.png', 'assets/sprites/balls.json');
    }
      
    // Переходимо далі
    create() {

        this.scene.start('Start')
    }

}