const canvas = document.getElementById("particle-canvas");

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x05070c, 0.025);

const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 30;

const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const PARTICLE_COUNT = 12000;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(PARTICLE_COUNT * 3);

for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 80;
    positions[i3 + 1] = (Math.random() - 0.5) * 80;
    positions[i3 + 2] = (Math.random() - 0.5) * 40;
}

geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

const material = new THREE.PointsMaterial({
    color: 0xff9933,
    size: 0.12,
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);


const mouse = new THREE.Vector2(9999, 9999);
const raycaster = new THREE.Raycaster();
const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const mouse3D = new THREE.Vector3();

window.addEventListener("mousemove", (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane, mouse3D);
});

function animate() {
    requestAnimationFrame(animate);

    const pos = geometry.attributes.position.array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;

        const dx = pos[i3] - mouse3D.x;
        const dy = pos[i3 + 1] - mouse3D.y;
        const dz = pos[i3 + 2] - mouse3D.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < 6) {
            const force = (6 - dist) * 0.08;
            pos[i3] += (dx / dist) * force;
            pos[i3 + 1] += (dy / dist) * force;
        }


        pos[i3 + 1] += Math.sin(Date.now() * 0.0003 + i) * 0.002;
    }

    geometry.attributes.position.needsUpdate = true;
    particles.rotation.y += 0.0005;

    renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
