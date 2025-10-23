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

        const startButtonLevel1 = this.add.text(400, 350, 'Bắt Đầu Chơi Level 1', {
            fontSize: '32px',
            fill: '#fff',
            backgroundColor: '#1a7aab',
            padding: { x: 20, y: 10 },
            borderRadius: 5
        }).setOrigin(0.5).setInteractive();

        startButtonLevel1.on('pointerdown', () => {
            this.scene.start('Level1Scene');
        });

        const startButtonLevel2 = this.add.text(400, 420, 'Bắt Đầu Chơi Level 2', {
            fontSize: '32px',
            fill: '#fff',
            backgroundColor: '#aab11a',
            padding: { x: 20, y: 10 },
            borderRadius: 5
        }).setOrigin(0.5).setInteractive();

        // Kiểm tra Registry thay vì biến toàn cục
        const level1Completed = this.registry.get('level1_completed');
        startButtonLevel2.setVisible(level1Completed);

        startButtonLevel2.on('pointerdown', () => {
            this.scene.start('Level2Scene');
        });

        // Xóa nút "Xóa Dữ Liệu" vì không còn cần thiết
    }
}
