import PIXI from 'pixi.js';
import PixiShader from '../Models/PixiShader.js';
import css from '../../css/pixi.css';

export default class PixiController {
  constructor(container, properties = {}) {
    this.container = container;
    this.verbose = properties.verbose;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.stage = new PIXI.Container();
    this.renderer = new PIXI.autoDetectRenderer(this.width, this.height, {
      antialias: true,
      autoResize: true,
      transparent: true,
      resolution: 1
    });
    this.renderer.view.className = properties.className;
    this.container.appendChild(this.renderer.view);
    // SMOKE
    this.smoke = PIXI.Sprite.fromImage("assets/textures/pixi/pixi.png");
    this.smokeShader = new PixiShader(this.smoke, {
      uniforms: require('../Data/uniforms.js').smoke,
      width: window.innerWidth,
      height: window.innerHeight
    });
    this.stage.addChild(this.smoke);
    // TEAM
    this.team = PIXI.Sprite.fromImage("assets/textures/pixi/siluetas.png");
    this.team.anchor.set(0.5, 0.9);
    var textureRatio = 1920 / 441;
    var newWidth = this.renderer.width < 1280 ? 1280 : this.renderer.width;
    this.team.width = newWidth;
    this.team.height = newWidth / textureRatio * 1.1;
    this.team.x = this.renderer.width / 2;
    this.team.y = this.renderer.height;
    this.stage.addChild(this.team);
    window.addEventListener("resize", this.resize.bind(this), false);
  }
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.smokeShader.update(0.01);
    this.renderer.render(this.stage);
  }
  resize() {
    if (this.verbose) console.log("App 2D: Resize handler called.");
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.renderer.resize(this.width, this.height);
    this.smokeShader.resize(this.width, this.height);
    this.team.x = this.width/2;
    this.team.y = this.height;
  }
}
