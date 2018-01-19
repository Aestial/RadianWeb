import * as THREE from 'three';
import BotObject from './BotObject.js';

export default class Scene {
  constructor() {
    this.scene = new THREE.Scene();
    this.fog = new THREE.FogExp2(0x000000, 0.077);
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    this.light = new THREE.PointLight(0xfffafa, 1, 0, 2);
    this.hemiLight = new THREE.HemisphereLight(0x404040, 0x1f1f1f);
    this.bot = new BotObject(
      'assets/meshes/bot.json',
      'assets/textures/cube/nice/',
      'assets/textures/arcade.png'
    );
    this.config();
    this.attach();
  }
  config() {
    this.scene.fog = this.fog;
    this.camera.position.x = -6.17403;
    var origin = new THREE.Vector3();
    this.camera.lookAt(origin);
    this.light.position.set(-80, -40, -55);
  }
  attach() {
    this.scene.add(this.camera);
    this.scene.add(this.light);
    this.scene.add(this.hemiLight);
    this.scene.add(this.bot.object);
  }
  animate() {
    this.bot.animate();
  }
  resize(width, height) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
}
