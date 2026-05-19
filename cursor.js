document.addEventListener('DOMContentLoaded', () => {
    let isTouch = false;

    // Create and append cursor elements dynamically
    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'mercury-dot';
    ring.className = 'mercury-ring';
    
    // Hide initially until mouse movement is detected
    dot.style.display = 'none';
    ring.style.display = 'none';
    
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    // Coordinate variables
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    // Snapped target dimensions
    let targetWidth = 32;
    let targetHeight = 32;
    let targetRadius = '50%';
    let targetBg = 'rgba(255, 255, 255, 0)';
    let targetBorderColor = 'rgba(255, 255, 255, 0.4)';

    let isMagnet = false;
    let magnetEl = null;

    // Detect actual touchstart event (to gracefully support hybrid touchscreens)
    window.addEventListener('touchstart', () => {
        isTouch = true;
        document.body.classList.remove('custom-cursor-active');
        dot.style.display = 'none';
        ring.style.display = 'none';
    }, { once: true });

    // Track mouse coordinates and activate custom cursor
    window.addEventListener('mousemove', (e) => {
        if (isTouch) return;
        
        // Show elements and add active class to hide default cursor
        document.body.classList.add('custom-cursor-active');
        dot.style.display = 'block';
        ring.style.display = 'block';
        
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Elastic Lerp Animation Loop
    function updateCursor() {
        if (isTouch) return;

        // Dot follows cursor immediately
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;

        if (isMagnet && magnetEl) {
            // Snap to element center with soft spring lag
            const rect = magnetEl.getBoundingClientRect();
            const elemX = rect.left + rect.width / 2;
            const elemY = rect.top + rect.height / 2;

            ringX += (elemX - ringX) * 0.25;
            ringY += (elemY - ringY) * 0.25;

            // Morph shape to match the element
            targetWidth = rect.width + 12;
            targetHeight = rect.height + 8;
            targetRadius = window.getComputedStyle(magnetEl).borderRadius || '4px';
            targetBg = 'rgba(255, 255, 255, 0.08)';
            targetBorderColor = 'rgba(255, 255, 255, 0.8)';
            
            // Add a small active hover scale to dot
            dot.style.width = '8px';
            dot.style.height = '8px';
        } else {
            // Free float following cursor with smooth spring lag
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;

            targetWidth = 32;
            targetHeight = 32;
            targetRadius = '50%';
            targetBg = 'rgba(255, 255, 255, 0)';
            targetBorderColor = 'rgba(255, 255, 255, 0.4)';
            
            dot.style.width = '6px';
            dot.style.height = '6px';
        }

        // Apply styles to ring
        ring.style.left = `${ringX}px`;
        ring.style.top = `${ringY}px`;
        ring.style.width = `${targetWidth}px`;
        ring.style.height = `${targetHeight}px`;
        ring.style.borderRadius = targetRadius;
        ring.style.backgroundColor = targetBg;
        ring.style.borderColor = targetBorderColor;

        requestAnimationFrame(updateCursor);
    }
    requestAnimationFrame(updateCursor);


    // Setup Magnetic Hover Listeners
    function setupMagneticListeners() {
        const targetElements = document.querySelectorAll(
            '.flowchart-node, .product-image-wrapper'
        );

        targetElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                isMagnet = true;
                magnetEl = el;
            });
            el.addEventListener('mouseleave', () => {
                isMagnet = false;
                magnetEl = null;
            });
        });
    }

    setupMagneticListeners();

    // Re-bind listeners on dynamic DOM changes
    const observer = new MutationObserver(() => {
        setupMagneticListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });
});
