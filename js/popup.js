var popup = (function(){
  var STATES = Object.freeze({Start:-1, Show:0, Hide:1});
  var ANIM_CMD = ['fadeInRight','fadeOutRight'];
  var BTN_TEXT = ['Cerrar','Ver más'];
  var dom;
  var button;
  var state;
  var playing;
  // Private methods
  var _animate = function (state) {
    var command = ANIM_CMD[state];
    dom.animateOnce(command);
  };
  var _set_text = function () {
    var text = BTN_TEXT[state];
    button.text(text);
  };
  var _update = function () {
    _animate(state);
    _set_text(state);
  };
  // Public methods
  var init = function () {
    console.log("INIT: popup");
    dom = $('#popup');
    button = $('.popup_toggle');
    state = STATES.Start;
  };
  var set = function (newState) {
    if (newState != state) {
      state = newState;
      _update(state);
    }
  };
  var toggle = function () {
    if (!playing) {
      newState = (state + 1) % 2;
      set(newState);
    }
  };
  var play = function () {
    playing = true;
  };
  var stop = function () {
    playing = false;
  };
  return {
    init : init,
    set : set,
    toggle : toggle,
    play : play,
    stop : stop
  };
})();
//dom.css({"background-image": "url('images/"+imageName+"')"});
