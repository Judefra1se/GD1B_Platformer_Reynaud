export class SceneBoss extends Phaser.Scene {
    constructor() {
        super("SceneBoss");
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

    //FONCTION PRELOAD
    preload() {
        this.load.image("assetsplage", "assetsplage.png")
        this.load.image("ennemi", "boss.png")
        this.load.image("attaquehitbox", "spritehitbox.png")
        this.load.image("ballon", "ballon.png")
        this.load.tilemapTiledJSON("Boss", "CarteBoss.json")
        this.load.image("plagebackground", "plagebackground.png")
        this.load.image("ui", "ui.png")
        this.load.spritesheet("viespritesheet", "vie-Sheet.png",
            { frameWidth: 64, frameHeight: 64 })
        this.load.spritesheet('perso', 'perso.png',
            { frameWidth: 64, frameHeight: 64 })
    }

    create() {
                
        this.scoreCoquillage = 5
        this.scoreFleurs = 5
        this.add.image(896, 544, "plagebackground")
        this.add.image(287, 130, "ui").setScale(0.065).setScrollFactor(0).setDepth(1)

        //Variables
        this.hpBoss = 1000
        this.canBallon = 1

        //Variables Dash
        this.canDash = true;
        this.dashLeft = false;
        this.dashRight = false;
        this.killEnnemies = false;
        this.isDashing = false;

        //Création de la map.
        const carteBoss = this.add.tilemap("Boss");
        const tileset = carteBoss.addTilesetImage(
            "assetsplage",
            "assetsplage");

        const sols = carteBoss.createLayer(
            "sols",
            tileset);
        sols.setCollisionByProperty({ estSolide: true });


        //Implémentation joueur.
        this.player = this.physics.add.sprite(this.spawnx, this.spawny, 'perso');
        this.player.setScale(0.65)
        this.player.setSize(27, 27)
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, sols);
        this.physics.world.setBounds(0, 0, 320, 352);

        //Implémentation de la caméra.
        this.cameras.main.setBounds(0, 0, 320, 352);
        this.cameras.main.zoom = 1.90;
        this.cameras.main.startFollow(this.player);

        //Implémentation touches.
        this.cursors = this.input.keyboard.createCursorKeys();
        this.clavier = this.input.keyboard.addKeys('C, SHIFT, A');


        this.scoreFleursText = this.add.text(312, 118, this.scoreFleurs, { fontSize: '25px', fill: '#d7018a' })
        this.scoreFleursText.setScrollFactor(0).setDepth(2);

        //Coquillages
        this.scoreCoquillageText = this.add.text(263, 118, this.scoreCoquillage, { fontSize: '25px', fill: '#fe6128' })
        this.scoreCoquillageText.setScrollFactor(0).setDepth(2);

        //Implémentation des grands ennemis.
        this.bossgroup = this.physics.add.group()
        this.boss = this.bossgroup.create(9 * 32, 5 * 32, 'ennemi').setScale(3).setSize(24, 58).body.setImmovable(true);
        this.physics.add.collider(sols, this.bossgroup);
        this.boss.setCollideWorldBounds(true);
        this.physics.add.collider(this.bossgroup, this.player, this.getHitGrand, null, this);

        this.attaquehitbox = this.physics.add.sprite(0, 0, "attaquehitbox").setSize(100, 250)
        this.attaquehitbox.body.setAllowGravity(false)
        this.physics.add.collider(this.attaquehitbox, sols);
        this.attaquehitbox.setCollideWorldBounds(true);

        this.physics.add.overlap(this.player, this.attaquehitbox, this.attaqueArme, null, this);
        this.physics.add.overlap(this.attaquehitbox, this.bossgroup, this.mortBoss, null, this);

        this.ballon = this.physics.add.group();
        this.physics.add.collider(this.player, this.ballon, this.ballonHit, null, this);

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

    update() {

        this.attaquehitbox.x = this.boss.x+22;
        this.attaquehitbox.y = this.boss.y + 50;

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
                //Déplacements boss
                if (this.boss.x <= 4 * 32) {
                    this.boss.setVelocityX(85);
                }
                else if (this.boss.x >= 7 * 32) {
                    this.boss.setVelocityX(-85);
                }

        if (this.hpBoss <= 500) {
            this.bossgroup.getChildren().forEach(boss => {
                if (this.canBallon > 0) {


                    this.ballon.create(boss.x-30, boss.y+55, "ballon").body.setAllowGravity(false).setVelocityX(-90)
                    this.canBallon -= 1;

                    if (this.canBallon == 0) {
                        setTimeout(() => {
                            this.canBallon = 2

                        }, 2000);
                    }
                }
            });
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

        //if (this.hpBoss <= 0) {
        //    this.bossgroup.destroy()
        //}
    }

    attaqueArme(player, boss) {
        if (this.clavier.A.isDown) {
            this.hpBoss -= 3
        }
    }

    mortBoss(player, boss) {
        if (this.hpBoss <= 0) {
            boss.destroy()
        }
    }

    getHitGrand(player, boss) {

        this.hpPlayer -= 3;
        this.cameras.main.shake(200, 0.003)
    }

    ballonHit(player, ballon) {
        this.hpPlayer -= 3;
        this.cameras.main.shake(200, 0.003)
        ballon.destroy()
    }

    ballonDestroy(ballon, sols) {
        ballon.destroy()
    }
}
