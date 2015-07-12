/// <reference path="../phaser/typescript/phaser.d.ts"/>
var Actores = (function () {
    function Actores(game) {
        this.game = game;
    }
    Actores.prototype.Actor = function (x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        var entity = {
            id: 12,
            name: "sin_imagen",
            image: 'sin_imagen',
            x: x,
            y: y,
            scale_x: 1,
            scale_y: 1,
            rotation: 0,
            anchor_x: 0.5,
            anchor_y: 0.5,
            scripts: {
                rotate: {
                    speed: 0,
                }
            }
        };
        this.game.game_state.entities.push(entity);
        return entity;
    };
    return Actores;
})();
var Game = (function () {
    function Game(element_id) {
        this.pause = false;
        this.sprites = [];
        var options = {
            preload: this.preload.bind(this),
            create: this.create.bind(this),
            update: this.update.bind(this),
            render: this.render.bind(this)
        };
        this.game = new Phaser.Game(800, 600, Phaser.CANVAS, element_id, options);
        this.game_state_history = [];
        this.game_state = { entities: [] };
        this.load_scripts();
        this.actores = new Actores(this);
    }
    Game.prototype.load_scripts = function () {
        this.scripts = {
            rotate: function (entity, data) {
                entity.rotation += data.speed;
            },
            move: function (entity, data) {
                entity.x += data.dx;
                entity.y += data.dy;
            }
        };
    };
    Game.prototype.preload = function () {
        this.game.load.image('humo', 'data/humo.png');
        this.game.load.image('sin_imagen', 'data/sin_imagen.png');
        this.game.stage.disableVisibilityChange = true;
    };
    Game.prototype.create = function () {
        var entity = {
            id: 12,
            name: "humo",
            image: 'humo',
            x: 100,
            y: 100,
            scale_x: 1,
            scale_y: 1,
            rotation: 0,
            anchor_x: 0.5,
            anchor_y: 0.5,
            scripts: {
                rotate: {
                    speed: 0,
                }
            }
        };
        this.game_state.entities.push(entity);
        this.actores.Actor();
    };
    Game.prototype.update = function () {
        var _this = this;
        this.game_state.entities.forEach(function (entity) {
            if (entity.sprite_id) {
                var sprite = _this.get_sprite_by_id(entity.sprite_id);
                sprite.position.set(entity.x, entity.y);
                sprite.scale.set(entity.scale_x, entity.scale_y);
                sprite.anchor.setTo(entity.anchor_x, entity.anchor_y);
                sprite.angle = -entity.rotation;
            }
            else {
                var sprite = _this.game.add.sprite(entity.x, entity.y, entity.image);
                var sprite_id = _this.add_sprite(sprite);
                entity.sprite_id = sprite_id;
                sprite.position.set(entity.x, entity.y);
                sprite.scale.set(entity.scale_x, entity.scale_y);
                sprite.anchor.setTo(entity.anchor_x, entity.anchor_y);
                sprite.angle = -entity.rotation;
            }
            if (!_this.pause) {
                // Actualiza las entidades.
                for (var name in entity.scripts) {
                    _this.apply_script(entity, name, entity.scripts[name]);
                }
            }
        });
        if (!this.pause) {
            this.save_history(this.game_state);
        }
    };
    Game.prototype.render = function () {
        this.game.debug.inputInfo(32, 32);
    };
    Game.prototype.add_sprite = function (sprite) {
        var id = this.create_id();
        this.sprites.push({ id: id, sprite: sprite });
        return id;
    };
    Game.prototype.create_id = function () {
        return (0 | Math.random() * 9e6).toString(36);
    };
    Game.prototype.get_sprite_by_id = function (id) {
        var sprite = null;
        for (var i = 0; i < this.sprites.length; i++) {
            var element = this.sprites[i];
            if (element.id === id) {
                return element.sprite;
            }
        }
        throw new Error("No se encuentra el sprite con el ID " + id);
    };
    Game.prototype.apply_script = function (entity, script_name, script_data) {
        this.get_script_by_name(script_name)(entity, script_data);
    };
    Game.prototype.get_script_by_name = function (script_name) {
        return this.scripts[script_name];
    };
    Game.prototype.save_history = function (state) {
        this.game_state_history.push(JSON.parse(JSON.stringify(state)));
    };
    return Game;
})();
function initGame(element_id) {
    return new Game(element_id);
}
function old() {
    var state_history = [];
    var previous_sprites_render = [];
    var state = {
        entities: [
            {
                id: 12,
                name: "humo",
                image: 'humo',
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
    };
    function saveHistory(game_state_history, state_in_time) {
        function JSONClone(o) {
            if (!o || 'object' !== typeof o) {
                return o;
            }
            var c = 'function' === typeof o.pop ? [] : {};
            var p, v;
            for (p in o) {
                if (p.toString().indexOf('_') === 0) {
                    continue;
                }
                else {
                    if (o.hasOwnProperty(p)) {
                        v = o[p];
                        if (v && 'object' === typeof v) {
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
    function restoreStateWithUndo(step) {
        if (step > 0) {
            state = state_history[step];
        }
    }
    function undo() {
        state = state_history.pop();
    }
    /*
  
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
    */
}
