import * as THREE from 'three';
import ArcadeObject from './ArcadeObject.js';

export default class BotObject {
  constructor(path, cubeTexturePath, parent = null) {
    this.parent = parent;
    // Object
    this.object = new THREE.Object3D();
    if (this.parent != null) this.parent.add(this.object);
    // Loader
    this.path = path;
    this.loader = new THREE.ObjectLoader(loader.manager);
    this.loader.load(path, this.onLoaded.bind(this));
    // Textures
    this.textures = {};
    this.textures.arcade = new THREE.TextureLoader(loader.manager).load('../../textures/arcade.png');
    this.textures.reflexion = {};
    this.textures.reflexion.path = cubeTexturePath;
    this.textures.reflexion.format = '.jpg';
    this.textures.reflexion.urls = [
      this.textures.reflexion.path + 'px' + this.textures.reflexion.format,
      this.textures.reflexion.path + 'nx' + this.textures.reflexion.format,
      this.textures.reflexion.path + 'py' + this.textures.reflexion.format,
      this.textures.reflexion.path + 'ny' + this.textures.reflexion.format,
      this.textures.reflexion.path + 'pz' + this.textures.reflexion.format,
      this.textures.reflexion.path + 'nz' + this.textures.reflexion.format
    ];
    this.textures.reflexion.cube = new THREE.CubeTextureLoader(loader.manager).load(this.textures.reflexion.urls);
    // Materials
    this.materials = {};
    this.materials.black = new THREE.MeshStandardMaterial({
      color: 0x060606,
      roughness: 0.1,
      metalness: 0.8,
      envMap: this.textures.reflexion.cube,
      envMapIntensity: 1.5
      // transparent: true,
      // opacity: 0.93
    });
    this.materials.white = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.18,
      metalness: 0.8,
      envMap: this.textures.reflexion.cube,
      envMapIntensity: 0.65
    });
    this.materials.red = new THREE.MeshStandardMaterial({
      color: 0xff0024,
      roughness: 0.1,
      metalness: 0.3,
      transparent: true,
      opacity: 0.8,
      emissive: 0.5
    });
    this.materials.edesign = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      transparent: true
    });
    this.materials.edesign.needsUpdate = true;
    this.materials.vfx = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      transparent: true
    });
    this.materials.vfx.needsUpdate = true;
    // Animation
    this.clock = new THREE.Clock();
    this.actions = [];
    this.currentAction = null;
    this.config();
    // Arcade
    this.arcadeObject = new ArcadeObject('../../textures/arcade.png', 'arcadeVideo');
  }
  config() {
    this.textures.reflexion.cube.format = THREE.RGBFormat;
    this.materials.edesign.side = THREE.DoubleSide;
    this.materials.vfx.side = THREE.DoubleSide;
  }
  animate() {
    if (typeof this.mixer != "undefined") {
      this.mixer.update(this.clock.getDelta());
    }
  }
  onLoaded(scene) {
    // this.bot = object;
    this.scene = scene;
    this.bot = this.scene.children[0];
    this.bot.children[0].material = this.materials.black;
    this.bot.children[1].material = [
      this.materials.white,
      this.materials.red
    ];
    this.edesign = this.scene.children[1];
    this.vfx = this.scene.children[2];
    this.arcade = this.scene.children[3];
    this.edesign.material = this.materials.edesign;
    this.vfx.material = this.materials.vfx;
    this.arcade.add(this.arcadeObject.object);
    this.object.add(this.scene);

    this.mixer = new THREE.AnimationMixer(this.scene);
    var numAnim = this.scene.animations.length;
    for (var i = 0; i < numAnim; i++) {
      var newAction = this.mixer.clipAction(this.scene.animations[i]);
      newAction.setLoop(THREE.LoopOnce);
      newAction.clampWhenFinished = true;
      newAction.timeScale = 1;
      newAction.weight = 0;
      this.actions.push(newAction);
    }
  }
  playAnimation(index) {
    this.appearObjets(index);
    this.actions[index].weight = 1;
    this.actions[index].reset();
    if (this.currentAction == null){
      this.actions[index].play();
      console.log("BOT: Playing Animation: " + index);

    } else {
      this.actions[index].play();
      this.currentAction.crossFadeTo(this.actions[index], 1);
      console.log("BOT: Fading to Animation: " + index);
    }
    this.currentAction = this.actions[index];
  }
  appearObjets(index) {
    console.log("Aperaing objecets" + index);
    this.materials.vfx.opacity = (index == 2) ? 1.0:0.0;
    this.materials.edesign.opacity = (index == 1) ? 1.0:0.0;
    console.log(this.materials.edesign.opacity);
  }
}
