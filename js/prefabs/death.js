Game.Prefabs.Death = function(game){

  // Super call
  Phaser.GameObjectFactory.call(this, game);

    this.game.add.tween(this.piano.position).to( { y: 220 }, 200, "Linear", true);

    this.game.time.events.add(200, function(){
      this.hero.animations.play('heroDeath')
    }, this);

}

Game.Prefabs.Death.prototype = Object.create(Phaser.Sprite.prototype);

//Game.Prefabs.Death.constructor = Game.Prefabs.Death;

Game.Prefabs.Death.prototype.update = function(){};



// .onComplete.add(function(){
//   this.hero.kill();
//   this.game.time.events.add(500, function(){
//     this.game.add.tween(this.piano)
//     .to({alpha: 0}, 200, "Linear", true)
//     this.game.time.events.add(500, this.reset, this);
//   }, this)
// }, this)