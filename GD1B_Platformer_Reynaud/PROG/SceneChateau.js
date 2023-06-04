export class SceneChateau extends Phaser.Scene {
    constructor() {
        super("SceneChateau");
    }

//INITIALISATION DES DONNEES
init(data) {}

//FONCTION PRELOAD
preload() {}

//FONCTION CREATE
create(){}

//FONCTION UPDATE
update(){}

//Fonction pour changer de scène
changeScene(player){
    this.scene.start("ScenePlage",{
        
    })
}
}