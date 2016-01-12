'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.game.time.advancedTiming = true;
    this.asset = this.add.sprite(this.game.width/2,this.game.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);
    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
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
  },

  create: function() {
    this.asset.cropEnabled = false;
  },

  update: function() {
    if(!!this.ready) {
      this.game.state.start('play');
    }
  },

  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;