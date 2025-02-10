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

// **Vytvoření karty**
const cardGeometry = new THREE.BoxGeometry(3, 2, 0.1);
const cardMaterial = new THREE.MeshStandardMaterial({
  color: 0x222222, // Tmavá šedá barva karty
  metalness: 0.7, 
  roughness: 0.3
});
const card = new THREE.Mesh(cardGeometry, cardMaterial);
scene.add(card);

// **Neonový okraj**
const edgeGeometry = new THREE.EdgesGeometry(cardGeometry);
const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 3 });
const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
card.add(edges);

// **Lehké podsvícení pozadí**
const glowGeometry = new THREE.PlaneGeometry(3.5, 2.5);
const glowMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x00ffff, 
    transparent: true, 
    opacity: 0.2 
});
const glow = new THREE.Mesh(glowGeometry, glowMaterial);
glow.position.set(0, 0, -0.2);
scene.add(glow);

// Ovládání kamery
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Animace renderování
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
