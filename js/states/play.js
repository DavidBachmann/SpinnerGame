Game.States.Play = function(game) {
  this.canClickWheel = true;
  this.howLongDoesTheWheelWait = 10000;
}

Game.States.Play.prototype = {
  create: function(){
    this.game.world.setBounds(0, 0, 1613, 625);
    this.cursors = this.game.input.keyboard.createCursorKeys();

    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.sky = this.game.add.sprite(0,0,'sky');
    this.sky.fixedToCamera = true;
    this.clouds = this.game.add.tileSprite(0, 0, 2564, 296, 'clouds');
    this.clouds.autoScroll(-10, 0);
    this.background = this.game.add.sprite(0,0,'background');

    // Creating the Piano (death animation)
    this.piano = this.game.add.sprite(660,-500,'piano');
    this.piano.scale.setTo(0.8);

    // Creating the wheel from multiple parts.
    this.wheelGroup = this.game.add.group();
    this.wheelGroup.position.setTo(740,90);
    this.wheelGroup.scale.setTo(0.65);

    this.wheelStand = this.wheelGroup.create(650, 300, 'wheelStand');
    this.wheelStand.anchor.setTo(0.5, 0);

    this.wheelColors = this.wheelGroup.create(650, 300, 'wheelColors');
    this.wheelColors.anchor.setTo(0.5, 0.5);
    this.game.physics.enable(this.wheelColors, Phaser.Physics.ARCADE);

    this.wheelFrame = this.wheelGroup.create(650, 300, 'wheelFrame');
    this.wheelFrame.anchor.setTo(0.5, 0.5);
    this.game.physics.enable(this.wheelFrame, Phaser.Physics.ARCADE);

    this.wheelCenter = this.wheelGroup.create(650, 300, 'wheelCenter');
    this.wheelCenter.anchor.setTo(0.5, 0.5);
    this.game.physics.enable(this.wheelCenter, Phaser.Physics.ARCADE);

    // Make the wheelFrame object accept inputs and make that input trigger wheelHandler();
    this.wheelFrame.inputEnabled = true;
    this.wheelFrame.events.onInputDown.add(this.wheelHandler, this);
    this.wheelCenter.inputEnabled = true;
    this.wheelCenter.events.onInputDown.add(this.wheelHandler, this);

    // We'll set a lower max angular velocity here to keep it from going totally nuts.
    this.wheelFrame.body.maxAngular = 500;
    this.wheelCenter.body.maxAngular = 250;
    this.wheelColors.body.maxAngular = 300;

    // Apply a drag otherwise the sprite will just spin and never slow down.
    this.wheelFrame.body.angularDrag = 100;
    this.wheelCenter.body.angularDrag = 100;
    this.wheelColors.body.angularDrag = 200;

    // Create our hero
    this.hero = new Game.Prefabs.Hero(this.game, 770, 260);
    this.game.add.existing(this.hero);

    // Create 'back to menu' clickable area
    this.backToMenu = this.game.add.sprite(0, 0);
    this.backToMenu.texture.baseTexture.skipRender = false;
    this.backToMenu.height = this.game.height;
    this.backToMenu.width = 650;
    this.backToMenu.inputEnabled = true;
    this.backToMenu.events.onInputDown.add(this.toggleMenu, this);

    // Set camera
    this.camera.x = 528;

    //this.game.time.events.add(1000, this.showMenu, this);

    this.canClickWheel = true;
  },

  update: function() {
    if (!this.canClickWheel) {
      this.wheelFrame.tint = 0xffa500;
    } else {
      this.wheelFrame.tint = 0xFFFFFF;
    }

    //Move camera for debugging
    if (this.cursors.left.isDown) {
       this.game.camera.x -= 8;
    }
    else if (this.cursors.right.isDown) {
      this.game.camera.x += 8;
    }
  },

  toggleMenu: function() {
    var tween = this.game.add.tween(this.game.camera);
    if (this.game.camera.x === 46) {
      tween.to({x: 520}, 650, "Back.easeOut");
    }
    else {
      tween.to({x: 46}, 650, "Back.easeOut");
    }
    tween.start();
  },

  render: function() {
    this.game.debug.cameraInfo(this.game.camera, 32, 32);
  },

  wheelHandler: function() {
    if (this.wheelCenter.body.angularAcceleration > 0 && this.canClickWheel) {
      this.stopWheel();
    } else if (this.wheelCenter.body.angularAcceleration === 0 && this.canClickWheel) {       
      this.spinWheel();
      this.hero.animations.play('hero-smiling-thumbsup');
    }
  },

  spinWheel: function() {
    this.wheelFrame.body.angularAcceleration = -100;
    this.wheelCenter.body.angularAcceleration = 100;
    this.wheelColors.body.angularAcceleration = -15;

    this.canClickWheel = false;

    // User can't stop wheel until after X ms, so it can build momentum
    this.game.time.events.add(3000, this.makeWheelClickable, this);
  },

  stopWheel: function() {
    this.wheelFrame.body.angularAcceleration = 0;
    this.wheelCenter.body.angularAcceleration = 0;
    this.wheelColors.body.angularAcceleration = 0;

    this.canClickWheel = false;
    this.hero.animations.play('hero-surprised-pointing');
    this.game.time.events.add(6000, this.checkIfWon, this);
  },

  makeWheelClickable: function() {
    this.canClickWheel = true;
    this.hero.animations.play('hero-smiling-pointing');
  },

  checkIfWon: function() {
    // Flip a coin for pseudo-prize-check
    this.chance = Phaser.Utils.chanceRoll();
    if (this.chance) {
      this.hero.animations.play('hero-frowning-shrugging');
      this.game.time.events.add(1000, this.deathAnimation, this);
    } 
    else {
      this.hero.animations.play('hero-frowning-shrugging');
      this.game.time.events.add(1000, this.deathAnimation, this);
    }
  },

  deathAnimation: function() {

    this.triggerPiano = this.game.add.tween(this.piano.position)
    .to( { y: 220 }, 200, "Linear", true);

    this.game.time.events.add(200, function(){
      this.hero.animations.play('heroDeath')
      .onComplete.add(function(){
        this.hero.kill();
        this.game.time.events.add(500, function(){
          this.game.add.tween(this.piano)
          .to({alpha: 0}, 200, "Linear", true)
          this.game.time.events.add(500, this.reset, this);
        }, this)
      }, this)
    }, this);
  },


  reset: function() {
    this.game.state.start("Play");
  }
};