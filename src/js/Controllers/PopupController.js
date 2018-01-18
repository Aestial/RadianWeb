import $ from 'jquery';
import css from '../../css/popup.css';

var STATES = Object.freeze({Start:-1, Show:0, Hide:1});
var ANIM_CMD = ['fadeInRight', 'fadeOutRight'];
var BTN_TEXT = ['Cerrar', 'Ver más'];

export default class PopupController {
  constructor(properties = {}, defaultState = STATES.Hide) {
    this.verbose = properties.verbose;
    this.states = STATES;
    this.state = -1;
    this.playing = false;
    this.dom = $('#popup');
    this.button = $('.popup_toggle');
    //this.set(defaultState); //Hide
  }
  playAnim(state) {
    var command = ANIM_CMD[state];
    this.dom.animateOnce(command);
  }
  setText(state) {
    var text = BTN_TEXT[state];
    this.button.text(text);
  }
  update(state) {
    this.playAnim(state);
    this.setText(state);
  }
  set(state) {
    if (state != this.state) {
      this.state = state;
      if (this.verbose) console.log("POPUP: Setting to: " + state);
      this.update(state);
    }
  }
  toggle() {
    if (this.verbose) console.log("POPUP: Toggling");
    if (!this.playing) {
      var state = (this.state + 1) % 2;
      this.set(state);
      return !state;
    }
  }
  play() {
    this.playing = true;
  }
  stop() {
    this.playing = false;
  }
}
