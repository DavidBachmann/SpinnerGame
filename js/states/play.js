// 'Play' state initialized.
Game.States.Play = function(){};

// 'Play' state prototype extended.
Game.States.Play.prototype = {

  // Create is called when the state is started and restarted.
  create: function(){

    // Set up variables
    this.canClickWheel = true;
    this.hasClickedWheel = false;

    // Set up world
    this.game.world.setBounds(0, 0, 1613, 625);
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    // Background art
    this.sky = this.game.add.sprite(0,0,'sky');
    this.sky.fixedToCamera = true;
    this.clouds = this.game.add.tileSprite(0, 0, 2564, 296, 'clouds');
    this.clouds.autoScroll(-8, 0);
    this.airBalloon = this.game.add.sprite(this.game.world.width, 50, 'airBalloon');
    this.airBalloon.scale.setTo(0.5);
    this.background = this.game.add.sprite(0,0,'background');

    // Creating the Piano (for death animation)
    this.piano = this.game.add.sprite(660,-500,'piano');
    this.piano.scale.setTo(0.8);

    // Create our hero
    this.hero = new Game.Prefabs.Hero(this.game, 770, 260);
    this.game.add.existing(this.hero);

    // Initialize menu functionality
    this.initMenu();

    // Initialize the wheel
    this.initWheel();

    //Start the idle timer
    this.initIdleTimer();


    // Set camera position
    this.camera.x = 528;
  },

  // Update is called once every tick.
  update: function() {
    if (!this.canClickWheel) {
      this.wheelFrame.tint = 0xffa500;
    } else {
      this.wheelFrame.tint = 0xFFFFFF;
    }

   if (this.hasClickedWheel) {
    this.game.time.events.remove(this.idleTimer);
    if (this.glowTween.isRunning) {
      this.glowTween.stop();
      this.wheelFrameGlow.alpha = 0;
    }
   }

    //Move camera with cursor keys for debugging
    if (this.cursors.left.isDown) {
       this.game.camera.x -= 8;
    }
    else if (this.cursors.right.isDown) {
      this.game.camera.x += 8;
    }

    // Move the the hot air balloon.
    this.airBalloon.x -= 0.25;
    // Allow it to wrap the world.
    this.game.world.wrap(this.airBalloon, 0, true);
  },

  initMenu: function() {
    // Create 'back to menu' clickable area
    this.backToMenu = this.game.add.sprite(0, 0);
    this.backToMenu.texture.baseTexture.skipRender = false;
    this.backToMenu.height = this.game.height;
    this.backToMenu.width = 650;
    this.backToMenu.inputEnabled = true;
    this.backToMenu.events.onInputDown.add(this.toggleMenu, this);
  },
  initWheel: function() {
    // Creating the wheel from multiple parts and attaching them to the wheelGroup
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
    this.wheelFrameGlow = this.wheelGroup.create(650, 300, 'wheelFrameGlow');
    this.wheelFrameGlow.anchor.setTo(0.5, 0.5);
    this.wheelFrameGlow.alpha = 0;

    this.glowTween = this.game.add.tween(this.wheelFrameGlow)
      .to( { alpha: 0.5 }, 750, "Linear", false, 0, -1, true);

    this.wheelCenter = this.wheelGroup.create(650, 300, 'wheelCenter');
    this.wheelCenter.anchor.setTo(0.5, 0.5);
    this.game.physics.enable(this.wheelCenter, Phaser.Physics.ARCADE);

    // Make the wheelFrame object accept inputs and make that input trigger wheelHandler();
    this.wheelFrame.inputEnabled = true;
    this.wheelFrame.events.onInputDown.add(this.wheelHandler, this);

    // We'll set a lower max angular velocity here to keep it from going totally nuts.
    this.wheelFrame.body.maxAngular = 500;
    this.wheelCenter.body.maxAngular = 250;
    this.wheelColors.body.maxAngular = 300;

    // Apply a drag otherwise the wheel will just spin and never slow down.
    this.wheelFrame.body.angularDrag = 100;
    this.wheelCenter.body.angularDrag = 100;
    this.wheelColors.body.angularDrag = 200;
  },

  initIdleTimer: function() {
    this.idleTimer = this.game.time.events.add(6000, function(){
      this.glowTween.start();
    }, this);
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
      this.hasClickedWheel = true;
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
    var chance = Phaser.Utils.chanceRoll();
    if (chance) {
      this.hero.animations.play('hero-frowning-shrugging');
      this.game.time.events.add(1100, this.deathAnimation, this);
    } 
    else {
      this.hero.animations.play('hero-frowning-shrugging');
      this.game.time.events.add(1100, this.deathAnimation, this);
    }
  },

  deathAnimation: function() {
    this.game.add.tween(this.piano.position)
    .to( { y: 220 }, 200, "Linear", true);

    this.game.time.events.add(200, function(){
      this.hero.animations.play('heroDeath')
      .onComplete.add(killHero, this)
    }, this);

    var killHero = function(){
      this.hero.kill();
      this.game.time.events.add(500, removePiano, this)
    }

    var removePiano = function(){
      this.game.add.tween(this.piano).to({alpha: 0}, 200, "Linear", true)
      this.game.time.events.add(500, this.reset, this);
    }
  },

  reset: function() {
    this.game.state.start("Play");
  }

};