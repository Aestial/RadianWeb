var three = (function() {
  //var debug = require('./settings').debug;
  var debug = true;
  var verbose = false; // CONSOLE
  // Utils
  //if (!Detector.webgl) Detector.addGetWebGLMessage();
  var clock = new THREE.Clock(); //
  var renderer, container; //
  var obj_loader; //
  // Scene objects
  var camera, scene, parent, glowSocket;
  var object, oclObject;
  // Helper scenes
  var glowScene, glowParent, glowMesh, worldPos; // Glow emissive postprocessing scene
  // Materials
  var blackMat, whiteMat, redMat, emissiveMat;
  var objMaterials = [];
  var zoomBlurShader, zoomCenter; // Glow emissive
  var opacity; // Black transparent
  // Animation
  var mixer;
  var actions = [];
  var currentAction;
  // Arcade
  var arcade;
  var arcadeSprite;
  var arcadeMaterial;
  var videoSprite;
  var videoMaterial;
  // Video
  var video;
  var vText;
  // Mouse Input
  var mouseX = 0;
  var mouseY = 0;
  var targetX = 0;
  var targetY = 0;
  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;
  var SCREEN_WIDTH = window.innerWidth;
  var SCREEN_HEIGHT = window.innerHeight;
  // DEBUG. GUI
  var gui;

  var trigger_anim;

  var initGUI = function() {
    gui = new dat.GUI({
      height: 40 - 1
    });
    var black = gui.addFolder('Black Sphere');
    black.add(blackMat, 'roughness').min(0.0).max(1.0).step(0.001).name("Roughness");
    black.add(blackMat, 'metalness').min(0.0).max(1.0).step(0.001).name("Metalness");
    black.add(blackMat, 'opacity').min(0.0).max(1.0).step(0.0001).name("Opacity");
    black.add(blackMat, 'envMapIntensity').min(0.0).max(15.0).step(0.001).name("Reflect intensity");
    var white = gui.addFolder('White Sphere');
    white.add(whiteMat, 'roughness').min(0.0).max(1.0).step(0.001).name("Roughness");
    white.add(whiteMat, 'metalness').min(0.0).max(1.0).step(0.001).name("Metalness");
    white.add(whiteMat, 'envMapIntensity').min(0.0).max(12.0).step(0.001).name("Reflect intensity");
    var glow = gui.addFolder('Glow Effect');
    glow.add(compositeShader.uniforms.glowStrength, 'value').min(0.0).max(0.9).step(0.005).name("Glow strength");
    glow.add(zoomBlurShader.uniforms.strength, 'value').min(0.0).max(1.25).step(0.005).name("Blur strength");
  };

  var init = function() {
    // App3D container DOM
    container = document.createElement('div');
    container.className = "threecontainer";
    // RENDERER
    renderer = new THREE.WebGLRenderer({
      antialias: false
    });
    renderer.setClearColor(0x000000);
    renderer.autoClear = false;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    container.appendChild(renderer.domElement);
    // EVENTS
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);
    setInterval(function() {
      if (!document.webkitHidden) requestAnimationFrame(animate);
    }, 1000 / 30);

    // At beginning of the body:
    var body = document.body;
    body.insertBefore(container, body.firstChild);

    // SCENE AND CAMERA
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 12;
    scene = new THREE.Scene();
    glowScene = new THREE.Scene();
    // LIGHTS
    scene.add(new THREE.HemisphereLight(0x443333, 0x111122));
    var light = new THREE.PointLight(0xbababa, 1, 0);
    light.position.set(0, 200, 0);
    scene.add(light);

    // ARCADE
    // Video texture
    video = document.getElementById('arcadeVideo');
    vText = new THREE.VideoTexture(video);
    vText.minFilter = THREE.LinearFilter;
    vText.magFilter = THREE.LinearFilter;
    vText.format = THREE.RGBFormat;
    // Arcade texture
    var arcadeMap = new THREE.TextureLoader(loader.manager).load('textures/arcade.png');
    // Arcade materials
    arcadeMaterial = new THREE.SpriteMaterial({
      map: arcadeMap,
      color: 0xffffff
    });
    videoMaterial = new THREE.SpriteMaterial({
      map: vText
    });
    // Arcade object
    arcade = new THREE.Object3D();
    arcadeSprite = new THREE.Sprite(arcadeMaterial);
    videoSprite = new THREE.Sprite(videoMaterial);
    // Config Sprites
    videoSprite.scale.set(0.285, 0.16, 1);
    videoSprite.position.set(0.015, 0.16, -0.01);
    arcadeSprite.scale.set(0.343, 0.859, 1);
    arcadeSprite.position.set(0, 0, 0);
    // Config arcade
    arcade.add(arcadeSprite);
    arcade.add(videoSprite);
    arcade.scale.set(25, 25, 1);
    arcade.position.set(0, 0, -20);
    scene.add(arcade);

    // BOT
    parent = new THREE.Object3D();
    glowParent = new THREE.Object3D();
    glowSocket = new THREE.Object3D();
    worldPos = new THREE.Vector3();

    // REFLECTION
    var path = "textures/cube/4/";
    var format = '.png';
    var urls = [
      path + 'px' + format, path + 'nx' + format,
      path + 'py' + format, path + 'ny' + format,
      path + 'pz' + format, path + 'nz' + format
    ];

    var reflectionCube = new THREE.CubeTextureLoader(loader.manager).load(urls);
    reflectionCube.format = THREE.RGBFormat;

    baseTexture = new THREE.WebGLRenderTarget(SCREEN_WIDTH * 1.25, SCREEN_HEIGHT * 1.25, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBFormat
    });
    glowTexture = new THREE.WebGLRenderTarget(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBFormat
    });
    blurTexture = new THREE.WebGLRenderTarget(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBFormat
    });
    zoomCenter = new THREE.Vector2(SCREEN_WIDTH * 0.5, SCREEN_HEIGHT * 0.5);

    function OnShadersLoaded(data) {
      emissiveMat = new THREE.ShaderMaterial({
        vertexShader: data.emissive.vertex,
        fragmentShader: data.emissive.fragment
      });
      glowMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.7, 5), emissiveMat);
      glowScene.add(glowMesh);
      zoomBlurShader = new THREE.ShaderMaterial({
        uniforms: {
          tDiffuse: {
            type: "t",
            value: 0,
            texture: blurTexture
          },
          resolution: {
            type: "v2",
            value: new THREE.Vector2(window.innerWidth, window.innerHeight)
          },
          strength: {
            type: "f",
            value: 0.9
          },
          center: {
            type: "v2",
            value: zoomCenter
          }
        },
        vertexShader: data.ortho.vertex,
        fragmentShader: data.zoomblur.fragment,
        depthWrite: false
      });
      compositeShader = new THREE.ShaderMaterial({
        uniforms: {
          tBase: {
            type: "t",
            value: 0,
            texture: baseTexture
          },
          tGlow: {
            type: "t",
            value: 1,
            texture: blurTexture
          },
          glowStrength: {
            type: "f",
            value: 0.95
          }
        },
        vertexShader: data.ortho.vertex,
        fragmentShader: data.composite.fragment,
        depthWrite: false
      });
      orthoScene = new THREE.Scene();
      orthoCamera = new THREE.OrthographicCamera(1 / -2, 1 / 2, 1 / 2, 1 / -2, 0.00001, 1000.0);
      orthoQuad = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), zoomBlurShader);
      orthoScene.add(orthoQuad);
      if (debug) initGUI();
    }
    SHADER_LOADER.load(OnShadersLoaded);

    var obj2Mats = [];

    blackMat = new THREE.MeshStandardMaterial({
      color: 0x000000,
      roughness: 0.1,
      metalness: 1,
      envMap: reflectionCube,
      envMapIntensity: 0.4,
      transparent: true,
      opacity: 0.94
    });
    objMaterials.push(blackMat);
    whiteMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      //map: vText,
      roughness: 0.5,
      metalness: 0.5,
      envMap: reflectionCube,
      envMapIntensity: 0.16
    });
    redMat = new THREE.MeshStandardMaterial({
      color: 0xff0024,
      roughness: 0.1,
      metalness: 0.3,
      transparent: true,
      opacity: 0.8,
      emissive: 0.5
    });
    obj2Mats.push(whiteMat);
    obj2Mats.push(redMat);

    var oclMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000
    });
    glowSocket.position.set(0, -1.7, 0);
    objMaterials.push(obj2Mats);

    obj_loader = new THREE.ObjectLoader(loader.manager);
    obj_loader.load("obj/botanim.json", OnBotLoaded);

    function OnBotLoaded(obj) {
      oclObject = obj.clone(true);
      for (var i = 0; i < obj.children.length; i++) {
        oclObject.children[i].position = obj.children[i].position;
        oclObject.children[i].quaternion = obj.children[i].quaternion;
        oclObject.children[i].material = oclMaterial;
        switch (obj.children[i].name) {
          case "WhiteSphere":
            if (verbose) console.log("Socket added!");
            obj.children[i].add(glowSocket);
            oclObject.children[i].material = [oclMaterial, emissiveMat];
            break;
          default:
            break;
        }
        if (objMaterials[i] != null) {
          obj.children[i].material = objMaterials[i];
        }
      }
      object = obj;
      parent.add(object);
      object.rotation.set(0, Math.PI / 2, 0);
      scene.add(parent);

      glowParent.add(oclObject);
      oclObject.rotation.set(0, Math.PI / 2, 0);
      glowScene.add(glowParent);

      mixer = new THREE.AnimationMixer(object);
      var numAnim = object.animations.length;
      if (verbose) console.log("Total animations: " + numAnim);
      for (i = 0; i < numAnim; i++) {
        var newAction = mixer.clipAction(object.animations[i]);
        newAction.setLoop(THREE.LoopOnce);
        //newAction.timeScale = 1;
        newAction.weight = 0;
        newAction.clampWhenFinished = true;
        newAction.play();
        //newAction.pause();
        actions.push(newAction);
      }
    }
  };

  trigger_anim = function(index, delay) {
    var i = index - 1;
    if (verbose) console.log("Animation index: " + i);
    if (currentAction) {
      if (verbose) console.log(currentAction._clip.name);
      actions[i].reset();
      actions[i].weight = 1;
      currentAction.crossFadeTo(actions[i], 1);
      if (verbose) console.log("Has current action");
    } else {
      //mixer.stopAllAction();
      //actions[i].play();
      actions[i].weight = 1;
      actions[i].reset();
      actions[i].startAt(mixer.time + delay).play();
      if (verbose) console.log("First action");
    }
    currentAction = actions[i];
  };
  // EVENT HANDLERS
  function onWindowResize(event) {
    SCREEN_WIDTH = window.innerWidth;
    SCREEN_HEIGHT = window.innerHeight;
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
    camera.updateProjectionMatrix();
    zoomBlurShader.uniforms.resolution.value = new THREE.Vector2(SCREEN_WIDTH, SCREEN_HEIGHT);

    baseTexture.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    glowTexture.setSize(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
    blurTexture.setSize(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);

    orthoQuad.scale.set(SCREEN_WIDTH, SCREEN_HEIGHT, 1);
    orthoCamera.left = -SCREEN_WIDTH / 2;
    orthoCamera.right = SCREEN_WIDTH / 2;
    orthoCamera.top = SCREEN_HEIGHT / 2;
    orthoCamera.bottom = -SCREEN_HEIGHT / 2;
    orthoCamera.updateProjectionMatrix();
  }

  function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
  }
  //
  function animate() {
    targetX = mouseX * 0.0005;
    targetY = mouseY * 0.0005;
    if (parent) {
      parent.rotation.y += 0.1 * (targetX - parent.rotation.y);
      parent.rotation.x += 0.1 * (targetY - parent.rotation.x);
    }
    if (typeof glowMesh != "undefined") {
      glowMesh.position.x = glowSocket.getWorldPosition().x;
      glowMesh.position.y = glowSocket.getWorldPosition().y;
      glowMesh.position.z = glowSocket.getWorldPosition().z;
    }
    // Parents rotations
    glowParent.rotation.x = parent.rotation.x;
    glowParent.rotation.y = parent.rotation.y;
    glowParent.rotation.z = parent.rotation.z;

    if (typeof object != "undefined") {
      for (var i = 0; i < object.children.length; i++) {
        // Position
        oclObject.children[i].position.x = object.children[i].position.x;
        oclObject.children[i].position.y = object.children[i].position.y;
        oclObject.children[i].position.z = object.children[i].position.z;
        // Scale
        oclObject.children[i].scale.x = object.children[i].scale.x;
        oclObject.children[i].scale.y = object.children[i].scale.y;
        oclObject.children[i].scale.z = object.children[i].scale.z;
        // Rotation
        oclObject.children[i].rotation.x = object.children[i].rotation.x;
        oclObject.children[i].rotation.y = object.children[i].rotation.y;
        oclObject.children[i].rotation.z = object.children[i].rotation.z;
        switch (object.children[i].name) {
          case "WhiteSphere":
            glowMesh.scale.x = object.children[i].scale.x;
            glowMesh.scale.y = object.children[i].scale.y;
            glowMesh.scale.z = object.children[i].scale.z;
            break;
          default:
            break;
        }
      }
      //glowMesh.getWorldPosition ( worldPos );
      object.getWorldPosition(worldPos);
      worldPos.project(camera);
      worldPos.x = (worldPos.x * windowHalfX) + windowHalfX;
      worldPos.y = -(worldPos.y * windowHalfY) + windowHalfY;
      worldPos.z = 0;
      zoomCenter.set(worldPos.x, worldPos.y);
    }
    if (typeof mixer != "undefined") mixer.update(clock.getDelta());
    render();
  }
  function render() {
    renderer.render(glowScene, camera, glowTexture, true);
    renderer.render(scene, camera, baseTexture, true);
    if (typeof zoomBlurShader != "undefined") {
      orthoQuad.material = zoomBlurShader;
      orthoQuad.material.uniforms.tDiffuse.value = glowTexture.texture;
      orthoQuad.material.uniforms.center.value = zoomCenter;
      renderer.render(orthoScene, orthoCamera, blurTexture, false);
    }
    if (typeof zoomBlurShader != "undefined") {
      orthoQuad.material = compositeShader;
      orthoQuad.material.uniforms.tBase.value = baseTexture.texture;
      orthoQuad.material.uniforms.tGlow.value = blurTexture.texture;
      renderer.render(orthoScene, orthoCamera);
    }
  }
  return {
    init: init,
    trigger_anim: trigger_anim
  };
})();
