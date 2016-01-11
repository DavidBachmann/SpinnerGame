  'use strict';
  var _ = require('underscore');
  var gsap = require('gsap');

  function Play() {
    this.canClickWheel = true;
    this.howLongDoesTheWheelWait = 10000;
  }

  Play.prototype = {

    create: function() {
      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      this.sky = this.game.add.sprite(0,0,'sky');
      this.clouds = this.game.add.tileSprite(0, 0, 2564, 296, 'clouds');
      this.clouds.autoScroll(-10, 0);
      this.background = this.game.add.sprite(0,0,'background');


      // Creating the wheel from multiple parts.
      this.wheelGroup = this.game.add.group();
      this.wheelGroup.position.setTo(-150,-120);
      this.wheelGroup.scale.setTo(1.3);

      this.wheelStand = this.wheelGroup.create(650, 300, 'wheelStand');
      this.wheelStand.anchor.setTo(0.5, 0);
      this.wheelStand.scale.setTo(0.5);

      this.wheelColors = this.wheelGroup.create(650, 300, 'wheelColors');
      this.wheelColors.anchor.setTo(0.5, 0.5);
      this.wheelColors.scale.setTo(0.5);
      this.game.physics.enable(this.wheelColors, Phaser.Physics.ARCADE);
      this.wheelFrame = this.wheelGroup.create(650, 300, 'wheelFrame');
      this.wheelFrame.anchor.setTo(0.5, 0.5);
      this.wheelFrame.scale.setTo(0.5);
      this.game.physics.enable(this.wheelFrame, Phaser.Physics.ARCADE);

      this.wheelCenter = this.wheelGroup.create(650, 300, 'wheelCenter');
      this.wheelCenter.anchor.setTo(0.5, 0.5);
      this.wheelCenter.scale.setTo(0.5);
      this.game.physics.enable(this.wheelCenter, Phaser.Physics.ARCADE);

      this.wheelTop = this.wheelGroup.create(0, -300, 'wheelTop');
      this.wheelTop.anchor.setTo(0.5, 0);
      this.wheelTop.scale.setTo(0.9);

      this.wheelNeedle = this.wheelGroup.create(0, -300, 'wheelNeedle');
      this.wheelNeedle.anchor.setTo(0.5, 0);
      this.wheelNeedle.scale.setTo(1.2);

      this.wheelLighting = this.wheelGroup.create(472, 120, 'wheelLighting');

      // Add Top and Needle into the wheelFrame object.
      this.wheelFrame.addChild(this.wheelTop);
      this.wheelFrame.addChild(this.wheelNeedle);

      // Creating the pull lever
      this.lever = this.game.add.sprite(0,0);

      this.leverHandle = this.game.add.sprite(497,400, 'leverHandle');
      this.leverHandle.anchor.setTo(0.5, 0);
      this.leverHandle.scale.setTo(0.6);

      this.leverBase = this.game.add.sprite(500,460, 'leverBase');
      this.leverBase.anchor.setTo(0.5, 0);
      this.leverBase.scale.setTo(0.6);

      this.lever.addChild(this.leverBase);
      this.lever.addChild(this.leverHandle);

      // Make the wheelFrame object accept inputs and make that input trigger wheelHandler();
      this.wheelFrame.inputEnabled = true;
      this.wheelFrame.events.onInputDown.add(this.wheelHandler, this);

      // We'll set a lower max angular velocity here to keep it from going totally nuts.
      this.wheelFrame.body.maxAngular = 500;
      this.wheelCenter.body.maxAngular = 250;


      // Apply a drag otherwise the sprite will just spin and never slow down.
      this.wheelFrame.body.angularDrag = 100;
      this.wheelCenter.body.angularDrag = 100;
      this.wheelColors.body.angularDrag = 200;

      // Create out hero
      this.hero = this.game.add.sprite(310,200, 'hero', 4);
      this.hero.scale.setTo(0.7);
      this.hero.position.setTo(350,280);
      this.hero.animations.add('hero-default', [4]);
      this.hero.animations.add('hero-frowning-shrugging', [0]);
      this.hero.animations.add('hero-notimpressed-shrugging', [1]);
      this.hero.animations.add('hero-smiling-pointing', [2]);
      this.hero.animations.add('hero-smiling-thumbsup', [3]);
      this.hero.animations.add('hero-surprised-pointing', [5]);
      this.hero.animations.add('hero-surprised-shrugging', [6]);

      // Create the spin button
      this.spinButton = this.game.add.sprite(30,460, 'spinButton', 1);
      this.spinButton.animations.add('buttonDefault', [1]);
      this.spinButton.animations.add('buttonPressed', [0]);
      this.spinButton.animations.add('buttonStop', [3]);
      this.spinButton.animations.add('buttonStopPressed', [2]);

      // Make the button object accept inputs and make that input trigger wheelHandler();
      this.spinButton.inputEnabled = true;
      this.spinButton.events.onInputDown.add(this.wheelHandler, this);


      // Create tween animations (with GSAP)
      var heroTimeline = new TimelineLite();

      //heroTimeline.fromTo(this.heroHandLeft, 2, {rotation: 0},{rotation: 0.5, repeat: -1, yoyo: true, repeatDelay: 0.1, ease: Power1.easeInOut});


      this.resetState();
    },

    update: function() {
      if (!this.canClickWheel) {
        this.wheelFrame.tint = 0xffa500;
      } else {
        this.wheelFrame.tint = 0xFFFFFF;
      }
    },

    render: function() {
      
    },

    wheelHandler: function() {
      if (this.wheelFrame.body.angularAcceleration > 0 && this.canClickWheel) {
        this.stopWheel();
      } else if (this.wheelFrame.body.angularAcceleration === 0 && this.canClickWheel) {       
        this.spinWheel();
        this.spinButton.animations.play('buttonStopPressed');
        this.hero.animations.play('hero-smiling-thumbsup');
      }
    },

    spinWheel: function() {

      this.wheelFrame.body.angularAcceleration = 250;
      this.wheelCenter.body.angularAcceleration = -250;
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
      this.spinButton.animations.play('buttonStopPressed');

      // The player can't click the wheel until 4 seconds has passed.
      this.game.time.events.add(5000, this.resetState, this);
    },

    makeWheelClickable: function() {
      this.canClickWheel = true;
      this.spinButton.animations.play('buttonStop');
      this.hero.animations.play('hero-smiling-pointing');
    },

    resetState: function() {
      this.hero.animations.play('hero-default');
      this.spinButton.animations.play('buttonDefault');
      this.canClickWheel = true;
    }

  };
  
  module.exports = Play;