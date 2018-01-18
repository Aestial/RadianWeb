import * as THREE from 'three';

export default class ArcadeObject {
  constructor(path, videoId, parent = null) {
    this.path = path;
    this.videoId = videoId;
    this.parent = parent;
    // Video
    this.video = document.getElementById(this.videoId);
    // Loader
    this.loader = new THREE.TextureLoader(loader.manager);
    // Textures
    this.mainTexture = this.loader.load(path);
    this.videoTexture = new THREE.VideoTexture(this.video);
    // Materials
    this.mainMaterial = new THREE.SpriteMaterial({
      map: this.mainTexture
    });
    this.videoMaterial = new THREE.SpriteMaterial({
      map: this.videoTexture
    });
    // Sprites
    this.mainSprite = new THREE.Sprite(this.mainMaterial);
    this.videoSprite = new THREE.Sprite(this.videoMaterial);
    // Object
    this.object = new THREE.Object3D();
    this.config();
  }
  config() {
    // Textures
    this.videoTexture.minFilter = THREE.LinearFilter;
    this.videoTexture.magFilter = THREE.LinearFilter;
    this.videoTexture.format = THREE.RGBFormat;
    // Sprites
    this.mainSprite.scale.set(0.343, 0.859, 1);
    this.mainSprite.position.set(0, 0, 0);
    this.videoSprite.scale.set(0.285, 0.16, 1);
    this.videoSprite.position.set(0.015, 0.16, -0.01);
    // Object
    this.object.add(this.mainSprite);
    this.object.add(this.videoSprite);
    this.object.scale.set(10, 10, 1);
    this.object.position.set(5, 0, 0);
    this.object.rotation.set(0, Math.PI / 2, 0);
  }
}
