// JavaScript for Inquiry-Based Learning Website

document.addEventListener('DOMContentLoaded', function() {
    // Testimonial Slider Functionality
    setupTestimonialSlider();
    
    // Mobile Navigation Menu
    setupMobileNavigation();
    
    // Smooth Scrolling
    setupSmoothScrolling();
});

// Function to handle testimonial slider
function setupTestimonialSlider() {
    const testimonials = [
        {
            quote: "As a parent, I have witnessed the positive impact of inquiry-based learning on my child's curiosity, critical thinking, and overall academic growth.",
            author: "Sarah Johnson, Parent"
        },
        {
            quote: "Implementing inquiry-based approaches in my classroom has transformed student engagement. They're asking deeper questions and taking ownership of their learning.",
            author: "Michael Torres, 5th Grade Teacher"
        },
        {
            quote: "The resources provided on this website have been invaluable for developing my curriculum around inquiry-based principles.",
            author: "Dr. Lisa Chen, Curriculum Director"
        }
    ];
    
    const testimonialContainer = document.querySelector('.testimonial-item');
    const dots = document.querySelectorAll('.testimonial-dot');
    let currentIndex = 0;
    
    // Set up click listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showTestimonial(index);
        });
    });
    
    // Auto-rotate testimonials every 8 seconds
    setInterval(() => {
        currentIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(currentIndex);
    }, 8000);
    
    // Function to display a specific testimonial
    function showTestimonial(index) {
        if (testimonialContainer) {
            const testimonial = testimonials[index];
            testimonialContainer.innerHTML = `
                <blockquote>${testimonial.quote}</blockquote>
                <cite>${testimonial.author}</cite>
            `;
            
            // Update active dot
            dots.forEach((dot, i) => {
                if (i === index) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
            
            currentIndex = index;
        }
    }
}

// Function to handle mobile navigation
function setupMobileNavigation() {
    const header = document.querySelector('header');
    const container = header.querySelector('.container');
    
    // Create mobile menu toggle button
    const mobileToggle = document.createElement('div');
    mobileToggle.className = 'mobile-toggle';
    mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
    
    // Insert before the logo (at the beginning of the container)
    container.prepend(mobileToggle);
    
    // Add mobile navigation CSS
    const style = document.createElement('style');
    style.innerHTML = `
        @media (max-width: 768px) {
            header .container {
                flex-direction: row;
                flex-wrap: wrap;
            }
            
            .mobile-toggle {
                display: block;
                font-size: 1.5rem;
                cursor: pointer;
                order: 1;
            }
            
            .logo {
                order: 2;
                margin-left: 1rem;
            }
            
            nav {
                width: 100%;
                order: 4;
                overflow: hidden;
                max-height: 0;
                transition: max-height 0.3s ease;
            }
            
            nav.active {
                max-height: 300px;
            }
            
            .search-bar {
                order: 3;
                margin-left: auto;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Toggle navigation when clicked
    mobileToggle.addEventListener('click', function() {
        const nav = header.querySelector('nav');
        nav.classList.toggle('active');
        
        const icon = this.querySelector('i');
        if (nav.classList.contains('active')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    });
}

// Function to enable smooth scrolling for anchor links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip if it's just "#" or not a valid selector
            if (targetId === '#' || !document.querySelector(targetId)) {
                return;
            }
            
            e.preventDefault();
            
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
}

// Form submission handler for contact forms (to be implemented)
function handleFormSubmission(formElement) {
    formElement.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simple form validation
        let isValid = true;
        const requiredFields = formElement.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });
        
        if (isValid) {
            // Here you would typically send the form data to a server
            // For now, just show a success message
            const successMessage = document.createElement('div');
            successMessage.className = 'form-success';
            successMessage.textContent = 'Thank you for your submission!';
            
            formElement.innerHTML = '';
            formElement.appendChild(successMessage);
        }
    });
}
/* JavaScript to add to your existing script.js or script section */

// Add this to your existing JavaScript in the DOMContentLoaded event
function setupMobileMenu() {
    // Create mobile menu toggle button if it doesn't exist
    if (!document.querySelector('.mobile-menu-toggle')) {
        const header = document.querySelector('header');
        const nav = header.querySelector('nav');
        const container = header.querySelector('.container');
        
        const mobileToggle = document.createElement('button');
        mobileToggle.className = 'mobile-menu-toggle';
        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
        mobileToggle.setAttribute('aria-label', 'Toggle navigation menu');
        
        container.insertBefore(mobileToggle, container.firstChild);
        
        // Toggle navigation when clicked
        mobileToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            
            // Change icon based on state
            const icon = this.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
        
        // Close menu when clicking anywhere else
        document.addEventListener('click', function(event) {
            if (!nav.contains(event.target) && !mobileToggle.contains(event.target) && nav.classList.contains('active')) {
                nav.classList.remove('active');
                mobileToggle.querySelector('i').className = 'fas fa-bars';
            }
        });
        
        // Close menu when a link is clicked
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('active');
                mobileToggle.querySelector('i').className = 'fas fa-bars';
            });
        });
    }
}

// Add this line to the DOMContentLoaded event
setupMobileMenu();