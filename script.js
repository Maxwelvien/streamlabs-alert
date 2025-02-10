// Inicializace scény
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Přidání světel
const ambientLight = new THREE.AmbientLight(0x404040, 3);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xAA00FF, 15, 10); // Lehce fialový odstín
pointLight.position.set(0, 0, 3);
scene.add(pointLight);

// **Vytvoření karty se stejnou texturou i zezadu**
const cardGeometry = new THREE.BoxGeometry(3, 2, 0.1);
const cardMaterial = new THREE.MeshStandardMaterial({
  color: 0x222222,
  metalness: 0.7, 
  roughness: 0.3,
  side: THREE.DoubleSide // Stejný materiál i zezadu
});
const card = new THREE.Mesh(cardGeometry, cardMaterial);
scene.add(card);

// **Neonový okraj**
const edgeGeometry = new THREE.EdgesGeometry(cardGeometry);
const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 3 });
const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
card.add(edges);

// **Zvětšené fialové kolečko uprostřed karty**
const circleGeometry = new THREE.CircleGeometry(0.7, 32);
const circleMaterial = new THREE.MeshStandardMaterial({
    color: 0x800080, // Fialová
    metalness: 0.7,
    roughness: 0.3
});
const circle = new THREE.Mesh(circleGeometry, circleMaterial);
circle.position.set(0, 0, 0.06); // Mírně nad povrch karty
card.add(circle);

// **Přidání zlatého písmena M**
const loader = new THREE.FontLoader();
loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font) {
    const textGeometry = new THREE.TextGeometry('M', {
        font: font,
        size: 0.5,
        height: 0.05,
    });
    const textMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700 }); // Zlatá barva
    const text = new THREE.Mesh(textGeometry, textMaterial);
    text.position.set(-0.25, 0, 0.1); // Střed karty
    card.add(text);
});

// **Úprava průsvitného modrého obdélníku za kartou**
const glowGeometry = new THREE.PlaneGeometry(3.5, 2.5);
const glowMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x0000ff, 
    transparent: true, 
    opacity: 0.1 
});
const glow = new THREE.Mesh(glowGeometry, glowMaterial);
glow.position.set(0, 0, -0.3); // Trochu dál od karty
scene.add(glow);

// Ovládání kamery
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// **Animace s horizontální rotací**
let rotationSpeed = 0.02; // Testovací rotace

function animate() {
    requestAnimationFrame(animate);
    card.rotation.y += rotationSpeed;
    renderer.render(scene, camera);
}
animate();
