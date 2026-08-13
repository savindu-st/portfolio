document.addEventListener('DOMContentLoaded', () => {
    
    // Mobile Navigation Toggle with Custom SVGs
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    const iconMenu = `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
    const iconClose = `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.innerHTML = navLinks.classList.contains('active') ? iconClose : iconMenu;
    });

    // Close mobile menu when a link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.innerHTML = iconMenu;
        });
    });

    // Scroll Progress & Active Nav Scrollspy
    const scrollProgressBar = document.getElementById('scroll-progress');
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');
    const navbar = document.getElementById('navbar');

    function updateScrollProgress() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (docHeight > 0 && scrollProgressBar) {
            const scrolled = (scrollTop / docHeight) * 100;
            scrollProgressBar.style.width = `${scrolled}%`;
        }
    }

    function highlightNavOnScroll() {
        const scrollY = window.pageYOffset;
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 180;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navItems.forEach(link => {
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateScrollProgress();
        highlightNavOnScroll();
    }, { passive: true });

    // Initial check on page load
    updateScrollProgress();
    highlightNavOnScroll();

    // Fade-in Animation on Scroll
    const fadeElements = document.querySelectorAll('.fade-in, .section-title, .stat-box, .bento-skill-card, .skill-category, .bento-card, .project-card, .timeline-item, .society-item');
    
    // Set initial state for scroll elements that aren't already explicitly fade-in (for consistency)
    fadeElements.forEach(el => {
        if(!el.classList.contains('fade-in')) {
            el.classList.add('fade-in');
        }
    });

    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    fadeElements.forEach(el => {
        appearOnScroll.observe(el);
    });

    // Trigger animations for elements already in view on load
    setTimeout(() => {
        const initialElements = document.querySelectorAll('.hero .fade-in');
        initialElements.forEach(el => el.classList.add('visible'));
    }, 100);

    // Contact Form Submission (Mock)
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic validation check
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            if(name && email && message) {
                // Simulate sending data
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerText;
                
                submitBtn.innerText = 'Sending...';
                submitBtn.disabled = true;

                setTimeout(() => {
                    contactForm.reset();
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                    formStatus.style.color = 'var(--accent-secondary)';
                    formStatus.innerText = 'Thank you! Your message has been sent successfully.';
                    
                    // Clear status message after 5 seconds
                    setTimeout(() => {
                        formStatus.innerText = '';
                    }, 5000);
                }, 1500);
            }
        });
    }

    // Initialize 3D Hero Canvas
    initHero3DCanvas();
});

/* =========================================================================
   Interactive 3D Hero Canvas (Three.js)
   AI Neural Structural Mesh, Quantum Particle Field & Cursor Physics
   ========================================================================= */
function initHero3DCanvas() {
    const canvas = document.getElementById('hero-3d-canvas');
    const container = document.getElementById('canvas-3d-container');
    const heroSection = document.getElementById('hero');

    if (!canvas || !container || typeof THREE === 'undefined') {
        console.warn('Three.js or Canvas element not found.');
        return;
    }

    // 1. Scene, Camera & Renderer
    const scene = new THREE.Scene();
    
    let width = container.clientWidth || 500;
    let height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7.2;

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Master Group for All 3D Components
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // 2. Structural Mesh: AI Neural Geodesic Polyhedron
    const outerRadius = 1.95;
    const outerGeometry = new THREE.IcosahedronGeometry(outerRadius, 2);
    
    // Wireframe Mesh
    const wireMaterial = new THREE.MeshStandardMaterial({
        color: 0x0ea5e9, // Cyan
        wireframe: true,
        transparent: true,
        opacity: 0.4,
        roughness: 0.2,
        metalness: 0.8
    });
    const outerMesh = new THREE.Mesh(outerGeometry, wireMaterial);
    masterGroup.add(outerMesh);

    // Neural Vertex Nodes (Glowing Points on each vertex)
    const pointsMaterial = new THREE.PointsMaterial({
        color: 0x38bdf8,
        size: 0.09,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending
    });
    const vertexPoints = new THREE.Points(outerGeometry, pointsMaterial);
    masterGroup.add(vertexPoints);

    // 3. Inner AI Core / Quantum Nucleus
    const coreGroup = new THREE.Group();
    masterGroup.add(coreGroup);

    const innerGeo = new THREE.OctahedronGeometry(0.9, 0);
    const innerMaterial = new THREE.MeshStandardMaterial({
        color: 0x10b981, // Emerald
        wireframe: true,
        transparent: true,
        opacity: 0.75,
        roughness: 0.1,
        metalness: 0.9
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMaterial);
    coreGroup.add(innerMesh);

    // Inner Crystalline Core (Solid transluscent)
    const crystalGeo = new THREE.OctahedronGeometry(0.65, 0);
    const crystalMat = new THREE.MeshPhysicalMaterial({
        color: 0x0ea5e9,
        transparent: true,
        opacity: 0.5,
        roughness: 0.1,
        metalness: 0.1,
        transmission: 0.8,
        thickness: 1.2
    });
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    coreGroup.add(crystalMesh);

    // 4. Gyroscopic Cyber Orbital Rings
    const ring1Geo = new THREE.TorusGeometry(2.45, 0.015, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({
        color: 0x0ea5e9,
        transparent: true,
        opacity: 0.55
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    masterGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.7, 0.015, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.45
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.z = Math.PI / 5;
    masterGroup.add(ring2);

    // Satellites orbiting on the rings
    const satGeo = new THREE.SphereGeometry(0.06, 12, 12);
    const satMat1 = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const sat1 = new THREE.Mesh(satGeo, satMat1);
    masterGroup.add(sat1);

    const satMat2 = new THREE.MeshBasicMaterial({ color: 0x34d399 });
    const sat2 = new THREE.Mesh(satGeo, satMat2);
    masterGroup.add(sat2);

    // 5. Quantum Data Particle Swarm
    const particleCount = 550;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleOrigins = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);
    const particlePhases = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
        // Spherical distribution around center
        const radius = 2.2 + Math.random() * 2.8;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        particlePositions[i * 3] = x;
        particlePositions[i * 3 + 1] = y;
        particlePositions[i * 3 + 2] = z;

        particleOrigins[i * 3] = x;
        particleOrigins[i * 3 + 1] = y;
        particleOrigins[i * 3 + 2] = z;

        particleSpeeds[i] = 0.2 + Math.random() * 0.8;
        particlePhases[i] = Math.random() * Math.PI * 2;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
        color: 0x7dd3fc,
        size: 0.045,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    masterGroup.add(particleSystem);

    // 6. Dynamic Colored Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x0ea5e9, 3.5, 30);
    cyanLight.position.set(5, 4, 5);
    scene.add(cyanLight);

    const emeraldLight = new THREE.PointLight(0x10b981, 3.0, 30);
    emeraldLight.position.set(-5, -4, 4);
    scene.add(emeraldLight);

    const purpleLight = new THREE.PointLight(0x818cf8, 2.0, 30);
    purpleLight.position.set(0, 5, -4);
    scene.add(purpleLight);

    // 7. Interactive Physics & Interaction State
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let isDragging = false;
    let previousPointerPosition = { x: 0, y: 0 };
    let dragRotationVelocity = { x: 0, y: 0 };
    let shockwaveIntensity = 0;
    let shockwaveTime = 0;
    let isHeroVisible = true;

    // Mouse movement listener (Window & Hero)
    function onPointerMove(e) {
        const rect = heroSection.getBoundingClientRect();
        // Normalized Coordinates between -1 and 1
        mouse.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.targetY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        
        // Clamping to sane range
        mouse.targetX = Math.max(-1.2, Math.min(1.2, mouse.targetX));
        mouse.targetY = Math.max(-1.2, Math.min(1.2, mouse.targetY));

        if (isDragging) {
            const deltaX = e.clientX - previousPointerPosition.x;
            const deltaY = e.clientY - previousPointerPosition.y;

            dragRotationVelocity.y = deltaX * 0.008;
            dragRotationVelocity.x = deltaY * 0.008;

            masterGroup.rotation.y += dragRotationVelocity.y;
            masterGroup.rotation.x += dragRotationVelocity.x;

            previousPointerPosition = { x: e.clientX, y: e.clientY };
        }
    }

    function onPointerDown(e) {
        isDragging = true;
        previousPointerPosition = { x: e.clientX, y: e.clientY };
        dragRotationVelocity = { x: 0, y: 0 };
    }

    function onPointerUp() {
        isDragging = false;
    }

    function triggerShockwave() {
        shockwaveIntensity = 1.0;
        shockwaveTime = 0;
    }

    window.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    container.addEventListener('click', triggerShockwave);

    // Touch support for mobile devices
    container.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            isDragging = true;
            previousPointerPosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            triggerShockwave();
        }
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
        if (isDragging && e.touches.length === 1) {
            const deltaX = e.touches[0].clientX - previousPointerPosition.x;
            const deltaY = e.touches[0].clientY - previousPointerPosition.y;

            dragRotationVelocity.y = deltaX * 0.01;
            dragRotationVelocity.x = deltaY * 0.01;

            masterGroup.rotation.y += dragRotationVelocity.y;
            masterGroup.rotation.x += dragRotationVelocity.x;

            previousPointerPosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
    }, { passive: true });

    container.addEventListener('touchend', () => {
        isDragging = false;
    });

    // 8. Performance: Intersection Observer to pause off-screen rendering
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isHeroVisible = entry.isIntersecting;
        });
    }, { threshold: 0.05 });
    heroObserver.observe(heroSection);

    // 9. Resize Handling
    function handleResize() {
        if (!container || !renderer || !camera) return;
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        
        if (newWidth > 0 && newHeight > 0) {
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }
    }

    window.addEventListener('resize', handleResize);

    // 10. Smooth 60 FPS Render & Animation Loop
    let clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        if (!isHeroVisible) return;

        const elapsedTime = clock.getElapsedTime();
        const delta = clock.getDelta();

        // Smooth Lerp for Cursor Parallax
        mouse.x += (mouse.targetX - mouse.x) * 0.06;
        mouse.y += (mouse.targetY - mouse.y) * 0.06;

        // Inertial damping from manual drag
        if (!isDragging) {
            dragRotationVelocity.x *= 0.94;
            dragRotationVelocity.y *= 0.94;
            masterGroup.rotation.x += dragRotationVelocity.x;
            masterGroup.rotation.y += dragRotationVelocity.y;
        }

        // Base Rotations
        outerMesh.rotation.y = elapsedTime * 0.15 + (mouse.x * 0.4);
        outerMesh.rotation.x = Math.sin(elapsedTime * 0.2) * 0.15 + (-mouse.y * 0.3);
        vertexPoints.rotation.copy(outerMesh.rotation);

        // Core Independent Counter-Rotation
        coreGroup.rotation.y = -elapsedTime * 0.45;
        coreGroup.rotation.z = elapsedTime * 0.3;
        coreGroup.rotation.x = Math.cos(elapsedTime * 0.3) * 0.25;

        // Ring Rotations
        ring1.rotation.z = elapsedTime * 0.25;
        ring2.rotation.y = -elapsedTime * 0.2;

        // Satellites motion along orbital paths
        const sat1Angle = elapsedTime * 0.8;
        sat1.position.set(
            Math.cos(sat1Angle) * 2.45,
            Math.sin(sat1Angle) * 1.7,
            Math.sin(sat1Angle * 0.5) * 1.2
        );

        const sat2Angle = -elapsedTime * 0.65;
        sat2.position.set(
            Math.sin(sat2Angle) * 1.5,
            Math.cos(sat2Angle) * 2.7,
            Math.cos(sat2Angle * 0.8) * 1.4
        );

        // Dynamic Lighting Orbit
        cyanLight.position.x = Math.sin(elapsedTime * 0.7) * 6;
        cyanLight.position.z = Math.cos(elapsedTime * 0.7) * 6;
        emeraldLight.position.y = Math.cos(elapsedTime * 0.5) * 5;

        // Shockwave Pulse Decay
        if (shockwaveIntensity > 0.001) {
            shockwaveTime += 0.04;
            shockwaveIntensity = Math.exp(-shockwaveTime * 3.0);
            
            const pulseScale = 1 + (shockwaveIntensity * 0.22);
            masterGroup.scale.set(pulseScale, pulseScale, pulseScale);
            cyanLight.intensity = 3.5 + (shockwaveIntensity * 4.0);
            emeraldLight.intensity = 3.0 + (shockwaveIntensity * 3.0);
        } else {
            // Subtle breathing scale
            const breath = 1.0 + Math.sin(elapsedTime * 1.5) * 0.025;
            masterGroup.scale.set(breath, breath, breath);
            cyanLight.intensity = 3.5;
            emeraldLight.intensity = 3.0;
        }

        // Quantum Particle Physics Animation
        const positions = particleGeometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const ox = particleOrigins[i3];
            const oy = particleOrigins[i3 + 1];
            const oz = particleOrigins[i3 + 2];
            const speed = particleSpeeds[i];
            const phase = particlePhases[i];

            // Wave undulation
            const wave = Math.sin(elapsedTime * speed + phase) * 0.12;
            let px = ox + Math.sin(elapsedTime * 0.3 + phase) * 0.15;
            let py = oy + wave;
            let pz = oz + Math.cos(elapsedTime * 0.3 + phase) * 0.15;

            // Shockwave dispersion outward
            if (shockwaveIntensity > 0.01) {
                const dist = Math.sqrt(ox * ox + oy * oy + oz * oz);
                const push = (dist > 0.1 ? dist : 1.0) * shockwaveIntensity * 0.35;
                px += (ox / dist) * push;
                py += (oy / dist) * push;
                pz += (oz / dist) * push;
            }

            // Magnetic attraction/reaction towards pointer
            const mouseEffectX = mouse.x * 0.4;
            const mouseEffectY = mouse.y * 0.4;
            px += mouseEffectX * (1.0 / (1.0 + Math.abs(ox)));
            py += mouseEffectY * (1.0 / (1.0 + Math.abs(oy)));

            positions[i3] = px;
            positions[i3 + 1] = py;
            positions[i3 + 2] = pz;
        }
        particleGeometry.attributes.position.needsUpdate = true;

        // Slight parallax tilt of overall master group
        masterGroup.position.x = mouse.x * 0.25;
        masterGroup.position.y = mouse.y * 0.25;

        renderer.render(scene, camera);
    }

    // Trigger initial layout resize & start loop
    setTimeout(handleResize, 50);
    animate();
}
