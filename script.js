import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { GLTFLoader } from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/examples/jsm/controls/OrbitControls.js';

// Inicializace scény
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Přidání světla
const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x00ffff, 10, 10);
pointLight.position.set(0, 0, 3);
scene.add(pointLight);

// Tvorba karty
const cardGeometry = new THREE.BoxGeometry(2, 3, 0.1);
const cardMaterial = new THREE.MeshStandardMaterial({
  color: 0x222222,
  metalness: 0.7,
  roughness: 0.3
});
const card = new THREE.Mesh(cardGeometry, cardMaterial);
scene.add(card);

// Přidání neonového efektu na hrany
const edgeGeometry = new THREE.EdgesGeometry(cardGeometry);
const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 3 });
const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
card.add(edges);

// Přidání zlatého emblému "M"
const fontLoader = new THREE.FontLoader();
fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font) {
  const textGeometry = new THREE.TextGeometry('M', {
    font: font,
    size: 0.8,
    height: 0.1,
  });
  const textMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 1, roughness: 0.2 });
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  textMesh.position.set(-0.3, -0.3, 0.06);
  card.add(textMesh);
});

// Přidání světelného efektu do pozadí
const glowGeometry = new THREE.PlaneGeometry(3, 4);
const glowMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.3 });
const glow = new THREE.Mesh(glowGeometry, glowMaterial);
glow.position.set(0, 0, -0.2);
scene.add(glow);

// Animace přiblížení a dopadu
function animateCard() {
  card.position.set(0, 5, 0);
  card.rotation.set(0, 0, 0);
  
  const tween = new TWEEN.Tween(card.position)
    .to({ y: 0 }, 1000)
    .easing(TWEEN.Easing.Bounce.Out)
    .start();
  
  const rotateTween = new TWEEN.Tween(card.rotation)
    .to({ y: Math.PI * 2 }, 1200)
    .easing(TWEEN.Easing.Quadratic.Out)
    .start();
}

// Ovládání kamery
const controls = new OrbitControls(camera, renderer.domElement);

// Animace renderování
function animate() {
  requestAnimationFrame(animate);
  TWEEN.update();
  renderer.render(scene, camera);
}
animate();

// Spuštění animace při načtení
setTimeout(animateCard, 1000);
