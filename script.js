// Inicializace scény
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Čistě modrá karta (původní barva)
const cardGeometry = new THREE.BoxGeometry(3, 2, 0.1);
const cardMaterial = new THREE.MeshStandardMaterial({
  color: 0x0000ff, // Modrá barva karty
  metalness: 0.7, 
  roughness: 0.3
});
const card = new THREE.Mesh(cardGeometry, cardMaterial);
scene.add(card);

// **Světlo - jemně upravené**
const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xaa00ff, 15, 12); // Fialové světlo
pointLight.position.set(0, 0, 3);
scene.add(pointLight);

// **Neonový okraj karty**
const edgeGeometry = new THREE.EdgesGeometry(cardGeometry);
const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 3 });
const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
card.add(edges);

// **Text "M" - vylepšený vzhled**
const loader = new THREE.FontLoader();
loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font) {
    const textGeometry = new THREE.TextGeometry('M', {
        font: font,
        size: 0.7,
        height: 0.1,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.03,
        bevelOffset: 0,
        bevelSegments: 5
    });
    const textMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700, emissive: 0x996600, metalness: 1, roughness: 0.2 });
    const text = new THREE.Mesh(textGeometry, textMaterial);
    text.position.set(-0.35, -0.2, 0.1); // Vycentrováno
    card.add(text);
});

// **Odstranění pevného kolečka pod M**
// Původně zde bylo, ale odstraněno

// **Ovládání kamery**
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// **Animace renderování s pomalejší rotací**
function animate() {
    requestAnimationFrame(animate);
    card.rotation.y += 0.005; // Zpomaleno
    renderer.render(scene, camera);
}
animate();
