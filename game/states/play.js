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

      this.background = this.game.add.sprite(0,0,'background');

      // Creating the wheel from multiple parts.
      this.wheelGroup = this.game.add.group();

      this.wheelStand = this.wheelGroup.create(650, 360, 'wheelStand');
      this.wheelStand.anchor.setTo(0.5, 0);
      this.wheelStand.scale.setTo(0.5);

      this.wheelColors = this.wheelGroup.create(650, 360, 'wheelColors');
      this.wheelColors.anchor.setTo(0.5, 0.5);
      this.wheelColors.scale.setTo(0.5);

      this.wheelFrame = this.wheelGroup.create(650, 360, 'wheelFrame');
      this.wheelFrame.anchor.setTo(0.5, 0.5);
      this.wheelFrame.scale.setTo(0.5);
      this.game.physics.enable(this.wheelFrame, Phaser.Physics.ARCADE);

      this.wheelCenter = this.wheelGroup.create(650, 360, 'wheelCenter');
      this.wheelCenter.anchor.setTo(0.5, 0.5);
      this.wheelCenter.scale.setTo(0.5);
      this.game.physics.enable(this.wheelCenter, Phaser.Physics.ARCADE);

      this.wheelTop = this.wheelGroup.create(0, -280, 'wheelTop');
      this.wheelTop.anchor.setTo(0.5, 0);
      this.wheelTop.scale.setTo(0.9);

      this.wheelNeedle = this.wheelGroup.create(0, -280, 'wheelNeedle');
      this.wheelNeedle.anchor.setTo(0.5, 0);
      this.wheelNeedle.scale.setTo(0.9);

      this.wheelLighting = this.wheelGroup.create(660, 150, 'wheelLighting');
      this.wheelLighting.anchor.setTo(0.5, 0);
      this.wheelLighting.scale.setTo(0.5);


      // Add Top and Needle into the wheelFrame object.
      this.wheelFrame.addChild(this.wheelTop);
      this.wheelFrame.addChild(this.wheelNeedle);

      // Make the wheelFrame object accept inputs and make that input trigger wheelHandler();
      this.wheelFrame.inputEnabled = true;
      this.wheelFrame.events.onInputDown.add(this.wheelHandler, this);


      // We'll set a lower max angular velocity here to keep it from going totally nuts.
      this.wheelFrame.body.maxAngular = 500;
      this.wheelCenter.body.maxAngular = 500;


      // Apply a drag otherwise the sprite will just spin and never slow down.
      this.wheelFrame.body.angularDrag = 200;
      this.wheelCenter.body.angularDrag = 200;

      // Create Hero group and add hero sprites to it.
      this.heroGroup = this.game.add.group();
      this.heroGroup.scale.setTo(0.85);
      this.heroGroup.position.setTo(100,100)

      // This sprite is empty, and used as a parent.
      this.hero = this.heroGroup.create(350, 350)

      this.heroHandLeft = this.heroGroup.create(50, 50,'hero', 7);
      this.heroHandLeft.anchor.setTo(0.2, 1);

      this.heroTorso = this.heroGroup.create(0, 0, 'hero', 19);
      this.heroTorso.anchor.setTo(0.5, 0);

      this.heroHead = this.heroGroup.create(10, -90, 'hero', 17)
      this.heroHead.anchor.setTo(0.5, 0);
      this.heroHead.scale.setTo(0.8);

      this.heroFeet = this.heroGroup.create(25, 85, 'hero', 5);
      this.heroFeet.anchor.setTo(0.5, 0);

      // Make the bodyparts be a child of the 'hero' sprite.
      this.hero.addChild(this.heroHandLeft);
      this.hero.addChild(this.heroFeet);
      this.hero.addChild(this.heroTorso);
      this.hero.addChild(this.heroHead);

      // Add 'animations' that are a single frame each.
      this.heroFeet.animations.add('standing-alt', [0], 1, false);
      this.heroFeet.animations.add('standing-on-left-alt', [1], 1, false);
      this.heroFeet.animations.add('standing-on-left', [2], 1, false);
      this.heroFeet.animations.add('standing-on-right-alt', [3], 1, false);
      this.heroFeet.animations.add('standing-on-right', [4], 1, false);
      this.heroFeet.animations.add('standing', [5], 1, false);

      this.heroHandLeft.animations.add('dunno', [6], 1, false);
      this.heroHandLeft.animations.add('raised', [7], 1, false);
      this.heroHandLeft.animations.add('thumbsup', [8], 1, false);

      this.heroHead.animations.add('angry-closed-eyes', [9], 1, false);
      this.heroHead.animations.add('angry-open-eyes', [10], 1, false);
      this.heroHead.animations.add('cool', [11], 1, false);
      this.heroHead.animations.add('laughing-closed-eyes', [12], 1, false);
      this.heroHead.animations.add('laughing-open-eyes', [13], 1, false);
      this.heroHead.animations.add('notimpressed', [14], 1, false);
      this.heroHead.animations.add('sad-alt', [15], 1, false);
      this.heroHead.animations.add('sad', [16], 1, false);
      this.heroHead.animations.add('smiling', [17], 1, false);
      this.heroHead.animations.add('surprised', [18], 1, false);

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
      }
    },

    spinWheel: function() {

      this.wheelFrame.body.angularAcceleration = 250;
      this.wheelCenter.body.angularAcceleration = -250;
      this.canClickWheel = false;

      // User can't stop wheel until after X ms, so it can build momentum
      this.game.time.events.add(4000, this.resetState, this);
    },

    stopWheel: function() {
      this.wheelFrame.body.angularAcceleration = 0;
      this.wheelCenter.body.angularAcceleration = 0;
      this.canClickWheel = false;
      this.heroHead.animations.play('surprised');
      // The player can't click the wheel until 4 seconds has passed.
      this.game.time.events.add(4000, this.resetState, this);
    },

    resetState: function() {
      this.canClickWheel = true;
      this.heroHead.animations.play('smiling');


    }

  };
  
  module.exports = Play;