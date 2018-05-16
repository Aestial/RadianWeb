import * as THREE from 'three';
import ShaderLoader from '../Libraries/ShaderLoader.js';

export default class RenderPlane {
  constructor(renderer, resolution = 1,  layer = 0) {
    this.renderer = renderer;
    this.layer = layer + 1;
    this.resolution = resolution;
    this.width = this.renderer.getSize().width * this.resolution;
    this.height = this.renderer.getSize().height * this.resolution;
    this.rt = new THREE.WebGLRenderTarget(this.width, this.height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBFormat
    });
    this.texture = this.rt.texture;
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(1 / -2, 1 / 2, 1 / 2, 1 / -2, 0.00001, 1000.0);
    this.camera.layers.set(this.layer);
    this.plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1));
    this.plane.layers.set(this.layer);
    ShaderLoader.load(this.onLoaded.bind(this));
  }
  get material() {
    return this._material;
  }
  set material(newMaterial) {
    this._material = newMaterial;
    console.log("Render Plane changed material: ", this._material);
    this.plane.material = this._material;
  }
  onLoaded(data) {
    this._material = new THREE.ShaderMaterial({
      uniforms: {
        tex: new THREE.Uniform(this.texture)
      },
      vertexShader: data.ortho.vertex,
      fragmentShader: data.ortho.fragment,
      depthWrite: false
    });
    this.plane.material = this._material;
    this.attach();
  }
  attach() {
    this.scene.add(this.plane);
  }
  render(scene, camera) {
    this.renderer.render(scene, camera, this.rt, true);
    this.renderer.render(this.scene, this.camera);
  }
}
