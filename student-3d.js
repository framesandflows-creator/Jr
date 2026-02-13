import * as THREE from "https://unpkg.com/three@0.162.0/build/three.module.js";

const mount = document.getElementById("student-3d-layer");

if (!mount) {
  throw new Error("3D mount layer not found");
}

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isSmallScreen = window.matchMedia("(max-width: 640px)").matches;

if (prefersReduced || isSmallScreen) {
  mount.style.display = "none";
} else {
  initStudentScene(mount);
}

function initStudentScene(container) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0.1, 8.4);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  const hemi = new THREE.HemisphereLight(0x9ae9ff, 0x060b16, 1.15);
  scene.add(hemi);

  const key = new THREE.DirectionalLight(0x89c4ff, 1.35);
  key.position.set(3.6, 4.5, 3.8);
  scene.add(key);

  const rim = new THREE.PointLight(0x4dd8b3, 1.5, 20, 1.4);
  rim.position.set(-3.2, 1.8, 2.7);
  scene.add(rim);

  const floorGlow = new THREE.Mesh(
    new THREE.CircleGeometry(1.2, 40),
    new THREE.MeshBasicMaterial({ color: 0x5eb7ff, transparent: true, opacity: 0.2 })
  );
  floorGlow.rotation.x = -Math.PI / 2;
  floorGlow.position.y = -1.42;

  const student = new THREE.Group();
  student.scale.setScalar(0.92);
  scene.add(student);
  student.add(floorGlow);

  const skinMat = new THREE.MeshStandardMaterial({ color: 0xa66a44, roughness: 0.52, metalness: 0.05 });
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x101420, roughness: 0.75, metalness: 0.1 });
  const shirtMat = new THREE.MeshStandardMaterial({ color: 0x2f68ff, roughness: 0.36, metalness: 0.2 });
  const pantMat = new THREE.MeshStandardMaterial({ color: 0x151e32, roughness: 0.56, metalness: 0.12 });
  const shoeMat = new THREE.MeshStandardMaterial({ color: 0xeff6ff, roughness: 0.35, metalness: 0.05 });
  const laptopMat = new THREE.MeshStandardMaterial({ color: 0x8cb6ff, roughness: 0.2, metalness: 0.8 });
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x7cf6ff, emissive: 0x3bc3ff, emissiveIntensity: 0.6, transparent: true, opacity: 0.42 });

  const torso = new THREE.Mesh(new THREE.BoxGeometry(1.05, 1.38, 0.54), shirtMat);
  torso.position.y = -0.1;
  student.add(torso);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.2, 20), skinMat);
  neck.position.y = 0.72;
  student.add(neck);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.44, 30, 30), skinMat);
  head.position.y = 1.08;
  student.add(head);

  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.46, 30, 30, 0, Math.PI * 2, 0, Math.PI * 0.6), hairMat);
  hair.position.y = 1.24;
  student.add(hair);

  const backpack = new THREE.Mesh(new THREE.BoxGeometry(0.84, 1.02, 0.28), pantMat);
  backpack.position.set(0, -0.1, -0.38);
  student.add(backpack);

  const tie = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.62, 0.04), new THREE.MeshStandardMaterial({ color: 0x9fd2ff, metalness: 0.45, roughness: 0.35 }));
  tie.position.set(0, -0.2, 0.28);
  student.add(tie);

  const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.1, 0.92, 16), shirtMat);
  leftArm.position.set(-0.66, 0.08, 0.03);
  leftArm.rotation.z = 0.22;
  student.add(leftArm);

  const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.1, 0.92, 16), shirtMat);
  rightArm.position.set(0.64, 0.02, 0.11);
  rightArm.rotation.z = -0.95;
  rightArm.rotation.x = 0.58;
  student.add(rightArm);

  const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), skinMat);
  leftHand.position.set(-0.83, -0.38, 0.02);
  student.add(leftHand);

  const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), skinMat);
  rightHand.position.set(0.92, -0.3, 0.28);
  student.add(rightHand);

  const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.12, 0.96, 16), pantMat);
  leftLeg.position.set(-0.24, -1.18, 0.03);
  student.add(leftLeg);

  const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.12, 0.96, 16), pantMat);
  rightLeg.position.set(0.24, -1.18, 0.03);
  student.add(rightLeg);

  const leftShoe = new THREE.Mesh(new THREE.BoxGeometry(0.33, 0.14, 0.54), shoeMat);
  leftShoe.position.set(-0.24, -1.73, 0.15);
  student.add(leftShoe);

  const rightShoe = new THREE.Mesh(new THREE.BoxGeometry(0.33, 0.14, 0.54), shoeMat);
  rightShoe.position.set(0.24, -1.73, 0.15);
  student.add(rightShoe);

  const laptopGroup = new THREE.Group();
  laptopGroup.position.set(1.06, -0.3, 0.44);
  laptopGroup.rotation.y = -0.52;
  laptopGroup.rotation.z = -0.32;

  const laptopBase = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.05, 0.38), laptopMat);
  const laptopScreen = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.29, 0.03), glassMat);
  laptopScreen.position.set(0, 0.17, -0.13);
  laptopScreen.rotation.x = -0.95;

  laptopGroup.add(laptopBase);
  laptopGroup.add(laptopScreen);
  student.add(laptopGroup);

  const hudRingA = new THREE.Mesh(
    new THREE.TorusGeometry(1.26, 0.02, 16, 100),
    new THREE.MeshBasicMaterial({ color: 0x67f1ff, transparent: true, opacity: 0.42 })
  );
  hudRingA.rotation.x = Math.PI / 2;
  hudRingA.position.y = 0.2;
  student.add(hudRingA);

  const hudRingB = new THREE.Mesh(
    new THREE.TorusGeometry(1.55, 0.012, 12, 100),
    new THREE.MeshBasicMaterial({ color: 0x77a7ff, transparent: true, opacity: 0.32 })
  );
  hudRingB.rotation.y = Math.PI / 2;
  student.add(hudRingB);

  const path = [
    new THREE.Vector3(2.2, 1.3, 0),
    new THREE.Vector3(1.05, 0.7, 0),
    new THREE.Vector3(-0.2, 0.2, 0),
    new THREE.Vector3(1.3, -0.4, 0),
    new THREE.Vector3(-1.5, -1.1, 0)
  ];

  const currentPos = path[0].clone();
  const targetPos = path[0].clone();
  let targetProgress = 0;
  let currentProgress = 0;

  function getPointAt(progress) {
    const maxSegment = path.length - 1;
    const scaled = progress * maxSegment;
    const idx = Math.min(Math.floor(scaled), maxSegment - 1);
    const t = scaled - idx;
    return path[idx].clone().lerp(path[idx + 1], t);
  }

  function updateTargetProgress() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    targetProgress = scrollable <= 0 ? 0 : window.scrollY / scrollable;
  }

  updateTargetProgress();
  window.addEventListener("scroll", updateTargetProgress, { passive: true });

  let rafId;

  function tick(time) {
    currentProgress += (targetProgress - currentProgress) * 0.06;

    targetPos.copy(getPointAt(currentProgress));
    currentPos.lerp(targetPos, 0.08);

    const nextPoint = getPointAt(Math.min(currentProgress + 0.014, 1));
    const direction = nextPoint.clone().sub(currentPos);

    student.position.set(currentPos.x, currentPos.y + Math.sin(time * 0.0022) * 0.08, currentPos.z);
    student.rotation.y = Math.atan2(direction.x, Math.max(0.001, direction.z + 1.4));
    student.rotation.z = Math.sin(time * 0.0016) * 0.05;

    leftArm.rotation.x = Math.sin(time * 0.004) * 0.09;
    rightArm.rotation.x = 0.58 + Math.sin(time * 0.0034 + 1.2) * 0.1;
    leftLeg.rotation.x = Math.sin(time * 0.004 + 0.6) * 0.12;
    rightLeg.rotation.x = Math.sin(time * 0.004 + 3.4) * 0.12;

    hudRingA.rotation.z += 0.005;
    hudRingB.rotation.x -= 0.004;
    laptopGroup.rotation.x = Math.sin(time * 0.0036) * 0.08;

    floorGlow.material.opacity = 0.16 + (Math.sin(time * 0.0032) + 1) * 0.08;

    renderer.render(scene, camera);
    rafId = window.requestAnimationFrame(tick);
  }

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    updateTargetProgress();
  }

  window.addEventListener("resize", onResize);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      window.cancelAnimationFrame(rafId);
      return;
    }
    rafId = window.requestAnimationFrame(tick);
  });

  rafId = window.requestAnimationFrame(tick);
}
