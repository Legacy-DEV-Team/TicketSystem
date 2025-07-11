// Load shared components
document.addEventListener('DOMContentLoaded', function() {
    // Determine the base path for components based on current page location
    const currentPath = window.location.pathname;
    let basePath = '';
    
    // If we're in a subdirectory, adjust the base path
    if (currentPath.includes('/guide/') || currentPath.includes('/api/') || currentPath.includes('/examples/')) {
        basePath = '../';
    }
    
    console.log('Current path:', currentPath);
    console.log('Base path:', basePath);
    
    // Load header
    const headerUrl = basePath + 'components/header.html';
    console.log('Loading header from:', headerUrl);
    
    fetch(headerUrl)
        .then(response => {
            console.log('Header response status:', response.status);
            return response.text();
        })
        .then(html => {
            console.log('Header HTML loaded, length:', html.length);
            // Update asset paths in the loaded HTML to be relative to the current page
            const updatedHtml = html.replace(/src="\.\.\/public\//g, `src="${basePath}public/`);
            
            const headerPlaceholder = document.getElementById('header-placeholder');
            if (headerPlaceholder) {
                headerPlaceholder.innerHTML = updatedHtml;
                console.log('Header loaded successfully');
            } else {
                console.error('Header placeholder not found');
            }
        })
        .catch(error => console.error('Error loading header:', error));

    // Load footer
    const footerUrl = basePath + 'components/footer.html';
    console.log('Loading footer from:', footerUrl);
    
    fetch(footerUrl)
        .then(response => {
            console.log('Footer response status:', response.status);
            return response.text();
        })
        .then(html => {
            console.log('Footer HTML loaded, length:', html.length);
            // Update asset paths in the loaded HTML to be relative to the current page
            const updatedHtml = html.replace(/src="\.\.\/public\//g, `src="${basePath}public/`)
                                   .replace(/src="\.\.\/assets\//g, `src="${basePath}assets/`);
            
            const footerPlaceholder = document.getElementById('footer-placeholder');
            if (footerPlaceholder) {
                footerPlaceholder.innerHTML = updatedHtml;
                console.log('Footer loaded successfully');
            } else {
                console.error('Footer placeholder not found');
            }
        })
        .catch(error => console.error('Error loading footer:', error));
});

// Mobile menu toggle
document.addEventListener('click', function(e) {
    if (e.target.closest('.mobile-menu-toggle')) {
        const navMenu = document.querySelector('.nav-menu');
        navMenu.classList.toggle('active');
    }
});

// Active navigation highlighting
document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
});