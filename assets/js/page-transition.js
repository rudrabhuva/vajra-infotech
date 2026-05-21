document.addEventListener('DOMContentLoaded', () => {
    // 1. Define the Master Navigation Map
    const pageIndexMap = {
        'service.html': { index: 1, theme: 'light' },
        'product.html': { index: 2, theme: 'dark' },
        'process.html': { index: 3, theme: 'light' },
        'about.html':   { index: 4, theme: 'dark' },
        'contact.html': { index: 5, theme: 'light' }
    };

    // Determine current page based on URL
    let currentPath = window.location.pathname.split('/').pop() || 'index.html';
    // Remove query params or hash if any
    currentPath = currentPath.split('?')[0].split('#')[0];

    const currentPageData = pageIndexMap[currentPath];

    // Dynamically Prefetch inner pages in the background for 100% lag-free instant navigation
    const prefetchPages = () => {
        const pages = ['index.html', 'service.html', 'product.html', 'process.html', 'about.html', 'contact.html'];
        pages.forEach(page => {
            if (page !== currentPath) {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = page;
                document.head.appendChild(link);
            }
        });
    };
    // Run prefetch after DOM is fully painted (idle/timeout delay of 1s to keep main paint thread free)
    if (window.requestIdleCallback) {
        window.requestIdleCallback(prefetchPages);
    } else {
        setTimeout(prefetchPages, 1000);
    }

    // If we are on Home page or unknown page, this generalized logic doesn't apply
    if (!currentPageData) return;

    // ==========================================
    // Dynamic Scroll-Velocity Blur & Vertical Parallax Physics
    // ==========================================
    let lastScrollTop = window.scrollY || document.documentElement.scrollTop;
    let scrollTimeout;
    let isScrolling = false;
    const bgContainer = document.querySelector('.neu-bg-container');

    window.addEventListener('scroll', () => {
        if (window.isTransitioning) return;
        const currentScrollTop = window.scrollY || document.documentElement.scrollTop;
        const delta = Math.abs(currentScrollTop - lastScrollTop);
        lastScrollTop = currentScrollTop;

        // 1. Calculate dynamic motion blur based on scroll speed (capped at beautiful 6.5px max)
        const blurAmount = Math.min(delta * 0.18, 6.5);
        document.documentElement.style.setProperty('--scroll-blur', `${blurAmount}px`);

        // 2. Add class indicating scrolling state to body
        if (!isScrolling && blurAmount > 0.5) {
            isScrolling = true;
            document.body.classList.add('is-scrolling');
        }

        // 3. Vertical Parallax Movement for the Neumorphic Background (if not transitioning)
        if (bgContainer && 
            !bgContainer.classList.contains('slide-in-right-active') && 
            !bgContainer.classList.contains('slide-in-left-active') &&
            !bgContainer.classList.contains('slide-in-right-start') &&
            !bgContainer.classList.contains('slide-in-left-start')) {
            // Translate the container vertically at a smooth 15% parallax ratio relative to scroll direction
            bgContainer.style.transform = `translate3d(0, ${currentScrollTop * -0.15}px, 0)`;
        }

        // 4. Snappy reset when scrolling halts
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
            document.body.classList.remove('is-scrolling');
            document.documentElement.style.setProperty('--scroll-blur', '0px');
        }, 120); // Responsive 120ms snap-back to crisp focus
    }, { passive: true });

    // Helper to get foreground elements that should slide (keeping neu-bg-container static)
    const getForegroundElements = () => {
        const els = [];
        
        // Grab page header and content wrappers (this keeps the branding logo and navbar perfectly in place!)
        const serviceContent = document.querySelector('.service-content');
        if (serviceContent) els.push(serviceContent);
        
        const serviceHeader = document.querySelector('.service-header');
        if (serviceHeader) els.push(serviceHeader);
        
        return els;
    };

    // ==========================================
    // 2. INCOMING TRANSITION ON PAGE LOAD
    // ==========================================
    const fromIndexStr = sessionStorage.getItem('fromPageIndex');
    if (fromIndexStr !== null) {
        window.isTransitioning = true;
        const fromIndex = parseInt(fromIndexStr, 10);
        sessionStorage.removeItem('fromPageIndex');

        // Hide standard reveal overlay so it doesn't block the parallax slide
        const revealOverlay = document.getElementById('page-reveal-overlay');
        if (revealOverlay) revealOverlay.style.display = 'none';

        // Setup smooth background color blend starting from previous page's color
        const fromTheme = sessionStorage.getItem('fromPageTheme');
        const startColor = fromTheme === 'dark' ? '#161616' : '#d3dbe4';
        const endColor = currentPageData.theme === 'dark' ? '#161616' : '#d3dbe4';

        document.body.style.setProperty('background-color', startColor, 'important');
        document.documentElement.style.setProperty('background-color', startColor, 'important');
        document.body.classList.add('bg-transition-blend');
        document.documentElement.classList.add('bg-transition-blend');

        // Determine slide direction
        // If coming from left (lower index), content slides in from RIGHT
        // If coming from right (higher index), content slides in from LEFT
        const isFromLeft = fromIndex < currentPageData.index;
        const startClass = isFromLeft ? 'slide-in-right-start' : 'slide-in-left-start';
        const activeClass = isFromLeft ? 'slide-in-right-active' : 'slide-in-left-active';

        const foregroundElements = getForegroundElements();
        const bgContainer = document.querySelector('.neu-bg-container');

        // Apply instant off-screen start position
        foregroundElements.forEach(el => el.classList.add(startClass));

        // Add warp speed deceleration and blend transition to background on page load
        if (bgContainer) {
            bgContainer.classList.add('bg-transition-blend');
            bgContainer.classList.add(isFromLeft ? 'warp-speed-left' : 'warp-speed-right');
            bgContainer.style.setProperty('background-color', startColor, 'important');
            if (fromTheme !== 'dark') {
                bgContainer.style.setProperty('background', 'none', 'important');
            }
        }

        // Trigger animation on next frame
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                // Blend background color to the current page's theme smoothly
                document.body.style.setProperty('background-color', endColor, 'important');
                document.documentElement.style.setProperty('background-color', endColor, 'important');
                if (bgContainer) {
                    bgContainer.style.setProperty('background-color', endColor, 'important');
                }

                // Animate content elements in
                foregroundElements.forEach(el => {
                    el.classList.remove(startClass);
                    el.classList.add(activeClass);
                });

                // Cleanup classes after transition completes
                setTimeout(() => {
                    document.body.classList.add('transition-loaded');
                    document.body.classList.remove('bg-transition-blend');
                    document.documentElement.classList.remove('bg-transition-blend', 'is-sliding-in-right', 'is-sliding-in-left');
                    foregroundElements.forEach(el => el.classList.remove(activeClass));
                    if (bgContainer) {
                        bgContainer.classList.remove('warp-speed-left', 'warp-speed-right', 'bg-transition-blend');
                        bgContainer.style.removeProperty('background-color');
                        bgContainer.style.removeProperty('background');
                    }
                    window.isTransitioning = false;
                }, 650);
            });
        });
    } else {
        // Standard fade reveal transition (runs if we arrived directly or from an unknown page)
        const revealOverlay = document.getElementById('page-reveal-overlay');
        if (revealOverlay) {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    revealOverlay.style.transition = 'opacity 0.2s ease';
                    revealOverlay.style.opacity = '0';
                    setTimeout(() => {
                        revealOverlay.style.display = 'none';
                    }, 200);
                });
            });
        }
    }

    // ==========================================
    // 3. OUTGOING TRANSITION ON LINK CLICK
    // ==========================================
    const navLinks = document.querySelectorAll('a[href]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (window.isTransitioning) {
                e.preventDefault();
                return;
            }
            
            const targetHref = this.getAttribute('href');
            const targetPageData = pageIndexMap[targetHref];

            // Only intercept if navigating to one of the 5 synchronized pages
            if (targetPageData) {
                e.preventDefault();
                window.isTransitioning = true;

                // 1. Sync the transition indicator if it exists
                const navIdMap = {
                    'service.html': 'Service',
                    'product.html': 'Product',
                    'process.html': 'Process',
                    'about.html': 'About',
                    'contact.html': 'Contact'
                };
                const suffix = navIdMap[targetHref];
                const transLink = document.querySelector(`#transitionNav${suffix} a[href="${targetHref}"]`);
                const indicator = document.getElementById(`transitionIndicator${suffix}`);
                
                // Extra check for Reverse variations
                let activeNav = document.getElementById(`transitionNav${suffix}`);
                if(!activeNav) {
                    activeNav = document.getElementById(`transitionNav${suffix}Reverse`);
                    if(activeNav) {
                        const reverseIndicator = document.getElementById(`transitionIndicator${suffix}Reverse`);
                        const reverseTransLink = document.querySelector(`#transitionNav${suffix}Reverse a[href="${targetHref}"]`);
                        if(reverseTransLink && reverseIndicator) {
                            const rect = reverseTransLink.getBoundingClientRect();
                            const navRect = activeNav.getBoundingClientRect();
                            reverseIndicator.style.width = `${rect.width + 40}px`;
                            reverseIndicator.style.left = `${rect.left - navRect.left - 20}px`;
                        }
                    }
                } else if (transLink && indicator) {
                    const rect = transLink.getBoundingClientRect();
                    const navRect = activeNav.getBoundingClientRect();
                    indicator.style.width = `${rect.width + 40}px`;
                    indicator.style.left = `${rect.left - navRect.left - 20}px`;
                }


                // 2. Set SessionStorage Flags for the destination page
                sessionStorage.setItem('fromPageIndex', currentPageData.index);
                sessionStorage.setItem('fromPageTheme', currentPageData.theme);

                // 3. Initialize background color blend on body, documentElement and bgContainer
                document.body.classList.add('bg-transition-blend');
                document.documentElement.classList.add('bg-transition-blend');
                
                const bgContainer = document.querySelector('.neu-bg-container');
                if (bgContainer) {
                    bgContainer.classList.add('bg-transition-blend');
                }

                const endColor = targetPageData.theme === 'dark' ? '#161616' : '#d3dbe4';

                // Nested requestAnimationFrames to guarantee CSSOM transition registration before painting value changes!
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        document.body.style.setProperty('background-color', endColor, 'important');
                        document.documentElement.style.setProperty('background-color', endColor, 'important');
                        if (bgContainer) {
                            bgContainer.style.setProperty('background-color', endColor, 'important');
                            if (targetPageData.theme !== 'dark') {
                                bgContainer.style.setProperty('background', 'none', 'important');
                            }
                        }
                    });
                });

                // 4. Slide out the current page's elements natively (no styling reflows)

                // 5. Trigger Foreground Slide
                // If going to a higher index, slide left. If going to lower index, slide right.
                const isGoingRight = targetPageData.index > currentPageData.index;
                const slideOutClass = isGoingRight ? 'slide-out-left' : 'slide-out-right';

                const foregroundElements = getForegroundElements();
                foregroundElements.forEach(el => el.classList.add(slideOutClass));

                // Trigger background warp speed
                if (bgContainer) {
                    bgContainer.classList.add(isGoingRight ? 'warp-speed-left' : 'warp-speed-right');
                }

                // 6. Navigate to Target Page (after 600ms slide-out completes completely + 30ms paint buffer)
                setTimeout(() => {
                    window.location.href = targetHref;
                }, 580);
            }
        });
    });

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
            
            // Find current active link (using class nav-active or matching current href)
            let currentActive = mainNav.querySelector('.nav-active');
            if (!currentActive) {
                const currentPath = window.location.pathname.split('/').pop() || 'index.html';
                currentActive = navLinks.find(link => link.getAttribute('href') === currentPath);
            }
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
});
