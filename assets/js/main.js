document.addEventListener('DOMContentLoaded', () => {
    // Setup automatic synchronization of mask phase to eliminate any mismatch across all pages and transition overlays
    const observeAllIndicators = () => {
        const indicators = document.querySelectorAll('.mercury-indicator');
        indicators.forEach(indicator => {
            const syncMask = () => {
                const leftVal = indicator.style.left || '0px';
                indicator.style.setProperty('--indicator-left', leftVal);
            };
            
            syncMask();
            const observer = new MutationObserver(syncMask);
            observer.observe(indicator, { attributes: true, attributeFilter: ['style'] });
        });
    };
    observeAllIndicators();

    // Check if we came from Services page for custom slide-in transition
    if (sessionStorage.getItem('fromServices') === 'true') {
        sessionStorage.removeItem('fromServices');

        // Setup smooth background transition
        document.body.style.setProperty('background-color', '#d3dbe4', 'important');
        document.documentElement.style.setProperty('background-color', '#d3dbe4', 'important');
        document.body.classList.add('bg-transition-blend');
        document.documentElement.classList.add('bg-transition-blend');

        // Target Home content containers
        const homeElements = [
            document.getElementById('bg-design-layer'),
            document.getElementById('hero-video-container'),
            document.getElementById('overlay'),
            document.getElementById('scrollHint')
        ];

        // 1. Instantly position them at translateX(-100vw)
        homeElements.forEach(el => {
            if (el) el.classList.add('slide-in-left-start');
        });

        // 2. Trigger the slide-in and background color blend on next frames
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                // Smoothly transition background color to Home dark
                document.body.style.setProperty('background-color', '#050505', 'important');
                document.documentElement.style.setProperty('background-color', '#050505', 'important');

                // Animate elements from translateX(-100vw) to translateX(0)
                homeElements.forEach(el => {
                    if (el) {
                        el.classList.remove('slide-in-left-start');
                        el.classList.add('slide-in-left-active');
                    }
                });

                // Clean up classes after animation completes (600ms)
                setTimeout(() => {
                    document.body.classList.remove('bg-transition-blend');
                    document.documentElement.classList.remove('bg-transition-blend');
                    homeElements.forEach(el => {
                        if (el) el.classList.remove('slide-in-left-active');
                    });
                }, 600);
            });
        });
    }

    const video = document.getElementById('bg-video');
    
    // Increase video speed slightly (1.3x) for a snappier transition reveal
    if (video) {
        video.playbackRate = 1.3;
    }

    const videoContainer = document.getElementById('hero-video-container');
    const brandContainer = document.getElementById('brandContainer');
    const mainNav = document.getElementById('mainNav');
    const logoSection = document.querySelector('.logo-section');
    const scrollHint = document.getElementById('scrollHint');

    // Time in seconds when the smoke 'clears' (3.5s original / 1.3 speed = 2.7s)
    const REVEAL_TIME = 2.7;

    // Decrypt/Scramble HUD Text boot sequence decrypter (Uniform Randomized Parallel Decryption)
    const decryptText = (element, targetText, duration = 1600) => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+=-/\\";
        let start = null;
        
        // Pre-generate organic, scattered reveal thresholds for each character index
        const thresholds = Array.from({ length: targetText.length }, () => Math.random() * 0.85);
        
        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const percent = Math.min(progress / duration, 1);
            
            let output = "";
            for (let i = 0; i < targetText.length; i++) {
                if (targetText[i] === "\n") {
                    output += "<br>";
                } else if (targetText[i] === " ") {
                    output += " ";
                } else if (percent >= thresholds[i] || percent === 1) {
                    output += targetText[i];
                } else {
                    output += chars[Math.floor(Math.random() * chars.length)];
                }
            }
            
            element.innerHTML = output;
            if (progress < duration) {
                requestAnimationFrame(step);
            }
        };
        requestAnimationFrame(step);
    };

    const revealBranding = () => {
        // Mark intro as played in session storage
        sessionStorage.setItem('introPlayed', 'true');

        // Fade out and then remove the video container
        videoContainer.style.opacity = '0';
        setTimeout(() => {
            videoContainer.style.display = 'none';
        }, 2000); // Wait for the fade to finish

        brandContainer.classList.add('visible');
        mainNav.classList.add('visible');
        logoSection.classList.add('visible');
        if (scrollHint) scrollHint.classList.add('visible');

        // Trigger cinematic Scramble Decryption on the main logo text
        const brandName = document.querySelector('.brand-name');
        if (brandName) {
            decryptText(brandName, "VAJRA\nINFOTECH", 300);
        }

        // Initialize structured cybernetic data streaks canvas background
        initTechCanvas();
        initDataStreams();

        // Background layer is naturally revealed as the video fades

        // Initialize mercury indicator on the active link
        setTimeout(initMercury, 2500);
    };

    const initDataStreams = () => {
        const panels = document.querySelectorAll('.dark-tech-panel');
        if (panels.length === 0) return;

        const hexChars = "0123456789ABCDEF";
        const generateHex = () => {
            let res = "0x";
            for(let i=0; i<4; i++) res += hexChars[Math.floor(Math.random() * 16)];
            return res;
        };
        const metrics = ["SYS_LOAD:", "REQ/S:", "CPU:", "MEM:", "NET_IO:", "PING:"];

        panels.forEach((panel) => {
            // Only add a stream to ~40% of panels for a sparse, minimal look
            if (Math.random() > 0.4) return;

            if (window.getComputedStyle(panel).position === 'static') {
                panel.style.position = 'relative';
            }

            const streamContainer = document.createElement('div');
            streamContainer.className = 'data-stream';

            const col = document.createElement('div');
            col.className = 'data-stream-col';

            // Center the column within the panel
            col.style.left = '50%';
            col.style.transform = 'translateX(-50%)';
            col.style.textAlign = 'left';

            // Very slow scroll — 20s to 30s
            const animDuration = Math.random() * 10 + 20;
            col.style.animationDuration = `${animDuration}s`;
            col.style.animationDelay = `-${Math.random() * 30}s`;

            // Only 4–6 lines of content — very sparse
            const numLines = Math.floor(Math.random() * 3) + 4;
            let textContent = "";
            for (let j = 0; j < numLines; j++) {
                const roll = Math.random();
                if (roll > 0.7) {
                    const metric = metrics[Math.floor(Math.random() * metrics.length)];
                    const val = Math.floor(Math.random() * 9999);
                    textContent += `${metric} ${val}\n`;
                } else if (roll > 0.45) {
                    textContent += `${generateHex()}\n`;
                } else {
                    // Double blank lines for heavy breathing room
                    textContent += `\n\n`;
                }
            }
            col.textContent = textContent;
            streamContainer.appendChild(col);
            panel.appendChild(streamContainer);
        });
    };

    const initTechCanvas = () => {
        let canvas = document.getElementById('techCanvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'techCanvas';
            Object.assign(canvas.style, {
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: '0'
            });
            const bgLayer = document.getElementById('bg-design-layer');
            if (bgLayer) {
                bgLayer.insertBefore(canvas, bgLayer.firstChild); // Insert as first child behind glass panels
            }
        }
        
        const ctx = canvas.getContext('2d');
        const gridSize = 40; // Reduced size (from 80 to 40) for an intricate, high-density cybernetic grid pattern
        let streaks = [];

        // Interactive spring mouse coordinates for Grid Warp
        let mouseX = -1000;
        let mouseY = -1000;
        let gridMouseX = -1000;
        let gridMouseY = -1000;

        window.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        });

        window.addEventListener('mouseleave', () => {
            mouseX = -1000;
            mouseY = -1000;
        });

        // Eased topological warp field computation
        const getWarpedPoint = (x, y) => {
            if (gridMouseX < -500 || gridMouseY < -500) {
                return { x, y };
            }
            const dx = x - gridMouseX;
            const dy = y - gridMouseY;
            const distSq = dx * dx + dy * dy;
            const radius = 130; // Subtle active warp radius (reduced from 220)
            const radiusSq = radius * radius;

            if (distSq < radiusSq) {
                const dist = Math.sqrt(distSq);
                if (dist === 0) return { x, y };
                const force = (radius - dist) / radius; // Linear ratio: 1.0 (center) to 0.0 (edge)
                const easeForce = Math.sin(force * Math.PI / 2); // Dynamic sine wave transition
                const angle = Math.atan2(dy, dx);
                const pushDist = 12 * easeForce; // Subtle maximum displacement of 12px (reduced from 32px)
                return {
                    x: x + Math.cos(angle) * pushDist,
                    y: y + Math.sin(angle) * pushDist
                };
            }
            return { x, y };
        };

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        class DataStreak {
            constructor() {
                this.reset();
            }
            reset() {
                // Snap starting point to a grid intersection
                const cols = Math.floor(canvas.width / gridSize);
                const rows = Math.floor(canvas.height / gridSize);
                this.x = Math.floor(Math.random() * cols) * gridSize;
                this.y = Math.floor(Math.random() * rows) * gridSize;
                this.speed = 1.6; // Snapping-compatible cinematic speed (80 / 1.6 = 50 exact frames per hop)
                this.dir = Math.floor(Math.random() * 4); // 0:R, 1:D, 2:L, 3:U
                this.length = 35 + Math.random() * 25; // Laser beam length
                this.life = 0;
                this.maxLife = 150 + Math.random() * 150;
            }
            update() {
                // Smooth snapping movement along the grid tracks
                if (this.dir === 0) this.x += this.speed;
                else if (this.dir === 1) this.y += this.speed;
                else if (this.dir === 2) this.x -= this.speed;
                else if (this.dir === 3) this.y -= this.speed;

                this.life++;
                if (this.life > this.maxLife || this.x < -this.length || this.x > canvas.width + this.length || this.y < -this.length || this.y > canvas.height + this.length) {
                    this.reset();
                    return;
                }

                // Snap-on-intersection turning decision
                if (this.x % gridSize === 0 && this.y % gridSize === 0) {
                    // 25% chance to change direction at intersections
                    if (Math.random() < 0.25) {
                        const currentDir = this.dir;
                        // If was moving horizontally, turn vertically. If moving vertically, turn horizontally.
                        if (currentDir === 0 || currentDir === 2) {
                            this.dir = Math.random() < 0.5 ? 1 : 3; // Down or Up
                        } else {
                            this.dir = Math.random() < 0.5 ? 0 : 2; // Right or Left
                        }
                    }
                }
            }
            draw() {
                ctx.save();
                ctx.shadowBlur = 10;
                ctx.shadowColor = 'rgba(255, 255, 255, 0.35)'; // Subtle white glow
                ctx.lineWidth = 1.8;

                const angle = this.getAngle();
                const segments = 8;

                // Collect warped coordinates along laser tail path
                const points = [];
                for (let i = 0; i <= segments; i++) {
                    const t = i / segments;
                    const segmentLength = t * this.length;
                    const unwarpedX = this.x - Math.cos(angle) * segmentLength;
                    const unwarpedY = this.y - Math.sin(angle) * segmentLength;
                    points.push(getWarpedPoint(unwarpedX, unwarpedY));
                }

                // Draw gradient laser path along warped curve segments
                ctx.beginPath();
                ctx.moveTo(points[0].x, points[0].y);
                for (let i = 1; i < points.length; i++) {
                    ctx.lineTo(points[i].x, points[i].y);
                }

                // Create precise gradient along the warped laser path coordinates
                const gradient = ctx.createLinearGradient(
                    points[0].x, points[0].y,
                    points[points.length - 1].x, points[points.length - 1].y
                );
                gradient.addColorStop(0, '#ffffff'); // Laser head (solid white)
                gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.5)'); // Laser body
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)'); // Fading tail

                ctx.strokeStyle = gradient;
                ctx.stroke();
                ctx.restore();
            }
            getAngle() {
                if (this.dir === 0) return 0;
                if (this.dir === 1) return Math.PI / 2;
                if (this.dir === 2) return Math.PI;
                if (this.dir === 3) return -Math.PI / 2;
                return 0;
            }
        }

        // Initialize 15 high-speed data streaks
        for (let i = 0; i < 15; i++) {
            streaks.push(new DataStreak());
        }

        // Subdivided grid path calculation
        const drawGrid = () => {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.09)'; // Fine-tuned opacity for a refined, premium technical layout
            ctx.lineWidth = 1;

            // Draw warped vertical grid lines
            for (let x = 0; x <= canvas.width; x += gridSize) {
                ctx.beginPath();
                let first = true;
                for (let y = 0; y <= canvas.height; y += 20) { // Subdivided segments
                    const warped = getWarpedPoint(x, y);
                    if (first) {
                        ctx.moveTo(warped.x, warped.y);
                        first = false;
                    } else {
                        ctx.lineTo(warped.x, warped.y);
                    }
                }
                const lastWarped = getWarpedPoint(x, canvas.height);
                ctx.lineTo(lastWarped.x, lastWarped.y);
                ctx.stroke();
            }

            // Draw warped horizontal grid lines
            for (let y = 0; y <= canvas.height; y += gridSize) {
                ctx.beginPath();
                let first = true;
                for (let x = 0; x <= canvas.width; x += 20) { // Subdivided segments
                    const warped = getWarpedPoint(x, y);
                    if (first) {
                        ctx.moveTo(warped.x, warped.y);
                        first = false;
                    } else {
                        ctx.lineTo(warped.x, warped.y);
                    }
                }
                const lastWarped = getWarpedPoint(canvas.width, y);
                ctx.lineTo(lastWarped.x, lastWarped.y);
                ctx.stroke();
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Interpolate tracking coordinate values for elegant spring inertia
            if (mouseX > -500 && mouseY > -500) {
                if (gridMouseX < -500) {
                    gridMouseX = mouseX;
                    gridMouseY = mouseY;
                } else {
                    gridMouseX += (mouseX - gridMouseX) * 0.08;
                    gridMouseY += (mouseY - gridMouseY) * 0.08;
                }
            } else {
                if (gridMouseX > -500) {
                    gridMouseX += (-1000 - gridMouseX) * 0.08;
                    gridMouseY += (-1000 - gridMouseY) * 0.08;
                    if (gridMouseX < -950) {
                        gridMouseX = -1000;
                        gridMouseY = -1000;
                    }
                }
            }

            drawGrid();
            streaks.forEach(s => {
                s.update();
                s.draw();
            });
            requestAnimationFrame(animate);
        };
        animate();
    };

    const initMercury = () => {
        const indicator = document.getElementById('mercuryIndicator');
        const activeLink = document.querySelector('.nav-active');
        const navLinks = document.querySelectorAll('.main-nav a');

        const moveIndicator = (element) => {
            const rect = element.getBoundingClientRect();
            const navRect = document.getElementById('mainNav').getBoundingClientRect();

            indicator.style.width = `${rect.width + 40}px`;
            indicator.style.left = `${rect.left - navRect.left - 20}px`;
        };

        // Set initial position instantly without transition
        if (activeLink && indicator) {
            indicator.classList.add('no-transition');
            moveIndicator(activeLink);
            // Force a reflow
            indicator.offsetHeight;
            indicator.style.opacity = '1';
            
            // Restore hover slide transition
            setTimeout(() => {
                indicator.classList.remove('no-transition');
            }, 50);
        }

        // Add hover listeners to all links
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', () => moveIndicator(link));
            // Return to active link on mouse leave
            link.addEventListener('mouseleave', () => {
                const currentActive = document.querySelector('.nav-active');
                if (currentActive) moveIndicator(currentActive);
            });
            // Update active link on click
            link.addEventListener('click', (e) => {
                navLinks.forEach(l => l.classList.remove('nav-active'));
                link.classList.add('nav-active');
                moveIndicator(link);
            });
        });
    };

    // Premium Mouse Wheel Navigation Scrolling inside Navbar
    const initNavWheelScroll = () => {
        const mainNav = document.getElementById('mainNav');
        if (!mainNav) return;

        let isScrollingNav = false;
        const pageLoadTime = Date.now(); // Track exact document load time

        mainNav.addEventListener('wheel', (e) => {
            // Prevent default scroll behavior
            e.preventDefault();

            // 1. Ignore scroll inputs during the first 1000ms of a fresh page load.
            // This completely filters out residual trackpad/mouse scroll wheel momentum from the previous page!
            if (Date.now() - pageLoadTime < 1000) return;

            // 2. Ignore inputs if a page transition is currently active or locked
            if (isScrollingNav || window.isTransitioning) return;

            // 3. Only trigger page cycle if scroll speed exceeds a distinct threshold (to prevent hyper-sensitive slips)
            if (Math.abs(e.deltaY) < 60) return;

            const navLinks = Array.from(mainNav.querySelectorAll('a'));
            const currentActive = mainNav.querySelector('.nav-active');
            if (!currentActive) return;

            const currentIndex = navLinks.indexOf(currentActive);
            let targetIndex = currentIndex;

            if (e.deltaY > 0) {
                // Scroll down -> Next link
                targetIndex = currentIndex + 1;
            } else if (e.deltaY < 0) {
                // Scroll up -> Previous link
                targetIndex = currentIndex - 1;
            }

            if (targetIndex >= 0 && targetIndex < navLinks.length && targetIndex !== currentIndex) {
                isScrollingNav = true;
                navLinks[targetIndex].click();

                // Enforce a deliberate 1200ms cooldown to guarantee perfect transitions
                setTimeout(() => {
                    isScrollingNav = false;
                }, 1200);
            }
        }, { passive: false });
    };
    initNavWheelScroll();

    // If the page is loaded via a refresh/reload, clear the sessionStorage flag so the intro plays again!
    try {
        const navEntries = performance.getEntriesByType('navigation');
        if (navEntries.length > 0 && navEntries[0].type === 'reload') {
            sessionStorage.removeItem('introPlayed');
        }
    } catch (e) {
        // Fallback for older performance API
        if (performance.navigation && performance.navigation.type === 1) {
            sessionStorage.removeItem('introPlayed');
        }
    }

    // Check if intro has already been played in this session
    if (sessionStorage.getItem('introPlayed') === 'true') {
        if (videoContainer) videoContainer.style.display = 'none';
        // Delay slightly to allow the browser to paint the hidden state, 
        // which forces the CSS entrance animations to play!
        setTimeout(() => {
            revealBranding();
        }, 100);
    } else {
        // Trigger reveal based on video playback time
        if (video) {
            video.addEventListener('timeupdate', () => {
                if (video.currentTime >= REVEAL_TIME) {
                    revealBranding();
                }
            });

            // Fallback: If video ends or fails, reveal anyway after 5 seconds
            video.addEventListener('ended', revealBranding);
        }

        setTimeout(() => {
            if (brandContainer && !brandContainer.classList.contains('visible')) {
                revealBranding();
            }
        }, 6000);
    }

    // Page Transition Logic (Snappy and Clean with Custom Overlay Sweeps)
    const performPageTransition = (targetUrl, overlayEl, type, setIndicatorCallback) => {
        if (window.isTransitioning) return;
        window.isTransitioning = true;

        // 1. Synchronize navigation mercury indicators
        if (setIndicatorCallback) {
            setIndicatorCallback();
        }

        // 2. Override root canvas background color to match the target page's background color.
        // This eliminates any blank screen flashes or browser canvas unload blinks!
        if (targetUrl.includes('index.html')) {
            document.body.style.setProperty('background-color', '#050505', 'important');
            document.documentElement.style.setProperty('background-color', '#050505', 'important');
        } else if (targetUrl.includes('pages/product.html') || targetUrl.includes('pages/about.html')) {
            document.body.style.setProperty('background-color', '#161616', 'important');
            document.documentElement.style.setProperty('background-color', '#161616', 'important');
        } else {
            document.body.style.setProperty('background-color', '#d3dbe4', 'important');
            document.documentElement.style.setProperty('background-color', '#d3dbe4', 'important');
        }

        // 3. Immediately sweep the overlay in!
        if (overlayEl) {
            if (type === 'style') {
                overlayEl.style.width = '100vw';
            } else {
                overlayEl.classList.add('active');
            }
        }

        // 4. Hard navigate after transition sweeps full screen (1200ms match CSS transition)
        setTimeout(() => {
            window.location.href = targetUrl;
        }, 1200);
    };

    const servicesLink = document.getElementById('services-link');
    const transitionOverlay = document.getElementById('page-transition-overlay');
    const transitionIndicator = document.getElementById('transitionIndicator');

    if (servicesLink) {
        servicesLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.isTransitioning) return;
            window.isTransitioning = true;
            
            // 1. Synchronize the mercury indicator
            const serviceTransLink = document.querySelector('#transitionNav a[href="pages/service.html"]');
            if (serviceTransLink && transitionIndicator) {
                const rect = serviceTransLink.getBoundingClientRect();
                const navRect = document.getElementById('transitionNav').getBoundingClientRect();
                transitionIndicator.style.width = `${rect.width + 40}px`;
                transitionIndicator.style.left = `${rect.left - navRect.left - 20}px`;
            }

            // 2. Set sessionStorage flag for service.html to slide-in from right
            sessionStorage.setItem('fromHome', 'true');

            // 3. Add smooth background blend override to light-gray
            document.body.classList.add('bg-transition-blend');
            document.documentElement.classList.add('bg-transition-blend');
            document.body.style.setProperty('background-color', '#d3dbe4', 'important');
            document.documentElement.style.setProperty('background-color', '#d3dbe4', 'important');

            // 4. Slide out Home elements to the left
            const homeElements = [
                document.getElementById('bg-design-layer'),
                document.getElementById('hero-video-container'),
                document.getElementById('overlay'),
                document.getElementById('scrollHint')
            ];
            homeElements.forEach(el => {
                if (el) el.classList.add('slide-out-left');
            });

            // 5. Navigate to service.html after slide completes (600ms)
            setTimeout(() => {
                window.location.href = 'pages/service.html';
            }, 600);
        });
    }

    const productsLink = document.getElementById('products-link');
    const transitionOverlayProduct = document.getElementById('page-transition-overlay-product');

    if (productsLink && transitionOverlayProduct) {
        productsLink.addEventListener('click', (e) => {
            e.preventDefault();
            performPageTransition(
                'product.html',
                transitionOverlayProduct,
                'style',
                () => {
                    const productTransLink = document.querySelector('#transitionNavProduct a[href="pages/product.html"]');
                    const transitionIndicatorProduct = document.getElementById('transitionIndicatorProduct');
                    if (productTransLink && transitionIndicatorProduct) {
                        const rect = productTransLink.getBoundingClientRect();
                        const navRect = document.getElementById('transitionNavProduct').getBoundingClientRect();
                        transitionIndicatorProduct.style.width = `${rect.width + 40}px`;
                        transitionIndicatorProduct.style.left = `${rect.left - navRect.left - 20}px`;
                    }
                }
            );
        });
    }

    const processLink = document.getElementById('process-link');
    const transitionOverlayProcess = document.getElementById('page-transition-overlay-process');

    if (processLink && transitionOverlayProcess) {
        processLink.addEventListener('click', (e) => {
            e.preventDefault();
            performPageTransition(
                'process.html',
                transitionOverlayProcess,
                'style',
                () => {
                    const processTransLink = document.querySelector('#transitionNavProcess a[href="pages/process.html"]');
                    const transitionIndicatorProcess = document.getElementById('transitionIndicatorProcess');
                    if (processTransLink && transitionIndicatorProcess) {
                        const rect = processTransLink.getBoundingClientRect();
                        const navRect = document.getElementById('transitionNavProcess').getBoundingClientRect();
                        transitionIndicatorProcess.style.width = `${rect.width + 40}px`;
                        transitionIndicatorProcess.style.left = `${rect.left - navRect.left - 20}px`;
                    }
                }
            );
        });
    }

    const aboutLink = document.getElementById('about-link');
    const transitionOverlayAbout = document.getElementById('page-transition-overlay-about');

    if (aboutLink && transitionOverlayAbout) {
        aboutLink.addEventListener('click', (e) => {
            e.preventDefault();
            performPageTransition(
                'about.html',
                transitionOverlayAbout,
                'style',
                () => {
                    const aboutTransLink = document.querySelector('#transitionNavAbout a[href="pages/about.html"]');
                    const transitionIndicatorAbout = document.getElementById('transitionIndicatorAbout');
                    if (aboutTransLink && transitionIndicatorAbout) {
                        const rect = aboutTransLink.getBoundingClientRect();
                        const navRect = document.getElementById('transitionNavAbout').getBoundingClientRect();
                        transitionIndicatorAbout.style.width = `${rect.width + 40}px`;
                        transitionIndicatorAbout.style.left = `${rect.left - navRect.left - 20}px`;
                    }
                }
            );
        });
    }

    const contactLink = document.getElementById('contact-link');
    const transitionOverlayContact = document.getElementById('page-transition-overlay-contact');

    if (contactLink && transitionOverlayContact) {
        contactLink.addEventListener('click', (e) => {
            e.preventDefault();
            performPageTransition(
                'contact.html',
                transitionOverlayContact,
                'style',
                () => {
                    const contactTransLink = document.querySelector('#transitionNavContact a[href="pages/contact.html"]');
                    const transitionIndicatorContact = document.getElementById('transitionIndicatorContact');
                    if (contactTransLink && transitionIndicatorContact) {
                        const rect = contactTransLink.getBoundingClientRect();
                        const navRect = document.getElementById('transitionNavContact').getBoundingClientRect();
                        transitionIndicatorContact.style.width = `${rect.width + 40}px`;
                        transitionIndicatorContact.style.left = `${rect.left - navRect.left - 20}px`;
                    }
                }
            );
        });
    }

    // 3D Inertia Parallax effect on background design layer
    const bgDesignLayer = document.getElementById('bg-design-layer');
    if (bgDesignLayer) {
        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;

        window.addEventListener('mousemove', (e) => {
            // Normalize cursor position to range [-1, 1] relative to viewport center
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = (e.clientY / window.innerHeight) * 2 - 1;
        });

        // Smooth Lerp loop to animate the parallax values with elastic decay
        const animateParallax = () => {
            // Smooth inertia: 8% speed lerp
            currentX += (mouseX - currentX) * 0.08;
            currentY += (mouseY - currentY) * 0.08;
            
            // Set typography spotlight shadow offsets (max displacement of 15px)
            document.documentElement.style.setProperty('--text-shadow-x', currentX * 15);
            document.documentElement.style.setProperty('--text-shadow-y', currentY * 15);

            // Set refractive spotlight backlight coordinates elastically (convert [-1, 1] range to percentage)
            const backlightX = (currentX + 1) * 50;
            const backlightY = (currentY + 1) * 50;
            document.documentElement.style.setProperty('--backlight-x', `${backlightX}%`);
            document.documentElement.style.setProperty('--backlight-y', `${backlightY}%`);

            requestAnimationFrame(animateParallax);
        };
        animateParallax();
    }

    // 3D Card Hover Tilt for Vajra Circuit Logo
    const logoLogo = document.querySelector('.vajra-v-logo');
    if (logoLogo) {
        let mouseX = 0;
        let mouseY = 0;
        let currentRotationX = 0;
        let currentRotationY = 0;
        let isHovered = false;

        logoLogo.addEventListener('mouseenter', () => {
            isHovered = true;
        });

        logoLogo.addEventListener('mousemove', (e) => {
            const rect = logoLogo.getBoundingClientRect();
            // Calculate center of the logo
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // Normalize cursor position within logo bounds to range [-1, 1]
            mouseX = (e.clientX - centerX) / (rect.width / 2);
            mouseY = (e.clientY - centerY) / (rect.height / 2);
        });

        logoLogo.addEventListener('mouseleave', () => {
            isHovered = false;
            mouseX = 0;
            mouseY = 0;
        });

        const animateTilt = () => {
            const targetRotX = isHovered ? -mouseY * 20 : 0; // Rotate up to 20 degrees
            const targetRotY = isHovered ? mouseX * 20 : 0;

            // Elastic lerp interpolation (12% speed)
            currentRotationX += (targetRotX - currentRotationX) * 0.12;
            currentRotationY += (targetRotY - currentRotationY) * 0.12;

            // Apply 3D perspective rotation and hover scale
            logoLogo.style.transform = `perspective(1000px) rotateX(${currentRotationX}deg) rotateY(${currentRotationY}deg) scale(${isHovered ? 1.06 : 1})`;

            requestAnimationFrame(animateTilt);
        };
        animateTilt();
    }

    // --- Magnetic Letter Fields Tagline Distortion ---
    const initMagneticTagline = () => {
        const tagline = document.querySelector('.brand-tagline');
        if (!tagline) return;

        const text = tagline.textContent.trim();
        tagline.innerHTML = '';

        // Wrap each letter in a span for individual dynamic styling
        const chars = [...text].map(char => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char; // Preserves layout using non-breaking space
            span.className = 'mag-char';
            tagline.appendChild(span);
            return span;
        });

        const threshold = 120; // Proximity threshold in pixels

        window.addEventListener('mousemove', (e) => {
            chars.forEach(char => {
                const rect = char.getBoundingClientRect();
                const charX = rect.left + rect.width / 2;
                const charY = rect.top + rect.height / 2;

                const dx = e.clientX - charX;
                const dy = e.clientY - charY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < threshold) {
                    const pull = (threshold - dist) / threshold; // Scale from 0.0 (edge) to 1.0 (exact overlap)
                    const pullX = dx * pull * 0.14; // Max displacement ~16px
                    const pullY = dy * pull * 0.14;

                    char.style.transform = `translate(${pullX}px, ${pullY}px) scale(${1 + pull * 0.18})`;
                    char.style.color = '#ffffff';
                    char.style.textShadow = `0 0 ${pull * 8}px rgba(255, 255, 255, 0.8)`;
                } else {
                    // Smoothly ease back to baseline layout
                    char.style.transform = 'translate(0px, 0px) scale(1)';
                    char.style.color = '';
                    char.style.textShadow = '';
                }
            });
        });
    };
    initMagneticTagline();

    console.log("Vajra Infotech Landing Script Initialized");
});

