var options = {preload: preload, create: create, update: update, render: render};
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', options);


function preload() {
  game.load.image('einstein', 'data/humo.png');
}

function create() {
  game.add.sprite(0, 0, 'einstein');
}

function update() {
}

function render() {
	game.debug.inputInfo(32, 32);
}
