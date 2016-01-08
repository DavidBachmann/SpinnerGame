
  'use strict';
  function Play() {}
  Play.prototype = {
    create: function() {
      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      this.background = this.game.add.sprite(0,0,'background');

      this.background.events.onInputDown.add(this.clickListener, this);

      // Spawn wheel parts
      this.wheelStand = this.game.add.sprite(650, 340, 'wheelStand');
      this.wheelStand.anchor.setTo(0.5, 0);
      this.wheelStand.scale.setTo(0.6);

      this.wheelColors = this.game.add.sprite(650, 340, 'wheelColors');
      this.wheelColors.anchor.setTo(0.5, 0.5);
      this.wheelColors.scale.setTo(0.6);

      this.wheelFrame = this.game.add.sprite(650, 170, 'wheelFrame');
      this.wheelFrame.anchor.setTo(0.5, 0);
      this.wheelFrame.scale.setTo(0.6);

      this.wheelCenter = this.game.add.sprite(650, 295, 'wheelCenter');
      this.wheelCenter.anchor.setTo(0.5, 0);
      this.wheelCenter.scale.setTo(0.6);

      this.wheelTop = this.game.add.sprite(650, 170, 'wheelTop');
      this.wheelTop.anchor.setTo(0.5, 0);
      this.wheelTop.scale.setTo(0.6);

      this.wheelNeedle = this.game.add.sprite(650, 170, 'wheelNeedle');
      this.wheelNeedle.anchor.setTo(0.5, 0);
      this.wheelNeedle.scale.setTo(0.6);

      this.wheelLighting = this.game.add.sprite(660, 150, 'wheelLighting');
      this.wheelLighting.anchor.setTo(0.5, 0);
      this.wheelLighting.scale.setTo(0.5);

      // Spawn hero
      this.hero = this.game.add.sprite(350, 360, 'hero');
      this.hero.anchor.setTo(0.5, 0);
      this.hero.scale.setTo(0.6);

    },

    update: function() {
      this.wheelColors.rotation -=0.05;
    },

    clickListener: function() {
      this.game.state.start('gameover');
    }
  };
  
  module.exports = Play;