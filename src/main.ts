import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import earthMap from "./assets/textures/earthmap4k.png";
import lightsMatPic from "./assets/textures/earth-nightmap-4k.jpg";
import cloudsMatPic from "./assets/textures/earthcloudmaptrans.jpg";
import getStarfield from "./lib/stars";
import { getFresnelMat } from "./lib/fresnelMat";

const w = window.innerWidth;
const h = window.innerHeight;

const loader = new THREE.TextureLoader();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

// ---main
const earthGroup = new THREE.Group();
earthGroup.rotation.z = (-23.5 * Math.PI) / 180;
scene.add(earthGroup);

const geometry = new THREE.IcosahedronGeometry(1, 12);
const material = new THREE.MeshStandardMaterial({
  map: loader.load(earthMap),
  emissive: new THREE.Color(0xffffff),
  emissiveMap: loader.load(lightsMatPic),
  emissiveIntensity: 0.15,
});
const earthMesh = new THREE.Mesh(geometry, material);
earthGroup.add(earthMesh);

const cloudsMat = new THREE.MeshStandardMaterial({
  map: loader.load(cloudsMatPic),
  transparent: true,
  opacity: 0.25,
  blending: THREE.AdditiveBlending,
});
const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
cloudsMesh.scale.setScalar(1.02);
scene.add(cloudsMesh);

const stars = getStarfield({ numStars: 1_000 });
scene.add(stars);

const fresnelMat = getFresnelMat({ rimHex: "#002aff" });
const fresnelMesh = new THREE.Mesh(geometry, fresnelMat);
fresnelMesh.scale.setScalar(1.04);
earthGroup.add(fresnelMesh);

const sunLight = new THREE.DirectionalLight(0xffffff, 1);
sunLight.position.set(-2, 1.5, 2);
scene.add(sunLight);

// ---main

(function masterAnimator(t: number = 0) {
  requestAnimationFrame(masterAnimator);

  earthGroup.rotation.y += 0.002;
  cloudsMesh.rotation.y += 0.00205;
  renderer.render(scene, camera);
})();
