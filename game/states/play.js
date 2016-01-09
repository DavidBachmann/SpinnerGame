  'use strict';
  var _ = require('underscore');

  function Play() {
    this.canClickWheel = true;
    this.howLongDoesTheWheelWait = 10000;
  }

  Play.prototype = {

    create: function() {
      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      this.background = this.game.add.sprite(0,0,'background');

      // Create wheel parts, set the right anchor and scale it down.
      this.wheelStand = this.game.add.sprite(650, 360, 'wheelStand');
      this.wheelStand.anchor.setTo(0.5, 0);
      this.wheelStand.scale.setTo(0.5);

      this.wheelColors = this.game.add.sprite(650, 360, 'wheelColors');
      this.wheelColors.anchor.setTo(0.5, 0.5);
      this.wheelColors.scale.setTo(0.5);

      this.wheelFrame = this.game.add.sprite(650, 360, 'wheelFrame');
      this.wheelFrame.anchor.setTo(0.5, 0.5);
      this.wheelFrame.scale.setTo(0.5);
      this.game.physics.enable(this.wheelFrame, Phaser.Physics.ARCADE);

      this.wheelCenter = this.game.add.sprite(650, 360, 'wheelCenter');
      this.wheelCenter.anchor.setTo(0.5, 0.5);
      this.wheelCenter.scale.setTo(0.5);
      this.game.physics.enable(this.wheelCenter, Phaser.Physics.ARCADE);

      this.wheelTop = this.game.add.sprite(0, -280, 'wheelTop');
      this.wheelTop.anchor.setTo(0.5, 0);
      this.wheelTop.scale.setTo(0.9);

      this.wheelNeedle = this.game.add.sprite(0, -280, 'wheelNeedle');
      this.wheelNeedle.anchor.setTo(0.5, 0);
      this.wheelNeedle.scale.setTo(0.9);

      this.wheelLighting = this.game.add.sprite(660, 150, 'wheelLighting');
      this.wheelLighting.anchor.setTo(0.5, 0);
      this.wheelLighting.scale.setTo(0.5);


      // Add Top and Needle into the wheelFrame object.
      this.wheelFrame.addChild(this.wheelTop);
      this.wheelFrame.addChild(this.wheelNeedle);

      // Make the wheelFrame object accept inputs and make that input trigger wheelHandler();
      this.wheelFrame.inputEnabled = true;
      this.wheelFrame.events.onInputDown.add(this.wheelHandler, this);


      // We'll set a lower max angular velocity here to keep it from going totally nuts
      this.wheelFrame.body.maxAngular = 500;
      this.wheelCenter.body.maxAngular = 500;


      // Apply a drag otherwise the sprite will just spin and never slow down
      this.wheelFrame.body.angularDrag = 200;
      this.wheelCenter.body.angularDrag = 200;

      // Spawn hero
      this.hero = this.game.add.sprite(350, 360, 'hero');
      this.hero.anchor.setTo(0.5, 0);
      this.hero.scale.setTo(0.6);
    },

    update: function() {
      if (!this.canClickWheel) {
        this.wheelFrame.tint = 0xffa500;
      } else {
        this.wheelFrame.tint = 0xFFFFFF;
      }


    },

    render: function() {
      // Sprite debug info
      this.game.debug.spriteInfo(this.wheelFrame, 32, 32);
    },

    wheelHandler: function() {
      if (this.wheelFrame.body.angularAcceleration > 0 && this.canClickWheel) {
        this.stopWheel();
      } else if (this.wheelFrame.body.angularAcceleration === 0 && this.canClickWheel) {       
        this.spinWheel();
      }
    },

    spinWheel: function() {

      this.wheelFrame.body.angularAcceleration = 100;
      this.wheelCenter.body.angularAcceleration = -100;
      this.canClickWheel = false;

      // User can't stop wheel until after X ms, so it can build momentum
      this.game.time.events.add(4000, this.resetState, this);

      // If the wheel is not stopped manually it stops automatically after X ms. (Doesn't work well.)
      //this.game.time.events.add(this.howLongDoesTheWheelWait, this.stopWheel, this);

    },

    stopWheel: function() {
      this.wheelFrame.body.angularAcceleration = 0;
      this.wheelCenter.body.angularAcceleration = 0;
      this.canClickWheel = false;

      // The player can't click the wheel until 4 seconds has passed.
      this.game.time.events.add(4000, this.resetState, this);
    },

    resetState: function() {
      this.canClickWheel = true;
    }

  };
  
  module.exports = Play;