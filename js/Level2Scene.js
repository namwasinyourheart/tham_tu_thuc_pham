// Class cho màn chơi 2
class Level2Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level2Scene' });
    }

    preload() {
        this.load.image('scene2_bg', 'assets/scene2_bg.png');
        this.load.image('hoot', 'assets/hoot.png');
        this.load.image('white_pixel', 'assets/white_pixel.png');
        this.load.audio('bg_music', 'assets/background_music.mp3');
        this.load.audio('correct_sfx', 'assets/correct.mp3');
    }

    create() {
        this.add.image(0, 0, 'scene2_bg').setOrigin(0, 0);

        // --- XÓA CÔNG CỤ DEBUG TỌA ĐỘ ---
        // this.input.on('pointerdown', (pointer) => {
        //     console.log(`Clicked at: x=${Math.round(pointer.x)}, y=${Math.round(pointer.y)}`);
        // });
        // --- KẾT THÚC CÔNG CỤ DEBUG TỌA ĐỌ ---

        const music = this.sound.add('bg_music');
        music.play({
            loop: true,
            volume: 0.4
        });

        // --- HỆ THỐNG THỜI GIAN ---
        this.timeLeft = 60; // Người chơi có 60 giây
        const timerBarWidth = 400;
        const timerBarHeight = 20;

        const timerBarBg = this.add.graphics();
        timerBarBg.fillStyle(0x000000, 0.5);
        timerBarBg.fillRect(400 - timerBarWidth / 2, 30, timerBarWidth, timerBarHeight);

        const timerBar = this.add.image(400 - timerBarWidth / 2, 30, 'white_pixel')
            .setOrigin(0, 0)
            .setDisplaySize(timerBarWidth, timerBarHeight)
            .setTint(0x00ff00);

        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.timeLeft--;
                const newWidth = timerBarWidth * (this.timeLeft / 60);
                timerBar.setDisplaySize(newWidth, timerBarHeight);

                if (this.timeLeft < 15) {
                    timerBar.setTint(0xff0000);
                }

                if (this.timeLeft <= 0) {
                    this.timerEvent.remove(false);
                    this.add.text(400, 300, 'HẾT GIỜ!', { fontSize: '48px', fill: '#ff0000' }).setOrigin(0.5).setDepth(30);
                }
            },
            callbackScope: this,
            loop: true
        });

        let cluesFound = 0;
        const totalClues = 4; // Sẽ có 4 manh mối trong màn này

        // --- Manh mối cho Màn 2 (Tọa độ placeholder) ---
        const cluesData = [
            { x: 150, y: 300, width: 80, height: 80, explanation: 'Dụng cụ pha chế không sạch sẽ có thể gây ô nhiễm đồ uống.' },
            { x: 350, y: 200, width: 100, height: 100, explanation: 'Nguyên liệu để hở, không che đậy dễ bị bụi bẩn và côn trùng bám vào.' },
            { x: 550, y: 400, width: 120, height: 120, explanation: 'Thùng chứa nước không đảm bảo vệ sinh, có thể chứa vi khuẩn gây bệnh.' },
            { x: 600, y: 100, width: 80, height: 80, explanation: 'Ly nhựa dùng một lần bị bẩn hoặc đã qua sử dụng.' }
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
                this.timerEvent.remove(false);
                let stars = 1;
                if (this.timeLeft >= 45) {
                    stars = 3;
                } else if (this.timeLeft >= 30) {
                    stars = 2;
                }
                const winText = `BẠN ĐÃ PHÁ ÁN XONG!\nThời gian: ${60 - this.timeLeft} giây\nSố sao: ${'★'.repeat(stars)}`;
                this.add.text(400, 300, winText, { fontSize: '32px', fill: '#0f0', align: 'center' }).setOrigin(0.5).setDepth(20);
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
