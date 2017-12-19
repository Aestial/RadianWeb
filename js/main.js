// GLOBAL CONTROL
var debug = true;
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
