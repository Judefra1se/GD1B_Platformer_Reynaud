export class SceneForet extends Phaser.Scene {
    constructor() {
        super("SceneForet");
    }
    //INITIALISATION DES DONNEES
    init(data) {
        this.hpPlayer = data.hpPlayer
        this.scoreCoquillage = data.scoreCoquillage
        this.scoreFleurs = data.scoreFleurs
        this.scoreCoquillageText = data.scoreCoquillageText
        this.scoreFleursText = data.scoreFleursText
        this.createArme = data.createArme
    }

    //PRELOAD
    preload() {
        this.load.image("assetsforet", "assetsforet.png")
        this.load.image("fleurs", "fleurs.png")
        this.load.image("filetforet", "filetforet.png")
        this.load.image("filetforetgrand", "filetgrand.png")
        this.load.image("ronces", "ronces.png")
        this.load.image("eau", "eau.png")
        this.load.image("plateformesforet", "plateformesforet.png")
        this.load.image("cubes", "cubes.png")
        this.load.image("terre", "terre.png")
        this.load.image("sable", "sable.png")
        this.load.image("picsforet", "picsforet.png")
        this.load.image("picsforetplafond", "picsforetplafond.png")
        this.load.image("spritehitbox", "spritehitbox.png")
        this.load.image("langouste", "langouste.png")
        this.load.image("crabe", "crabe.png")
        this.load.image("checkpoint", "spritehitbox.png")
        this.load.image("attaquehitbox", "spritehitbox.png")
        this.load.image("vide", "spritehitbox.png")
        this.load.image("petitHitbox", "spritehitbox.png")
        this.load.image("ui", "ui.png")
        this.load.image("foretbackgroundbackground", "foretbackbackground.png")
        this.load.image("foretbackground", "foretbackground.png")
        this.load.tilemapTiledJSON("Foret", "CarteForet.json")
        this.load.spritesheet("viespritesheet", "vie-Sheet.png",
            { frameWidth: 64, frameHeight: 64 })
        this.load.spritesheet('perso', 'perso.png',
            { frameWidth: 64, frameHeight: 64 })
    }

    //CREATE
    create() {
        this.add.image(640, 528, "foretbackgroundbackground").setScrollFactor(0.2, 0)
        this.add.image(640, 528, "foretbackground")

        this.add.image(295, 130, "ui").setScale(0.080).setScrollFactor(0).setDepth(1)

        //Variables checkpoint.
        this.spawnx = 2 * 32
        this.spawny = 2 * 32

        //Variables joueur et ennemis.
        this.follow1 = false
        this.follow2 = false
        this.follow3 = false
        this.follow4 = false

        this.hpGrandEnnemi1 = 20
        this.hpGrandEnnemi2 = 20
        this.hpGrandEnnemi3 = 20
        this.hpGrandEnnemi4 = 20

        //Variables plateformes terre.
        this.terreCreate = true

        //Variables Dash
        this.canDash = true;
        this.dashLeft = false;
        this.dashRight = false;
        this.killEnnemies = false;
        this.isDashing = false;
        this.dashRecup = false;

        //Variables rapetissement
        this.petit = false
        this.toucheX = false


        //Création de la map.
        const carteForet = this.add.tilemap("Foret");
        const tileset = carteForet.addTilesetImage(
            "assetsforet",
            "assetsforet");

        const sols = carteForet.createLayer(
            "sols",
            tileset);
        sols.setCollisionByProperty({ estSolide: true });

        //Implémentation joueur.
        this.player = this.physics.add.sprite(this.spawnx, this.spawny, 'perso');
        this.player.setScale(0.65)
        this.player.setSize(27, 27)
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, sols);
        this.physics.world.setBounds(0, 0, 1280, 1056);

        //Implémentation de la caméra.
        this.cameras.main.setBounds(0, 0, 1280, 1056);
        this.cameras.main.zoom = 1.80;
        this.cameras.main.startFollow(this.player);

        //Implémentation touches.
        this.cursors = this.input.keyboard.createCursorKeys();
        this.clavier = this.input.keyboard.addKeys('C, SHIFT, A, X');

        //Implémentation des consommables.
        this.fleurs = this.physics.add.group();
        this.physics.add.overlap(this.player, this.fleurs, this.collectFleurs, null, this);
        this.calque_fleurs = carteForet.getObjectLayer('fleurs');
        this.calque_fleurs.objects.forEach(calque_fleurs => {
            const POP = this.fleurs.create(calque_fleurs.x + 15, calque_fleurs.y - 15, 'fleurs').setScale(0.085).body.setAllowGravity(false).setImmovable(true);

        })

        this.scoreFleursText = this.add.text(268, 117, this.scoreFleurs, { fontSize: '27px', fill: '#fe6128' })
        this.scoreFleursText.setScrollFactor(0).setDepth(2);


        this.scoreCoquillageText = this.add.text(325, 117, this.scoreCoquillage, { fontSize: '27px', fill: '#d7018a' })
        this.scoreCoquillageText.setScrollFactor(0).setDepth(2);


        //Implémentation filets à escalader.
        this.filet = this.physics.add.group();
        this.calque_filet = carteForet.getObjectLayer('escalade');
        this.calque_filet.objects.forEach(calque_filet => {
            const POP = this.filet.create(calque_filet.x + 32, calque_filet.y - 0, 'filetforet').body.setAllowGravity(false).setImmovable(true);

        })

        this.filetGrand = this.physics.add.group();
        this.calque_filetGrand = carteForet.getObjectLayer('escalade_grand');
        this.calque_filetGrand.objects.forEach(calque_filetGrand => {
            const POP = this.filetGrand.create(calque_filetGrand.x - 30, calque_filetGrand.y - 65, 'filetforetgrand').body.setAllowGravity(false).setImmovable(true);

        })

        //Implémentation des ronces
        this.ronces = this.physics.add.group();
        this.physics.add.overlap(this.player, this.ronces, this.getStung, null, this);
        this.calque_ronces = carteForet.getObjectLayer('ronces');
        this.calque_ronces.objects.forEach(calque_ronces => {
            const POP = this.ronces.create(calque_ronces.x + 10, calque_ronces.y - 1, 'ronces').setScale(0.75).setSize(32, 32).body.setAllowGravity(false).setImmovable(true);

        })



        //Implémentation des plateformes.
        this.plateformes = this.physics.add.group();
        this.physics.add.collider(this.player, this.plateformes);
        this.calque_plateformes = carteForet.getObjectLayer('plateformes');
        this.calque_plateformes.objects.forEach(calque_plateformes => {
            const POP = this.plateformes.create(calque_plateformes.x + 31, calque_plateformes.y - 27, 'plateformesforet').body.setAllowGravity(false).setImmovable(true);

        })

        //Implémentation des cubes.
        this.cubes = this.physics.add.group();
        this.physics.add.collider(this.player, this.cubes);
        this.calque_cubes = carteForet.getObjectLayer('cubes');
        this.calque_cubes.objects.forEach(calque_cubes => {
            const POP = this.cubes.create(calque_cubes.x + 8, calque_cubes.y - 13, 'cubes').body.setAllowGravity(false).setImmovable(true);

        })

        //Implémentation des plateformes terre.
        this.terre = this.physics.add.group();
        this.physics.add.collider(this.player, this.terre, this.terreBreak, null, this);
        this.calque_terre = carteForet.getObjectLayer('terre');
        this.calque_terre.objects.forEach(calque_terre => {
            const POP = this.terre.create(calque_terre.x + 31, calque_terre.y - 27, 'terre').body.setAllowGravity(false).setImmovable(true);

        })


        //Implémentaion des blocs de sables.
        this.sable = this.physics.add.group();
        this.calque_sable = carteForet.getObjectLayer('sable');
        this.calque_sable.objects.forEach(calque_sable => {
            const POP = this.sable.create(calque_sable.x + 16, calque_sable.y - 16, 'sable').body.setAllowGravity(true).setCollideWorldBounds(true);
            this.physics.add.collider(this.player, this.sable);
            this.physics.add.collider(this.sable, sols);
        })


        //Implémentation des pics.
        this.pics = this.physics.add.group();
        this.physics.add.collider(this.player, this.pics, this.mortPics, null, this);
        this.calque_pics = carteForet.getObjectLayer('pics');
        this.calque_pics.objects.forEach(calque_pics => {
            const POP = this.pics.create(calque_pics.x + 17, calque_pics.y - 7, 'picsforet').body.setAllowGravity(false).setImmovable(true);

        })

        //Implémentation des pics aux plafonds.
        this.picsplafond = this.physics.add.group();
        this.physics.add.collider(this.player, this.picsplafond, this.mortPics, null, this);
        this.calque_picsplafond = carteForet.getObjectLayer('picsplafond');
        this.calque_picsplafond.objects.forEach(calque_picsplafond => {
            const POP = this.picsplafond.create(calque_picsplafond.x - 15, calque_picsplafond.y + 7, 'picsforetplafond').body.setAllowGravity(false).setImmovable(true);

        })

        //Implémentation de l'eau.
        this.eau = this.physics.add.group();
        this.physics.add.collider(this.player, this.eau, this.mortPics, null, this);
        this.calque_eau = carteForet.getObjectLayer('eau');
        this.calque_eau.objects.forEach(calque_eau => {
            const POP = this.eau.create(calque_eau.x + 32, calque_eau.y - 16, 'eau').body.setAllowGravity(false).setImmovable(true);

        })

        //Implémentation des checkpoints.
        this.checkpoint = this.physics.add.group();
        this.physics.add.overlap(this.player, this.checkpoint, this.save, null, this)
        this.calque_checkpoint = carteForet.getObjectLayer('checkpoint');
        this.calque_checkpoint.objects.forEach(calque_checkpoint => {
            const POP = this.checkpoint.create(calque_checkpoint.x + 17, calque_checkpoint.y - 16, 'checkpoint').body.setAllowGravity(false)


        })

        //Implémentation du vide (limites du monde qui tuent).
        this.vide = this.physics.add.group();
        this.physics.add.collider(this.player, this.vide, this.mortVide, null, this)
        this.calque_vide = carteForet.getObjectLayer('vide');
        this.calque_vide.objects.forEach(calque_vide => {
            const POP = this.vide.create(calque_vide.x + 17, calque_vide.y - 16, 'vide').body.setAllowGravity(false).setImmovable(true)

        })

        //Implémentation des portes.
        this.porte = this.physics.add.group();
        this.physics.add.overlap(this.player, this.porte, this.changeScene, null, this)
        this.calque_porte = carteForet.getObjectLayer('porte');
        this.calque_porte.objects.forEach(calque_porte => {
            const POP = this.porte.create(calque_porte.x + 17, calque_porte.y - 16, 'porte').body.setAllowGravity(false)


        })

        //Implémentation des grands ennemis.
        this.grandEnnemies = this.physics.add.group({ allowGravity: true, collideWorldBounds: true });
        this.physics.add.collider(this.player, this.grandEnnemies, this.getHitGrand, null, this);


        //Implémentation du grand ennemi 1.
        this.grandEnnemi1 = this.grandEnnemies.create(17.5 * 32, 5 * 32, 'crabe').body.setImmovable(true).setSize(40, 40);
        this.spritehitbox1 = this.physics.add.sprite(0, 0, "spritehitbox").setSize(115, 128);
        this.spritehitbox1.body.setAllowGravity(false);
        this.physics.add.overlap(this.player, this.spritehitbox1, this.followPlayer1, null, this);
        this.attaquehitbox1 = this.physics.add.sprite(0, 0, "attaquehitbox").setSize(100, 100)
        this.attaquehitbox1.body.setAllowGravity(false)
        this.physics.add.overlap(this.player, this.attaquehitbox1, this.attaqueArme1, null, this);
        this.physics.add.overlap(this.attaquehitbox1, this.grandEnnemies, this.mortEnnemi1, null, this);

        //Implémentation du grand ennemi 2.
        this.grandEnnemi2 = this.grandEnnemies.create(35 * 32, 11 * 32, 'crabe').body.setImmovable(true).setSize(40, 40);
        this.spritehitbox2 = this.physics.add.sprite(0, 0, "spritehitbox").setSize(115, 128);
        this.spritehitbox2.body.setAllowGravity(false);
        this.physics.add.overlap(this.player, this.spritehitbox2, this.followPlayer2, null, this);
        this.attaquehitbox2 = this.physics.add.sprite(0, 0, "attaquehitbox").setSize(100, 100)
        this.attaquehitbox2.body.setAllowGravity(false)
        this.physics.add.overlap(this.player, this.attaquehitbox2, this.attaqueArme2, null, this);
        this.physics.add.overlap(this.attaquehitbox2, this.grandEnnemies, this.mortEnnemi2, null, this);

        //Implémentation du grand ennemi 3.
        this.grandEnnemi3 = this.grandEnnemies.create(6 * 32, 22 * 32, 'crabe').body.setImmovable(true).setSize(40, 40);
        this.spritehitbox3 = this.physics.add.sprite(0, 0, "spritehitbox").setSize(115, 128);
        this.spritehitbox3.body.setAllowGravity(false);
        this.physics.add.overlap(this.player, this.spritehitbox3, this.followPlayer3, null, this);
        this.attaquehitbox3 = this.physics.add.sprite(0, 0, "attaquehitbox").setSize(100, 100)
        this.attaquehitbox3.body.setAllowGravity(false)
        this.physics.add.overlap(this.player, this.attaquehitbox3, this.attaqueArme3, null, this);
        this.physics.add.overlap(this.attaquehitbox3, this.grandEnnemies, this.mortEnnemi3, null, this);

        //Implémentation du grand ennemi 4.
        this.grandEnnemi4 = this.grandEnnemies.create(37 * 32, 30 * 32, 'crabe').body.setImmovable(true).setSize(40, 40);
        this.spritehitbox4 = this.physics.add.sprite(0, 0, "spritehitbox").setSize(115, 128);
        this.spritehitbox4.body.setAllowGravity(false);
        this.physics.add.overlap(this.player, this.spritehitbox4, this.followPlayer4, null, this);
        this.attaquehitbox4 = this.physics.add.sprite(0, 0, "attaquehitbox").setSize(100, 100)
        this.attaquehitbox4.body.setAllowGravity(false)
        this.physics.add.overlap(this.player, this.attaquehitbox4, this.attaqueArme4, null, this);
        this.physics.add.overlap(this.attaquehitbox4, this.grandEnnemies, this.mortEnnemi4, null, this);

        //Colliders.
        this.physics.add.collider(this.grandEnnemies, sols);
        this.physics.add.collider(this.grandEnnemies, this.plateformes);
        this.physics.add.collider(this.grandEnnemies, this.pics);
        this.physics.add.collider(this.grandEnnemies, this.algues);


        //Implémentation des petits ennemis
        this.ennemies = this.physics.add.group({ allowGravity: true, collideWorldBounds: true });

        this.ennemi1 = this.ennemies.create(14 * 32, 17 * 32, 'langouste').setScale(0.80).body.setImmovable(true).setSize(25, 25);
        this.physics.add.collider(this.player, this.ennemies, this.getHit, null, this);
        this.ennemi2 = this.ennemies.create(34 * 32, 25.5 * 32, 'langouste').setScale(0.80).body.setImmovable(true).setAllowGravity(false).setSize(25, 25);
        this.physics.add.collider(this.player, this.ennemies, this.getHit, null, this);
        this.ennemi3 = this.ennemies.create(38 * 32, 28.5 * 32, 'langouste').setScale(0.80).body.setImmovable(true).setAllowGravity(false).setSize(25, 25);
        this.physics.add.collider(this.player, this.ennemies, this.getHit, null, this);


        this.physics.add.collider(this.ennemies, sols);
        this.physics.add.collider(this.ennemies, this.plateformes);
        this.physics.add.collider(this.ennemies, this.pics);
        this.physics.add.collider(this.ennemies, this.algues);

        //Implémentation des hitbox pour le rapetissement.
        //this.petitHitbox = this.physics.add.group();
        this.petitHitbox1 = this.physics.add.sprite(10 * 32, 19.5 * 32, "petitHitbox")
        this.petitHitbox1.body.setSize(164, 32)
        this.petitHitbox1.body.setAllowGravity(false)

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
    //FONCTION UPDATE
    update() {

        //Dash
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
            if (this.player.x >= this.grandEnnemi1.x) {
                this.grandEnnemi1.setVelocityX(90);
            }

            else if (this.player.x <= this.grandEnnemi1.x) {
                this.grandEnnemi1.setVelocityX(-90);
            }
        }
        else {
            this.grandEnnemi1.setVelocityX(0)
        }

        //L'ennemi 2 nous suit.
        if (this.follow2 == true) {
            if (this.player.x >= this.grandEnnemi2.x) {
                this.grandEnnemi2.setVelocityX(90);
            }

            else if (this.player.x <= this.grandEnnemi2.x) {
                this.grandEnnemi2.setVelocityX(-90);
            }
        }
        else {
            this.grandEnnemi2.setVelocityX(0)
        }

        //L'ennemi 3 nous suit.
        if (this.follow3 == true) {
            if (this.player.x >= this.grandEnnemi3.x) {
                this.grandEnnemi3.setVelocityX(90);
            }

            else if (this.player.x <= this.grandEnnemi3.x) {
                this.grandEnnemi3.setVelocityX(-90);
            }
        }
        else {
            this.grandEnnemi3.setVelocityX(0)
        }

        //L'ennemi 4 nous suit.
        if (this.follow4 == true) {
            if (this.player.x >= this.grandEnnemi4.x) {
                this.grandEnnemi4.setVelocityX(90);
            }

            else if (this.player.x <= this.grandEnnemi4.x) {
                this.grandEnnemi4.setVelocityX(-90);
            }
        }
        else {
            this.grandEnnemi4.setVelocityX(0)
        }

        //Lier les coordonnées de la hitbox de suivi avec l'ennemi.
        this.spritehitbox1.x = this.grandEnnemi1.x;
        this.spritehitbox1.y = this.grandEnnemi1.y;
        this.attaquehitbox1.x = this.grandEnnemi1.x + 15;
        this.attaquehitbox1.y = this.grandEnnemi1.y + 20;

        this.spritehitbox2.x = this.grandEnnemi2.x;
        this.spritehitbox2.y = this.grandEnnemi2.y;
        this.attaquehitbox2.x = this.grandEnnemi2.x + 15;;
        this.attaquehitbox2.y = this.grandEnnemi2.y + 20;;

        this.spritehitbox3.x = this.grandEnnemi3.x;
        this.spritehitbox3.y = this.grandEnnemi3.y;
        this.attaquehitbox3.x = this.grandEnnemi3.x + 15;;
        this.attaquehitbox3.y = this.grandEnnemi3.y + 20;;

        this.spritehitbox4.x = this.grandEnnemi4.x;
        this.spritehitbox4.y = this.grandEnnemi4.y;
        this.attaquehitbox4.x = this.grandEnnemi4.x + 15;;
        this.attaquehitbox4.y = this.grandEnnemi4.y + 20;;

        //Déplacements petit ennemi 1
        if (this.ennemi1.x <= 14 * 32) {
            this.ennemi1.setVelocityX(90);
        }
        else if (this.ennemi1.x >= 17 * 32) {
            this.ennemi1.setVelocityX(-90);
        }

        //Déplacements petit ennemi 2
        if (this.ennemi2.x <= 34 * 32) {
            this.ennemi2.setVelocityX(70);
        }
        else if (this.ennemi2.x >= 37 * 32) {
            this.ennemi2.setVelocityX(-70);
        }

        //Déplacements petit ennemi 3
        if (this.ennemi3.x <= 34 * 32) {
            this.ennemi3.setVelocityX(70);
        }
        else if (this.ennemi3.x >= 37 * 32) {
            this.ennemi3.setVelocityX(-70);
        }

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

        if (this.physics.overlap(this.player, this.filetGrand) == true) {
        }
        if (this.clavier.C.isDown && this.physics.overlap(this.player, this.filetGrand)) {
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
        if (this.physics.overlap(this.player, this.spritehitbox1) == false) {
            this.follow1 = false;
        }

        //L'ennemi 2 arrête de suivre.
        if (this.physics.overlap(this.player, this.spritehitbox2) == false) {
            this.follow2 = false;
        }

        //L'ennemi 3 arrête de suivre.
        if (this.physics.overlap(this.player, this.spritehitbox3) == false) {
            this.follow3 = false;
        }

        //L'ennemi 4 arrête de suivre.
        if (this.physics.overlap(this.player, this.spritehitbox4) == false) {
            this.follow4 = false;
        }

        //Mise en place de la mécanique du rapetissement.
        if (this.clavier.X.isDown && this.petit == false && this.toucheX == false) {
            this.player.y += 1;
            this.player.setScale(0.50);
            this.player.setSize(54, 32);

            this.petit = true;
        }
        else if (this.clavier.X.isDown && this.petit == true && this.toucheX == false) {
            this.player.y -= 1;
            this.player.setScale(0.65);
            this.player.setSize(27, 27)

            this.toucheX = false;
            this.petit = false
        }

        if (this.clavier.X.isDown) {
            this.toucheX = true
        }
        else {
            this.toucheX = false

        }

        //Correctif HP
        if (this.hpPlayer >= 100) {
            this.hpPlayer = 100
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


    //Fonction pour changer de scène.
    changeScene(player) {
        this.scene.start("ScenePlage", {
            hpPlayer: this.hpPlayer,
            scoreCoquillage: this.scoreCoquillage,
            scoreFleurs: this.scoreFleurs,
            scoreCoquillageText: this.scoreCoquillageText,
            scoreFleursText: this.scoreFleursText,
            createArme: this.createArme,


        })
    }

    //Fonction pour ramasser les coquillages.
    collectCoquillage(player, coquillage) {
        if (this.dashRecup == false) {
            coquillage.disableBody(true, true);
            this.scoreCoquillage += 1;
            this.scoreCoquillageText.setText(+this.scoreCoquillage);
        }
    }

    //Fonction pour ramasser les fleurs.
    collectFleurs(player, fleurs) {
        if (this.dashRecup == false) {
            fleurs.disableBody(true, true);
            this.scoreFleurs += 1;
            this.scoreFleursText.setText(+this.scoreFleurs);
        }
    }


    //Fonction pour prendre des dégats sur les pics.
    mortPics(player, pics) {
        this.hpPlayer -= 5
        this.cameras.main.shake(200, 0.003)

    }

    //Fonction pour mourir si le joueur touche le vide.
    mortVide(player, vide) {
        this.hpPlayer -= 100
        this.cameras.main.shake(200, 0.003)

    }

    //Fonction pour faire disparaître les plateformes une fois touchées.
    terreBreak(player, terre) {
        if (this.player.body.touching.down && this.terreCreate == true) {
            this.terreCreate = false;
            setTimeout(() => {
                terre.destroy()
                this.terreCreate = true;
            }, 450);
            setTimeout(() => {
                this.terre.create(terre.x, terre.y, 'terre').body.setAllowGravity(false).setImmovable(true);
            }, 5000);

        }

    }

    //Fonction pour émettre et prendre des dégats par les ennemis.
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

    getHitGrand(player, ennemies) {

        this.hpPlayer -= 3;
        this.cameras.main.shake(200, 0.003)
    }



    //Fonction pour que le joueur meurt et respawn au dernier checkpoint touché.
    mortPlayer(player) {
        if (this.hpPlayer <= 0) {
            setTimeout(() => {
                this.player.x = this.spawnx;
                this.player.y = this.spawny;
            }, 200);

        }
        this.hpPlayer += 100
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
        this.follow3 = true
    }

    //Fonction pour activer le suivi de l'ennemi 4.
    followPlayer4() {
        this.follow4 = true;
    }

    //Fonction pour faire respawn le joueur au dernier checkpoint touché.
    save(player, checkpoint) {

        this.spawnx = checkpoint.x
        this.spawny = checkpoint.y
    }

    //Fonction pour se prendre des dégats par les ronces.
    getStung(player, ronces) {
        this.hpPlayer -= 5
        this.cameras.main.shake(200, 0.003)
    }

    //Fonction pour attaquer l'ennemi 1 avec l'arme.
    attaqueArme1(player, ennemies) {
        if (this.clavier.A.isDown && this.createArme == true) {
            this.hpGrandEnnemi1 -= 1
        }

    }

    //Fonction pour attaquer l'ennemi 2 avec l'arme.
    attaqueArme2(player, ennemies) {
        if (this.clavier.A.isDown && this.createArme == true) {
            this.hpGrandEnnemi2 -= 1
        }

    }

    //Fonction pour attaquer l'ennemi 3 avec l'arme.
    attaqueArme3(player, ennemies) {
        if (this.clavier.A.isDown && this.createArme == true) {
            this.hpGrandEnnemi3 -= 1
        }

    }

    //Fonction pour attaquer l'ennemi 4 avec l'arme.
    attaqueArme4(player, ennemies) {
        if (this.clavier.A.isDown && this.createArme == true) {
            this.hpGrandEnnemi4 -= 1
        }

    }

    //Fonction pour faire mourir l'ennemi 1.
    mortEnnemi1(player, grandEnnemi1) {
        if (this.hpGrandEnnemi1 <= 0) {
            this.fleurs.create(this.grandEnnemi1.x, this.grandEnnemi1.y, "fleurs").setScale(0.085).body.setImmovable(true).setAllowGravity(false)
            grandEnnemi1.destroy()
        }
    }

    //Fonction pour faire mourir l'ennemi 2.
    mortEnnemi2(player, grandEnnemi2) {
        if (this.hpGrandEnnemi2 <= 0) {
            this.fleurs.create(this.grandEnnemi2.x, this.grandEnnemi2.y, "fleurs").setScale(0.085).body.setImmovable(true).setAllowGravity(false)
            grandEnnemi2.destroy()
        }
    }

    //Fonction pour faire mourir l'ennemi 3.
    mortEnnemi3(player, grandEnnemi3) {
        if (this.hpGrandEnnemi3 <= 0) {
            this.fleurs.create(this.grandEnnemi3.x, this.grandEnnemi3.y, "fleurs").setScale(0.085).body.setImmovable(true).setAllowGravity(false)
            grandEnnemi3.destroy()
        }
    }

    //Fonction pour faire mourir l'ennemi 4.
    mortEnnemi4(player, grandEnnemi4) {
        if (this.hpGrandEnnemi4 <= 0) {
            this.fleurs.create(this.grandEnnemi4.x, this.grandEnnemi4.y, "fleurs").setScale(0.085).body.setImmovable(true).setAllowGravity(false)
            grandEnnemi4.destroy()
        }
    }
}
