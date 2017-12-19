// GLOBAL CONTROL
var debug = false;
// Methods
var init = function () {
  // browser.init();
  loader.init();
  vimeo.init();
  popup.init();
  fullpage.init();
  three.init();
  two.init();
};
// Window load event: "all" resources
window.addEventListener('load', init, false);
