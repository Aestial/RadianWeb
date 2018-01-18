import * as THREE from 'three';

export default class BotObject {
  constructor(path, cubeTexturePath, parent = null) {
    this.parent = parent;
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
    this.textures.reflexion.format = '.png';
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
      color: 0x000000,
      roughness: 0.1,
      metalness: 1,
      envMap: this.textures.reflexion.cube,
      envMapIntensity: 0.4,
      transparent: true,
      opacity: 0.94
    });
    this.materials.white = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.5,
      metalness: 0.5,
      envMap: this.textures.reflexion.cube,
      envMapIntensity: 0.16
    });
    this.materials.red = new THREE.MeshStandardMaterial({
      color: 0xff0024,
      roughness: 0.1,
      metalness: 0.3,
      transparent: true,
      opacity: 0.8,
      emissive: 0.5
    });
    // Sprites
    this.materials.edesign = new THREE.MeshBasicMaterial({
      color: 0x00ff00
    });
    this.materials.vfx = new THREE.MeshBasicMaterial({
      color: 0xff00ff
    });
    this.materials.arcade = new THREE.MeshBasicMaterial({
      map: this.textures.arcade
    });
    // Animation
    this.clock = new THREE.Clock();
    this.actions = [];
    this.currentAction = null;
    this.config();
  }
  config() {
    this.textures.reflexion.cube.format = THREE.RGBFormat;
    this.materials.edesign.side = THREE.DoubleSide;
    this.materials.vfx.side = THREE.DoubleSide;
    this.materials.arcade.side = THREE.DoubleSide;
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
    this.arcade.material = this.materials.arcade;
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
    console.log("Object Total animations: " + numAnim);
  }
  playAnimation(index) {
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
}
