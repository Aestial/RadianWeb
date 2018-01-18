import $ from 'jquery';
import 'fullpage.js/dist/jquery.fullpage';
import 'fullpage.js/dist/jquery.fullpage.css';

import fadingFX from '../../css/fullPageFX.css';

export default class FullPageController {
  constructor(properties = {}) {
    this.verbose = properties.verbose;
    var config = {
      sectionsColor: ['rgba(0,0,0,0)'],
      anchors: ['aboutus', 'edesign', 'vfx', 'videogames', 'contact'],
      recordHistory: false,
      menu: '#menu',
      scrollingSpeed: 2000,
      onLeave: this.onLeave,
      afterRender: this.afterRender,
      afterResize: this.afterResize,
      afterLoad: this.afterLoad
    };
    $('#fullpage').fullpage(config);
    $.fn.fullpage.setAllowScrolling(false);
  }
  onLeave(index, nextIndex, direction) {
    if (this.verbose) console.log("fullPage: onLeave--" + "index: " + index + " nextIndex: " + nextIndex + " direction: " +  direction);
    // ++ TODO: REMOVE THIS DEPENDENCIES!!!:
    if (loader.entered) {
      popup.set(popup.states.Hide);
      vimeo.pause();
    }
    // ++
  }
  afterLoad(anchorLink, index) {
    if (this.verbose) console.log("fullPage: afterLoad--" + "anchorLink: " + anchorLink + " index: " + index );
    // ++ TODO: REMOVE THIS DEPENDENCIES!!!:
    if (loader.entered) {
      three.scene.bot.playAnimation(index-1);
    }
    // ++
  }
  afterRender() {
    if (this.verbose) console.log("fullPage: afterRender");
  }
  afterResize() {
    if (this.verbose) console.log("fullPage: afterResize");
  }
}
