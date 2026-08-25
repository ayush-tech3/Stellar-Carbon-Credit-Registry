// ═══════════════════════════════════════════════════════════
// CarbonTrack Documentation — Navigation & Interactivity
// ═══════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const hamburger = document.getElementById('hamburger');
    const closeSidebar = document.getElementById('closeSidebar');
    const mobileOverlay = document.getElementById('mobileNavOverlay');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.doc-section');
    const breadcrumbPage = document.getElementById('breadcrumbPage');

    // Section name mapping
    const sectionNames = {
        'overview': 'Overview',
        'features': 'Features',
        'quickstart': 'Quick Start',
        'architecture': 'System Design',
        'tech-stack': 'Tech Stack',
        'contracts': 'Contract Design',
        'api-reference': 'API Reference',
        'security': 'Security',
        'frontend': 'Frontend Guide',
        'components': 'Components',
        'deployment': 'Deployment',
        'testing': 'Testing',
        'cicd': 'CI/CD Pipeline',
        'env-vars': 'Configuration',
        'contributing': 'Contributing',
        'links': 'Links & Demo'
    };

    // ─── Navigation ──────────────────────────────────────
    function navigateToSection(sectionId) {
        // Hide all sections
        sections.forEach(s => s.classList.remove('active'));

        // Show target section
        const target = document.getElementById(sectionId);
        if (target) {
            target.classList.add('active');
        }

        // Update nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === sectionId) {
                link.classList.add('active');
            }
        });

        // Update breadcrumb
        if (breadcrumbPage) {
            breadcrumbPage.textContent = sectionNames[sectionId] || sectionId;
        }

        // Update hash
        history.pushState(null, '', '#' + sectionId);

        // Scroll to top of content
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Close mobile sidebar
        closeMobileSidebar();
    }

    // Nav link click handlers
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            if (section) {
                navigateToSection(section);
            }
        });
    });

    // Expose navigateTo globally for inline onclick handlers
    window.navigateTo = navigateToSection;

    // Handle hash on page load
    function handleHash() {
        const hash = window.location.hash.slice(1);
        if (hash && sectionNames[hash]) {
            navigateToSection(hash);
        }
    }
    handleHash();

    // Handle hash changes (back/forward)
    window.addEventListener('hashchange', handleHash);

    // ─── Mobile Sidebar ──────────────────────────────────
    function openMobileSidebar() {
        sidebar.classList.add('open');
        mobileOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileSidebar() {
        sidebar.classList.remove('open');
        mobileOverlay.classList.remove('show');
        document.body.style.overflow = '';
    }

    if (hamburger) {
        hamburger.addEventListener('click', openMobileSidebar);
    }

    if (closeSidebar) {
        closeSidebar.addEventListener('click', closeMobileSidebar);
    }

    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMobileSidebar);
    }

    // ─── Copy Code Button ────────────────────────────────
    // Expose globally for onclick handlers
    window.copyCode = function(btn) {
        const codeBlock = btn.closest('.code-block');
        const code = codeBlock.querySelector('code');
        const text = code.textContent;

        navigator.clipboard.writeText(text).then(() => {
            btn.textContent = 'Copied!';
            btn.classList.add('copied');
            setTimeout(() => {
                btn.textContent = 'Copy';
                btn.classList.remove('copied');
            }, 2000);
        }).catch(() => {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                btn.textContent = 'Copied!';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.textContent = 'Copy';
                    btn.classList.remove('copied');
                }, 2000);
            } catch (e) {
                btn.textContent = 'Error';
                setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
            }
            document.body.removeChild(textarea);
        });
    };

    // ─── Keyboard shortcuts ──────────────────────────────
    document.addEventListener('keydown', (e) => {
        // Escape to close mobile sidebar
        if (e.key === 'Escape') {
            closeMobileSidebar();
        }
    });

    // ─── Smooth entrance animations ──────────────────────
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe cards and elements for entrance animation
    const animateElements = document.querySelectorAll(
        '.stat-card, .feature-card, .info-item, .security-card, .link-card, .prereq-card, .api-card, .contract-card'
    );

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(16px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });

    // Make elements in the active section visible immediately
    function showActiveElements() {
        const activeSection = document.querySelector('.doc-section.active');
        if (activeSection) {
            activeSection.querySelectorAll(
                '.stat-card, .feature-card, .info-item, .security-card, .link-card, .prereq-card, .api-card, .contract-card'
            ).forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
        }
    }

    // Re-trigger animations when switching sections
    const originalNavigate = navigateToSection;
    window.navigateTo = function(sectionId) {
        originalNavigate(sectionId);
        // Small delay to allow section to become visible
        setTimeout(showActiveElements, 50);
    };

    // Also update nav link handlers
    navLinks.forEach(link => {
        link.removeEventListener('click', () => {});
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            if (section) {
                window.navigateTo(section);
            }
        });
    });

    // Show initial section elements
    setTimeout(showActiveElements, 100);
});
