var Utils;
(function (Utils) {
    function test() {
        console.log('test');
    }
    Utils.test = test;
})(Utils || (Utils = {}));
/// <reference path="../phaser/typescript/phaser.d.ts"/>
/// <reference path="utils.ts" />
Utils.test();
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
                    speed: 0.5,
                }
            }
        };
        entity.id = Math.ceil(Math.random() * 1000000000000);
        this.game.game_state.entities.push(entity);
        return entity;
    };
    return Actores;
})();
var GameHistory = (function () {
    function GameHistory(game) {
        this.game = game;
        this.game_state_history = [];
        this.current_step = 0;
    }
    GameHistory.prototype.reset = function () {
        this.game_state_history = [];
        this.current_step = 0;
    };
    GameHistory.prototype.get_length = function () {
        return this.game_state_history.length;
    };
    GameHistory.prototype.save = function (state) {
        this.game_state_history.push(JSON.parse(JSON.stringify(state)));
        this.current_step = this.game_state_history.length;
    };
    GameHistory.prototype.get_state_by_step = function (step) {
        var total = this.get_length();
        if (step < 0 || step >= total) {
            throw new Error("No se puede recuperar el historial en el paso " + step);
        }
        return this.game_state_history[step];
    };
    return GameHistory;
})();
var ActorProxy = (function () {
    function ActorProxy(game, id) {
        this.id = id;
        this.game = game;
    }
    Object.defineProperty(ActorProxy.prototype, "x", {
        set: function (value) {
            this.data.x = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActorProxy.prototype, "data", {
        get: function () {
            return this.game.get_entity_by_id(this.id);
        },
        enumerable: true,
        configurable: true
    });
    return ActorProxy;
})();
var Game = (function () {
    function Game(element_id) {
        this.pause_enabled = false;
        this.sprites = [];
        var options = {
            preload: this.preload.bind(this),
            create: this.create.bind(this),
            update: this.update.bind(this),
            render: this.render.bind(this)
        };
        this.game = new Phaser.Game(800, 600, Phaser.CANVAS, element_id, options);
        this.game_history = new GameHistory(this);
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
        this.actores.Actor(400, 100);
    };
    Game.prototype.pause = function () {
        this.pause_enabled = true;
    };
    Game.prototype.unpause = function () {
        this.pause_enabled = false;
        this.game_history.reset();
    };
    Game.prototype.toggle_pause = function () {
        if (this.pause_enabled) {
            this.unpause();
        }
        else {
            this.pause();
        }
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
            if (!_this.pause_enabled) {
                // Actualiza las entidades.
                for (var name in entity.scripts) {
                    _this.apply_script(entity, name, entity.scripts[name]);
                }
            }
        });
        if (!this.pause_enabled) {
            this.game_history.save(this.game_state);
        }
    };
    Game.prototype.render = function () {
        this.game.debug.inputInfo(32, 32);
    };
    Game.prototype.get_entity_by_id = function (id) {
        var entities = this.ls();
        var index = entities.indexOf(id);
        return this.game_state.entities[index];
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
    Game.prototype.restore = function (step) {
        var state = this.game_history.get_state_by_step(step);
        this.transition_to_step(state);
    };
    Game.prototype.ls = function () {
        return this.game_state.entities.map(function (e) {
            return (e.id);
        });
    };
    Game.prototype.getActorProxy = function (id) {
        return new ActorProxy(this, id);
    };
    Game.prototype.transition_to_step = function (state) {
        var current_state = this.game_state;
        this.game_state = state;
    };
    return Game;
})();
function initGame(element_id) {
    return new Game(element_id);
}
