import * as THREE from 'three';
import ThreeScene from '../Models/ThreeScene.js';
import css from '../../css/three.css';

export default class ThreeController {
  constructor(container, properties = {}) {
    this.container = container;
    this.className = properties.className;
    this.verbose = properties.verbose;
    this.editor = properties.editor;
    this.renderer = new THREE.WebGLRenderer({
      antialias: false
    });
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.scene = new ThreeScene();
    this.config();
  }
  config() {
    // Container
    this.container.appendChild(this.renderer.domElement);
    this.container.className = this.className;
    var body = document.body;
    body.insertBefore(this.container, body.firstChild);
    // Renderer
    this.renderer.setClearColor(0x000000);
    this.renderer.autoClear = false;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;
    // Events
    window.addEventListener('resize', this.resize.bind(this), false);
    setInterval(this.animate.bind(this), 1000 / 30);
    // setInterval(function() {
    //   if (!document.webkitHidden)
    //     requestAnimationFrame(this.animate.bind(this));
    // }, 1000 / 30);
  }
  animate() {
    this.scene.animate();
    this.render();
  }
  render() {
    this.renderer.render(this.scene.scene, this.scene.camera);
  }
  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.renderer.setSize(this.width, this.height);
    this.scene.resize(this.width, this.height);
  }
}
