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
    }

    create() {
        // ... (toàn bộ nội dung hàm create cũ) ...
        this.add.image(0, 0, 'scene1_bg').setOrigin(0, 0);

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
            this.sound.play('correct_sfx', { volume: 0.8 });
            hootPopup.setVisible(false);
            if (cluesFound === totalClues) {
                this.add.text(400, 300, 'BẠN ĐÃ PHÁ ÁN XONG!\nTuyệt vời!', { fontSize: '40px', fill: '#0f0', align: 'center' }).setOrigin(0.5).setDepth(20);
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
