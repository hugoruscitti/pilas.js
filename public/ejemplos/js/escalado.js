var pilas = pilasengine.iniciar('elementoCanvas', {data_path: '../data', redimensionar: true});

window.pilas = pilas;
window.actor = null;

pilas.cuando('inicia', function() {

  pilas.fondos.Plano();
  actor = pilas.actores.Actor();

  var actorPersonalizado = pilas.actores.crear({
    nombre: "otro-yamcha",
    imagen: "yamcha",
    escala: 2,
    y: 300,
    x: 200,

    contador: 0,

    actualizar: function() {
      this.contador += 0.1;
      this.rotation += this.contador;

      this.x = pilas.mouse.x;
      this.y = pilas.mouse.y;
    }
  });

  var actorPersonalizado = pilas.actores.crear({
    nombre: "mi-yamcha",
    imagen: "yamcha",
    escala: 2,
    y: 300,
    x: 200,

    // Atributos personalizados.
    contador: 0,

    actualizar: function() {
      this.contador += 1;

      this.rotation = Math.sin(this.contador / 20.0) * -30;
      this.x += Math.sin(this.contador / 20.0) * 10;
      this.scale_x = Math.sin(this.contador / 5.0) * 0.2 + 1.2;
      this.scale_y = Math.cos(this.contador / 5.0) * 0.2 + 1.2;
    },

  });


});
