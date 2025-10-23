// Di chuyển toàn bộ code từ file này sang Level1Scene.js

class Level1Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level1Scene' });
    }

    preload() {
        // ... (toàn bộ nội dung hàm preload cũ) ...
        this.load.image('scene1_bg', 'assets/scene1_bg.png'); 
        this.load.image('hoot', 'assets/hoot.png');
        this.load.audio('bg_music', 'assets/background_music.mp3');
        this.load.audio('correct_sfx', 'assets/correct.mp3');
        // Thêm một ảnh trắng nhỏ để làm thanh timer
        this.load.image('white_pixel', 'assets/white_pixel.png');
    }

    create() {
        // ... (toàn bộ nội dung hàm create cũ) ...
        this.add.image(0, 0, 'scene1_bg').setOrigin(0, 0);

        // --- HỆ THỐNG THỜI GIAN ---
        this.timeLeft = 60; // Người chơi có 60 giây
        const timerBarWidth = 400;
        const timerBarHeight = 20;

        // Vẽ nền cho thanh timer
        const timerBarBg = this.add.graphics();
        timerBarBg.fillStyle(0x000000, 0.5);
        timerBarBg.fillRect(400 - timerBarWidth / 2, 30, timerBarWidth, timerBarHeight);

        // Vẽ thanh timer thực tế
        const timerBar = this.add.image(400 - timerBarWidth / 2, 30, 'white_pixel')
            .setOrigin(0, 0)
            .setDisplaySize(timerBarWidth, timerBarHeight)
            .setTint(0x00ff00); // Màu xanh lá

        // Tạo sự kiện đếm ngược mỗi giây
        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.timeLeft--;
                
                // Cập nhật chiều dài và màu sắc của thanh timer
                const newWidth = timerBarWidth * (this.timeLeft / 60);
                timerBar.setDisplaySize(newWidth, timerBarHeight);

                if (this.timeLeft < 15) {
                    timerBar.setTint(0xff0000); // Chuyển sang màu đỏ khi sắp hết giờ
                }

                if (this.timeLeft <= 0) {
                    this.timerEvent.remove(false);
                    this.add.text(400, 300, 'HẾT GIỜ!', { fontSize: '48px', fill: '#ff0000' }).setOrigin(0.5).setDepth(30);
                    // Thêm nút "Chơi lại" và chuyển về Main Menu sau khi thua
                    const retryButton = this.add.text(400, 400, 'Chơi lại', { fontSize: '32px', fill: '#fff', backgroundColor: '#ff0000', padding: { x: 20, y: 10 } }).setOrigin(0.5).setInteractive();
                    retryButton.on('pointerdown', () => {
                        this.scene.start('MainMenuScene'); // Quay về màn hình chính để chọn lại
                    });
                }
            },
            callbackScope: this,
            loop: true
        });

        // --- BẮT ĐẦU CÔNG CỤ DEBUG TỌA ĐỘ ---
        // Đoạn code này sẽ in tọa độ của con trỏ chuột ra console mỗi khi bạn click.
        // Hãy dùng nó để tìm tọa độ chính xác của các manh mối.
        this.input.on('pointerdown', (pointer) => {
            console.log(`Clicked at: x=${Math.round(pointer.x)}, y=${Math.round(pointer.y)}`);
        });
        // --- KẾT THÚC CÔNG CỤ DEBUG TỌA ĐỘ ---

        const music = this.sound.add('bg_music');
        music.play({
            loop: true,
            volume: 0.4
        });
        
        let cluesFound = 0;
        const totalClues = 4;

        const cluesData = [
            { x: 100, y: 440, width: 220, height: 120, explanation: 'Dầu chiên màu đen kịt là dấu hiệu dầu đã được dùng lại nhiều lần, không tốt cho sức khỏe.' },
            { x: 320, y: 420, width: 200, height: 100, explanation: 'Tay người bán hàng vừa cầm tiền vừa chuẩn bị đồ ăn có thể lây truyền rất nhiều vi khuẩn.' },
            { x: 580, y: 420, width: 200, height: 150, explanation: 'Ruồi là vật trung gian truyền rất nhiều bệnh nguy hiểm. Thức ăn cần được che đậy cẩn thận.' },
            { x: 130, y: 150, width: 80, height: 80, explanation: 'Trang phục người bán hàng không sạch sẽ cũng là một dấu hiệu về điều kiện vệ sinh chung không đảm bảo.' }
        ];

        

        const clueCounterText = this.add.text(10, 10, `Manh mối: 0 / ${totalClues}`, { fontSize: '24px', fill: '#fff', stroke: '#000', strokeThickness: 4 });
        clueCounterText.setDepth(20);

        // --- THAY THẾ POPUP CŨ BẰNG POPUP MỚI ---
        const popupWidth = 700;
        const popupHeight = 400;
        const hootPopup = this.add.container(400, 300).setDepth(10).setVisible(false);

        const popupBackground = this.add.graphics();
        popupBackground.fillStyle(0xffffff, 0.95);
        popupBackground.lineStyle(3, 0x543829, 1);
        popupBackground.fillRoundedRect(-popupWidth / 2, -popupHeight / 2, popupWidth, popupHeight, 20);
        popupBackground.strokeRoundedRect(-popupWidth / 2, -popupHeight / 2, popupWidth, popupHeight, 20);
        hootPopup.add(popupBackground);

        // SỬA LỖI: Tăng kích thước Cú Hoot và căn chỉnh lại vị trí
        const hootImage = this.add.image(-popupWidth / 4, -20, 'hoot').setScale(1); // Tăng scale từ 0.5 lên 1
        hootPopup.add(hootImage);

        const textWidth = popupWidth / 2 - 40;
        const educationalText = this.add.text(
            popupWidth / 4,
            -20,
            '',
            { fontSize: '22px', fill: '#333', align: 'center', wordWrap: { width: textWidth } } // Tăng font size
        ).setOrigin(0.5);
        hootPopup.add(educationalText);

        const closeButton = this.add.text(
            popupWidth / 4,
            popupHeight / 2 - 50,
            'Đã hiểu!',
            { fontSize: '24px', fill: '#007bff', fontStyle: 'bold' } // Chỉnh style nút
        ).setOrigin(0.5).setInteractive();
        hootPopup.add(closeButton);

        closeButton.on('pointerdown', () => {
            this.sound.play('correct_sfx', { volume: 0.8 });
            hootPopup.setVisible(false);
            if (cluesFound === totalClues) {
                this.timerEvent.remove(false);
                let stars = 1;
                if (this.timeLeft >= 45) {
                    stars = 3;
                } else if (this.timeLeft >= 30) {
                    stars = 2;
                }
                const winText = `BẠN ĐÃ PHÁ ÁN XONG!\nThời gian: ${60 - this.timeLeft} giây\nSố sao: ${'★'.repeat(stars)}`;
                this.add.text(400, 300, winText, { fontSize: '32px', fill: '#0f0', align: 'center' }).setOrigin(0.5).setDepth(20);

                // CẬP NHẬT TRẠNG THÁI: Sử dụng Registry
                this.registry.set('level1_completed', true);

                // Chuyển về Main Menu sau 2 giây
                this.time.delayedCall(2000, () => {
                    this.sound.stopAll(); // Dừng tất cả âm thanh của cảnh hiện tại
                    this.scene.start('MainMenuScene');
                }, [], this);
            }
        });
        
        cluesData.forEach(clueInfo => {
            const clueZone = this.add.zone(clueInfo.x, clueInfo.y, clueInfo.width, clueInfo.height).setOrigin(0, 0).setInteractive();
            
            let found = false;
            clueZone.on('pointerdown', () => {
                if (!found && !hootPopup.visible) { 
                    this.sound.play('correct_sfx');
                    found = true;
                    cluesFound++;
                    clueCounterText.setText(`Manh mối: ${cluesFound} / ${totalClues}`);
                    
                    educationalText.setText(clueInfo.explanation);
                    hootPopup.setVisible(true);
                }
            });
        });
    }
}
