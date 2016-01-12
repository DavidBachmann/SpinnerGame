  'use strict';
  var _ = require('underscore');
  var gsap = require('gsap');

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
      this.hero = this.game.add.sprite(400,250, 'hero', 10);
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

      // // Create the spin button
      // this.spinButton = this.game.add.sprite(30,460, 'spinButton', 1);
      // this.spinButton.animations.add('buttonDefault', [1]);
      // this.spinButton.animations.add('buttonPressed', [0]);
      // this.spinButton.animations.add('buttonStop', [3]);
      // this.spinButton.animations.add('buttonStopPressed', [2]);

      // // Make the button object accept inputs and make that input trigger wheelHandler();
      // this.spinButton.inputEnabled = true;
      // this.spinButton.events.onInputDown.add(this.wheelHandler, this);


      // Create tween animations (with GSAP)
      //var heroTimeline = new TimelineLite();

      //heroTimeline.fromTo(this.heroHandLeft, 2, {rotation: 0},{rotation: 0.5, repeat: -1, yoyo: true, repeatDelay: 0.1, ease: Power1.easeInOut});


      this.resetState();
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
      this.game.time.events.add(4000, this.makeWheelClickable, this);
    },

    stopWheel: function() {
      this.wheelFrame.body.angularAcceleration = 0;
      this.wheelCenter.body.angularAcceleration = 0;
      this.wheelColors.body.angularAcceleration = 0;

      this.canClickWheel = false;
      this.hero.animations.play('hero-surprised-pointing');
      //this.spinButton.animations.play('buttonStopPressed');

      // The player can't click the wheel until 4 seconds has passed.
      this.game.time.events.add(5000, this.resetState, this);
    },

    makeWheelClickable: function() {
      this.canClickWheel = true;
      //this.spinButton.animations.play('buttonStop');
      this.hero.animations.play('hero-smiling-pointing');
    },

    resetState: function() {
      this.hero.animations.play('hero-smiling-waving');
      //this.spinButton.animations.play('buttonDefault');
      this.canClickWheel = true;
      this.camera.x = 216;
    }

  };
  
  module.exports = Play;