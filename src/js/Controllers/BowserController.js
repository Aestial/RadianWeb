import bowser from 'bowser';
import css from '../../css/bowser.css';

var config = {
  browser: bowser.chrome,
  version: 45
};
export default class BowserController {
  constructor(properties = {}) {
    this.verbose = properties.verbose;
    this.alert = properties.alert;
    this.browser = config.browser;
    this.version = config.version;
    this.showMessage();
  }
  showMessage() {
    if (this.verbose) {
      if (this.browser && this.version >= 45) {
        console.log("Full featured");
      } else {
        console.log("Restricted features");
      }
    }
    if (this.alert) {
      if (this.browser && this.version >= 45) {
        alert('Welcome to the full featured Radian website!');
      } else {
        alert('Limited features of this site. Please download the latest Google Chrome version.');
      }
    }
  }
}
