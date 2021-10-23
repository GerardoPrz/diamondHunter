import { Game } from "./scenes/game.js";

const Config = {
    type: Phaser.Auto,
    width: 800,
    heihgt: 600,
    scene: [Game],
    physics:{
        default: 'arcade',
        arcade:{
            gravity: {y: 300},
            debug: false
        }
    }
}

var game = new Phaser.Game(Config);