// Cấu hình game không đổi
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
    // Chúng ta không cần hàm update ở giai đoạn này
};

const game = new Phaser.Game(config);

function preload() {
    // 1. Tải các tài sản đồ họa mới cho màn chơi 1
    this.load.image('scene1_bg', 'assets/scene1_bg.png'); 
    // SỬA LỖI: Sửa lại đường dẫn ảnh cho đúng
    this.load.image('hoot', 'assets/hoot.png');
}

function create() {
    // 1. Hiển thị ảnh nền
    this.add.image(0, 0, 'scene1_bg').setOrigin(0, 0);

    // 2. Khai báo các biến quản lý trạng thái game
    let cluesFound = 0;
    const totalClues = 4;

    // 3. Dữ liệu của các manh mối (tọa độ, kích thước, nội dung) - ĐÃ CẬP NHẬT
    const cluesData = [
        { x: 100, y: 440, width: 220, height: 120, explanation: 'Dầu chiên màu đen kịt là dấu hiệu dầu đã được dùng lại nhiều lần, không tốt cho sức khỏe.' },
        { x: 320, y: 420, width: 200, height: 100, explanation: 'Tay người bán hàng vừa cầm tiền vừa chuẩn bị đồ ăn có thể lây truyền rất nhiều vi khuẩn.' },
        { x: 580, y: 420, width: 200, height: 150, explanation: 'Ruồi là vật trung gian truyền rất nhiều bệnh nguy hiểm. Thức ăn cần được che đậy cẩn thận.' },
        { x: 130, y: 150, width: 80, height: 80, explanation: 'Trang phục người bán hàng không sạch sẽ cũng là một dấu hiệu về điều kiện vệ sinh chung không đảm bảo.' }
    ];

    // 4. Tạo giao diện người dùng (UI)
    const clueCounterText = this.add.text(10, 10, `Manh mối: 0 / ${totalClues}`, { fontSize: '24px', fill: '#fff', stroke: '#000', strokeThickness: 4 });
    clueCounterText.setDepth(20); // Đặt lớp cao nhất

    // 5. Tạo popup Cú Hoot và mây chat (phiên bản duy nhất, ở góc trên phải)
    const hootPopup = this.add.container(800, 0).setDepth(10).setVisible(false);
    
    const bubbleWidth = 320;
    const bubbleHeight = 180;
    const bubbleX = -bubbleWidth - 120;
    const bubbleY = 80;

    const bubble = this.add.graphics();
    bubble.fillStyle(0xffffff, 0.95);
    bubble.lineStyle(3, 0x543829, 1);
    bubble.fillRoundedRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, 20);
    bubble.strokeRoundedRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, 20);
    // Vẽ đuôi mây chat
    bubble.fillTriangle(bubbleX + bubbleWidth, bubbleY + 70, bubbleX + bubbleWidth + 20, bubbleY + 80, bubbleX + bubbleWidth, bubbleY + 90);
    bubble.strokeTriangle(bubbleX + bubbleWidth, bubbleY + 70, bubbleX + bubbleWidth + 20, bubbleY + 80, bubbleX + bubbleWidth, bubbleY + 90);
    hootPopup.add(bubble);

    const hootImage = this.add.image(-60, 160, 'hoot').setScale(0.8);
    hootPopup.add(hootImage);

    const educationalText = this.add.text(
        bubbleX + bubbleWidth / 2,
        bubbleY + 75,
        '',
        { fontSize: '18px', fill: '#333', align: 'center', wordWrap: { width: bubbleWidth - 40 } }
    ).setOrigin(0.5);
    hootPopup.add(educationalText);

    const closeButton = this.add.text(
        bubbleX + bubbleWidth / 2,
        bubbleY + bubbleHeight - 30,
        'Đã hiểu!',
        { fontSize: '20px', fill: '#007bff' }
    ).setOrigin(0.5).setInteractive();
    hootPopup.add(closeButton);

    closeButton.on('pointerdown', () => {
        hootPopup.setVisible(false);
        if (cluesFound === totalClues) {
            this.add.text(400, 300, 'BẠN ĐÃ PHÁ ÁN XONG!\nTuyệt vời!', { fontSize: '40px', fill: '#0f0', align: 'center' }).setOrigin(0.5).setDepth(20);
        }
    });
    
    // 6. Tạo các vùng tương tác cho manh mối
    cluesData.forEach(clueInfo => {
        const clueZone = this.add.zone(clueInfo.x, clueInfo.y, clueInfo.width, clueInfo.height).setOrigin(0, 0).setInteractive();
        
        // THAY ĐỔI: Chuyển từ khung xanh sang ô đỏ để dễ debug
        const graphics = this.add.graphics().setDepth(1);
        graphics.fillStyle(0xff0000, 0.4); // Màu đỏ, độ trong suốt 40%
        graphics.fillRect(clueInfo.x, clueInfo.y, clueInfo.width, clueInfo.height);
        
        let found = false;
        clueZone.on('pointerdown', () => {
            // Chỉ cho phép tìm manh mối mới khi popup đang đóng
            if (!found && !hootPopup.visible) { 
                found = true;
                cluesFound++;
                clueCounterText.setText(`Manh mối: ${cluesFound} / ${totalClues}`);
                
                educationalText.setText(clueInfo.explanation);
                hootPopup.setVisible(true);

                // Không cần ẩn khung xanh nữa vì nó không tồn tại
            }
        });
    });
}
