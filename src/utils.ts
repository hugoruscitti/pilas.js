class Utils {
  pilas: Pilas;

  constructor(pilas:Pilas) {
    this.pilas = pilas;
  }


  public activar_redimensionado(id_elemento_html: string) {
    var gameArea = document.getElementById(id_elemento_html);

    gameArea.style.position = "absolute";
    gameArea.style.left = "50%";
    gameArea.style.top = "50%";

    gameArea.style.width = "100%";
    gameArea.style.height = "100%";


    function resizeGame() {
      var gameArea = document.getElementById(id_elemento_html);
      var canvas:any = gameArea.children[0];
      var widthToHeight = 4 / 3;
      var newWidth = window.innerWidth;
      var newHeight = window.innerHeight;

      var newWidthToHeight = newWidth / newHeight;

      if (newWidthToHeight > widthToHeight) {
        newWidth = newHeight * widthToHeight;
        gameArea.style.height = newHeight + "px";
        gameArea.style.width = newWidth + "px";
      } else {
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
  }

  private _crear_estilo_de_canvas_redimensionado() {
    
    var style = document.createElement("style");
    style.appendChild(document.createTextNode(""));
    document.head.appendChild(style);

    var sheet:any = style.sheet;
    var selector = "canvas"; // TODO: AGREGAR ID DEL ELEMENTO
    var rules = "width: 100% !important; height: 100% !important;";

    if("insertRule" in sheet) {
      sheet.insertRule(selector + "{" + rules + "}", 0);
    } else {
      if("addRule" in sheet) {
        sheet.addRule(selector, rules, 0);
      }
    }

  }

}
