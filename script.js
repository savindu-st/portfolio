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

    // Functional Contact Form Submission with Web3Forms & Real-time Validation
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');
    const btnIcon = document.getElementById('btnIcon');
    const btnText = document.getElementById('btnText');

    if (contactForm) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const subjectInput = document.getElementById('subject');
        const messageInput = document.getElementById('message');

        const inputs = [
            { el: nameInput, group: document.getElementById('group-name'), err: document.getElementById('nameError'), validate: (val) => val.trim().length >= 2 ? '' : 'Please enter your name (at least 2 characters).' },
            { el: emailInput, group: document.getElementById('group-email'), err: document.getElementById('emailError'), validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()) ? '' : 'Please enter a valid email address.' },
            { el: subjectInput, group: document.getElementById('group-subject'), err: document.getElementById('subjectError'), validate: (val) => val.trim().length >= 2 ? '' : 'Please enter a subject.' },
            { el: messageInput, group: document.getElementById('group-message'), err: document.getElementById('messageError'), validate: (val) => val.trim().length >= 8 ? '' : 'Message must be at least 8 characters long.' }
        ];

        // Clear error on input typing
        inputs.forEach(({ el, group, err }) => {
            if (el) {
                el.addEventListener('input', () => {
                    group.classList.remove('has-error');
                    if (err) err.textContent = '';
                });
            }
        });

        // Form Submit Handler
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Clear existing status
            formStatus.className = 'form-status';
            formStatus.innerHTML = '';

            // Run client validations
            let hasErrors = false;
            inputs.forEach(({ el, group, err, validate }) => {
                if (el) {
                    const errorMsg = validate(el.value);
                    if (errorMsg) {
                        group.classList.add('has-error');
                        if (err) err.textContent = errorMsg;
                        hasErrors = true;
                    } else {
                        group.classList.remove('has-error');
                        if (err) err.textContent = '';
                    }
                }
            });

            if (hasErrors) {
                const firstInvalid = contactForm.querySelector('.form-group.has-error input, .form-group.has-error textarea');
                if (firstInvalid) firstInvalid.focus();
                return;
            }

            // Extract Access Key
            const accessKeyInput = document.getElementById('accessKey');
            const accessKey = accessKeyInput ? accessKeyInput.value.trim() : '';

            // Prepare Payload
            const formData = new FormData(contactForm);
            const payload = Object.fromEntries(formData.entries());

            // UI: Loading State
            submitBtn.disabled = true;
            const originalIconHTML = btnIcon ? btnIcon.innerHTML : '';
            const originalText = btnText ? btnText.textContent : 'Send Message';

            if (btnIcon) {
                btnIcon.innerHTML = `<svg class="svg-icon spinner-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12"></circle></svg>`;
            }
            if (btnText) btnText.textContent = 'Sending...';

            try {
                // If user has not yet replaced the demo key, inform them cleanly with a fallback
                if (!accessKey || accessKey === 'YOUR_ACCESS_KEY_HERE') {
                    await new Promise(r => setTimeout(r, 600)); // Smooth brief visual feedback
                    
                    formStatus.className = 'form-status info';
                    formStatus.innerHTML = `
                        <svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                        <div>
                            <strong>Nearly Ready!</strong> Please add your free Web3Forms access key in <code>index.html</code>, or click to email directly: 
                            <a href="mailto:savindus.23@cse.mrt.ac.lk?subject=${encodeURIComponent(payload.subject || 'Portfolio Inquiry')}&body=${encodeURIComponent(`Hi Savindu,\n\n${payload.message || ''}\n\nFrom: ${payload.name || ''} (${payload.email || ''})`)}">savindus.23@cse.mrt.ac.lk</a>.
                        </div>
                    `;
                    return;
                }

                // Live API Dispatch to Web3Forms
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (response.status === 200 && data.success) {
                    // Success feedback
                    formStatus.className = 'form-status success';
                    formStatus.innerHTML = `
                        <svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        <div>
                            <strong>Message Sent!</strong> Thank you, ${payload.name}. Your message has been delivered to my inbox. I'll get back to you soon.
                        </div>
                    `;
                    contactForm.reset();

                    // Automatically clear success banner after 8 seconds
                    setTimeout(() => {
                        formStatus.innerHTML = '';
                        formStatus.className = 'form-status';
                    }, 8000);
                } else {
                    // Service error
                    throw new Error(data.message || 'Submission failed. Please check your details.');
                }

            } catch (error) {
                console.error('Contact Form Error:', error);
                formStatus.className = 'form-status error';
                formStatus.innerHTML = `
                    <svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    <div>
                        <strong>Unable to send:</strong> ${error.message || 'An error occurred.'} You can reach me directly at <a href="mailto:savindus.23@cse.mrt.ac.lk?subject=${encodeURIComponent(payload.subject || 'Portfolio Inquiry')}">savindus.23@cse.mrt.ac.lk</a>.
                    </div>
                `;
            } finally {
                // Restore button state
                submitBtn.disabled = false;
                if (btnIcon) btnIcon.innerHTML = originalIconHTML;
                if (btnText) btnText.textContent = originalText;
            }
        });
    }

    // Initialize 3D Hero Canvas
    initHero3DCanvas();
});

/* =========================================================================
   Interactive 3D Hero Canvas (Three.js)
   AI Neural Structural Mesh, Orbiting Tech Stack Badges & Holographic HUD
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
        opacity: 0.38,
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

    // Inner Crystalline Core (Solid translucent)
    const crystalGeo = new THREE.OctahedronGeometry(0.65, 0);
    const crystalMat = new THREE.MeshPhysicalMaterial({
        color: 0x0ea5e9,
        transparent: true,
        opacity: 0.5,
        roughness: 0.1,
        metalness: 0.1,
        transmission: 0.8
    });
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    coreGroup.add(crystalMesh);

    // 4. Gyroscopic Cyber Orbital Rings
    const ring1Geo = new THREE.TorusGeometry(2.55, 0.015, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({
        color: 0x0ea5e9,
        transparent: true,
        opacity: 0.55
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    masterGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.95, 0.015, 16, 100);
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
    const satGeo = new THREE.SphereGeometry(0.055, 12, 12);
    const satMat1 = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const sat1 = new THREE.Mesh(satGeo, satMat1);
    masterGroup.add(sat1);

    const satMat2 = new THREE.MeshBasicMaterial({ color: 0x34d399 });
    const sat2 = new THREE.Mesh(satGeo, satMat2);
    masterGroup.add(sat2);

    // 5. Quantum Data Particle Swarm
    const particleCount = 520;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleOrigins = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);
    const particlePhases = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
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

    /* =========================================================================
       7. 3D Floating Tech Stack Nodes & High-Resolution Vector Badge Generator
       ========================================================================= */
    const techStackList = [
        { id: 'react', name: 'React & React Native', shortName: 'REACT', tag: 'Core / Mobile', desc: 'Cross-platform mobile apps & declarative components', color: '#61dafb', iconEmoji: '⚛️', ring: 1, radius: 2.55, offset: 0, speed: 0.35 },
        { id: 'js', name: 'JavaScript (ES6+)', shortName: 'JS', tag: 'Language', desc: 'Modern asynchronous web apps & reactive interfaces', color: '#f7df1e', iconEmoji: '📜', ring: 1, radius: 2.55, offset: (Math.PI / 3), speed: 0.35 },
        { id: 'docker', name: 'Docker Container', shortName: 'DOCKER', tag: 'DevOps', desc: 'Microservices containerization & reproducible envs', color: '#38bdf8', iconEmoji: '🐳', ring: 1, radius: 2.55, offset: (2 * Math.PI / 3), speed: 0.35 },
        { id: 'python', name: 'Python 3', shortName: 'PYTHON', tag: 'AI & Backend', desc: 'Applied AI, LangGraph agent workflows & backend ML', color: '#38bdf8', iconEmoji: '🐍', ring: 1, radius: 2.55, offset: Math.PI, speed: 0.35 },
        { id: 'node', name: 'Node.js / Express', shortName: 'NODE.JS', tag: 'Backend', desc: 'High-concurrency RESTful APIs & event-driven backend', color: '#22c55e', iconEmoji: '🟢', ring: 1, radius: 2.55, offset: (4 * Math.PI / 3), speed: 0.35 },
        { id: 'git', name: 'Git & GitHub', shortName: 'GIT', tag: 'DevOps', desc: 'Distributed version control & automated CI/CD workflows', color: '#f97316', iconEmoji: '🐙', ring: 1, radius: 2.55, offset: (5 * Math.PI / 3), speed: 0.35 },
        
        { id: 'ts', name: 'TypeScript', shortName: 'TS', tag: 'Language', desc: 'Static typing, interfaces & scalable frontend architectures', color: '#3178c6', iconEmoji: '🔷', ring: 2, radius: 2.95, offset: (Math.PI / 6), speed: -0.28 },
        { id: 'langgraph', name: 'LangGraph & AI', shortName: 'LANGGRAPH', tag: 'Applied AI', desc: 'Autonomous multi-agent orchestration & vector RAG', color: '#c084fc', iconEmoji: '🧠', ring: 2, radius: 2.95, offset: (Math.PI / 2), speed: -0.28 },
        { id: 'mongo', name: 'MongoDB', shortName: 'MONGODB', tag: 'Database', desc: 'Flexible NoSQL document stores & Atlas cloud database', color: '#10b981', iconEmoji: '🍃', ring: 2, radius: 2.95, offset: (5 * Math.PI / 6), speed: -0.28 },
        { id: 'cpp', name: 'C++ Systems', shortName: 'C++', tag: 'Systems', desc: 'Algorithmic computing, DSA & performance-critical code', color: '#0ea5e9', iconEmoji: '⚙️', ring: 2, radius: 2.95, offset: (7 * Math.PI / 6), speed: -0.28 },
        { id: 'postgres', name: 'PostgreSQL', shortName: 'POSTGRES', tag: 'Database', desc: 'ACID relational databases, complex SQL & normalization', color: '#818cf8', iconEmoji: '🐘', ring: 2, radius: 2.95, offset: (3 * Math.PI / 2), speed: -0.28 },
        { id: 'mediapipe', name: 'MediaPipe CV', shortName: 'VISION', tag: 'Computer Vision', desc: 'On-device real-time pose estimation & face biometrics', color: '#06b6d4', iconEmoji: '👁️', ring: 2, radius: 2.95, offset: (11 * Math.PI / 6), speed: -0.28 }
    ];

    // Dedicated Orbit Groups matching gyroscopic ring planes
    const orbitGroup1 = new THREE.Group();
    orbitGroup1.rotation.x = Math.PI / 3;
    orbitGroup1.rotation.y = Math.PI / 6;
    masterGroup.add(orbitGroup1);

    const orbitGroup2 = new THREE.Group();
    orbitGroup2.rotation.x = -Math.PI / 4;
    orbitGroup2.rotation.z = Math.PI / 5;
    masterGroup.add(orbitGroup2);

    // Canvas Texture Generator for High-Resolution Glass Badges
    function createTechBadgeTexture(tech) {
        const size = 256;
        const offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = size;
        offscreenCanvas.height = size;
        const ctx = offscreenCanvas.getContext('2d');

        const cx = size / 2;
        const cy = 106;
        const r = 70;

        // Outer Glow Halo
        ctx.save();
        ctx.shadowColor = tech.color;
        ctx.shadowBlur = 24;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Glassmorphic Inner Radial Gradient
        const grad = ctx.createRadialGradient(cx, cy - 20, 10, cx, cy, r);
        grad.addColorStop(0, 'rgba(30, 41, 59, 0.95)');
        grad.addColorStop(0.7, 'rgba(15, 23, 42, 0.96)');
        grad.addColorStop(1, 'rgba(10, 15, 25, 0.98)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, r - 2, 0, Math.PI * 2);
        ctx.fill();

        // Glowing Cyber Rim Border
        ctx.strokeStyle = tech.color;
        ctx.lineWidth = 4.5;
        ctx.stroke();

        // Inner Tech-Corner Accents
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, r - 8, -Math.PI * 0.25, Math.PI * 0.25);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, r - 8, Math.PI * 0.75, Math.PI * 1.25);
        ctx.stroke();

        // Draw Specific Vector Brand Glyphs inside the badge
        ctx.save();
        ctx.translate(cx, cy);
        drawTechVectorGlyph(ctx, tech.id, tech.color);
        ctx.restore();

        // Label Pill Box below Badge
        const pillY = 202;
        const pillW = 140;
        const pillH = 34;
        const pillX = cx - pillW / 2;
        const pillR = 10;

        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.6)';
        ctx.shadowBlur = 10;
        ctx.fillStyle = 'rgba(10, 15, 22, 0.94)';
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(pillX, pillY, pillW, pillH, pillR) : ctx.rect(pillX, pillY, pillW, pillH);
        ctx.fill();

        ctx.strokeStyle = tech.color;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Label Typography
        ctx.font = '700 17px Inter, -apple-system, sans-serif';
        ctx.fillStyle = '#f8fafc';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(tech.shortName, cx, pillY + pillH / 2 + 1);
        ctx.restore();

        const texture = new THREE.CanvasTexture(offscreenCanvas);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        return texture;
    }

    // High Precision Canvas Vector Drawing for Each Tech Stack
    function drawTechVectorGlyph(ctx, id, color) {
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        switch (id) {
            case 'react':
                // Central Nucleus Dot
                ctx.beginPath();
                ctx.arc(0, 0, 7.5, 0, Math.PI * 2);
                ctx.fill();
                // 3 Orbital Ellipses
                for (let i = 0; i < 3; i++) {
                    ctx.save();
                    ctx.rotate(i * (Math.PI / 3));
                    ctx.beginPath();
                    ctx.ellipse(0, 0, 36, 13, 0, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.restore();
                }
                break;

            case 'js':
                // JS Monogram Badge
                ctx.font = '900 36px Inter, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('JS', 0, 2);
                break;

            case 'ts':
                // TS Monogram Badge
                ctx.font = '900 36px Inter, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('TS', 0, 2);
                break;

            case 'docker':
                // Docker Container Grid & Whale Silhouette
                // Container boxes
                const bw = 10, bh = 8;
                const bx = -22, by = -18;
                for (let row = 0; row < 2; row++) {
                    for (let col = 0; col < 3; col++) {
                        ctx.fillStyle = color;
                        ctx.fillRect(bx + col * (bw + 2), by + row * (bh + 2), bw, bh);
                    }
                }
                ctx.fillRect(bx + 1 * (bw + 2), by - 10, bw, bh);
                // Whale body bottom curve
                ctx.beginPath();
                ctx.moveTo(-28, 4);
                ctx.lineTo(26, 4);
                ctx.bezierCurveTo(28, 16, 12, 22, -10, 22);
                ctx.bezierCurveTo(-26, 22, -32, 14, -28, 4);
                ctx.fill();
                // Whale Tail
                ctx.beginPath();
                ctx.moveTo(-28, 4);
                ctx.lineTo(-36, -4);
                ctx.lineTo(-34, 4);
                ctx.fill();
                break;

            case 'python':
                // Dual Interlocking Python Snakes
                // Top Snake (Cyan)
                ctx.beginPath();
                ctx.moveTo(-16, -18);
                ctx.lineTo(6, -18);
                ctx.arc(6, -8, 10, -Math.PI / 2, 0);
                ctx.lineTo(16, 0);
                ctx.arc(6, 0, 10, 0, Math.PI / 2);
                ctx.lineTo(-6, 10);
                ctx.stroke();
                // Eye 1
                ctx.beginPath();
                ctx.arc(0, -12, 3, 0, Math.PI * 2);
                ctx.fill();

                // Bottom Snake (Yellow Accent)
                ctx.strokeStyle = '#f59e0b';
                ctx.fillStyle = '#f59e0b';
                ctx.beginPath();
                ctx.moveTo(16, 18);
                ctx.lineTo(-6, 18);
                ctx.arc(-6, 8, 10, Math.PI / 2, Math.PI);
                ctx.lineTo(-16, 0);
                ctx.arc(-6, 0, 10, Math.PI, 3 * Math.PI / 2);
                ctx.lineTo(6, -10);
                ctx.stroke();
                // Eye 2
                ctx.beginPath();
                ctx.arc(0, 12, 3, 0, Math.PI * 2);
                ctx.fill();
                break;

            case 'node':
                // Hexagonal Node Logo with 'N'
                ctx.beginPath();
                for (let a = 0; a < 6; a++) {
                    const angle = a * Math.PI / 3 - Math.PI / 6;
                    const hx = Math.cos(angle) * 32;
                    const hy = Math.sin(angle) * 32;
                    if (a === 0) ctx.moveTo(hx, hy);
                    else ctx.lineTo(hx, hy);
                }
                ctx.closePath();
                ctx.stroke();
                ctx.font = '800 28px Inter, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('N', 0, 2);
                break;

            case 'cpp':
                // C++ Monogram with Cyber Brackets
                ctx.font = '800 28px Inter, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('C++', 0, 2);
                // Precision Cyber brackets
                ctx.beginPath();
                ctx.moveTo(-28, -14);
                ctx.lineTo(-34, -14);
                ctx.lineTo(-34, 14);
                ctx.lineTo(-28, 14);
                ctx.moveTo(28, -14);
                ctx.lineTo(34, -14);
                ctx.lineTo(34, 14);
                ctx.lineTo(28, 14);
                ctx.stroke();
                break;

            case 'git':
                // Git Branching Graph
                ctx.beginPath();
                // Main Stem
                ctx.moveTo(-12, -22);
                ctx.lineTo(-12, 22);
                // Branch Curve
                ctx.moveTo(-12, -4);
                ctx.bezierCurveTo(0, -4, 16, 2, 16, 12);
                ctx.stroke();
                // 3 Branch Commit Circles
                ctx.beginPath();
                ctx.arc(-12, -20, 5.5, 0, Math.PI * 2);
                ctx.arc(-12, 20, 5.5, 0, Math.PI * 2);
                ctx.arc(16, 14, 5.5, 0, Math.PI * 2);
                ctx.fill();
                break;

            case 'mongo':
                // MongoDB Leaf Shape
                ctx.beginPath();
                ctx.moveTo(0, -28);
                ctx.bezierCurveTo(22, -12, 22, 18, 0, 28);
                ctx.bezierCurveTo(-22, 18, -22, -12, 0, -28);
                ctx.fill();
                // Central leaf spine
                ctx.strokeStyle = '#064e3b';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(0, -22);
                ctx.lineTo(0, 24);
                ctx.stroke();
                break;

            case 'postgres':
                // Relational Database Cylinders / Stack
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.ellipse(0, -16, 26, 9, 0, 0, Math.PI * 2);
                ctx.fill();

                ctx.beginPath();
                ctx.moveTo(-26, -16);
                ctx.lineTo(-26, 4);
                ctx.ellipse(0, 4, 26, 9, 0, 0, Math.PI);
                ctx.lineTo(26, -16);
                ctx.fill();

                ctx.beginPath();
                ctx.moveTo(-26, 4);
                ctx.lineTo(-26, 18);
                ctx.ellipse(0, 18, 26, 9, 0, 0, Math.PI);
                ctx.lineTo(26, 4);
                ctx.fill();
                break;

            case 'langgraph':
                // Neural Multi-Agent Graph Network
                ctx.beginPath();
                ctx.arc(0, 0, 8, 0, Math.PI * 2);
                ctx.fill();
                // 4 Satellite Agent nodes connected by lines
                const nodes = [
                    { x: -22, y: -18 },
                    { x: 22, y: -18 },
                    { x: -22, y: 18 },
                    { x: 22, y: 18 }
                ];
                nodes.forEach(n => {
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(n.x, n.y);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(n.x, n.y, 5, 0, Math.PI * 2);
                    ctx.fill();
                });
                break;

            case 'mediapipe':
                // Computer Vision Landmark Aperture / Eye
                ctx.beginPath();
                ctx.ellipse(0, 0, 32, 18, 0, 0, Math.PI * 2);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(0, 0, 8, 0, Math.PI * 2);
                ctx.fill();
                // Crosshair corner tracking brackets
                ctx.beginPath();
                ctx.moveTo(-16, -16);
                ctx.lineTo(-10, -16);
                ctx.moveTo(-16, -16);
                ctx.lineTo(-16, -10);

                ctx.moveTo(16, -16);
                ctx.lineTo(10, -16);
                ctx.moveTo(16, -16);
                ctx.lineTo(16, -10);

                ctx.moveTo(-16, 16);
                ctx.lineTo(-10, 16);
                ctx.moveTo(-16, 16);
                ctx.lineTo(-16, 10);

                ctx.moveTo(16, 16);
                ctx.lineTo(10, 16);
                ctx.moveTo(16, 16);
                ctx.lineTo(16, 10);
                ctx.stroke();
                break;

            default:
                ctx.beginPath();
                ctx.arc(0, 0, 14, 0, Math.PI * 2);
                ctx.fill();
        }
    }

    // Build 3D Sprites for Each Tech Stack Item
    const techSprites = [];

    techStackList.forEach((tech, idx) => {
        const texture = createTechBadgeTexture(tech);
        const spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            depthTest: false,
            blending: THREE.NormalBlending
        });

        const sprite = new THREE.Sprite(spriteMaterial);
        const baseScale = 0.68;
        sprite.scale.set(baseScale, baseScale, 1);

        sprite.userData = {
            ...tech,
            baseScale: baseScale,
            currentScale: baseScale,
            targetScale: baseScale,
            pulseEnergy: 0,
            verticalPhase: (idx * (Math.PI / 6)),
            verticalSpeed: 1.1 + (idx % 3) * 0.2
        };

        if (tech.ring === 1) {
            orbitGroup1.add(sprite);
        } else {
            orbitGroup2.add(sprite);
        }

        techSprites.push(sprite);
    });

    // 8. Holographic HUD Tooltip Element & Interaction State
    const tooltipHud = document.getElementById('tech-tooltip-hud');
    const tooltipIcon = document.getElementById('techTooltipIcon');
    const tooltipTitle = document.getElementById('techTooltipTitle');
    const tooltipTag = document.getElementById('techTooltipTag');
    const tooltipDesc = document.getElementById('techTooltipDesc');

    function showTechTooltip(data) {
        if (!tooltipHud) return;
        if (tooltipIcon) tooltipIcon.textContent = data.iconEmoji || '⚡';
        if (tooltipTitle) tooltipTitle.textContent = data.name;
        if (tooltipTag) {
            tooltipTag.textContent = data.tag;
            tooltipTag.style.borderColor = data.color;
            tooltipTag.style.color = data.color;
        }
        if (tooltipDesc) tooltipDesc.textContent = data.desc;
        tooltipHud.classList.add('active');
    }

    function hideTechTooltip() {
        if (!tooltipHud) return;
        tooltipHud.classList.remove('active');
    }

    // 9. Interactive Physics, Raycasting & Cursor Handling
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2(-999, -999);
    let hoveredSprite = null;
    let isDragging = false;
    let previousPointerPosition = { x: 0, y: 0 };
    let dragRotationVelocity = { x: 0, y: 0 };
    let shockwaveIntensity = 0;
    let shockwaveTime = 0;
    let isHeroVisible = true;

    function onPointerMove(e) {
        const heroRect = heroSection.getBoundingClientRect();
        mouse.targetX = ((e.clientX - heroRect.left) / heroRect.width) * 2 - 1;
        mouse.targetY = -(((e.clientY - heroRect.top) / heroRect.height) * 2 - 1);
        
        mouse.targetX = Math.max(-1.2, Math.min(1.2, mouse.targetX));
        mouse.targetY = Math.max(-1.2, Math.min(1.2, mouse.targetY));

        // Raycaster Coordinates
        const canvasRect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((e.clientX - canvasRect.left) / canvasRect.width) * 2 - 1;
        pointer.y = -((e.clientY - canvasRect.top) / canvasRect.height) * 2 + 1;

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

    function onCanvasClick() {
        // If clicked on a tech sprite, boost its kinetic energy
        if (hoveredSprite) {
            hoveredSprite.userData.pulseEnergy = 1.2;
            triggerShockwave();
            showTechTooltip(hoveredSprite.userData);
        } else {
            triggerShockwave();
        }
    }

    function triggerShockwave() {
        shockwaveIntensity = 1.0;
        shockwaveTime = 0;
    }

    window.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    container.addEventListener('click', onCanvasClick);

    // Touch support for mobile devices
    container.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            isDragging = true;
            previousPointerPosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            
            const canvasRect = renderer.domElement.getBoundingClientRect();
            pointer.x = ((e.touches[0].clientX - canvasRect.left) / canvasRect.width) * 2 - 1;
            pointer.y = -((e.touches[0].clientY - canvasRect.top) / canvasRect.height) * 2 + 1;
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
        pointer.set(-999, -999);
    });

    // 10. Performance: Intersection Observer
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isHeroVisible = entry.isIntersecting;
        });
    }, { threshold: 0.05 });
    heroObserver.observe(heroSection);

    // 11. Resize Handling
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

    // 12. 60 FPS Render & Animation Loop
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
        outerMesh.rotation.y = elapsedTime * 0.12 + (mouse.x * 0.35);
        outerMesh.rotation.x = Math.sin(elapsedTime * 0.2) * 0.12 + (-mouse.y * 0.25);
        vertexPoints.rotation.copy(outerMesh.rotation);

        // Core Independent Counter-Rotation
        coreGroup.rotation.y = -elapsedTime * 0.45;
        coreGroup.rotation.z = elapsedTime * 0.3;
        coreGroup.rotation.x = Math.cos(elapsedTime * 0.3) * 0.25;

        // Ring Rotations
        ring1.rotation.z = elapsedTime * 0.22;
        ring2.rotation.y = -elapsedTime * 0.18;

        // Satellites motion along orbital paths
        const sat1Angle = elapsedTime * 0.8;
        sat1.position.set(
            Math.cos(sat1Angle) * 2.55,
            Math.sin(sat1Angle) * 1.8,
            Math.sin(sat1Angle * 0.5) * 1.2
        );

        const sat2Angle = -elapsedTime * 0.65;
        sat2.position.set(
            Math.sin(sat2Angle) * 1.6,
            Math.cos(sat2Angle) * 2.95,
            Math.cos(sat2Angle * 0.8) * 1.5
        );

        // Dynamic 3D Tech Stack Nodes Orbital Positioning
        techSprites.forEach((sprite) => {
            const data = sprite.userData;
            const currentAngle = data.offset + (elapsedTime * data.speed);
            const floatZ = Math.sin(elapsedTime * data.verticalSpeed + data.verticalPhase) * 0.16;

            const orbitX = Math.cos(currentAngle) * data.radius;
            const orbitY = Math.sin(currentAngle) * data.radius;
            sprite.position.set(orbitX, orbitY, floatZ);
        });

        // 3D Raycasting for Hover & Interactive Telemetry
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(techSprites, false);

        if (intersects.length > 0) {
            const hit = intersects[0].object;
            if (hoveredSprite !== hit) {
                hoveredSprite = hit;
                container.style.cursor = 'pointer';
                showTechTooltip(hoveredSprite.userData);
            }
        } else {
            if (hoveredSprite) {
                hoveredSprite = null;
                container.style.cursor = isDragging ? 'grabbing' : 'grab';
                hideTechTooltip();
            }
        }

        // Smooth Scale Interpolation for Hover & Kinetic Energy Pulse
        techSprites.forEach((sprite) => {
            const data = sprite.userData;
            const isHovered = (sprite === hoveredSprite);
            const target = (isHovered ? data.baseScale * 1.35 : data.baseScale) * (1 + data.pulseEnergy * 0.35);
            
            data.currentScale += (target - data.currentScale) * 0.12;
            sprite.scale.set(data.currentScale, data.currentScale, 1);

            if (data.pulseEnergy > 0.01) {
                data.pulseEnergy *= 0.93;
            }
        });

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

            const wave = Math.sin(elapsedTime * speed + phase) * 0.12;
            let px = ox + Math.sin(elapsedTime * 0.3 + phase) * 0.15;
            let py = oy + wave;
            let pz = oz + Math.cos(elapsedTime * 0.3 + phase) * 0.15;

            if (shockwaveIntensity > 0.01) {
                const dist = Math.sqrt(ox * ox + oy * oy + oz * oz);
                const push = (dist > 0.1 ? dist : 1.0) * shockwaveIntensity * 0.35;
                px += (ox / dist) * push;
                py += (oy / dist) * push;
                pz += (oz / dist) * push;
            }

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
