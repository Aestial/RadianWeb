import $ from 'jquery';
import * as THREE from 'three';

import css from '../../css/loader.css';
import bar_css from '../../css/loading-bar.css';

export default class LoaderController {
  constructor(control, properties = {}) {
    this.control = control;
    this.verbose = properties.verbose;
    this.loaded = false;
    this.entered = false;
    this.logo = $('#logo');
    this.bar = $('#loadBar');
    this.dom = $('#loadScreen');
    this.logo.hover(this.onEnter.bind(this));
    this.manager = new THREE.LoadingManager();
    this.manager.onStart = this.onStart.bind(this);
    this.manager.onLoad = this.onLoad.bind(this);
    this.manager.onProgress = this.onProgress.bind(this);
    this.manager.onError = this.onError.bind(this);
  }
  onStart(item, loaded, total) {
    if (this.verbose) console.log('LOADER: Loading started');
  }
  onLoad() {
    if (this.verbose) console.log('LOADER: Loading complete');
    this.logo.animateOnce('tada');
    this.bar.animateOnce('fadeOut');
    // ++ TODO: REMOVE THIS DEPENDENCIES:
    popup.set(popup.states.Hide);
    $.fn.fullpage.silentMoveTo('aboutus');
    // ++
    this.loaded = true;
  }
  onProgress(item, loaded, total) {
    this.control.set((loaded * 100.0) / total * 1.0);
  }
  onError(url) {
    if (this.verbose) console.log('LOADER: Error loading');
  }
  onEnter() {
    if (this.loaded && !this.entered) {
      this.dom.animateOnce('fadeOut');
      // ++ TODO: REMOVE THIS DEPENDENCIES!!!:
      three.scene.bot.playAnimation(0);
      pixi.animate();
      $.fn.fullpage.setAllowScrolling(true);
      // ++
      this.entered = true;
    }
  }
}
