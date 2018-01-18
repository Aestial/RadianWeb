import Player from '@vimeo/player';
import css from '../../css/vimeo.css';

var WIDTHS = [128, 256, 384, 512, 640, 768, 896, 1024];

export default class VimeoController {
  constructor(properties = {}) {
    this.verbose = properties.verbose;
    this.id = '';
    this.player = new Player('vimeo');
    this.color = this.player.getColor();
    this.player.on('loaded', this.onLoaded.bind(this));
    this.player.on('ended', this.onEnded.bind(this));
    this.player.on('play', this.onPlay.bind(this));
    this.player.on('pause', this.onPause.bind(this));
    this.player.getVideoTitle().then(function(title) {
      if (properties.verbose) console.log('VIMEO: Title:', title);
    });
  }
  onLoaded(data) {
    if (this.verbose) console.log('VIMEO: Video loaded');
  }
  onPlay(data) {
    if (this.verbose) console.log('VIMEO: Video played');
  }
  onTimeUpdate(data) {
    var percent = data.percent;
    if (this.verbose) console.log('VIMEO: Video progress:', percent);
  }
  onPause(data) {
    if (this.verbose) console.log('VIMEO: Video paused');
  }
  onEnded(data) {
    if (this.verbose) console.log('VIMEO: Video ended');
    set(this.id);
  }
  pause() {
    this.player.pause();
  }
  set(newId) {
    // TODO: PROMISES! AND CODE FOR OPTIONS :/
    this.id = newId;
    this.player.loadVideo(this.id).then(function(id) {
      // the video successfully loaded
      if (this.verbose) console.log('VIMEO: loaded ID:', id);
      // TODO: OPTIONS!!:
      this.player.setColor(this.color);
      this.player.getVideoTitle().then(function(title) {
        if (this.verbose) console.log('VIMEO: Title:', title);
      });
    }).catch(function(error) {
      switch (error.name) {
        case 'TypeError':
          // the id was not a number
          break;
        case 'PasswordError':
          // the video is password-protected and the viewer needs to enter the
          // password first
          break;
        case 'PrivacyError':
          // the video is password-protected or private
          break;
        default:
          // some other error occurred
          break;
      }
    });
  }
}
