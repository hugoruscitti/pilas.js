var options = {preload: preload, create: create, update: update, render: render};
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', options);

var pause = false;

var state_history = [];

var previous_sprites_render = [];

var sprites = [];

function add_sprite(sprite) {
  var id = (0|Math.random()*9e6).toString(36);

  sprites.push({id: id, sprite: sprite});

  return id;
}

function get_sprite_by_id(id) {
  var sprite = null;

  for (var i=0; i<sprites.length; i++) {
    var element = sprites[i];

    if (element.id === id) {
      return element.sprite;
    }

  }

  throw new Error("No se encuentra el sprite con el ID " + id);
}


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
        },
        move: {
          dx: 10
        }
      }
    }
  ]
}


var scripts = {
  rotate: function(entity, data) {
    entity.rotation += data.speed;
  },

  move: function(entity, data) {
    entity.x += data.dx;
    entity.y += data.dy;
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

    if (entity.sprite_id) {
      var sprite = get_sprite_by_id(entity.sprite_id);

      sprite.position.set(entity.x, entity.y);
      sprite.scale.set(entity.scale_x, entity.scale_y);
      sprite.anchor.setTo(entity.anchor_x, entity.anchor_y);
      sprite.angle = -entity.rotation;
    } else {
      var sprite = game.add.sprite(entity.x, entity.y, entity.image);
      var sprite_id = add_sprite(sprite);
      entity.sprite_id = sprite_id;

      sprite.position.set(entity.x, entity.y);
      sprite.scale.set(entity.scale_x, entity.scale_y);
      sprite.anchor.setTo(entity.anchor_x, entity.anchor_y);
      sprite.angle = -entity.rotation;
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

function restoreStateWithUndo(step) {
  if (step > 0) {
    state = state_history[step];
  }
}

function undo() {
  state = state_history.pop();
}

function showSlider() {
  slider.style.visibility = null;
  slider.setAttribute('max', state_history.length);
  slider.value = state_history.length;

  slider.onmousemove = function(value) {
    restoreStateWithUndo(this.value -1);
  };
}

function hideSlider() {
  slider.style.visibility = "hidden";
}

pauseButton.onclick = function() {
  pause = !pause;

  if (pause) {
    showSlider();
    this.textContent = "Play";
  } else {
    hideSlider();
    this.textContent = "Pause";
  }
};

function render() {
	game.debug.inputInfo(32, 32);
}
