import * as THREE from 'three';
import BotObject from './BotObject.js';
import ArcadeObject from './ArcadeObject.js';

export default class ThreeScene {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    this.light = new THREE.PointLight(0xbababa, 1, 0);
    this.hemiLight = new THREE.HemisphereLight(0x443333, 0x111122);
    this.arcade = new ArcadeObject('../../textures/arcade.png', 'arcadeVideo');
    this.bot = new BotObject('../../obj/Bot.json', '../../textures/cube/4/');
    this.config();
    this.attach();
  }
  config() {
    this.camera.position.x = -11;
    var origin = new THREE.Vector3();
    this.camera.lookAt(origin);
    this.light.position.set(0, 200, 0);
  }
  attach() {
    this.scene.add(this.camera);
    this.scene.add(this.light);
    // this.scene.add(this.hemiLight);
    // this.scene.add(this.arcade.object);
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
