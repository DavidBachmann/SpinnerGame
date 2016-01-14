var Game = {
  name: 'Spinner Game',
  States: {},
  Prefabs: {}
};

Game.States.Boot = function(game){};

Game.States.Boot.prototype = {
  create: function(){
    this.game.state.start('Preloader');
  }
};
