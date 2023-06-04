import {SceneSeau as SceneSeau} from "./SceneSeau.js";
import {SceneForet as SceneForet} from "./SceneForet.js";
import { ScenePlage as ScenePlage } from "./ScenePlage.js";
import { SceneChateau as SceneChateau } from "./SceneChateau.js";
import { SceneBoss as SceneBoss} from "./SceneBoss.js";



var config = {
    type: Phaser.AUTO,
    width: 896, height: 448,
    pixelArt : true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
        }
    },
    scene: [SceneSeau,SceneForet, ScenePlage,SceneBoss]
};
new Phaser.Game(config); 