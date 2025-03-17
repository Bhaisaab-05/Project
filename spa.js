// Single Page Application functionality for IBL Website

document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const pageContent = document.getElementById('page-content');
    const navLinks = document.querySelectorAll('.nav-link');
    const loadingSpinner = document.querySelector('.loading-spinner');
    
    // Page content cache to avoid repeated fetches
    const pageCache = {
        home: pageContent.innerHTML // Cache the initial home content
    };
    
    // Initialize the application
    init();
    
    function init() {
        // Set up navigation event listeners
        setupNavigation();
        
        // Handle initial page load based on URL hash
        handleInitialLoad();
    }
    
    function setupNavigation() {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const pageName = this.getAttribute('data-page');
                
                // Update active navigation link
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                document.querySelectorAll(`[data-page="${pageName}"]`).forEach(navLink => navLink.classList.add('active'));
                
                // Load the requested page content
                loadPage(pageName);
                
                // Update URL hash for bookmarking
                window.location.hash = pageName;
            });
        });
    }
    
    function handleInitialLoad() {
        // Get the page from URL hash or default to home
        let pageName = window.location.hash.replace('#', '');
        
        if (!pageName || pageName === '') {
            pageName = 'home';
            window.location.hash = 'home';
        }
        
        // Set the active navigation link
        navLinks.forEach(link => link.classList.remove('active'));
        document.querySelectorAll(`[data-page="${pageName}"]`).forEach(link => link.classList.add('active'));
        
        // If not on home page, load the requested page
        if (pageName !== 'home') {
            loadPage(pageName);
        }
    }
    
    function loadPage(pageName) {
        // If page content is already cached, use it
        if (pageCache[pageName]) {
            renderPage(pageCache[pageName]);
            return;
        }
        
        // Show loading spinner
        loadingSpinner.classList.add('active');
        pageContent.classList.add('loading');
        
        // Fetch the page content
        fetch(`${pageName}.html`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load page: ${response.statusText}`);
                }
                return response.text();
            })
            .then(html => {
                // Extract the main content from the HTML
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                // Remove header and footer from the loaded content
                const header = doc.querySelector('header');
                const footer = doc.querySelector('footer');
                
                if (header) header.remove();
                if (footer) footer.remove();
                
                // Get the content between header and footer
                const content = doc.body.innerHTML;
                
                // Cache the content for future use
                pageCache[pageName] = content;
                
                // Render the page
                renderPage(content);
            })
            .catch(error => {
                console.error('Error loading page:', error);
                pageContent.innerHTML = `
                    <div style="text-align: center; padding: 4rem 0;">
                        <h2>Error Loading Page</h2>
                        <p>Sorry, we couldn't load the requested page. Please try again later.</p>
                        <a href="#home" class="btn nav-link" data-page="home">Return to Home</a>
                    </div>
                `;
            })
            .finally(() => {
                // Hide loading spinner
                loadingSpinner.classList.remove('active');
                pageContent.classList.remove('loading');
                
                // Scroll to top
                window.scrollTo(0, 0);
            });
    }
    
    function renderPage(content) {
        // Set the page content
        pageContent.innerHTML = content;
        
        // Reinitialize any scripts specific to the new content
        initPageScripts();
    }
    
    function initPageScripts() {
        // Reinitialize any page-specific scripts here
        
        // Testimonial slider
        if (typeof setupTestimonialSlider === 'function' && document.querySelector('.testimonial-slider')) {
            setupTestimonialSlider();
        }
        
        // FAQ accordion
        const faqItems = document.querySelectorAll('.faq-item');
        if (faqItems.length > 0) {
            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question');
                if (question) {
                    question.addEventListener('click', () => {
                        // Close all other items
                        faqItems.forEach(otherItem => {
                            if (otherItem !== item && otherItem.classList.contains('active')) {
                                otherItem.classList.remove('active');
                            }
                        });
                        
                        // Toggle current item
                        item.classList.toggle('active');
                    });
                }
            });
        }
        
        // Event tabs
        const eventTabs = document.querySelectorAll('.event-tab');
        if (eventTabs.length > 0) {
            eventTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    // Remove active class from all tabs
                    eventTabs.forEach(t => t.classList.remove('active'));
                    
                    // Add active class to clicked tab
                    this.classList.add('active');
                });
            });
        }
        
        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        if (filterButtons.length > 0) {
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Remove active class from all buttons
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    
                    // Add active class to clicked button
                    this.classList.add('active');
                });
            });
        }
        
        // Resource navigation links
        const resourceLinks = document.querySelectorAll('.resource-links a');
        if (resourceLinks.length > 0) {
            resourceLinks.forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Remove active class from all links
                    resourceLinks.forEach(a => a.classList.remove('active'));
                    
                    // Add active class to clicked link
                    this.classList.add('active');
                    
                    // Scroll to section
                    const targetId = this.getAttribute('href');
                    const targetSection = document.querySelector(targetId);
                    
                    if (targetSection) {
                        window.scrollTo({
                            top: targetSection.offsetTop - 150,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        }
        
        // Video modal functionality
        const videoCards = document.querySelectorAll('.video-card');
        const videoModal = document.getElementById('videoModal');
        
        if (videoCards.length > 0 && videoModal) {
            const videoFrame = document.getElementById('videoFrame');
            const closeModal = document.querySelector('.close-modal');
            
            // Open modal when a video card is clicked
            videoCards.forEach(card => {
                card.addEventListener('click', function() {
                    const videoId = this.getAttribute('data-video-id');
                    videoFrame.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1`);
                    videoModal.style.display = 'flex';
                    document.body.style.overflow = 'hidden'; // Prevent scrolling
                });
            });
            
            // Close modal when close button is clicked
            if (closeModal) {
                closeModal.addEventListener('click', function() {
                    videoFrame.setAttribute('src', '');
                    videoModal.style.display = 'none';
                    document.body.style.overflow = 'auto'; // Re-enable scrolling
                });
            }
            
            // Close modal when clicking outside content
            videoModal.addEventListener('click', function(event) {
                if (event.target == videoModal) {
                    videoFrame.setAttribute('src', '');
                    videoModal.style.display = 'none';
                    document.body.style.overflow = 'auto'; // Re-enable scrolling
                }
            });
        }
        
        // Form submission handlers
        setupFormHandlers();
        
        // Set up navigation for any new nav links in the loaded content
        const newNavLinks = pageContent.querySelectorAll('.nav-link');
        if (newNavLinks.length > 0) {
            newNavLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const pageName = this.getAttribute('data-page');
                    
                    // Update active navigation link
                    document.querySelectorAll('.nav-link').forEach(navLink => navLink.classList.remove('active'));
                    document.querySelectorAll(`[data-page="${pageName}"]`).forEach(navLink => navLink.classList.add('active'));
                    
                    // Load the requested page
                    loadPage(pageName);
                    
                    // Update URL hash
                    window.location.hash = pageName;
                });
            });
        }
    }
    
    function setupFormHandlers() {
        // Contact form
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formContent = this.innerHTML;
                this.innerHTML = `
                    <div style="text-align: center; padding: 2rem 0;">
                        <i class="fas fa-check-circle" style="font-size: 3rem; color: green; margin-bottom: 1rem;"></i>
                        <h3>Message Sent Successfully!</h3>
                        <p>Thank you for contacting us. We'll respond to your inquiry as soon as possible.</p>
                    </div>
                `;
                
                // Reset form after 5 seconds
                setTimeout(() => {
                    this.innerHTML = formContent;
                    setupFormHandlers(); // Re-attach event listeners
                }, 5000);
            });
        }
        
        // Newsletter form
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formContent = this.innerHTML;
                this.innerHTML = `
                    <div style="text-align: center; padding: 1rem 0;">
                        <i class="fas fa-check-circle" style="font-size: 2rem; color: green; margin-bottom: 0.5rem;"></i>
                        <h3>Subscription Successful!</h3>
                        <p>You've been added to our newsletter list.</p>
                    </div>
                `;
                
                // Reset form after 5 seconds
                setTimeout(() => {
                    this.innerHTML = formContent;
                    setupFormHandlers(); // Re-attach event listeners
                }, 5000);
            });
        }
    }
    
    // Handle browser back/forward navigation
    window.addEventListener('hashchange', function() {
        let pageName = window.location.hash.replace('#', '');
        
        if (!pageName || pageName === '') {
            pageName = 'home';
        }
        
        // Update active navigation link
        navLinks.forEach(link => link.classList.remove('active'));
        document.querySelectorAll(`[data-page="${pageName}"]`).forEach(link => link.classList.add('active'));
        
        // Load the page content if it's not the current page
        if (pageName === 'home' && pageContent.innerHTML === pageCache.home) {
            // Already on home page, do nothing
            return;
        }
        
        loadPage(pageName);
    });
});