/* =====================================================================
   FELICITY IDC — SIGNATURE 3D SCENE
   One proprietary object (F frame + rack + fibre ring + power path +
   cooling blades + modular block) that assembles, explodes, extends,
   rises and contracts as the user scrolls through the narrative.
===================================================================== */
(function(){
  const canvas = document.getElementById('scene-canvas');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let webglAvailable = true;
  try{
    const testCanvas = document.createElement('canvas');
    webglAvailable = !!(window.WebGLRenderingContext &&
      (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl')));
  }catch(e){ webglAvailable = false; }

  if(!webglAvailable || typeof THREE === 'undefined'){
    document.body.classList.add('no-webgl');
    window.FelicityScene = { ready:false };
    return;
  }

  const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x07111F, 0.045);

  const camera = new THREE.PerspectiveCamera(42, window.innerWidth/window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 14);

  /* -------------------- lighting -------------------- */
  const ambient = new THREE.AmbientLight(0x8899aa, 0.55);
  scene.add(ambient);
  const key = new THREE.DirectionalLight(0xffffff, 0.9);
  key.position.set(6, 8, 10);
  scene.add(key);
  const orangeGlow = new THREE.PointLight(0xF95700, 2.2, 30);
  orangeGlow.position.set(-4, -2, 6);
  scene.add(orangeGlow);
  const signalGlow = new THREE.PointLight(0xC7F36B, 0.8, 20);
  signalGlow.position.set(4, 3, 4);
  scene.add(signalGlow);

  /* -------------------- materials -------------------- */
  const matGraphite = new THREE.MeshStandardMaterial({ color:0x0C192E, metalness:0.75, roughness:0.35 });
  const matSlate = new THREE.MeshStandardMaterial({ color:0x64748B, metalness:0.6, roughness:0.4 });
  const matOrange = new THREE.MeshStandardMaterial({ color:0xF95700, emissive:0xF95700, emissiveIntensity:0.6, metalness:0.3, roughness:0.4 });
  const matSignal = new THREE.MeshStandardMaterial({ color:0xC7F36B, emissive:0xC7F36B, emissiveIntensity:0.8, metalness:0.2, roughness:0.3 });
  const matGlass = new THREE.MeshStandardMaterial({ color:0xF8FAFC, metalness:0.1, roughness:0.15, transparent:true, opacity:0.25 });

  /* =====================================================================
     SIGNATURE OBJECT — proprietary Felicity form
     Built from named child groups so sections can move / rotate /
     separate them independently to narrate the infrastructure story.
  ===================================================================== */
  const signature = new THREE.Group();

  // --- F frame (vertical bar + two horizontal bars) ---
  const fFrame = new THREE.Group();
  const fVert = new THREE.Mesh(new THREE.BoxGeometry(0.45, 5.6, 0.45), matGraphite);
  fVert.position.set(-1.4, 0, 0);
  const fTop = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.45, 0.45), matGraphite);
  fTop.position.set(-0.3, 2.55, 0);
  const fMid = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.4, 0.4), matGraphite);
  fMid.position.set(-0.55, 0.35, 0);
  fFrame.add(fVert, fTop, fMid);
  fFrame.name = 'fFrame';

  // --- rack frame (wireframe box surrounding the F) ---
  const rackGeo = new THREE.BoxGeometry(4.2, 6.4, 4.2);
  const rackEdges = new THREE.EdgesGeometry(rackGeo);
  const rackFrame = new THREE.LineSegments(rackEdges, new THREE.LineBasicMaterial({ color:0x64748B, transparent:true, opacity:0.45 }));
  rackFrame.name = 'rackFrame';

  // --- fibre ring (torus, diagonal) ---
  const fibreRing = new THREE.Mesh(new THREE.TorusGeometry(3.1, 0.05, 16, 96), matOrange);
  fibreRing.rotation.x = Math.PI / 2.4;
  fibreRing.rotation.y = 0.3;
  fibreRing.name = 'fibreRing';

  const fibreRing2 = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.035, 16, 96), matSlate);
  fibreRing2.rotation.x = Math.PI / 1.8;
  fibreRing2.rotation.z = 0.5;
  fibreRing2.name = 'fibreRing2';

  // --- power pathway (thin vertical cylinder + pulse spheres) ---
  const powerPath = new THREE.Group();
  const powerRod = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 7, 12), matOrange);
  powerRod.position.set(1.8, 0, 0.6);
  const pulses = [];
  for(let i=0;i<4;i++){
    const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), matSignal);
    pulse.position.set(1.8, -3.5 + i*2, 0.6);
    pulses.push(pulse);
    powerPath.add(pulse);
  }
  powerPath.add(powerRod);
  powerPath.name = 'powerPath';

  // --- cooling blades (radial fan near base) ---
  const coolingBlades = new THREE.Group();
  const bladeCount = 6;
  for(let i=0;i<bladeCount;i++){
    const blade = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.06, 0.35), matSlate);
    blade.position.set(0, -3.6, 0);
    blade.rotation.y = (i / bladeCount) * Math.PI * 2;
    blade.translateX(0.7);
    coolingBlades.add(blade);
  }
  coolingBlades.name = 'coolingBlades';

  // --- modular infrastructure block (small cube grid at base) ---
  const modularBlock = new THREE.Group();
  for(let x=0;x<2;x++){
    for(let z=0;z<2;z++){
      const cube = new THREE.Mesh(new THREE.BoxGeometry(0.55,0.55,0.55), matGlass);
      cube.position.set(-2.4 + x*1.1, -3.4, -2.4 + z*1.1);
      modularBlock.add(cube);
    }
  }
  modularBlock.name = 'modularBlock';

  signature.add(fFrame, rackFrame, fibreRing, fibreRing2, powerPath, coolingBlades, modularBlock);
  scene.add(signature);

  /* -------------------- background architectural grid -------------------- */
  const gridGroup = new THREE.Group();
  const gridHelper = new THREE.GridHelper(40, 40, 0x24344a, 0x162032);
  gridHelper.position.y = -6;
  gridGroup.add(gridHelper);
  const gridHelper2 = gridHelper.clone();
  gridHelper2.rotation.x = Math.PI/2;
  gridHelper2.position.z = -14;
  gridHelper2.position.y = 0;
  gridGroup.add(gridHelper2);
  scene.add(gridGroup);

  /* =====================================================================
     SCROLL NARRATIVE — maps section ids to signature-object states
  ===================================================================== */
  const state = {
    groupRotY: 0.4,
    groupScale: 1,
    camZ: 14,
    camY: 0,
    fFrameOpacity: 1,
    explode: 0,     // 0 = assembled, 1 = exploded
    riseY: 0,       // vertical rise for orbital section
    ringSpread: 1,  // fibre ring scale for connectivity section
    contract: 0     // 0 = normal, 1 = fully contracted for contact
  };

  function applyState(){
    signature.rotation.y = state.groupRotY;
    const s = state.groupScale * (1 - state.contract*0.4);
    signature.scale.setScalar(s);
    signature.position.y = state.riseY;
    camera.position.z = state.camZ;
    camera.position.y = state.camY;

    const ex = state.explode;
    fVert.position.x = -1.4 - ex*0.6;
    fTop.position.y = 2.55 + ex*1.3;
    fMid.position.x = -0.55 - ex*0.9;
    powerPath.position.x = ex*1.6;
    coolingBlades.position.y = -ex*1.1;
    modularBlock.position.y = -ex*0.9;
    modularBlock.children.forEach((c,i)=>{
      c.position.x += 0; // static grid spread handled via group scale below
    });
    modularBlock.scale.setScalar(1 + ex*0.35);

    const ring = state.ringSpread;
    fibreRing.scale.setScalar(ring);
    fibreRing2.scale.setScalar(ring*1.05);

    rackFrame.material.opacity = 0.45 * (1 - state.contract*0.6);
  }
  applyState();

  if(typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined'){
    gsap.registerPlugin(ScrollTrigger);

    // Hero -> Infrastructure: assemble to exploded isometric view
    gsap.timeline({ scrollTrigger:{ trigger:'#infrastructure', start:'top bottom', end:'bottom top', scrub:1 } })
      .to(state, { explode:1, groupRotY:1.1, camZ:11 }, 0);

    // Infrastructure -> Connectivity: extend fibre rings outward
    gsap.timeline({ scrollTrigger:{ trigger:'#connectivity', start:'top bottom', end:'bottom top', scrub:1 } })
      .to(state, { ringSpread:1.8, groupRotY:2.4, explode:0.6 }, 0);

    // Connectivity -> Orbital: structure rises, camera pulls back
    gsap.timeline({ scrollTrigger:{ trigger:'#orbital', start:'top bottom', end:'bottom top', scrub:1 } })
      .to(state, { riseY:1.6, camZ:17, camY:1.5, groupRotY:3.4 }, 0);

    // Orbital -> Operations: resolves back to steady, centred formation
    gsap.timeline({ scrollTrigger:{ trigger:'#operations', start:'top bottom', end:'bottom top', scrub:1 } })
      .to(state, { riseY:0, camZ:13, camY:0, explode:0.25, ringSpread:1.1, groupRotY:4.2 }, 0);

    // Operations -> Contact: full contraction into the Felicity symbol
    gsap.timeline({ scrollTrigger:{ trigger:'#contact', start:'top bottom', end:'top center', scrub:1 } })
      .to(state, { contract:1, explode:0, ringSpread:0.7, camZ:10, groupRotY:5.1 }, 0);
  }

  /* -------------------- mouse parallax -------------------- */
  let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
  window.addEventListener('mousemove', (e)=>{
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
  });

  /* -------------------- resize -------------------- */
  window.addEventListener('resize', ()=>{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* -------------------- render loop -------------------- */
  const clock = new THREE.Clock();
  let paused = document.hidden;
  document.addEventListener('visibilitychange', ()=>{ paused = document.hidden; });

  function animate(){
    requestAnimationFrame(animate);
    if(paused) return;
    const dt = clock.getDelta();

    applyState();

    if(!prefersReducedMotion){
      signature.rotation.y += dt * 0.05;
      fibreRing.rotation.z += dt * 0.15;
      fibreRing2.rotation.z -= dt * 0.1;
      coolingBlades.rotation.y += dt * 0.6;

      pulses.forEach((p, i)=>{
        p.position.y = ((p.position.y + dt*2.2 + 3.5) % 7) - 3.5;
      });

      targetX += (mouseX - targetX) * 0.03;
      targetY += (mouseY - targetY) * 0.03;
      camera.position.x = targetX * 1.2;
      camera.lookAt(0, signature.position.y * 0.3, 0);
      gridGroup.rotation.y = targetX * 0.05;
    } else {
      camera.lookAt(0,0,0);
    }

    renderer.render(scene, camera);
  }
  animate();

  window.FelicityScene = { ready:true, scene, camera, renderer, signature, state };
})();
