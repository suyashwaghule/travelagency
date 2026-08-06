/* ==========================================================================
   Sangitam Travels — Epic Full-Screen GLB 3D World Engine
   Scales waterfall_mountain_river.glb to cover maximum page width & depth
   ========================================================================== */

let scene, camera, renderer, environmentGroup;
let targetCameraPos = { x: 0, y: 3.5, z: 9.0 };
let targetCameraLookAt = { x: 0, y: 1.0, z: 0 };
let currentCameraPos = { x: 0, y: 3.5, z: 9.0 };
let currentCameraLookAt = { x: 0, y: 1.0, z: 0 };
let mouseX = 0, mouseY = 0;

function initThreeWorld() {
  const container = document.getElementById('webgl-canvas-container');
  if (!container) return;

  // 1. SCENE SETUP
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xFAF8F5, 0.008);

  // 2. CAMERA SETUP (Wider perspective to cover maximum screen background)
  camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 3.5, 9.0);

  // 3. RENDERER SETUP
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  container.appendChild(renderer.domElement);

  // 4. LIGHTING SYSTEM
  setupLighting();

  // 5. LOAD USER'S CUSTOM GLB MODEL WITH EXPANDED SCALE
  loadCustomGLBModel();

  // 6. ATMOSPHERIC PARTICLES
  createParticleAtmosphere();

  // 7. EVENT LISTENERS
  window.addEventListener('resize', onWindowResize);
  window.addEventListener('mousemove', onMouseMove);

  // 8. SCROLLTRIGGER GSAP INTEGRATION
  setupScrollCameraAnimation();

  // 9. ANIMATION LOOP
  animateThreeWorld();
}

/* LIGHTING SYSTEM */
function setupLighting() {
  const ambientLight = new THREE.AmbientLight(0xFFFAF0, 1.8);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xF3E8DE, 2.8);
  sunLight.position.set(40, 60, 40);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  scene.add(sunLight);

  const rimLight = new THREE.PointLight(0x8B263E, 5.0, 50);
  rimLight.position.set(-25, 20, -20);
  scene.add(rimLight);
}

/* LOAD USER'S GLB FILE WITH EXPANDED FULL-SCREEN SCALE */
function loadCustomGLBModel() {
  environmentGroup = new THREE.Group();
  scene.add(environmentGroup);

  if (typeof THREE.GLTFLoader !== 'undefined') {
    const gltfLoader = new THREE.GLTFLoader();

    if (typeof THREE.DRACOLoader !== 'undefined') {
      const dracoLoader = new THREE.DRACOLoader();
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
      gltfLoader.setDRACOLoader(dracoLoader);
    }

    gltfLoader.load(
      'waterfall_mountain_river.glb',
      function (gltf) {
        const model = gltf.scene;

        // Compute model dimensions & scale up to cover maximum page background
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.z);
        // Expand scale factor significantly (85 units) to stretch across screen background
        const scaleFactor = 85 / (maxDim || 1);
        model.scale.set(scaleFactor, scaleFactor * 0.9, scaleFactor);

        // Center geometry nicely inside viewport
        model.position.x = -center.x * scaleFactor;
        model.position.y = -center.y * (scaleFactor * 0.9) - 4.5;
        model.position.z = -center.z * scaleFactor;

        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              child.material.envMapIntensity = 1.4;
            }
          }
        });

        environmentGroup.add(model);
      },
      undefined,
      function (error) {
        console.warn('GLTF loading notice:', error);
      }
    );
  }
}

/* DUST PARTICLES */
function createParticleAtmosphere() {
  const particleCount = 900;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 120;
    positions[i + 1] = Math.random() * 50;
    positions[i + 2] = (Math.random() - 0.5) * 160;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: 0x8B263E,
    size: 0.28,
    transparent: true,
    opacity: 0.4
  });

  const particlesMesh = new THREE.Points(geometry, material);
  scene.add(particlesMesh);
}

/* SCROLL CAMERA ORBIT & PARALLAX GLIDE */
function setupScrollCameraAnimation() {
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;

    // Wide camera orbit to sweep across the full-width mountain river landscape
    const angle = progress * Math.PI * 1.2;
    const radius = 10.0;

    targetCameraPos.x = Math.sin(angle) * radius + mouseX * 1.5;
    targetCameraPos.y = 3.5 + progress * 6.0 + mouseY * 0.8;
    targetCameraPos.z = Math.cos(angle) * radius;

    targetCameraLookAt.x = 0;
    targetCameraLookAt.y = 0.5;
    targetCameraLookAt.z = 0;
  }, { passive: true });
}

/* MOUSE CONTROLS */
function onMouseMove(event) {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

/* ANIMATION LOOP */
function animateThreeWorld() {
  requestAnimationFrame(animateThreeWorld);

  currentCameraPos.x += (targetCameraPos.x - currentCameraPos.x) * 0.04;
  currentCameraPos.y += (targetCameraPos.y - currentCameraPos.y) * 0.04;
  currentCameraPos.z += (targetCameraPos.z - currentCameraPos.z) * 0.04;

  currentCameraLookAt.x += (targetCameraLookAt.x - currentCameraLookAt.x) * 0.04;
  currentCameraLookAt.y += (targetCameraLookAt.y - currentCameraLookAt.y) * 0.04;
  currentCameraLookAt.z += (targetCameraLookAt.z - currentCameraLookAt.z) * 0.04;

  camera.position.set(currentCameraPos.x, currentCameraPos.y, currentCameraPos.z);
  camera.lookAt(currentCameraLookAt.x, currentCameraLookAt.y, currentCameraLookAt.z);

  if (environmentGroup) {
    environmentGroup.rotation.y += 0.0012;
  }

  renderer.render(scene, camera);
}

document.addEventListener('DOMContentLoaded', initThreeWorld);
