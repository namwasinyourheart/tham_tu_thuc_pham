// Cấu hình game không đổi
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    // Thêm danh sách các Scene vào game
    scene: [MainMenuScene, Level1Scene, Level2Scene]
};

// Biến toàn cục để lưu trạng thái game tạm thời, sẽ reset mỗi khi tải lại trang
// ĐÃ BỊ XÓA - Thay thế bằng Registry

const game = new Phaser.Game(config);

// Khởi tạo Registry khi game sẵn sàng
game.events.on('ready', function () {
    game.registry.set('level1_completed', false);
});
