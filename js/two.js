var two = (function () {
  var verbose = false; // CONSOLE
  var container; // DOM container
  var width = window.innerWidth;
  var height = window.innerHeight;
  var renderer;
  var stage;
  // smoke shader
  var uniforms = {
    resolution : {type: "v2", value: {x: width, y: height}},
    alpha : {type: "1f", value: 1.0},
    shift : {type: "1f", value: 1.6},
    time : {type: "1f", value: 0},
    speed : {type: "v2", value: {x: 0.7, y: 0.4}}
  };
  var code;
  var smokeShader;
  var bg;
  var team;
  var count = 0;

  //SHADER_LOADER.load(
  function on_loaded(data) {
    code = data.smoke.fragment;
    // v3
    smokeShader = new PIXI.AbstractFilter(null, code, uniforms);
    // v4
    //smokeShader = new PIXI.Filter(null, code, uniforms);
    bg.filters = [smokeShader];
    bg.width = width;
    bg.height = height;
    stage.addChild(bg);
    // Team silhouette
    team = PIXI.Sprite.fromImage("textures/pixi/siluetas.png");
    team.anchor.set(0.5, 0.9);
    var textureRatio = 1920 / 441;
    var newWidth = renderer.width < 1280 ? 1280 : renderer.width;
    team.width = newWidth;
    team.height = newWidth / textureRatio * 1.1;
    team.x = renderer.width / 2;
    team.y = renderer.height;
    stage.addChild(team);
  }
  //);
  var resize = function () {
    if (verbose) console.log("App 2D: Resize handler called.");
    var screenWidth = window.innerWidth;
    var screenHeight = window.innerHeight;
    renderer.resize(screenWidth, screenHeight);
    bg.width = screenWidth;
    bg.height = screenHeight;
    //uniforms.resolution = {type: "v2", value: {x: screenWidth, y: screenHeight}};
    smokeShader.uniforms.resolution = {x: screenWidth, y: screenHeight};
    team.x = screenWidth / 2;
  };
  var init = function () {
    //The stage is the root container that will hold everything in our scene
    stage = new PIXI.Container();
    container = document.getElementById("app2d_cont");
    //Chooses either WebGL if supported or falls back to Canvas rendering
    renderer = new PIXI.autoDetectRenderer(width, height, {antialias: true, autoResize: true, transparent: true, resolution: 1});
    //renderer = new PIXI.autoDetectRenderer(width, height, container, true);
    renderer.view.className = "pixi";
    //Add the render view object into the page
    container.appendChild(renderer.view);
    bg = PIXI.Sprite.fromImage("textures/pixi/pixi.png");
    // Bind Events
    window.addEventListener("resize", resize, false);
    anim();
  };
  var anim = function () {
    // start the timer for the next animation loop
    requestAnimationFrame(anim);
    count += 0.01;
    if (typeof smokeShader != "undefined") {
      smokeShader.uniforms.time.value = count;
    }
    // this is the main render call that makes pixi draw your container and its children.
    renderer.render(stage);
  };
  return {
    init : init,
    anim : anim,
    on_loaded : on_loaded
  };
})();
