import * as THREE from 'three';

export default class VolumetricLight {
  constructor(object, renderer) {
    this.object = object;
    this.renderer = renderer;
    this.width = this.renderer.getSize().width;
    this.width = this.renderer.getSize().height;
    this.scene = new THREE.Scene();
    this.rt = new THREE.WebGLRenderTarget(this.width, this.height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBFormat
    });
  }
}
