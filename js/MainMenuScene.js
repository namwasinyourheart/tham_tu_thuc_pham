class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#61d1ff');

        this.add.text(400, 200, 'Thám Tử Thực Phẩm', { 
            fontSize: '48px', 
            fill: '#fff',
            stroke: '#1a7aab',
            strokeThickness: 6
        }).setOrigin(0.5);

        const startButton = this.add.text(400, 350, 'Bắt Đầu Chơi', {
            fontSize: '32px',
            fill: '#fff',
            backgroundColor: '#1a7aab',
            padding: { x: 20, y: 10 },
            borderRadius: 5
        }).setOrigin(0.5).setInteractive();

        startButton.on('pointerdown', () => {
            this.scene.start('Level1Scene');
        });
    }
}
