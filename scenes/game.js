import { Scoreboard } from '../components/Scoreboard.js';
import { RestartButton } from '../components/restar-button.js';

export class Game extends Phaser.Scene{
    constructor(){
        super({ key: 'game' });
    }

    init(){
        this.scoreboard = new Scoreboard(this);
        this.restarbutton = new RestartButton(this);
    }

    preload(){
        this.load.image('gameover','images/gameover.png');
        this.load.image('ground','images/platform.png');
        this.load.image('background', 'images/backgroundSky.png');
        this.load.image('diamond', 'images/diamond.png');
        this.load.image('enemie', 'images/pelota.png');
        this.load.spritesheet('player', 'images/woofPlayer.png', {frameWidth: 32, frameHeight: 32});
    }

    create(){
        this.physics.world.setBoundsCollision(true, true, true, true);//activamos las "paredes del escenario"

        this.add.image(400,300, 'background');
        
        this.gameoverImage = this.add.image(400, 300, 'gameover');//creamos un elemento pre cargado y damos las coordenadas
        this.gameoverImage.visible = false;

        this.enemies = this.physics.add.group();

        //this.physics.add.collider(this.enemies, platforms);

        /*this.enemies = this.physics.add.group({
            key: 'enemie',
            repeat: 4,
            setXY: { x: 152, y: 0, stepX: 70 }//para separa cada diamante con 70px
        });*/

        this.enemies.children.iterate(function (child) {
            
            child.setCollideWorldBounds(true);
            child.setVelocity(50, 10);

        });

        this.platforms = this.physics.add.staticGroup();

        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');
        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');

        this.player = this.physics.add.sprite(32, 150, 'player');
        this.player.body.setGravityY(300);
        this.player.setCollideWorldBounds(true);//para que pueda chocar con las paredes del escenario
        this.player.setBounce(0.2);
        
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1,
            yoyo: false,
        });

      this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', { start: 2, end: 3 }),
        frameRate: 10,
        repeat: -1,
        yoyo: false,
        });

        this.scoreboard.create();

        this.diamonds = this.physics.add.group({
            key: 'diamond',
            repeat: 10,
            setXY: { x: 12, y: 0, stepX: 70 }//para separa cada diamante con 70px
        });

        this.diamonds.children.iterate(function (child) {
            
            child.setCollideWorldBounds(true);

        });

        
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.diamonds, this.platforms);
        this.physics.add.collider(this.enemies, this.platforms);
        this.physics.add.collider(this.enemies, this.player, this.endGame, null, this);
        this.physics.add.collider(this.player, this.diamonds, this.diiamondImpact, null, this);
        
        this.cursors = this.input.keyboard.createCursorKeys();

    }

    update(){
        if(this.cursors.left.isDown){
            this.player.setVelocityX(-200);
            this.player.anims.play('left', true);
        }
        else if(this.cursors.right.isDown){
            this.player.setVelocityX(200);
            this.player.anims.play('right', true);
        }
        else{
            this.player.setVelocityX(0);//modificamos solo la velocidad en X
            this.player.anims.stop();

        }

        if ((this.cursors.space.isDown || this.cursors.up.isDown) && this.player.body.onFloor()) {
            this.player.setVelocityY(-500);
        }

        this.enemies.children.iterate(function (child) {
            
            if(child.x <= Game.width)
            {
                child.setVelocityX(-100)
            }else if(child.x >= Game.width)
            {
                child.setVelocityX(100);
            }
            

        });
        
    }

    diiamondImpact(player, diamond){
        diamond.disableBody(true, true);
        this.scoreboard.incrementPoints(10);
        if(this.diamonds.countActive() === 0)
        {
            this.endGame(false);
        }
        var x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = this.enemies.create(x, 16, 'enemie');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

        var x2 = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb2 = this.enemies.create(x2, 16, 'enemie');
        bomb2.setBounce(1);
        bomb2.setCollideWorldBounds(true);
        bomb2.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }

    endGame(completed = false){
        if(completed){
            this.scene.start('gameover');
        } else if(!completed){
            this.scene.start('congratulations');
        }
    }
}

