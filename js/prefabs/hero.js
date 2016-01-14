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