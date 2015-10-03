var Utils;
(function (Utils) {
    function test() {
        console.log('test');
    }
    Utils.test = test;
})(Utils || (Utils = {}));
/// <reference path="../phaser/typescript/phaser.d.ts"/>
/// <reference path="utils.ts" />
/// <reference path="entidad.ts" />
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
var Pilas = (function () {
    function Pilas(id_elemento_html, opciones) {
        this.pause_enabled = false;
        this.sprites = [];
        var options = {
            preload: this.preload.bind(this),
            create: this.create.bind(this),
            update: this.update.bind(this),
            render: this.render.bind(this)
        };
        this.opciones = opciones;
        this.game = new Phaser.Game(800, 600, Phaser.CANVAS, id_elemento_html, options);
        this.game_history = new GameHistory(this);
        this.game_state = { entities: [] };
        this.load_scripts();
        this.actores = new Actores(this);
    }
    Pilas.prototype.load_scripts = function () {
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
    Pilas.prototype.cargar_imagen = function (identificador, archivo) {
        var path = this.join(this.opciones.data_path, archivo);
        this.game.load.image(identificador, path);
    };
    /**
     * Concatena dos rutas de manera similar a la función os.path.join
     */
    Pilas.prototype.join = function (a, b) {
        var path = [a, b].map(function (i) {
            return i.replace(/(^\/|\/$)/, '');
        }).join('/');
        return path;
    };
    /**
     * Concatena dos rutas de manera similar a la función os.path.join
     */
    Pilas.prototype.ejecutar = function () {
        console.log("llamando a pilas.ejecutar() ...");
    };
    Pilas.prototype.preload = function () {
        this.cargar_imagen('humo', 'humo.png');
        this.cargar_imagen('sin_imagen', 'sin_imagen.png');
        this.game.stage.disableVisibilityChange = true;
    };
    Pilas.prototype.create = function () {
        this.actores.Actor(400, 100);
    };
    Pilas.prototype.pause = function () {
        this.pause_enabled = true;
    };
    Pilas.prototype.unpause = function () {
        this.pause_enabled = false;
        this.game_history.reset();
    };
    Pilas.prototype.toggle_pause = function () {
        if (this.pause_enabled) {
            this.unpause();
        }
        else {
            this.pause();
        }
    };
    Pilas.prototype.update = function () {
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
    Pilas.prototype.render = function () {
        this.game.debug.inputInfo(32, 32);
    };
    Pilas.prototype.get_entity_by_id = function (id) {
        var entities = this.ls();
        var index = entities.indexOf(id);
        return this.game_state.entities[index];
    };
    Pilas.prototype.add_sprite = function (sprite) {
        var id = this.create_id();
        this.sprites.push({ id: id, sprite: sprite });
        return id;
    };
    Pilas.prototype.create_id = function () {
        return (0 | Math.random() * 9e6).toString(36);
    };
    Pilas.prototype.get_sprite_by_id = function (id) {
        var sprite = null;
        for (var i = 0; i < this.sprites.length; i++) {
            var element = this.sprites[i];
            if (element.id === id) {
                return element.sprite;
            }
        }
        throw new Error("No se encuentra el sprite con el ID " + id);
    };
    Pilas.prototype.apply_script = function (entity, script_name, script_data) {
        this.get_script_by_name(script_name)(entity, script_data);
    };
    Pilas.prototype.get_script_by_name = function (script_name) {
        return this.scripts[script_name];
    };
    Pilas.prototype.restore = function (step) {
        var state = this.game_history.get_state_by_step(step);
        this.transition_to_step(state);
    };
    Pilas.prototype.ls = function () {
        return this.game_state.entities.map(function (e) {
            return (e.id);
        });
    };
    Pilas.prototype.getActorProxy = function (id) {
        return new ActorProxy(this, id);
    };
    Pilas.prototype.transition_to_step = function (state) {
        var current_state = this.game_state;
        this.game_state = state;
    };
    return Pilas;
})();
var pilasengine = {
    /**
     * Inicializa la biblioteca completa.
     *
     * @example
     *     var pilas = pilasengine.iniciar("canvas_id");
     *     // => '&lt;script&gt;&lt;/script&gt;'
     *
     * @param {OpcionesIniciar} las opciones de inicialización.
     * @return {Game} el objeto instanciado que representa el contexto del juego.
     * @api public
     */
    iniciar: function (element_id, opciones) {
        if (opciones === void 0) { opciones = { data_path: 'data' }; }
        return new Pilas(element_id, opciones);
    }
};
