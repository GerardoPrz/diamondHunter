export class Scoreboard{
    constructor(scene){
        this.relatedScene = scene;
        this.score = 0;
    }

    create(){
        this.scoreText = this.relatedScene.add.text(16,16, 'puntos: 0',{
            fontSize: '20px',
            fill: '#fbf',
            fontFamily: 'verdana, aria, sans-serif'
        });
    }

    incrementPoints(points){
    this.score += points;
    this.scoreText.setText('puntos: ' + this.score);
    }

}