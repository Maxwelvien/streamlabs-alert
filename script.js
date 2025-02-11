// Inicializace scény, kamery a rendereru
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Funkce pro vytvoření tvaru s oblými rohy (rounded rectangle)
function createRoundedRectShape(width, height, radius) {
  const shape = new THREE.Shape();
  shape.moveTo(-width / 2 + radius, -height / 2);
  shape.lineTo(width / 2 - radius, -height / 2);
  shape.quadraticCurveTo(width / 2, -height / 2, width / 2, -height / 2 + radius);
  shape.lineTo(width / 2, height / 2 - radius);
  shape.quadraticCurveTo(width / 2, height / 2, width / 2 - radius, height / 2);
  shape.lineTo(-width / 2 + radius, height / 2);
  shape.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - radius);
  shape.lineTo(-width / 2, -height / 2 + radius);
  shape.quadraticCurveTo(-width / 2, -height / 2, -width / 2 + radius, -height / 2);
  return shape;
}

// Parametry karty
const cardWidth = 3;
const cardHeight = 2;
const cardDepth = 0.03; // ještě tenčí karta
const cornerRadius = 0.3; // poloměr oblých rohů

// Vytvoření geometrie karty pomocí extruze tvaru s oblými rohy
const cardShape = createRoundedRectShape(cardWidth, cardHeight, cornerRadius);
const extrudeSettings = {
  steps: 1,
  depth: cardDepth,
  bevelEnabled: false
};
const cardGeometry = new THREE.ExtrudeGeometry(cardShape, extrudeSettings);

// Futuristický, matný materiál karty
const cardMaterial = new THREE.MeshStandardMaterial({
  color: 0x1c1c1c,
  emissive: 0x001133,
  metalness: 0.3,
  roughness: 0.8
});
const card = new THREE.Mesh(cardGeometry, cardMaterial);
card.castShadow = true;
card.receiveShadow = true;
scene.add(card);

// Přidání neonového okraje (hran) pro zvýraznění obrysů
const edgeGeometry = new THREE.EdgesGeometry(cardGeometry);
const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 3 });
const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
card.add(edges);

// Osvětlení scény

// Jemné ambientní světlo pro základní vyplnění
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

// Světlo čelně z levého horního rohu (pro krátké, dynamické stíny)
const frontLight = new THREE.DirectionalLight(0x7700ff, 1.5);
frontLight.position.set(-5, 5, 5);
frontLight.castShadow = true;
scene.add(frontLight);

// Světlo ze zadní strany, aby byla karta osvětlená i zezadu
const backLight = new THREE.DirectionalLight(0x7700ff, 1.0);
backLight.position.set(5, 5, -5);
backLight.castShadow = true;
scene.add(backLight);

// Vytvoření modelu písmena "M" s mírně vystupujícím profilem a kulatými hranami
const fontLoader = new THREE.FontLoader();
fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font) {
    const mGeometry = new THREE.TextGeometry('M', {
      font: font,
      size: 1,
      height: 0.1, // vystupující profil
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 3,
      curveSegments: 12
    });
    mGeometry.center();
    
    const mMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFD700, // zlatá barva
      metalness: 0.5,
      roughness: 0.7
    });
    
    const mMesh = new THREE.Mesh(mGeometry, mMaterial);
    mMesh.castShadow = true;
    mMesh.receiveShadow = true;
    // Umístění písmena "M" přímo na kartu, mírně vystupující nad její přední plochu
    mMesh.position.set(0, 0, cardDepth + 0.02);
    card.add(mMesh);
});

// Ovládání kamery
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Animace renderování
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
