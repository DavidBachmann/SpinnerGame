(function(){
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
})();