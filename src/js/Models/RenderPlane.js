import * as THREE from 'three';
import loader from '../Libraries/ShaderLoader.js';

export default class RenderPlane {
  constructor(width, height) {
    this.resolution = 1;
    this.width = width * this.resolution;
    this.height = height * this.resolution;
    console.log("Render Target resolution: ", this.width, this.height);
    this.rt = new THREE.WebGLRenderTarget(this.width, this.height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBFormat
    });
    loader.load(this.onloaded.bind(this));
  }
  attach() {
    this.scene.add(this.plane);
  }
  onloaded(data) {
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        tex: new THREE.Uniform(this.rt.texture)
      },
      vertexShader: data.ortho.vertex,
      fragmentShader: data.ortho.fragment,
      depthWrite: false
    });
    this.plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), this.material);
    this.camera = new THREE.OrthographicCamera(1 / -2, 1 / 2, 1 / 2, 1 / -2, 0.00001, 1000.0);
    this.scene = new THREE.Scene();
    this.attach();
  }
}
