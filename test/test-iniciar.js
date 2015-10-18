test('Puede inicializar y crear actores', function(assert) {
  var done = assert.async();
  expect(1);

  var pilas = pilasengine.iniciar('elementoCanvas', {ancho: 320, alto: 240, en_test:true, data_path: '../public/data'});

  pilas.cuando('inicia', function() {
      var fondo = pilas.fondos.Plano();

      equal(fondo.x, 0, "La bomba está en la posición inicial");

      done();
  });

  pilas.ejecutar();
});
