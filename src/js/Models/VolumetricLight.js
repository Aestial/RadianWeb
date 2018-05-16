import * as THREE from 'three';
import RenderPlane from '../Models/RenderPlane.js';
import ShaderLoader from '../Libraries/ShaderLoader.js';

export default class VolumetricLight {
  constructor(color) {
    this.color = color;
    this.geometry = new THREE.IcosahedronGeometry(1, 3);
    this.scene = new THREE.Scene();
    // Materials
    this.materials = {};
    // Render plane
    ShaderLoader.load(this.onLoaded.bind(this));
  }
  onLoaded(data) {
    this.materials.emissive = new THREE.ShaderMaterial({
      uniforms: {
        color: new THREE.Uniform(this.color)
      },
      vertexShader: data.emissive.vertex,
      fragmentShader: data.emissive.fragment,
      depthWrite: false
    });
    this.mesh = new THREE.Mesh(this.geometry, this.materials.emissive);
    this.scene.add(this.mesh);

    console.log(data.zoomblur.fragment);
    this.materials.zoomblur = new THREE.ShaderMaterial({
      uniforms: {
        tex: new THREE.Uniform(this.rt.base.texture),
        resolution: new THREE.Uniform(new THREE.Vector2(this.width, this.height)),
        strength: 0.9,
        center: new THREE.Uniform(new THREE.Vector2(this.width / 2, this.height / 2))
      },
      vertexShader: data.ortho.vertex,
      fragmentShader: data.ortho.fragment,
      depthWrite: false
    });
  }
}
