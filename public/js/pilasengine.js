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
    Object.defineProperty(ActorProxy.prototype, "y", {
        set: function (value) {
            this.data.y = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActorProxy.prototype, "data", {
        get: function () {
            return this.game.obtener_entidad_por_id(this.id);
        },
        enumerable: true,
        configurable: true
    });
    return ActorProxy;
})();
var Actores = (function () {
    function Actores(game) {
        this.game = game;
    }
    /**
     * Representa a un actor genérico, con una imagen y propiedades
     * de transformación como ``x``, ``y``, ``escala_x``, ``escala_y`` etc...
     *
     * ![](../imagenes/sin_imagen.png)
     *
     * @param x - posición horizontal.
     * @param y - posición vertical.
     */
    Actores.prototype.Actor = function (x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        var entity = {
            id: 12,
            nombre: "sin_imagen",
            imagen: 'sin_imagen',
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
        this.game.game_state.entidades.push(entity);
        return entity;
    };
    Actores.prototype.Patito = function () {
        var entidad = this.crear({
            nombre: "patito",
            imagen: "data:patito.png"
        });
        return new ActorProxy(this.game, entidad.id);
    };
    Actores.prototype.crear = function (diccionario) {
        var entidad = {
            id: Math.ceil(Math.random() * 1000000000000),
            nombre: diccionario.nombre || "",
            imagen: diccionario.imagen || 'sin_imagen',
            x: diccionario.x || 100,
            y: diccionario.y || 100,
            scale_x: 1,
            scale_y: 1,
            rotation: 0,
            anchor_x: 0.5,
            anchor_y: 0.5,
            scripts: {}
        };
        entidad.contador = diccionario.contador;
        this.game.codigos[entidad.nombre] = {
            actualizar: diccionario.actualizar || function () { },
        };
        if (entidad.nombre == "") {
            console.error("Tienes que especificar le nombre de la entidad.", entidad);
            throw new Error("Tienes que especificar le nombre de la entidad.");
        }
        this.game.game_state.entidades.push(entidad);
        return entidad;
    };
    return Actores;
})();
var Fondos = (function () {
    function Fondos(pilas) {
        this.pilas = pilas;
    }
    Fondos.prototype.Plano = function (x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        var entity = {
            id: 12,
            nombre: "fondos/plano",
            imagen: 'fondos/plano',
            x: x,
            y: y,
            tiled: true,
            scale_x: 1,
            scale_y: 1,
            rotation: 0,
            anchor_x: 0.5,
            anchor_y: 0.5,
            scripts: {}
        };
        entity.id = Math.ceil(Math.random() * 1000000000000);
        this.pilas.game_state.entidades.push(entity);
        return entity;
    };
    return Fondos;
})();
var Historial = (function () {
    function Historial(game) {
        this.game = game;
        this.game_state_history = [];
        this.current_step = 0;
    }
    Historial.prototype.reset = function () {
        this.game_state_history = [];
        this.current_step = 0;
    };
    Historial.prototype.get_length = function () {
        return this.game_state_history.length;
    };
    Historial.prototype.save = function (state) {
        this.game_state_history.push(JSON.parse(JSON.stringify(state)));
        this.current_step = this.game_state_history.length;
    };
    Historial.prototype.get_state_by_step = function (step) {
        var total = this.get_length();
        if (step < 0 || step >= total) {
            throw new Error("No se puede recuperar el historial en el paso " + step);
        }
        return this.game_state_history[step];
    };
    return Historial;
})();
/// <reference path="../phaser/typescript/phaser.d.ts"/>
/// <reference path="entidad.ts" />
/// <reference path="actores.ts" />
/// <reference path="fondos.ts" />
/// <reference path="historial.ts" />
/// <reference path="actorProxy.ts" />
/// <reference path="tipos.ts" />
var timer = 0;
var Pilas = (function () {
    function Pilas(id_elemento_html, opciones) {
        this.pause_enabled = false;
        this.sprites = [];
        this.mouse = { x: 0, y: 0 };
        var options = {
            preload: this.preload.bind(this),
            create: this.create.bind(this),
            update: this._actualizar.bind(this),
            render: this.render.bind(this)
        };
        this.id_elemento_html = id_elemento_html;
        console.log("%cpilasengine.js v" + VERSION + " | http://www.pilas-engine.com.ar", "color: blue");
        this.codigos = {};
        this.opciones = opciones;
        this.ancho = 800;
        this.alto = 600;
        this.game = new Phaser.Game(this.ancho, this.alto, Phaser.CANVAS, id_elemento_html, options);
        this.game_history = new Historial(this);
        this.game_state = { entidades: [] };
        this.load_scripts();
        this.actores = new Actores(this);
        this.fondos = new Fondos(this);
        this.utils = new Utils(this);
        this.evento_inicia = document.createEvent("Event");
    }
    Pilas.prototype.cuando = function (nombre_evento, callback) {
        if (nombre_evento === "inicia") {
            this._cuando_inicia_callback = callback;
            window.addEventListener("evento_inicia", function () { callback(); });
        }
        else {
            alert("El evento " + nombre_evento + " no est\u00E1 soportado.");
        }
    };
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
    Pilas.prototype.cargar_imagen_atlas = function (id, archivo_png, archivo_json) {
        var path_png = this.join(this.opciones.data_path, archivo_png);
        var path_json = this.join(this.opciones.data_path, archivo_json);
        this.game.load.atlasJSONHash(id, path_png, path_json);
    };
    /**
     * Concatena dos rutas de manera similar a la función ``os.path.join`` de python.
     */
    Pilas.prototype.join = function (a, b) {
        var path = [a, b].map(function (i) {
            return i.replace(/(^\/|\/$)/, "");
        }).join("/");
        return path;
    };
    /**
     * Concatena dos rutas de manera similar a la función os.path.join
     */
    Pilas.prototype.ejecutar = function () {
        if (this.opciones.en_test) {
            this._cuando_inicia_callback.call(this);
        }
    };
    Pilas.prototype.obtener_actores = function () {
        console.log("TODO");
    };
    Pilas.prototype.preload = function () {
        this.game.stage.disableVisibilityChange = true;
        this.cargar_imagen("humo", "humo.png");
        this.cargar_imagen("sin_imagen", "sin_imagen.png");
        this.cargar_imagen("fondos/plano", "fondos/plano.png");
        this.cargar_imagen("yamcha", "yamcha.png");
        this.cargar_imagen_atlas("data", "sprites.png", "sprites.json");
        this.game.stage.disableVisibilityChange = false;
        if (this.opciones.redimensionar) {
            this.utils.activar_redimensionado(this.id_elemento_html);
        }
    };
    Pilas.prototype.create = function () {
        window.dispatchEvent(new CustomEvent("evento_inicia"));
        this.canvas = this.game.add.graphics(0, 0);
        //this.game.world.bringToTop();
    };
    Pilas.prototype.pausar = function () {
        this.pause_enabled = true;
    };
    Pilas.prototype.continuar = function () {
        this.pause_enabled = false;
        this.game_history.reset();
    };
    Pilas.prototype.alternar_pausa = function () {
        if (this.pause_enabled) {
            this.continuar();
        }
        else {
            this.pausar();
        }
    };
    Pilas.prototype._actualizar = function () {
        this._actualizar_actores(this.pause_enabled);
        this.mouse.x = this.game.input.x;
        this.mouse.y = this.game.input.y;
    };
    Pilas.prototype._actualizar_actores = function (pause_enabled) {
        var _this = this;
        this.canvas.clear();
        this.game_state.entidades.forEach(function (entity) {
            var sprite = null;
            if (entity.sprite_id) {
                sprite = _this._obtener_sprite_por_id(entity.sprite_id);
                sprite.position.set(entity.x, entity.y);
                sprite.scale.set(entity.scale_x, entity.scale_y);
                sprite.anchor.setTo(entity.anchor_x, entity.anchor_y);
                sprite.angle = -entity.rotation;
                _this.canvas.beginFill(0xFF00FF, 1);
                _this.canvas.drawCircle(entity.x, entity.y, 200);
                _this.canvas.endFill();
            }
            else {
                if (entity["tiled"]) {
                    sprite = _this.game.add.tileSprite(entity.x, entity.y, _this.ancho * 2, _this.alto * 2, entity.imagen);
                }
                else {
                    console.log(entity);
                    console.log(entity.imagen);
                    if (entity.imagen.indexOf(":") > 0) {
                        var items = entity.imagen.split(":");
                        var galeria = items[0];
                        var imagen = items[1];
                        sprite = _this.game.add.sprite(entity.x, entity.y, galeria, imagen);
                    }
                    else {
                        sprite = _this.game.add.sprite(entity.x, entity.y, entity.imagen);
                    }
                }
                var sprite_id = _this.add_sprite(sprite);
                entity.sprite_id = sprite_id;
                sprite.position.set(entity.x, entity.y);
                sprite.scale.set(entity.scale_x, entity.scale_y);
                sprite.anchor.setTo(entity.anchor_x, entity.anchor_y);
                sprite.angle = -entity.rotation;
            }
            if (!pause_enabled) {
                if (_this.codigos[entity.nombre]) {
                    try {
                        _this.codigos[entity.nombre].actualizar.call(entity);
                    }
                    catch (e) {
                        console.warn("Hay un error en pilas, así que se activó la pausa. Usá la sentencia 'pilas.unpause()' luego de reparar el error.");
                        console.error(e);
                        _this.pausar();
                    }
                }
                // Actualiza las entidades.
                for (var name in entity.scripts) {
                    _this.aplicar_script(entity, name, entity.scripts[name]);
                }
            }
        });
        if (!pause_enabled) {
            this.game_history.save(this.game_state);
        }
    };
    Pilas.prototype.step = function () {
        this._actualizar_actores(false);
    };
    Pilas.prototype.render = function () {
        //this.game.debug.inputInfo(32, 32);
    };
    Pilas.prototype.obtener_entidad_por_id = function (id) {
        var entities = this.obtener_entidades();
        var index = entities.indexOf(id);
        return this.game_state.entidades[index];
    };
    Pilas.prototype.add_sprite = function (sprite) {
        var id = this._crear_id();
        this.sprites.push({ id: id, sprite: sprite });
        return id;
    };
    Pilas.prototype._crear_id = function () {
        return (0 | Math.random() * 9e6).toString(36);
    };
    Pilas.prototype._obtener_sprite_por_id = function (id) {
        for (var i = 0; i < this.sprites.length; i++) {
            var element = this.sprites[i];
            if (element.id === id) {
                return element.sprite;
            }
        }
        throw new Error("No se encuentra el sprite con el ID " + id);
    };
    Pilas.prototype.aplicar_script = function (entity, script_name, script_data) {
        this.obtener_script_por_nombre(script_name)(entity, script_data);
    };
    Pilas.prototype.obtener_script_por_nombre = function (script_name) {
        return this.scripts[script_name];
    };
    Pilas.prototype.restaurar = function (step) {
        var state = this.game_history.get_state_by_step(step);
        this.transition_to_step(state);
    };
    Pilas.prototype.obtener_entidades = function () {
        return this.game_state.entidades.map(function (e) {
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
/**
 * Representa el espacio de nombres para acceder a todos los componentes
 * de pilasengine.
 */
var pilasengine = {
    /**
     * Inicializa la biblioteca completa.
     *
     * @example
     *     var pilas = pilasengine.iniciar("canvas_id");
     *
     * @param {OpcionesIniciar} las opciones de inicialización.
     * @return {Game} el objeto instanciado que representa el contexto del juego.
     * @api public
     */
    iniciar: function (element_id, opciones) {
        if (opciones === void 0) { opciones = { data_path: "data", en_test: false, redimensionar: true }; }
        return new Pilas(element_id, opciones);
    }
};
var Utils = (function () {
    function Utils(pilas) {
        this.pilas = pilas;
    }
    Utils.prototype.activar_redimensionado = function (id_elemento_html) {
        var gameArea = document.getElementById(id_elemento_html);
        gameArea.style.position = "absolute";
        gameArea.style.left = "50%";
        gameArea.style.top = "50%";
        gameArea.style.width = "100%";
        gameArea.style.height = "100%";
        function resizeGame() {
            var gameArea = document.getElementById(id_elemento_html);
            var canvas = gameArea.children[0];
            var widthToHeight = 4 / 3;
            var newWidth = window.innerWidth;
            var newHeight = window.innerHeight;
            var newWidthToHeight = newWidth / newHeight;
            if (newWidthToHeight > widthToHeight) {
                newWidth = newHeight * widthToHeight;
                gameArea.style.height = newHeight + "px";
                gameArea.style.width = newWidth + "px";
            }
            else {
                newHeight = newWidth / widthToHeight;
                gameArea.style.width = newWidth + "px";
                gameArea.style.height = newHeight + "px";
            }
            gameArea.style.marginTop = (-newHeight / 2) + "px";
            gameArea.style.marginLeft = (-newWidth / 2) + "px";
            canvas.style.width = "100%";
            canvas.style.height = "100%";
        }
        window.addEventListener("resize", resizeGame, false);
        this._crear_estilo_de_canvas_redimensionado();
        resizeGame();
    };
    Utils.prototype._crear_estilo_de_canvas_redimensionado = function () {
        var style = document.createElement("style");
        style.appendChild(document.createTextNode(""));
        document.head.appendChild(style);
        var sheet = style.sheet;
        var selector = "canvas"; // TODO: AGREGAR ID DEL ELEMENTO
        var rules = "width: 100% !important; height: 100% !important;";
        if ("insertRule" in sheet) {
            sheet.insertRule(selector + "{" + rules + "}", 0);
        }
        else {
            if ("addRule" in sheet) {
                sheet.addRule(selector, rules, 0);
            }
        }
    };
    return Utils;
})();
var VERSION = "0.0.2";
