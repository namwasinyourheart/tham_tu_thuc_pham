// Cấu hình game không đổi
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    // Thêm danh sách các Scene vào game
    scene: [MainMenuScene, Level1Scene]
};

const game = new Phaser.Game(config);
