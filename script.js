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


// Osvětlení scény

// Jemné ambientní světlo pro základní vyplnění
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

// Světlo čelně z levého horního rohu (pro krátké, dynamické stíny)
const frontLight = new THREE.DirectionalLight(0x404040, 2);
frontLight.position.set(-25, 20, 95);
frontLight.castShadow = true;
scene.add(frontLight);

// Světlo ze zadní strany, aby byla karta osvětlená i zezadu
const backLight = new THREE.DirectionalLight(0x404040, 1.0);
backLight.position.set(5, 5, -5);
backLight.castShadow = true;
scene.add(backLight);

// Vytvoření modelu písmena "M" s mírně vystupujícím profilem a kulatými hranami
const fontLoader = new THREE.FontLoader();
fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font) {
    const mGeometry = new THREE.TextGeometry('M', {
      font: font,
      size: 1,
      height: 0.001, // vystupující profil
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.02,
      bevelSegments: 3,
      curveSegments: 12
    });
    mGeometry.center();
    
    const mMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFD700, // zlatá barva
      metalness: 0.8,
      roughness: 0.3
    });
    
    const mMesh = new THREE.Mesh(mGeometry, mMaterial);
    mMesh.castShadow = true;
    mMesh.receiveShadow = true;
    // Umístění písmena "M" přímo na kartu, mírně vystupující nad její přední plochu
    mMesh.position.set(0, 0.2, cardDepth + 0.0);
    card.add(mMesh);
});

// Funkce pro vytvoření kovového rohového chrániče
function createCornerProtector(radius, thickness, depth) {
    const shape = new THREE.Shape();
    
    // Vnější obrys s posunutým a zesíleným rádiusem
    shape.absarc(0, 0, radius+0.078 + thickness-0.00, Math.PI, Math.PI / 2, true);
    shape.lineTo(radius + thickness-0.38, radius + thickness);
    shape.absarc(0, 0, radius+0.03, Math.PI / 2, Math.PI, false);
    shape.lineTo(-radius - thickness, -radius+0.2 - thickness+0.18);
    
    // Extruze 3D tvaru
    const extrudeSettings = {
        steps: 1,
        depth: depth, // Tloušťka ve směru Z
        bevelEnabled: true,
        bevelSize: 0.03, // Větší zaoblení hran
        bevelThickness: 0.04
    };
    
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
}

// Parametry ochranných rohů
const protectorRadius = cornerRadius * 1.1; // Posunutí rádiusu blíže ke středu
const protectorThickness = 0.08; // Další zvětšení tloušťky
const protectorDepth = 0.04; // Zachování hloubky ve směru Z

// Vytvoření materiálu (zlatý vzhled)
const protectorMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFD700, // Zlatá
    metalness: 0.8,
    roughness: 0.3 // Snížení hrubosti pro elegantnější vzhled
});

// Vytvoření a přesnější umístění rohů
const cornerPositions = [
    { x: cardWidth / 2 - protectorRadius-0.1, y: cardHeight / 2 - protectorRadius-0.1, rotation: -Math.PI / 2 },
    { x: -cardWidth / 2 + protectorRadius+0.1, y: cardHeight / 2 - protectorRadius-0.1, rotation: 0 },
    { x: -cardWidth / 2 + protectorRadius+0.1, y: -cardHeight / 2 + protectorRadius+0.1, rotation: Math.PI / 2 },
    { x: cardWidth / 2 - protectorRadius-0.1, y: -cardHeight / 2 + protectorRadius+0.1, rotation: Math.PI }
];

cornerPositions.forEach(pos => {
    const cornerGeo = createCornerProtector(protectorRadius, protectorThickness, protectorDepth);
    const cornerMesh = new THREE.Mesh(cornerGeo, protectorMaterial);
    
    // Posuneme je blíže ke kartě
    cornerMesh.position.set(pos.x, pos.y, cardDepth / 2 - 0.03); // Ještě větší zapuštění
    cornerMesh.rotation.z = pos.rotation;
    card.add(cornerMesh);
});


// Ovládání kamery
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Animace renderování
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
