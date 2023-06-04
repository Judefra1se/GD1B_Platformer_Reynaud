export class SceneSeau extends Phaser.Scene {
    constructor() {
        super("SceneSeau");
    }


    //PRELOAD
    preload() {
        this.load.image("assetsseau", "assetsseau.png")
        this.load.image("coquillage1", "coquillage1.png")
        this.load.image("coquillage2", "coquillage2.png")
        this.load.image("fleurs", "fleurs.png")
        this.load.image("filet", "filet.png")
        this.load.image("filet2", "filet2.png")
        this.load.image("plateformes", "plateformes.png")
        this.load.image("algues", "algues.png")
        this.load.image("sable", "sable.png")
        this.load.image("pics", "pics.png")
        this.load.image("spritehitbox", "spritehitbox.png")
        this.load.image("vide", "spritehitbox.png")
        this.load.image("langouste", "langouste.png")
        this.load.image("checkpoint", "spritehitbox.png")
        this.load.image("porte", "spritehitbox.png")
        this.load.image("foretbackground", "foretbackground.png")
        this.load.image("foretbackgroundbackground", "foretbackbackground.png")
        this.load.image("seaubackground", "seaubackground.png")
        this.load.image("ui", "ui.png")
        this.load.spritesheet("viespritesheet", "vie-Sheet.png",
            { frameWidth: 64, frameHeight: 64 })
        this.load.tilemapTiledJSON("Seau", "CarteSeau.json")
        this.load.spritesheet('perso', 'perso.png',
            { frameWidth: 64, frameHeight: 64 })


    }

    //CREATE
    create() {


        this.add.image(544, 496, "foretbackgroundbackground").setScrollFactor(0.4, 0)
        this.add.image(544, 496, "foretbackground").setScrollFactor(0.2)
        this.add.image(544, 496, "seaubackground")

        this.add.image(300, 135, "ui").setScale(0.080).setScrollFactor(0).setDepth(1)

        // Variables checkpoint.
        this.spawnx = 320
        this.spawny = 992

        //Variables scores.
        this.scoreCoquillage = 0
        this.scoreFleurs = 0

        //Variables joueur et ennemis.
        this.hpPlayer = 100
        this.follow1 = false
        this.follow2 = false
        this.follow3 = false

        //Variable algues.
        this.alguesCreate = true

        //Variables Dash.
        this.canDash = true;
        this.dashLeft = false;
        this.dashRight = false;
        this.killEnnemies = false;
        this.isDashing = false;
        this.dashRecup = false;

        //Variables attaque arme.
        this.createArme = false;

        //regen hp
        this.attfrr = false


        //Création de la map.
        const carteSeau = this.add.tilemap("Seau");
        const tileset = carteSeau.addTilesetImage(
            "assetsseau",
            "assetsseau");

        const sols = carteSeau.createLayer(
            "sols",
            tileset);
        sols.setCollisionByProperty({ estSolide: true });

        //Implémentation joueur.
        this.player = this.physics.add.sprite(this.spawnx, this.spawny, 'perso');
        this.player.setScale(0.65)
        this.player.setSize(27, 27)
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, sols);
        this.physics.world.setBounds(0, 0, 1088, 992);

        //Implémentation de la caméra.
        this.cameras.main.setBounds(0, 0, 1088, 992);
        this.cameras.main.zoom = 1.80;
        this.cameras.main.startFollow(this.player);

        //Implémentation touches.
        this.cursors = this.input.keyboard.createCursorKeys();
        this.clavier = this.input.keyboard.addKeys('C, SHIFT');


        //Implémentation consommables coquillage.
        this.coquillage1 = this.physics.add.group();
        this.physics.add.overlap(this.player, this.coquillage1, this.collectCoquillage, null, this);
        this.calque_coquillage1 = carteSeau.getObjectLayer('coquillage1');
        this.calque_coquillage1.objects.forEach(calque_coquillage1 => {
            const POP = this.coquillage1.create(calque_coquillage1.x + 15, calque_coquillage1.y - 15, 'coquillage1').body.setSize(20, 20).setAllowGravity(false).setImmovable(true);

        })

        this.coquillage2 = this.physics.add.group();
        this.physics.add.collider(this.player, this.coquillage2, this.collectCoquillage, null, this);
        this.calque_coquillage2 = carteSeau.getObjectLayer('coquillage2');
        this.calque_coquillage2.objects.forEach(calque_coquillage2 => {
            const POP = this.coquillage2.create(calque_coquillage2.x + 15, calque_coquillage2.y - 15, 'coquillage2').setScale(0.8).body.setAllowGravity(false).setImmovable(true);
        })

        this.scoreCoquillageText = this.add.text(274, 120, this.scoreCoquillage, { fontSize: '27px', fill: '#fe6128' })
        this.scoreCoquillageText.setScrollFactor(0).setDepth(2);
        this.scoreCoquillage = 0

        //Implémentation consommables fleurs.
        this.fleurs = this.physics.add.group();
        this.physics.add.overlap(this.player, this.fleurs, this.collectFleurs, null, this);
        this.calque_fleurs = carteSeau.getObjectLayer('fleurs');
        this.calque_fleurs.objects.forEach(calque_fleurs => {
            const POP = this.fleurs.create(calque_fleurs.x + 15, calque_fleurs.y - 15, 'fleurs').setScale(0.085).body.setAllowGravity(false).setImmovable(true);

        })

        this.scoreFleursText = this.add.text(334, 120, this.scoreFleurs, { fontSize: '27px', fill: '#d7018a' })
        this.scoreFleursText.setScrollFactor(0).setDepth(2);;
        this.scoreFleurs = 0


        //Implémentation filets à escalader.
        this.filet = this.physics.add.group();
        this.calque_filet = carteSeau.getObjectLayer('escalade');
        this.calque_filet.objects.forEach(calque_filet => {
            const POP = this.filet.create(calque_filet.x + 32, calque_filet.y - 0, 'filet2').body.setAllowGravity(false).setImmovable(true);

        })

        //Implémentation des plateformes.
        this.plateformes = this.physics.add.group();
        this.physics.add.collider(this.player, this.plateformes);
        this.calque_plateformes = carteSeau.getObjectLayer('plateforme');
        this.calque_plateformes.objects.forEach(calque_plateformes => {
            const POP = this.plateformes.create(calque_plateformes.x + 31, calque_plateformes.y - 27, 'plateformes').body.setAllowGravity(false).setImmovable(true);

        })

        //Implémentation des plateformes algues.
        this.algues = this.physics.add.group();
        this.physics.add.collider(this.player, this.algues, this.alguesBreak, null, this);
        this.calque_algues = carteSeau.getObjectLayer('algues');
        this.calque_algues.objects.forEach(calque_algues => {
            const POP = this.algues.create(calque_algues.x + 31, calque_algues.y - 27, 'algues').body.setAllowGravity(false).setImmovable(true);

        })


        //Implémentaion des blocs de sables.
        this.sable = this.physics.add.group();
        this.calque_sable = carteSeau.getObjectLayer('sable');
        this.calque_sable.objects.forEach(calque_sable => {
            const POP = this.sable.create(calque_sable.x + 16, calque_sable.y - 16, 'sable').body.setAllowGravity(true).setCollideWorldBounds(true);
            this.physics.add.collider(this.player, this.sable);
            this.physics.add.collider(this.sable, sols);
        })


        //Implémentation des pics.
        this.pics = this.physics.add.group();
        this.physics.add.collider(this.player, this.pics, this.mortPics, null, this);
        this.calque_pics = carteSeau.getObjectLayer('pics');
        this.calque_pics.objects.forEach(calque_pics => {
            const POP = this.pics.create(calque_pics.x + 17, calque_pics.y - 9, 'pics').body.setAllowGravity(false).setImmovable(true);

        })

        //Implémentation des checkpoints.
        this.checkpoint = this.physics.add.group();
        this.physics.add.overlap(this.player, this.checkpoint, this.save, null, this)
        this.calque_checkpoint = carteSeau.getObjectLayer('checkpoint');
        this.calque_checkpoint.objects.forEach(calque_checkpoint => {
            const POP = this.checkpoint.create(calque_checkpoint.x + 17, calque_checkpoint.y - 16, 'checkpoint').body.setAllowGravity(false)


        })

        //Implémentation du vide (limites du monde qui tuent).
        this.vide = this.physics.add.group();
        this.physics.add.overlap(this.player, this.vide, this.mortVide, null, this)
        this.calque_vide = carteSeau.getObjectLayer('vide');
        this.calque_vide.objects.forEach(calque_vide => {
            const POP = this.vide.create(calque_vide.x + 17, calque_vide.y - 16, 'vide').body.setAllowGravity(false)


        })

        //Implémentation des portes.
        this.porte = this.physics.add.group();
        this.physics.add.overlap(this.player, this.porte, this.changeScene, null, this)
        this.calque_porte = carteSeau.getObjectLayer('porte');
        this.calque_porte.objects.forEach(calque_porte => {
            const POP = this.porte.create(calque_porte.x + 17, calque_porte.y - 16, 'porte').body.setAllowGravity(false)


        })

        //Implémentation des ennemis.
        this.ennemies = this.physics.add.group({ allowGravity: true, collideWorldBounds: true });

        this.physics.add.collider(this.player, this.ennemies, this.getHit, null, this);


        this.ennemi1 = this.ennemies.create(600, 350, 'langouste').setScale(0.80).body.setImmovable(true).setSize(32, 32)
        this.spritehitbox1 = this.physics.add.sprite(0, 0, "spritehitbox").setSize(164, 128);
        this.spritehitbox1.body.setAllowGravity(false);
        this.physics.add.overlap(this.player, this.spritehitbox1, this.followPlayer1, null, this);

        this.ennemi2 = this.ennemies.create(128, 390, 'langouste').setScale(0.80).body.setImmovable(true).setSize(32, 32)
        this.spritehitbox2 = this.physics.add.sprite(0, 0, "spritehitbox").setSize(164, 128);
        this.spritehitbox2.body.setAllowGravity(false);
        this.physics.add.overlap(this.player, this.spritehitbox2, this.followPlayer2, null, this);

        this.ennemi3 = this.ennemies.create(250, 250, 'langouste').setScale(0.80).body.setImmovable(true).setSize(32, 32)
        this.spritehitbox3 = this.physics.add.sprite(0, 0, "spritehitbox").setSize(100, 128);
        this.spritehitbox3.body.setAllowGravity(false);
        this.physics.add.overlap(this.player, this.spritehitbox3, this.followPlayer3, null, this);


        this.physics.add.collider(this.ennemies, sols);
        this.physics.add.collider(this.ennemies, this.plateformes);
        this.physics.add.collider(this.ennemies, this.pics);
        this.physics.add.collider(this.ennemies, this.algues);

        this.anims.create({
            key: 'vie1',
            frames: [{ key: 'viespritesheet', frame: 0 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'vie2',
            frames: [{ key: 'viespritesheet', frame: 1 }],
            frameRate: 20
        });


        this.anims.create({
            key: 'vie3',
            frames: [{ key: 'viespritesheet', frame: 2 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'vie4',
            frames: [{ key: 'viespritesheet', frame: 3 }],
            frameRate: 20
        });


        this.anims.create({
            key: 'vie5',
            frames: [{ key: 'viespritesheet', frame: 4 }],
            frameRate: 20
        });

    }



    //UPDATE
    update() {

        //Implémentation du dash.
        if (this.clavier.SHIFT.isDown && this.dashRight == false && this.canDash == true) {
            this.dashRight = false
            this.player.setVelocityX(-600);
            this.player.setVelocityY(0);
            this.player.body.setAllowGravity(false);
            this.killEnnemies = true;
            this.dashRecup = true;
            setTimeout(() => {
                this.canDash = false;
                this.player.body.setAllowGravity(true);
                this.killEnnemies = false;
                this.dashRecup = false;
            }, 200);

            this.time.addEvent({
                delay: 1000, callback: () => {
                    this.canDash = true
                },
            })
        }

        else if (this.clavier.SHIFT.isDown && this.dashRight == true && this.canDash == true) {
            this.dashRight = true
            this.player.setVelocityX(600);
            this.player.setVelocityY(0);
            this.player.body.setAllowGravity(false);
            this.killEnnemies = true;
            this.dashRecup = true;
            setTimeout(() => {
                this.canDash = false;
                this.player.body.setAllowGravity(true);
                this.killEnnemies = false
                this.dashRecup = false;
            }, 200);

            this.time.addEvent({
                delay: 1000, callback: () => {
                    this.canDash = true
                },
            })
        }


        //Implémentation des déplacements.
        else if (this.cursors.left.isDown) {
            this.dashRight = false
            this.player.setVelocityX(-160);
            //this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown) {
            this.dashRight = true
            this.player.setVelocityX(160);
            //this.player.anims.play('right', true);
        }
        else { // sinon
            this.dashRight = false
            this.player.setVelocityX(0); //vitesse nulle
            //this.player.anims.play('turn');
        }
        if (this.cursors.up.isDown && this.player.body.blocked.down) {
            this.player.setVelocityY(-385);
            //(on saute)
        }

        //L'ennemi 1 nous suit.
        if (this.follow1 == true) {
            if (this.player.x >= this.ennemi1.x) {
                this.ennemi1.setVelocityX(90);
            }

            else if (this.player.x <= this.ennemi1.x) {
                this.ennemi1.setVelocityX(-90);
            }
        }
        else if (this.follow1 == false) {
            if (this.ennemi1.x <= 600) {
                this.ennemi1.setVelocityX(90);
            }


            if (this.ennemi1.x >= 740) {
                this.ennemi1.setVelocityX(-90);
            }
        }

        //L'ennemi 2 nous suit.
        if (this.follow2 == true) {
            if (this.player.x >= this.ennemi2.x) {
                this.ennemi2.setVelocityX(90);
            }

            else if (this.player.x <= this.ennemi2.x) {
                this.ennemi2.setVelocityX(-90);
            }
        }
        else {
            this.ennemi2.setVelocityX(0)
        }

        //L'ennemi 3 nous suit.
        if (this.follow3 == true) {
            if (this.player.x >= this.ennemi3.x) {
                this.ennemi3.setVelocityX(90);
            }

            else if (this.player.x <= this.ennemi3.x) {
                this.ennemi3.setVelocityX(-90);
            }
        }
        else {
            this.ennemi3.setVelocityX(0)
        }

        //Lier les coordonnées de la hitbox de suivi avec l'ennemi.
        this.spritehitbox1.x = this.ennemi1.x;
        this.spritehitbox1.y = this.ennemi1.y;

        this.spritehitbox2.x = this.ennemi2.x;
        this.spritehitbox2.y = this.ennemi2.y;

        this.spritehitbox3.x = this.ennemi3.x + 22;
        this.spritehitbox3.y = this.ennemi3.y;


        //Imlémenter la mécanique de pouvoir grimper aux algues.
        if (this.physics.overlap(this.player, this.filet) == true) {
        }
        if (this.clavier.C.isDown && this.physics.overlap(this.player, this.filet)) {
            this.player.body.setAllowGravity(false);
            this.player.setVelocityY(-160)
        }
        else {
            this.player.body.setAllowGravity(true);
        }

        //Attribuer une vélocité à 0 aux blocs de sable pour obtenir un effet "pousser"
        this.sable.setVelocityX(0)

        if (this.hpPlayer <= 0) {
            this.mortPlayer()
        }

        //L'ennemi 1 arrête de suivre.
        this.follow1 = false;

        //L'ennemi 2 arrête de suivre.
        if (this.physics.overlap(this.player, this.spritehitbox2) == false) {
            this.follow2 = false;
        }

        //L'ennemi 3 arrête de suivre.
        if (this.physics.overlap(this.player, this.spritehitbox3) == false) {
            this.follow3 = false;
        }

        //Implémentation de l'arme si 5 coquillages sont ramassés.
        if (this.scoreCoquillage >= 5) {
            this.createArme = true
        }

        //Correctif HP
        if (this.hpPlayer >= 100) {
            this.hpPlayer = 100
        }

        if (this.hpPlayer >= 80) {
            this.player.anims.play("vie1")
        }
        else if (this.hpPlayer >= 60) {
            this.player.anims.play("vie2")
        }
        else if (this.hpPlayer >= 40) {
            this.player.anims.play("vie3")
        }
        else if (this.hpPlayer >= 20) {
            this.player.anims.play("vie4")
        }
        else if (this.hpPlayer >= 0) {
            this.player.anims.play("vie5")
        }

    }

    //FONCTIONS
    //Fonction pour changer de scène
    changeScene(player) {
        if (this.createArme == true) {
            this.scene.start("SceneForet", {
                hpPlayer: this.hpPlayer,
                scoreCoquillage: this.scoreCoquillage,
                scoreFleurs: this.scoreFleurs,
                scoreCoquillageText: this.scoreCoquillageText,
                scoreFleursText: this.scoreFleursText,
                createArme: this.createArme,


            })
        }
    }

    //Fonction pour ramasser les consommables.
    collectCoquillage(player, coquillage) {
        if (this.dashRecup == false) {
            coquillage.disableBody(true, true);
            this.scoreCoquillage += 1;
            this.scoreCoquillageText.setText(+this.scoreCoquillage);
        }
    }

    collectFleurs(player, fleurs) {
        if (this.dashRecup == false) {
            fleurs.disableBody(true, true);
            this.scoreFleurs += 1;
            this.scoreFleursText.setText(+this.scoreFleurs);
            this.hpPlayer += 10
        }
    }


    //Fonction pour prendre des dégats sur les pics.
    mortPics() {
        this.hpPlayer -= 5
        this.cameras.main.shake(200, 0.003)

    }

    //Fonction pour mourir si le joueur touche le vide.
    mortVide(player, vide) {
        this.hpPlayer -= 100
        this.cameras.main.shake(200, 0.003)

    }

    //Fonctions pour que les plateformes algues se détruisent et réconstruisent au toucher.
    alguesBreak(player, algues) {

        if (this.player.body.touching.down && this.alguesCreate == true) {
            this.alguesCreate = false;
            setTimeout(() => {
                algues.destroy()
                this.alguesCreate = true;
            }, 450);
            setTimeout(() => {
                this.algues.create(algues.x, algues.y, 'algues').body.setAllowGravity(false).setImmovable(true);
            }, 5000);

        }

    }

    //Fonction pour émettre et prendre des dégats des ennemis.
    getHit(player, ennemies) {

        if (this.killEnnemies == true) {
            this.fleurs.create(ennemies.x, ennemies.y, "fleurs").setScale(0.085).body.setImmovable(true).setAllowGravity(false)
            ennemies.destroy()

        }
        else {
            this.hpPlayer -= 1;
            this.cameras.main.shake(200, 0.003)
        }

    }

    //Fonction pour que le joueur meurt et respawn au dernier checkpoint touché.
    mortPlayer() {
        if (this.hpPlayer <= 0) {
            this.player.x = this.spawnx;
            this.player.y = this.spawny;
            this.hpPlayer = 100
        }
    }

    //Fonction pour activer le suivi de l'ennemi 1.
    followPlayer1() {
        this.follow1 = true;
    }

    //Fonction pour activer le suivi de l'ennemi 2.
    followPlayer2() {
        this.follow2 = true;
    }

    //Fonction pour activer le suivi de l'ennemi 3.
    followPlayer3() {
        this.follow3 = true;
    }

    //Fonction pour tuer les petits ennemis grâce au dash.
    dashKill(player, ennemies) {
        if (this.killEnnemies == true) {
            this.fleurs.create(ennemies.x, ennemies.y, "fleurs").setScale(0.085).body.setImmovable(true).setAllowGravity(false)
            ennemies.destroy()

        }
    }

    //Fonction pour faire respawn le joueur au dernier checkpoint touché.
    save(player, checkpoint) {
        this.spawnx = checkpoint.x
        this.spawny = checkpoint.y
    }

}