/* =====================================================================
   FELICITY IDC — CUSTOM FLOATING 3D ICON SYSTEM
   Small engineered objects (not flat icon-library glyphs) that float
   with restrained motion around the signature object.
===================================================================== */
(function(){
  if(!window.FelicityScene || !window.FelicityScene.ready) return;
  const { scene } = window.FelicityScene;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const matDark = new THREE.MeshStandardMaterial({ color:0x0C192E, metalness:0.7, roughness:0.35 });
  const matAlum = new THREE.MeshStandardMaterial({ color:0x94A3B8, metalness:0.85, roughness:0.25 });
  const matOrangeGlow = new THREE.MeshStandardMaterial({ color:0xF95700, emissive:0xF95700, emissiveIntensity:0.7, metalness:0.3, roughness:0.4 });
  const matGlass = new THREE.MeshStandardMaterial({ color:0xF8FAFC, metalness:0.1, roughness:0.1, transparent:true, opacity:0.3 });

  function makePowerIcon(){
    const g = new THREE.Group();
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,0.9,10), matOrangeGlow);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.22,0.025,8,24), matAlum);
    ring.rotation.x = Math.PI/2;
    g.add(rod, ring);
    return g;
  }
  function makeCoolingIcon(){
    const g = new THREE.Group();
    for(let i=0;i<3;i++){
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.45,0.04,0.14), matAlum);
      blade.rotation.y = (i/3)*Math.PI*2;
      blade.translateX(0.22);
      g.add(blade);
    }
    return g;
  }
  function makeConnectivityIcon(){
    return new THREE.Mesh(new THREE.TorusKnotGeometry(0.18,0.035,64,8,2,3), matOrangeGlow);
  }
  function makeSecurityIcon(){
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.28,0.4,6), matDark);
    const cap = new THREE.Mesh(new THREE.TorusGeometry(0.16,0.03,8,20,Math.PI), matAlum);
    cap.position.y = 0.22;
    cap.rotation.x = Math.PI/2;
    g.add(body, cap);
    return g;
  }
  function makeMonitoringIcon(){
    const g = new THREE.Group();
    const panel = new THREE.Mesh(new THREE.BoxGeometry(0.5,0.34,0.03), matDark);
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.03,8,8), matOrangeGlow);
    dot.position.set(0.18,0.11,0.03);
    g.add(panel, dot);
    return g;
  }
  function makeCloudIcon(){
    const g = new THREE.Group();
    [[0,0,0,0.2],[0.18,0.05,0,0.15],[-0.18,0.04,0,0.15]].forEach(([x,y,z,r])=>{
      const s = new THREE.Mesh(new THREE.SphereGeometry(r,12,12), matGlass);
      s.position.set(x,y,z);
      g.add(s);
    });
    return g;
  }
  function makeSatelliteIcon(){
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.16,0.16,0.16), matDark);
    const dish = new THREE.Mesh(new THREE.ConeGeometry(0.16,0.08,16,1,true), matAlum);
    dish.rotation.x = Math.PI;
    dish.position.x = 0.16;
    g.add(body, dish);
    return g;
  }
  function makeRedundancyIcon(){
    const g = new THREE.Group();
    const r1 = new THREE.Mesh(new THREE.TorusGeometry(0.16,0.025,8,24), matOrangeGlow);
    const r2 = new THREE.Mesh(new THREE.TorusGeometry(0.16,0.025,8,24), matAlum);
    r2.rotation.y = Math.PI/2;
    g.add(r1,r2);
    return g;
  }

  const factories = [
    makePowerIcon, makeCoolingIcon, makeConnectivityIcon, makeSecurityIcon,
    makeMonitoringIcon, makeCloudIcon, makeSatelliteIcon, makeRedundancyIcon
  ];

  const icons = [];
  const radius = 6.5;
  factories.forEach((fn, i)=>{
    const icon = fn();
    const angle = (i / factories.length) * Math.PI * 2;
    icon.userData.baseAngle = angle;
    icon.userData.radius = radius + (i % 2 === 0 ? 0 : 1.2);
    icon.userData.yOffset = Math.sin(i) * 2;
    icon.userData.speed = 0.06 + (i % 3) * 0.015;
    icon.position.set(
      Math.cos(angle) * icon.userData.radius,
      icon.userData.yOffset,
      Math.sin(angle) * icon.userData.radius - 4
    );
    scene.add(icon);
    icons.push(icon);
  });

  if(prefersReducedMotion){ return; }

  const clock = new THREE.Clock();
  function driftIcons(){
    requestAnimationFrame(driftIcons);
    if(document.hidden) return;
    const t = clock.getElapsedTime();
    icons.forEach(icon=>{
      const a = icon.userData.baseAngle + t * icon.userData.speed;
      icon.position.x = Math.cos(a) * icon.userData.radius;
      icon.position.z = Math.sin(a) * icon.userData.radius - 4;
      icon.position.y = icon.userData.yOffset + Math.sin(t*0.7 + icon.userData.baseAngle) * 0.35;
      icon.rotation.y += 0.004;
      icon.rotation.x = Math.sin(t*0.3 + icon.userData.baseAngle) * 0.2;
    });
  }
  driftIcons();

  window.FelicityIcons = icons;
})();
