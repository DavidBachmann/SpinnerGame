var Game = {
  name: 'Spinner Game',
  States: {},
  Prefabs: {}
};

Game.States.Boot = function(game){};

Game.States.Boot.prototype = {
  create: function(){
    this.game.state.start('Preloader');
  }
};

Game.States.Preloader = function(game) {
  this.asset = null;
  this.ready = false;
};

Game.States.Preloader.prototype = {

  preload: function() {
    this.game.time.advancedTiming = true;
    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.atlas('hero', 'assets/hero.png', 'assets/hero.json');
    this.load.image('background', 'assets/WOF-background.png');
    this.load.image('sky', 'assets/WOF-sky.png');
    this.load.image('clouds', 'assets/WOF-clouds.png');
    this.load.image('piano', 'assets/WOF-piano.png');
    this.load.image('pianoShadow', 'assets/pianoShadow.png');
    this.load.image('wheelCenter', 'assets/WOF-center.png');
    this.load.image('wheelColors', 'assets/WOF-colors_w-pictures.png');
    this.load.image('wheelFrame', 'assets/WOF-frame.png');
    this.load.image('wheelStand', 'assets/WOF-stand.png');
    this.load.image('wheelNeedle', 'assets/WOF-needle.png');
    this.load.image('wheelTop', 'assets/WOF-top.png');
    this.load.image('leverBase', 'assets/WOF-lever-base.png');
    this.load.image('leverHandle', 'assets/WOF-lever-handle.png');
    this.load.atlas('spinButton', 'assets/spinButton.png', 'assets/spinButton.json');
    this.load.image('youWin', 'assets/you-win-text.png');
    this.load.image('youLose', 'assets/you-lost-text.png');
  },

 create: function() {

 },

  update: function() {
    if(this.ready) {
       this.game.state.start('Play');
    }
  },

  onLoadComplete: function() {
    this.ready = true;
  }

};
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
Game.Prefabs.Hero = function(game, x, y){

  // Super call to Phaser.sprite
  Phaser.Sprite.call(this, game, x, y, 'hero', 11);

  var heroAnimations = 
  ['hero-angry-pointing',
  'hero-angry-waving',
  'hero-frowning-shrugging',
  'hero-laughing-pointing',
  'hero-laughing-thumbsup',
  'hero-laughing-waving',
  'hero-lost-hit-one',
  'hero-lost-hit-three',
  'hero-lost-hit-two',
  'hero-lost',
  'hero-notimpressed-shrugging',
  'hero-smiling-pointing',
  'hero-smiling-shrugging',
  'hero-smiling-thumbsup',
  'hero-smiling-waving',
  'hero-surprised-pointing',
  'hero-surprised-shrugging']

  this.scale.setTo(0.8);

  for (var i = 0; i < heroAnimations.length; i++) {
    this.animations.add(heroAnimations[i], [i]);
  }

  this.animations.add('heroDeath', [6,8,7]);

}

Game.Prefabs.Hero.prototype = Object.create(Phaser.Sprite.prototype);

//Game.Prefabs.Hero.constructor = Game.Prefabs.Hero;

Game.Prefabs.Hero.prototype.update = function(){};
Game.Prefabs.Hero.prototype.render = function(){};
Game.Prefabs.Wheel = function(game, x, y){

  // Super call to Phaser.sprite
  Phaser.Sprite.call(this, game, x, y);

  // Creating the wheel from multiple parts.
  this.wheelGroup = this.game.add.group();
  this.wheelGroup.position.setTo(400,65);
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
  this.wheelCenter.anchor.setTo(0.5, 0.428);
  this.game.physics.enable(this.wheelCenter, Phaser.Physics.ARCADE);

  // Make the wheelFrame object accept inputs and make that input trigger wheelHandler();
  this.wheelFrame.inputEnabled = true;
  this.wheelCenter.inputEnabled = true;

  // We'll set a lower max angular velocity here to keep it from going totally nuts.
  this.wheelFrame.body.maxAngular = 250;
  this.wheelCenter.body.maxAngular = 500;

  // Apply a drag otherwise the sprite will just spin and never slow down.
  this.wheelFrame.body.angularDrag = 100;
  this.wheelCenter.body.angularDrag = 100;
  this.wheelColors.body.angularDrag = 200;

  return this.wheelGroup;
}

Game.Prefabs.Wheel.prototype = Object.create(Phaser.Sprite.prototype);

//Game.Prefabs.Wheel.constructor = Game.Prefabs.Wheel;

Game.Prefabs.Wheel.prototype.update = function(){
  if (!this.canClickWheel) {
    this.wheelFrame.tint = 0xffa500;
  } else {
    this.wheelFrame.tint = 0xFFFFFF;
  }
};
window.onload = function(){

  var phaser = new Phaser.Game(960, 580, Phaser.AUTO, 'game');

  // Load states
  phaser.state.add('Boot', Game.States.Boot);
  phaser.state.add('Preloader', Game.States.Preloader);
  phaser.state.add('Play', Game.States.Play);

  // Load game
  phaser.state.start('Boot');
};