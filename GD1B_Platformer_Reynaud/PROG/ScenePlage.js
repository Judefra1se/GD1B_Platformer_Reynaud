export class ScenePlage extends Phaser.Scene {
    constructor() {
        super("ScenePlage");
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
        this.load.image("assetsplage", "assetsplage.png")
        this.load.image("fleurs", "fleurs.png")
        this.load.image("filetplage", "filetplage.png")
        this.load.image("filetplagemoyen", "filetplagemoyen.png")
        this.load.image("filetplagegrand", "filetplagegrand.png")
        this.load.image("ronces", "ronces.png")
        this.load.image("eau", "eauplage.png")
        this.load.image("plateformesplage", "plateformesplage.png")
        this.load.image("cubesplage", "cubesplage.png")
        this.load.image("cubesalgues", "cubesalgues.png")
        this.load.image("palmier", "palmier.png")
        this.load.image("algues", "algues.png")
        this.load.image("sable", "sable.png")
        this.load.image("picsplage", "pics.png")
        this.load.image("picsplafondplage", "picsplageplafond.png")
        this.load.image("spritehitbox", "spritehitbox.png")
        this.load.image("langouste", "langouste.png")
        this.load.image("crabe", "crabe.png")
        this.load.image("mouette", "mouette.png")
        this.load.image("perle", "perle.png")
        this.load.image("cle", "cle.png")
        this.load.image("porte", "spritehitbox.png")
        this.load.image("checkpoint", "spritehitbox.png")
        this.load.image("attaquehitbox", "spritehitbox.png")
        this.load.image("vide", "spritehitbox.png")
        this.load.image("petitHitbox", "spritehitbox.png")
        this.load.image("plagebackground", "plagebackground.png")
        this.load.image("ui", "ui.png")
        this.load.tilemapTiledJSON("Plage", "CartePlage.json")
        this.load.spritesheet("viespritesheet", "vie-Sheet.png",
            { frameWidth: 64, frameHeight: 64 })
        this.load.spritesheet('perso', 'perso.png',
            { frameWidth: 64, frameHeight: 64 })
    }

    //CREATE
    create() {

        this.add.image(896, 544, "plagebackground")
        this.add.image(291, 128, "ui").setScale(0.080).setScrollFactor(0).setDepth(1)

        // Variables checkpoint.
        this.spawnx = 11 * 32
        this.spawny = 32 * 32

        //Variables joueur et ennemis.
        this.follow1 = false
        this.follow2 = false
        this.follow3 = false

        this.hpGrandEnnemi1 = 20
        this.hpGrandEnnemi2 = 20
        this.hpGrandEnnemi3 = 20

        //Variables cubes algues.
        this.alguesCreate = true
        this.cubesalguesCreate = true

        //Variables Dash
        this.canDash = true;
        this.dashLeft = false;
        this.dashRight = false;
        this.killEnnemies = false;
        this.isDashing = false;
        this.dashRecup = false;

        //Variables projectiles
        this.canPerle = 2

        //Variables clé
        this.hasKey = false

        //Variables rapetissement
        this.petit = false
        this.toucheX = false


        //Création de la map.
        const cartePlage = this.add.tilemap("Plage");
        const tileset = cartePlage.addTilesetImage(
            "assetsplage",
            "assetsplage");

        const sols = cartePlage.createLayer(
            "sols",
            tileset);
        sols.setCollisionByProperty({ estSolide: true });

        //Implémentation joueur.
        this.player = this.physics.add.sprite(this.spawnx, this.spawny, 'perso');
        this.player.setScale(0.65)
        this.player.setSize(27, 27)
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, sols);
        this.physics.world.setBounds(0, 0, 56 * 32, 34 * 32);

        //Implémentation de la caméra.
        this.cameras.main.setBounds(0, 0, 56 * 32, 34 * 32);
        this.cameras.main.zoom = 1.80;
        this.cameras.main.startFollow(this.player);

        //Implémentation touches.
        this.cursors = this.input.keyboard.createCursorKeys();
        this.clavier = this.input.keyboard.addKeys('C, SHIFT, A, X');


        //Implémentation des consommables.
        this.fleurs = this.physics.add.group();
        this.physics.add.overlap(this.player, this.fleurs, this.collectFleurs, null, this);
        this.calque_fleurs = cartePlage.getObjectLayer('fleurs');
        this.calque_fleurs.objects.forEach(calque_fleurs => {
            const POP = this.fleurs.create(calque_fleurs.x + 15, calque_fleurs.y - 15, 'fleurs').setScale(0.085).body.setAllowGravity(false).setImmovable(true);

        })

        this.scoreFleursText = this.add.text(321, 114, this.scoreFleurs, { fontSize: '27px', fill: '#d7018a' })
        this.scoreFleursText.setScrollFactor(0).setDepth(2);


        this.scoreCoquillageText = this.add.text(263, 114, this.scoreCoquillage, { fontSize: '27px', fill: '#fe6128' })
        this.scoreCoquillageText.setScrollFactor(0).setDepth(2);


        //Implémentation filets à escalader.
        this.filet = this.physics.add.group();
        this.calque_filet = cartePlage.getObjectLayer('escalade');
        this.calque_filet.objects.forEach(calque_filet => {
            const POP = this.filet.create(calque_filet.x + 32, calque_filet.y - 0, 'filetplage').body.setAllowGravity(false).setImmovable(true);

        })

        //Implémentation filets moyens à escalader.
        this.filetMoyen = this.physics.add.group();
        this.calque_filetMoyen = cartePlage.getObjectLayer('escalade_moyen');
        this.calque_filetMoyen.objects.forEach(calque_filetMoyen => {
            const POP = this.filetMoyen.create(calque_filetMoyen.x + 47, calque_filetMoyen.y + 16.5, 'filetplagemoyen').body.setAllowGravity(false).setImmovable(true);

        })

        //Implémentation filets grands à escalader.
        this.filetGrand = this.physics.add.group();
        this.calque_filetGrand = cartePlage.getObjectLayer('escalade_grand');
        this.calque_filetGrand.objects.forEach(calque_filetGrand => {
            const POP = this.filetGrand.create(calque_filetGrand.x + 80, calque_filetGrand.y - 10, 'filetplagegrand').body.setAllowGravity(false).setImmovable(true);

        })

        //Implémentation des ronces
        this.ronces = this.physics.add.group();
        this.physics.add.overlap(this.player, this.ronces, this.getStung, null, this);
        this.calque_ronces = cartePlage.getObjectLayer('ronces');
        this.calque_ronces.objects.forEach(calque_ronces => {
            const POP = this.ronces.create(calque_ronces.x + 10, calque_ronces.y - 1, 'ronces').setScale(0.75).setSize(32, 32).body.setAllowGravity(false).setImmovable(true);

        })

        //Implémentation des plateformes.
        this.plateformes = this.physics.add.group();
        this.physics.add.collider(this.player, this.plateformes);
        this.calque_plateformes = cartePlage.getObjectLayer('plateformes');
        this.calque_plateformes.objects.forEach(calque_plateformes => {
            const POP = this.plateformes.create(calque_plateformes.x + 31, calque_plateformes.y - 27, 'plateformesplage').body.setAllowGravity(false).setImmovable(true);

        })

        //Implémentation des cubes .
        this.cubes = this.physics.add.group();
        this.physics.add.collider(this.player, this.cubes);
        this.calque_cubes = cartePlage.getObjectLayer('cubes');
        this.calque_cubes.objects.forEach(calque_cubes => {
            const POP = this.cubes.create(calque_cubes.x + 8, calque_cubes.y - 13, 'cubesplage').body.setAllowGravity(false).setImmovable(true);

        })

        //Implémentation des plateformes algues.
        this.algues = this.physics.add.group();
        this.physics.add.collider(this.player, this.algues, this.alguesBreak, null, this);
        this.calque_algues = cartePlage.getObjectLayer('algues');
        this.calque_algues.objects.forEach(calque_algues => {
            const POP = this.algues.create(calque_algues.x + 31, calque_algues.y - 27, 'algues').body.setAllowGravity(false).setImmovable(true);

        })

        //Implémentation des cubes d'algues.
        this.cubesalgues = this.physics.add.group();
        this.physics.add.collider(this.player, this.cubesalgues, this.cubesalguesBreak, null, this);
        this.calque_cubesalgues = cartePlage.getObjectLayer('cubes_algues');
        this.calque_cubesalgues.objects.forEach(calque_cubesalgues => {
            const POP = this.cubesalgues.create(calque_cubesalgues.x + 31, calque_cubesalgues.y - 27, 'cubesalgues').body.setAllowGravity(false).setImmovable(true);

        })


        //Implémentaion des blocs de sables.
        this.sable = this.physics.add.group();
        this.calque_sable = cartePlage.getObjectLayer('sable');
        this.calque_sable.objects.forEach(calque_sable => {
            const POP = this.sable.create(calque_sable.x + 16, calque_sable.y - 16, 'sable').body.setAllowGravity(true).setCollideWorldBounds(true);
            this.physics.add.collider(this.player, this.sable);
            this.physics.add.collider(this.sable, sols);
        })


        //Implémentation des pics.
        this.pics = this.physics.add.group();
        this.physics.add.collider(this.player, this.pics, this.mortPics, null, this);
        this.calque_pics = cartePlage.getObjectLayer('pics');
        this.calque_pics.objects.forEach(calque_pics => {
            const POP = this.pics.create(calque_pics.x + 17, calque_pics.y - 9, 'picsplage').body.setAllowGravity(false).setImmovable(true);

        })

        //Implémentation des pics au plafond.
        this.picsplafond = this.physics.add.group();
        this.physics.add.collider(this.player, this.picsplafond, this.mortPics, null, this);
        this.calque_picsplafond = cartePlage.getObjectLayer('picsplafond');
        this.calque_picsplafond.objects.forEach(calque_picsplafond => {
            const POP = this.picsplafond.create(calque_picsplafond.x - 15, calque_picsplafond.y + 7, 'picsplafondplage').body.setAllowGravity(false).setImmovable(true);

        })

        //Implémentation de l'eau.
        this.eau = this.physics.add.group();
        this.physics.add.collider(this.player, this.eau, this.mortPics, null, this);
        this.calque_eau = cartePlage.getObjectLayer('eau');
        this.calque_eau.objects.forEach(calque_eau => {
            const POP = this.eau.create(calque_eau.x + 32, calque_eau.y - 16, 'eau').body.setAllowGravity(false).setImmovable(true);

        })

        //Implémentation des checkpoints.
        this.checkpoint = this.physics.add.group();
        this.physics.add.overlap(this.player, this.checkpoint, this.save, null, this)
        this.calque_checkpoint = cartePlage.getObjectLayer('checkpoint');
        this.calque_checkpoint.objects.forEach(calque_checkpoint => {
            const POP = this.checkpoint.create(calque_checkpoint.x + 17, calque_checkpoint.y - 16, 'checkpoint').body.setAllowGravity(false)


        })

        //Implémentation du vide (limites du monde qui tuent).
        this.vide = this.physics.add.group();
        this.physics.add.collider(this.player, this.vide, this.mortVide, null, this)
        this.calque_vide = cartePlage.getObjectLayer('vide');
        this.calque_vide.objects.forEach(calque_vide => {
            const POP = this.vide.create(calque_vide.x + 17, calque_vide.y - 16, 'vide').body.setAllowGravity(false).setImmovable(true)

        })

        //Implémentation du palmier.
        this.palmier = this.physics.add.group();
        this.physics.add.collider(this.player, this.palmier)
        this.calque_palmier = cartePlage.getObjectLayer('palmier');
        this.calque_palmier.objects.forEach(calque_palmier => {
            const POP = this.palmier.create(calque_palmier.x + 17, calque_palmier.y - 80, 'palmier').body.setAllowGravity(false).setImmovable(true)

        })

        //Implémentation de la clé.
        this.cle = this.physics.add.group();
        this.physics.add.collider(this.player, this.cle, this.collectCle, null, this)
        this.calque_cle = cartePlage.getObjectLayer('cle');
        this.calque_cle.objects.forEach(calque_cle => {
            const POP = this.cle.create(calque_cle.x + 17, calque_cle.y - 16, 'cle').body.setAllowGravity(false).setImmovable(true)

        })

        //Implémentation des portes.
        this.porte = this.physics.add.group();
        this.physics.add.overlap(this.player, this.porte, this.changeScene, null, this)
        this.calque_porte = cartePlage.getObjectLayer('porte');
        this.calque_porte.objects.forEach(calque_porte => {
            const POP = this.porte.create(calque_porte.x + 17, calque_porte.y - 16, 'porte').body.setAllowGravity(false).setImmovable(true)

        })

        //Implémentation des hitbox pour le rapetissement.
        this.petitHitbox = this.physics.add.group();
        this.petitHitbox1 = this.petitHitbox.create(44 * 32, 32.5 * 32, "petitHitbox").body.setImmovable(true).setSize(255, 32).setAllowGravity(false)
        this.petitHitbox2 = this.petitHitbox.create(23.5 * 32, 19.5 * 32, "petitHitbox").body.setImmovable(true).setSize(124, 32).setAllowGravity(false)


        //Implémentation des grands ennemis.
        this.grandEnnemies = this.physics.add.group({ allowGravity: true, collideWorldBounds: true });
        this.physics.add.collider(this.player, this.grandEnnemies, this.getHitGrand, null, this)

        //Implémentation du grand ennemi 1.
        this.grandEnnemi1 = this.grandEnnemies.create(18.5 * 32, 16 * 32, 'crabe').body.setImmovable(true).setSize(40, 40);;
        this.spritehitbox1 = this.physics.add.sprite(0, 0, "spritehitbox").setSize(110, 110);
        this.spritehitbox1.body.setAllowGravity(false);
        this.physics.add.overlap(this.player, this.spritehitbox1, this.followPlayer1, null, this);
        this.attaquehitbox1 = this.physics.add.sprite(0, 0, "attaquehitbox").setSize(64, 64)
        this.attaquehitbox1.body.setAllowGravity(false)
        this.physics.add.overlap(this.player, this.attaquehitbox1, this.attaqueArme1, null, this);
        this.physics.add.overlap(this.attaquehitbox1, this.grandEnnemies, this.mortEnnemi1, null, this);

        //Implémentation du grand ennemi 2.
        this.grandEnnemi2 = this.grandEnnemies.create(17 * 32, 23 * 32, 'crabe').body.setImmovable(true).setSize(40, 40);;
        this.spritehitbox2 = this.physics.add.sprite(0, 0, "spritehitbox").setSize(115, 128);
        this.spritehitbox2.body.setAllowGravity(false);
        this.physics.add.overlap(this.player, this.spritehitbox2, this.followPlayer2, null, this);
        this.attaquehitbox2 = this.physics.add.sprite(0, 0, "attaquehitbox").setSize(64, 64)
        this.attaquehitbox2.body.setAllowGravity(false)
        this.physics.add.overlap(this.player, this.attaquehitbox2, this.attaqueArme2, null, this);
        this.physics.add.overlap(this.attaquehitbox2, this.grandEnnemies, this.mortEnnemi2, null, this);

        //Implémentation du grand ennemi 3.
        this.grandEnnemi3 = this.grandEnnemies.create(52 * 32, 1 * 32, 'crabe').body.setImmovable(true).setSize(40, 40);;
        this.spritehitbox3 = this.physics.add.sprite(0, 0, "spritehitbox").setSize(115, 128);
        this.spritehitbox3.body.setAllowGravity(false);
        this.physics.add.overlap(this.player, this.spritehitbox3, this.followPlayer3, null, this);
        this.attaquehitbox3 = this.physics.add.sprite(0, 0, "attaquehitbox").setSize(64, 64)
        this.attaquehitbox3.body.setAllowGravity(false)
        this.physics.add.overlap(this.player, this.attaquehitbox3, this.attaqueArme3, null, this);
        this.physics.add.overlap(this.attaquehitbox3, this.grandEnnemies, this.mortEnnemi3, null, this);

        //Colliders
        this.physics.add.collider(this.grandEnnemies, sols);
        this.physics.add.collider(this.grandEnnemies, this.plateformes);
        this.physics.add.collider(this.grandEnnemies, this.pics);
        this.physics.add.collider(this.grandEnnemies, this.algues);

        //Implémentation des petits ennemis.
        this.ennemies = this.physics.add.group({ collideWorldBounds: true });

        this.ennemi3 = this.ennemies.create(31.5 * 32, 25 * 32, 'langouste').body.setImmovable(true).setAllowGravity(false)
        this.ennemi4 = this.ennemies.create(35 * 32, 28 * 32, 'langouste').body.setImmovable(true).setAllowGravity(false)
        this.ennemi5 = this.ennemies.create(44 * 32, 30.5 * 32, 'langouste').body.setImmovable(true).setAllowGravity(false)
        this.ennemi6 = this.ennemies.create(50 * 32, 27.5 * 32, 'langouste').body.setImmovable(true).setAllowGravity(false)

        this.physics.add.collider(this.player, this.ennemies, this.getHit, null, this);

        //Implémentation des ennemis volants
        this.flyingennemies = this.physics.add.group();
        this.ennemi1 = this.flyingennemies.create(14 * 32, 27 * 32, 'mouette').setScale(0.55).body.setImmovable(true).setAllowGravity(false)
        this.ennemi2 = this.flyingennemies.create(25 * 32, 17 * 32, 'mouette').setScale(0.55).body.setImmovable(true).setAllowGravity(false)

        //Implémentation des projectiles perles.
        this.perle = this.physics.add.group();
        this.physics.add.collider(this.player, this.perle, this.perleHit, null, this);
        this.physics.add.collider(sols, this.perle, this.perleDestroy, null, this);

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

        //Lier les coordonnées de la hitbox de suivi avec l'ennemi.
        this.spritehitbox1.x = this.grandEnnemi1.x;
        this.spritehitbox1.y = this.grandEnnemi1.y;
        this.attaquehitbox1.x = this.grandEnnemi1.x + 15;
        this.attaquehitbox1.y = this.grandEnnemi1.y + 20;

        this.spritehitbox2.x = this.grandEnnemi2.x;
        this.spritehitbox2.y = this.grandEnnemi2.y;
        this.attaquehitbox2.x = this.grandEnnemi2.x + 15;
        this.attaquehitbox2.y = this.grandEnnemi2.y + 20;

        this.spritehitbox3.x = this.grandEnnemi3.x;
        this.spritehitbox3.y = this.grandEnnemi3.y;
        this.attaquehitbox3.x = this.grandEnnemi3.x + 15;
        this.attaquehitbox3.y = this.grandEnnemi3.y + 20;

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

        //Déplacements petit ennemi 1
        if (this.ennemi1.x <= 14 * 32) {
            this.ennemi1.setVelocityX(90);
        }
        else if (this.ennemi1.x >= 21 * 32) {
            this.ennemi1.setVelocityX(-90);
        }

        //Déplacements petit ennemi 2
        if (this.ennemi2.x <= 25 * 32) {
            this.ennemi2.setVelocityX(90);
        }
        else if (this.ennemi2.x >= 29 * 32) {
            this.ennemi2.setVelocityX(-90);
        }

        //Déplacements petit ennemi 3
        if (this.ennemi3.x <= 31.5 * 32) {
            this.ennemi3.setVelocityX(90);
        }
        else if (this.ennemi3.x >= 34 * 32) {
            this.ennemi3.setVelocityX(-90);
        }

        //Déplacements petit ennemi 4
        if (this.ennemi4.x <= 31.5 * 32) {
            this.ennemi4.setVelocityX(90);
        }
        else if (this.ennemi4.x >= 34 * 32) {
            this.ennemi4.setVelocityX(-90);
        }

        //Déplacements petit ennemi 5
        if (this.ennemi5.x <= 44 * 32) {
            this.ennemi5.setVelocityX(90);
        }
        else if (this.ennemi5.x >= 47 * 32) {
            this.ennemi5.setVelocityX(-90);
        }

        //Déplacements petit ennemi 6
        if (this.ennemi6.x <= 45 * 32) {
            this.ennemi6.setVelocityX(90);
        }
        else if (this.ennemi6.x >= 49 * 32) {
            this.ennemi6.setVelocityX(-90);
        }


        //Implémenter la mécanique de pouvoir grimper aux algues.
        if (this.physics.overlap(this.player, this.filet) == true) {
        }
        if (this.clavier.C.isDown && this.physics.overlap(this.player, this.filet)) {
            this.player.body.setAllowGravity(false);
            this.player.setVelocityY(-160)
        }
        else {
            this.player.body.setAllowGravity(true);
        }

        if (this.physics.overlap(this.player, this.filetMoyen) == true) {
        }
        if (this.clavier.C.isDown && this.physics.overlap(this.player, this.filetMoyen)) {
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

        //Mort du joueur.
        if (this.hpPlayer <= 0) {
            this.mortPlayer()
        }

        //Implémentation des lancers de perles par les ennemis.
        this.flyingennemies.getChildren().forEach(enemy => {
            if (this.canPerle > 0) {


                this.perle.create(enemy.x, enemy.y, "perle").body.setAllowGravity(true)
                this.canPerle -= 1;

                if (this.canPerle == 0) {
                    setTimeout(() => {
                        this.canPerle = 2

                    }, 1100);
                }
            }
        });

        //Mise en place de la mécanique du rapetissement.
        if (this.clavier.X.isDown && this.petit == false && this.toucheX == false) {
            this.player.y += 1;
            this.player.setScale(0.5);
            this.player.setSize(32, 32);

            this.petit = true;
        }
        else if (this.clavier.X.isDown && this.petit == true&& this.toucheX == false) {
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

    //Fonction pour changer de scène
    changeScene(player) {
        if (this.hasKey == true) {
            this.scene.start("SceneBoss", {
                hpPlayer: this.hpPlayer,
                scoreCoquillage: this.scoreCoquillage,
                scoreFleurs: this.scoreFleurs,
                scoreCoquillageText: this.scoreCoquillageText,
                scoreFleursText: this.scoreFleursText,
                createArme: this.createArme,

            })
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

    //Fonction pour ramasser la clé.
    collectCle(player, cle) {
        this.hasKey = true
        cle.disableBody(true, true);
    }



    //Fonction pour prendre des dégats sur les pics.
    mortPics(player, pics) {
        this.hpPlayer -= 5
        this.cameras.main.shake(200, 0.003)

    }

    //Fonction pour mourir si le joueur touche le vide.
    mortVide() {
        this.hpPlayer -= 5
        this.cameras.main.shake(200, 0.003)

    }

    //Fonction pour faire disparaître les plateformes une fois touchées.
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

    //Fonction pour faire disparaître les cubes une fois touchés.
    cubesalguesBreak(player, cubesalgues) {
        if (this.player.body.touching.down && this.cubesalguesCreate == true) {
            this.cubesalguesCreate = false;
            setTimeout(() => {
                cubesalgues.destroy()
                this.cubesalguesCreate = true;
            }, 450);
            setTimeout(() => {
                this.cubesalgues.create(cubesalgues.x, cubesalgues.y, 'cubesalgues').body.setAllowGravity(false).setImmovable(true);
            }, 5000);

        }
    }




    //Fonction pour faire mourir et respawn le joueur au dernier checkpoint touché.
    mortPlayer(player) {
        if (this.hpPlayer <= 0) {
            setTimeout(() => {
                this.player.x = this.spawnx;
                this.player.y = this.spawny;
            }, 200);

        }
        this.hpPlayer += 100
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

    //Fonction pour émettre et prendre des dégats par les petits ennemis.
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

    //Fonction pour émettre et prendre des dégats par les grands ennemis.
    getHitGrand(player, ennemies) {

        this.hpPlayer -= 3;
        this.cameras.main.shake(200, 0.003)
    }

    //Fonction pour faire suivre le joueur par l'ennemi 1.
    followPlayer1() {
        this.follow1 = true;
    }

    //Fonction pour faire suivre le joueur par l'ennemi 2.
    followPlayer2() {
        this.follow2 = true;
    }

    //Fonction pour faire suivre le joueur par l'ennemi 3.
    followPlayer3() {
        this.follow3 = true;
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

    //Fonction pour prendre ded dégats par les projectiles.
    perleHit(player, perle) {
        this.hpPlayer -= 7;
        this.cameras.main.shake(200, 0.003)
        perle.destroy()
    }

    //Fonction pour faire disparaitre les projectiles lorsqu'ils touchent le sol.
    perleDestroy(perle, sols) {
        perle.destroy()
    }
}