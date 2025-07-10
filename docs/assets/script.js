// Discord Ticket SaaS Documentation JavaScript

(function() {
    'use strict';

    // DOM elements
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navActions = document.querySelector('.nav-actions');
    
    // Mobile menu functionality
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            const isOpen = navMenu.classList.contains('mobile-open');
            
            if (isOpen) {
                navMenu.classList.remove('mobile-open');
                navActions.classList.remove('mobile-open');
                mobileMenuToggle.classList.remove('active');
                document.body.style.overflow = '';
            } else {
                navMenu.classList.add('mobile-open');
                navActions.classList.add('mobile-open');
                mobileMenuToggle.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.navbar') && navMenu && navMenu.classList.contains('mobile-open')) {
            navMenu.classList.remove('mobile-open');
            navActions.classList.remove('mobile-open');
            mobileMenuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close mobile menu on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navMenu && navMenu.classList.contains('mobile-open')) {
            navMenu.classList.remove('mobile-open');
            navActions.classList.remove('mobile-open');
            mobileMenuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Copy code functionality
    function addCopyButtons() {
        const codeBlocks = document.querySelectorAll('.code-block');
        
        codeBlocks.forEach(block => {
            const button = document.createElement('button');
            button.className = 'copy-button';
            button.textContent = 'Copy';
            button.setAttribute('aria-label', 'Copy code to clipboard');
            
            button.addEventListener('click', function() {
                const code = block.querySelector('code, pre');
                if (code) {
                    navigator.clipboard.writeText(code.textContent).then(() => {
                        button.textContent = 'Copied!';
                        button.classList.add('copied');
                        
                        setTimeout(() => {
                            button.textContent = 'Copy';
                            button.classList.remove('copied');
                        }, 2000);
                    }).catch(() => {
                        // Fallback for older browsers
                        const textArea = document.createElement('textarea');
                        textArea.value = code.textContent;
                        document.body.appendChild(textArea);
                        textArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textArea);
                        
                        button.textContent = 'Copied!';
                        button.classList.add('copied');
                        
                        setTimeout(() => {
                            button.textContent = 'Copy';
                            button.classList.remove('copied');
                        }, 2000);
                    });
                }
            });
            
            block.style.position = 'relative';
            block.appendChild(button);
        });
    }

    // Theme toggle functionality
    function initThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (!themeToggle) return;

        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        } else if (systemPrefersDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }

        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // Search functionality
    function initSearch() {
        const searchInput = document.querySelector('.search-input');
        const searchResults = document.querySelector('.search-results');
        
        if (!searchInput || !searchResults) return;

        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim();
            
            if (query.length < 2) {
                searchResults.style.display = 'none';
                return;
            }
            
            searchTimeout = setTimeout(() => {
                performSearch(query);
            }, 300);
        });
        
        function performSearch(query) {
            // Simple client-side search implementation
            const searchableElements = document.querySelectorAll('h1, h2, h3, p, .feature-title, .doc-category');
            const results = [];
            
            searchableElements.forEach(element => {
                const text = element.textContent.toLowerCase();
                if (text.includes(query.toLowerCase())) {
                    results.push({
                        element: element,
                        text: element.textContent,
                        type: element.tagName
                    });
                }
            });
            
            displaySearchResults(results, query);
        }
        
        function displaySearchResults(results, query) {
            if (results.length === 0) {
                searchResults.innerHTML = '<div class="no-results">No results found</div>';
            } else {
                const resultsHTML = results.slice(0, 5).map(result => {
                    const highlightedText = result.text.replace(
                        new RegExp(query, 'gi'), 
                        `<mark>$&</mark>`
                    );
                    
                    return `
                        <div class="search-result" data-element="${result.element.id}">
                            <div class="result-title">${highlightedText}</div>
                            <div class="result-type">${result.type}</div>
                        </div>
                    `;
                }).join('');
                
                searchResults.innerHTML = resultsHTML;
                
                // Add click listeners to results
                searchResults.querySelectorAll('.search-result').forEach(result => {
                    result.addEventListener('click', function() {
                        const elementId = this.getAttribute('data-element');
                        const targetElement = document.getElementById(elementId);
                        if (targetElement) {
                            targetElement.scrollIntoView({ behavior: 'smooth' });
                            searchResults.style.display = 'none';
                            searchInput.value = '';
                        }
                    });
                });
            }
            
            searchResults.style.display = 'block';
        }
        
        // Hide search results when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.search-container')) {
                searchResults.style.display = 'none';
            }
        });
    }

    // Intersection Observer for animations
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements that should animate on scroll
        document.querySelectorAll('.feature-card, .doc-category, .community-item').forEach(el => {
            observer.observe(el);
        });
    }

    // Table of contents generation
    function generateTableOfContents() {
        const toc = document.querySelector('.table-of-contents');
        if (!toc) return;

        const headings = document.querySelectorAll('h2, h3, h4');
        if (headings.length === 0) return;

        const tocList = document.createElement('ul');
        tocList.className = 'toc-list';

        headings.forEach((heading, index) => {
            // Generate ID if not present
            if (!heading.id) {
                heading.id = `heading-${index}`;
            }

            const listItem = document.createElement('li');
            listItem.className = `toc-item toc-${heading.tagName.toLowerCase()}`;

            const link = document.createElement('a');
            link.href = `#${heading.id}`;
            link.textContent = heading.textContent;
            link.className = 'toc-link';

            listItem.appendChild(link);
            tocList.appendChild(listItem);
        });

        toc.appendChild(tocList);

        // Highlight current section
        const tocLinks = document.querySelectorAll('.toc-link');
        
        const highlightCurrentSection = () => {
            const scrollPosition = window.scrollY + 100;
            
            headings.forEach((heading, index) => {
                const rect = heading.getBoundingClientRect();
                const elementTop = rect.top + window.scrollY;
                
                if (scrollPosition >= elementTop) {
                    // Remove active class from all links
                    tocLinks.forEach(link => link.classList.remove('active'));
                    // Add active class to current link
                    if (tocLinks[index]) {
                        tocLinks[index].classList.add('active');
                    }
                }
            });
        };

        window.addEventListener('scroll', highlightCurrentSection);
        highlightCurrentSection(); // Initial call
    }

    // Back to top button
    function initBackToTop() {
        const backToTopButton = document.createElement('button');
        backToTopButton.className = 'back-to-top';
        backToTopButton.innerHTML = '↑';
        backToTopButton.setAttribute('aria-label', 'Back to top');
        backToTopButton.style.display = 'none';
        
        document.body.appendChild(backToTopButton);

        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopButton.style.display = 'flex';
            } else {
                backToTopButton.style.display = 'none';
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // External link handling
    function initExternalLinks() {
        document.querySelectorAll('a[href^="http"]').forEach(link => {
            if (!link.hostname || link.hostname !== window.location.hostname) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
                
                // Add external link icon
                if (!link.querySelector('.external-icon')) {
                    const icon = document.createElement('span');
                    icon.className = 'external-icon';
                    icon.innerHTML = ' ↗';
                    link.appendChild(icon);
                }
            }
        });
    }

    // Keyboard navigation
    function initKeyboardNavigation() {
        document.addEventListener('keydown', function(event) {
            // ESC key closes mobile menu
            if (event.key === 'Escape') {
                if (navMenu && navMenu.classList.contains('mobile-open')) {
                    navMenu.classList.remove('mobile-open');
                    navActions.classList.remove('mobile-open');
                    mobileMenuToggle.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    }

    // Initialize all functionality when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        addCopyButtons();
        initThemeToggle();
        initSearch();
        initScrollAnimations();
        generateTableOfContents();
        initBackToTop();
        initExternalLinks();
        initKeyboardNavigation();
        
        // Add loaded class for CSS animations
        document.body.classList.add('loaded');
    });

    // Service Worker registration for offline support
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('SW registered: ', registration);
                })
                .catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }

})();