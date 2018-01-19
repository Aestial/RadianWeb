import BowserController from './Controllers/BowserController.js';
import ContactController from './Controllers/ContactController.js';
import FullPageController from './Controllers/FullPageController.js';
import LoaderController from './Controllers/LoaderController.js';
import PixiController from './Controllers/PixiController.js';
import PopupController from './Controllers/PopupController.js';
import ThreeController from './Controllers/ThreeController.js';
import VimeoController from './Controllers/VimeoController.js';
import $ from 'jquery';

import reset from '../css/reset.css';
import style from '../css/style.css';
import fonts from '../css/fonts.css';
import glitch from '../css/glitch.scss';

require('./Libraries/loading-bar.js');
require('./Libraries/jquery-extents.js');

var settings = require('./Data/settings.js');
var debug = settings.debug;

var init = function() {
  var loader_control = document.getElementById('loadBar').ldBar;
  var pixi_container = document.getElementById('pixi_cont');
  var three_container = document.createElement('div');
  // Controllers
  var loader = new LoaderController(loader_control, {
    verbose: debug
  });
  window.loader = loader;
  var bowser = new BowserController({
    verbose: debug
  });
  var contact = new ContactController({
    verbose: debug
  });
  var popup = new PopupController({
    verbose: debug
  });
  window.popup = popup;
  var fullPage = new FullPageController({
    verbose: debug
  });
  var pixi = new PixiController(pixi_container, {
    className: "pixi",
    verbose: debug
  });
  window.pixi = pixi;
  var vimeo = new VimeoController({
    verbose: debug
  });
  window.vimeo = vimeo;
  var three = new ThreeController(three_container, {
    className: "three",
    verbose: debug
  });
  window.three = three;
};
// Window load event: "all" resources
window.addEventListener('load', init, false);
