// GLOBAL CONTROL
var debug = true;
// Dog images:
var imageNames = ["French.jpg","Dog.jpg","Chilaquil.jpg","Pug.jpg"];
// MAIN ON LOADED (Javascript method)
window.addEventListener( 'load', onWindowLoaded, false );
function onWindowLoaded() {
  // browser.init();
  loader.init();
  popup.init();
  fullpage.init();
  three.init();
  //pixi_init();
}
