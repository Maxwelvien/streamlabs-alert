// Inicializace scény
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Čistě tmavě šedá karta (změna barvy zpět)
const cardGeometry = new THREE.BoxGeometry(3, 2, 0.1);
const cardMaterial = new THREE.MeshStandardMaterial({
  color: 0x222222, // Tmavá šedá barva karty
  metalness: 0.7, 
  roughness: 0.3
});
const card = new THREE.Mesh(cardGeometry, cardMaterial);
scene.add(card);

// **Světlo - futuristický modrofialový vzhled**
const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x7700ff, 20, 15); // Modrofialové světlo
pointLight.position.set(0, 0, 8); // Posunuto dále pro lepší rozložení světla
scene.add(pointLight);

// **Neonový okraj karty**
const edgeGeometry = new THREE.EdgesGeometry(cardGeometry);
const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 3 });
const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
card.add(edges);

// **Text "M" - vícebarevné efekty s vrstvami**
const loader = new THREE.FontLoader();
loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font) {
    const textGroup = new THREE.Group();
    
    const colors = [0xFFD700, 0x5500AA, 0x00FFFF, 0xFFD700, 0x00FFFF, 0xFFD700, 0x5500AA, 0xFFD700]; // Zlatá, fialová, modrá
    const sizes = [0.85, 0.75, 0.65, 0.55, 0.45, 0.35, 0.25, 0.15];
    const depths = [0.04, 0.035, 0.03, 0.025, 0.02, 0.015, 0.01, 0.005];
    
    colors.forEach((color, index) => {
        const textGeometry = new THREE.TextGeometry('M', {
            font: font,
            size: sizes[index], // Postupné zmenšování velikosti
            height: 0.01, // Zachování plochého vzhledu
            bevelEnabled: false
        });
        
        const textMaterial = new THREE.MeshStandardMaterial({ 
            color: color, 
            emissive: color, // Každá vrstva má svůj zářivý efekt
            metalness: 0.8, 
            roughness: 0.3
        });
        
        const text = new THREE.Mesh(textGeometry, textMaterial);
        text.position.set(-0.35, -0.2, 0.06 + depths[index]); // Každá vrstva je o kousek nad předchozí
        textGroup.add(text);
    });
    
    card.add(textGroup);
});

// **Ovládání kamery**
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// **Animace renderování s pomalejší rotací**
function animate() {
    requestAnimationFrame(animate);
    card.rotation.y += 0.005; // Zpomaleno
    renderer.render(scene, camera);
}
animate();
