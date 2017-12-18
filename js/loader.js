var loader = (function(){
  var manager = new THREE.LoadingManager();
  var is_loaded = false;
  var dom;
  var logo;
  var bar;
  var control;

  var init = function () {
    console.log("INIT: loader");
    logo = $('#logo');
    bar = $('#loadBar');
    dom = $('#loadScreen');
    control = document.getElementById('loadBar').ldBar;
    logo.hover(on_enter);
    manager.onStart = on_start;
    manager.onLoad = on_load;
    manager.onProgress = on_progress;
    manager.onError = on_error;
  };
  var get_manager = function () {
    return manager;
  };
  var get_loaded = function () {
    console.log(is_loaded);
    return is_loaded;
  };
  // Manager Handlers
  var on_start = function (item, loaded, total) {
    console.log('Loading started');
  };
  var on_load = function () {
    console.log('Loading complete');
    logo.animateOnce('tada');
    bar.animateOnce('fadeOut');
    is_loaded = true;
    console.log("Onload"+ loaded);
    // TODO: REMOVE THIS DEPENDENCY!!
    if (!debug) {
      $('#fullpage').fullpage.moveTo('aboutus');
    }
  };
  var on_progress = function (item, loaded, total) {
    control.set((loaded*100.0)/total*1.0);
  };
  var on_error = function (url) {
    console.log( 'Error loading' );
  };
  var on_enter = function () {
    dom.animateOnce('fadeOut');
    // ++++ TODO: REMOVE THIS DEPENDENCIES!!
    //if (debug) initGUI();
    // animate();
    // pixi_animate();
    $.fn.fullpage.setAllowScrolling(true);
    // ++++
  };
  return {
    get_manager : get_manager,
    get_loaded : get_loaded,
    init : init
  };
})();
