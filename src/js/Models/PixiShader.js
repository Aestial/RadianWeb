import PIXI from 'pixi.js';
import loader from '../Libraries/ShaderLoader.js';

export default class PixiShader {
  constructor(sprite, properties = {}) {
    this.sprite = sprite;
    this.uniforms = properties.uniforms;
    this.width = properties.width;
    this.height = properties.height;
    this.counter = 0;
    this.code = null;
    loader.load(this.onloaded.bind(this));
  }
  update(delta) {
    this.counter += delta;
    this.shader.uniforms.time.value = this.counter;
  }
  onloaded(data) {
    this.code = data.smoke.fragment;
    this.shader = new PIXI.AbstractFilter(null, this.code, this.uniforms);
    this.sprite.filters = [this.shader];
    this.sprite.width = this.width;
    this.sprite.height = this.height;
  }
  resize(width, height) {
    this.sprite.width = width;
    this.sprite.height = height;
    this.shader.uniforms.resolution = {
      x: width,
      y: height
    };
  }
}
