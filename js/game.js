window.onload = function(){

  var phaser = new Phaser.Game(960, 580, Phaser.AUTO, 'game');

  // Load states
  phaser.state.add('Boot', Game.States.Boot);
  phaser.state.add('Preloader', Game.States.Preloader);
  phaser.state.add('Play', Game.States.Play);

  // Load game
  phaser.state.start('Boot');
};