  'use strict';
  var _ = require('underscore');

  function Play() {
    this.canClickWheel = true;
    this.howLongDoesTheWheelWait = 10000;
  }

  Play.prototype = {

    create: function() {
      this.game.world.setBounds(0, 0, 1291, 566);
      this.cursors = this.game.input.keyboard.createCursorKeys();

      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      this.sky = this.game.add.sprite(0,0,'sky');
      this.sky.fixedToCamera = true;
      this.clouds = this.game.add.tileSprite(0, 0, 2564, 296, 'clouds');
      this.clouds.autoScroll(-10, 0);
      this.background = this.game.add.sprite(0,0,'background');

      // Creating the Piano (death animation)
      this.pianoShadow = this.game.add.sprite(480,455,'pianoShadow');
      this.pianoShadow.scale.setTo(0,0);
      this.pianoShadow.opacity = 0;
      this.pianoShadow.anchor.setTo(0.5, 0);
      this.piano = this.game.add.sprite(320,-500,'piano');
      this.piano.scale.setTo(0.8);

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
      this.wheelFrame.events.onInputDown.add(this.wheelHandler, this);
      this.wheelCenter.inputEnabled = true;
      this.wheelCenter.events.onInputDown.add(this.wheelHandler, this);

      // We'll set a lower max angular velocity here to keep it from going totally nuts.
      this.wheelFrame.body.maxAngular = 250;
      this.wheelCenter.body.maxAngular = 500;


      // Apply a drag otherwise the sprite will just spin and never slow down.
      this.wheelFrame.body.angularDrag = 100;
      this.wheelCenter.body.angularDrag = 100;
      this.wheelColors.body.angularDrag = 200;

      // Create out hero
      this.hero = this.game.add.sprite(420,250, 'hero', 10);
      this.hero.scale.setTo(0.8);
      this.hero.animations.add('hero-angry-pointing', [0]);
      this.hero.animations.add('hero-angry-waving', [1]);
      this.hero.animations.add('hero-frowning-shrygging', [2]);
      this.hero.animations.add('hero-laughing-pointing', [3]);
      this.hero.animations.add('hero-laughing-thumbsup', [4]);
      this.hero.animations.add('hero-laughing-waving', [5]);
      this.hero.animations.add('hero-notimpressed-shrugging', [6]);
      this.hero.animations.add('hero-smiling-pointing', [7]);
      this.hero.animations.add('hero-smiling-shrugging', [8]);
      this.hero.animations.add('hero-smiling-thumbsup', [9]);
      this.hero.animations.add('hero-smiling-waving', [10]);
      this.hero.animations.add('hero-surprised-pointing', [11]);
      this.hero.animations.add('hero-surprised-shrugging', [12]);

      this.camera.x = 216;
    },

    update: function() {
      if (!this.canClickWheel) {
        this.wheelFrame.tint = 0xffa500;
      } else {
        this.wheelFrame.tint = 0xFFFFFF;
      }

      //Move camera for debugging
        if (this.cursors.left.isDown) {
            this.game.camera.x -= 4;
        }
        else if (this.cursors.right.isDown) {
            this.game.camera.x += 4;
        }
    },

    render: function() {
      this.game.debug.text(this.game.time.fps);    
      this.game.debug.cameraInfo(this.game.camera, 32, 32);
    },

    wheelHandler: function() {
      if (this.wheelCenter.body.angularAcceleration > 0 && this.canClickWheel) {
        this.stopWheel();
      } else if (this.wheelCenter.body.angularAcceleration === 0 && this.canClickWheel) {       
        this.spinWheel();
        //this.spinButton.animations.play('buttonStopPressed');
        this.hero.animations.play('hero-smiling-thumbsup');
      }
    },

    spinWheel: function() {
      this.wheelFrame.body.angularAcceleration = -250;
      this.wheelCenter.body.angularAcceleration = 250;
      this.wheelColors.body.angularAcceleration = -15;

      this.canClickWheel = false;

      // User can't stop wheel until after X ms, so it can build momentum
      this.game.time.events.add(1000, this.makeWheelClickable, this);
    },

    stopWheel: function() {
      this.wheelFrame.body.angularAcceleration = 0;
      this.wheelCenter.body.angularAcceleration = 0;
      this.wheelColors.body.angularAcceleration = 0;

      this.canClickWheel = false;
      this.hero.animations.play('hero-surprised-pointing');
      //this.spinButton.animations.play('buttonStopPressed');
      this.game.time.events.add(1000, this.checkIfWon, this);
      console.log("checked");

    },

    makeWheelClickable: function() {
      this.canClickWheel = true;
      //this.spinButton.animations.play('buttonStop');
      this.hero.animations.play('hero-smiling-pointing');
    },

    checkIfWon: function() {
      this.chance = Phaser.Utils.chanceRoll();
      console.log(this.chance);
      if (this.chance) {
        this.deathAnimation();
        //this.game.time.events.add(5000, this.resetState, this);
      } 
      else {
        this.deathAnimation();
      }
    },

    deathAnimation: function() {
      this.game.time.events.add(800, function(){
        this.triggerPiano = this.game.add.tween(this.piano.position)
        .to( { y: 220 }, 400, "Linear", true);
      }, this);

    this.game.add.tween(this.pianoShadow.scale)
    .to({x: 0.6, y: 0.6}, 1000, "Linear", true);

    this.game.add.tween(this.pianoShadow)
    .to({ opacity: 1}, 1000, "Linear", true)
    .onComplete.addOnce(function(){
      this.pianoShadow.kill();
      this.hero.kill();
      this.game.time.events.add(2000, this.resetState, this);
   }, this);

    },

    resetState: function() {
      this.hero.animations.play('hero-smiling-waving');
      this.canClickWheel = true;
      this.camera.x = 216;
    },


  };
  
  module.exports = Play;