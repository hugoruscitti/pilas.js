var options = {preload: preload, create: create, update: update, render: render};
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', options);

var pause = false;

var state_history = [];

var state = {
  entities: [
    {
      id: 12,
      name: "humo",
      image: 'humo',
      _sprite: null,
      x: 100,
      y: 100,
      scale_x: 1,
      scale_y: 1,
      rotation: 0,
      anchor_x: 0.5,
      anchor_y: 0.5,
      scripts: {
        rotate: {
          speed: 1,
        }
      }
    },

    {
      id: 123,
      name: "humo",
      image: 'humo',
      _sprite: null,
      x: 200,
      y: 200,
      scale_x: 1,
      scale_y: 1,
      rotation: 0,
      anchor_x: 0.5,
      anchor_y: 0.5,
      scripts: {
        rotate: {
          speed: 10,
        }
      }
    }
  ]
}


var scripts = {
  rotate: function(entity, data) {
    entity.rotation += data.speed;
  }
}



function preload() {
  game.load.image('humo', 'data/humo.png');
  game.stage.disableVisibilityChange = true;
}

function create() {
}

function apply_script(entity, script_name, script_data) {
  scripts[script_name](entity, script_data);
}

function saveHistory(game_state_history, state_in_time) {
  function JSONClone(o) {
    if(!o || 'object' !== typeof o)  {
      return o;
    }
    var c = 'function' === typeof o.pop ? [] : {};
      var p, v;
      for(p in o) {
        if (p.toString().indexOf('_') === 0) {
          continue;
          } else {

            if(o.hasOwnProperty(p)) {
              v = o[p];

              if(v && 'object' === typeof v) {
                c[p] = JSONClone(v);
              }
              else {
                c[p] = v;
              }
            }
          }


      }

      return c;
  }


  game_state_history.push(JSONClone(state_in_time));
}

function update() {
  state.entities.forEach(function(entity) {

    if (entity._sprite) {
      entity._sprite.position.set(entity.x, entity.y);
      entity._sprite.scale.set(entity.scale_x, entity.scale_y);
      entity._sprite.anchor.setTo(entity.anchor_x, entity.anchor_y);
      entity._sprite.angle = -entity.rotation;
    } else {
      entity._sprite = game.add.sprite(entity.x, entity.y, entity.image);
      
      entity._sprite.position.set(entity.x, entity.y);
      entity._sprite.scale.set(entity.scale_x, entity.scale_y);
      entity._sprite.anchor.setTo(entity.anchor_x, entity.anchor_y);
      entity._sprite.angle = -entity.rotation;
    }

    if (!pause) {
      // Actualiza las entidades.
      for (var name in entity.scripts) {
        apply_script(entity, name, entity.scripts[name]);
      }
    }


  });

  if (!pause) {
    saveHistory(state_history, state);
  }
}


function undo() {
  state = state_history.pop();
}


pauseButton.onclick = function() {
  pause = !pause;
};

function render() {
	game.debug.inputInfo(32, 32);
}
