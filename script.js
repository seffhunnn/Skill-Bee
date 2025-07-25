const sampleTools = [
    {
        id: 1,
        title: "Canon EOS R5 Camera",
        owner: "Alexander Novikov",
        category: "cameras",
        price: 399,
        period: "hour",
        rating: 4.9,
        location: "Downtown",
        verified: true,
        instant: true,
        image: "camera-bg",
        description: "Professional mirrorless camera perfect for photography and videography projects.",
        features: ["45MP Full Frame", "8K Video", "Image Stabilization", "Weather Sealed"],
        deposit: 100
    },
    {
        id: 2,
        title: "MacBook Pro M3 16\"",
        owner: "Sunwoo Han",
        category: "laptops",
        price: 899,
        period: "hour",
        rating: 4.8,
        location: "University Area",
        verified: true,
        instant: false,
        image: "laptop-bg",
        description: "High-performance laptop ideal for video editing, development, and creative work.",
        features: ["M3 Pro Chip", "32GB RAM", "1TB SSD", "16-inch Display"],
        deposit: 550
    },
    {
        id: 3,
        title: "Blue Yeti USB Microphone",
        owner: "Tayane Alves",
        category: "audio",
        price: 149,
        period: "hour",
        rating: 4.7,
        location: "Creative District",
        verified: true,
        instant: true,
        image: "mic-bg",
        description: "Professional USB microphone perfect for podcasts, streaming, and voice recording.",
        features: ["Multiple Patterns", "Zero-latency Headphone Monitoring", "Plug & Play", "Adjustable Stand"],
        deposit: 150
    },
    {
        id: 4,
        title: "Neewer Ring Light 18\"",
        owner: "Varun Batra",
        category: "lighting",
        price: 59,
        period: "hour",
        rating: 4.6,
        location: "Arts Quarter",
        verified: false,
        instant: true,
        image: "light-bg",
        description: "Professional ring light for portrait photography, makeup tutorials, and video calls.",
        features: ["Dimmable LED", "Color Temperature Control", "Phone & Camera Mount", "Remote Control"],
        deposit: 100
    },
    {
        id: 5,
        title: "EPSON 4K Projector",
        owner: "Aamir",
        category: "projectors",
        price: 1499,
        period: "day",
        rating: 4.9,
        location: "Tech Hub",
        verified: true,
        instant: false,
        image: "projector-bg",
        description: "High-quality 4K projector perfect for presentations, movie nights, and events.",
        features: ["4K Ultra HD", "3000 Lumens", "Wireless Connectivity", "Portable Design"],
        deposit: 300
    },
    {
        id: 6,
        title: "PlayStation 5 Console",
        owner: "Vincent Fabron",
        category: "gaming",
        price: 1599,
        period: "day",
        rating: 4.8,
        location: "Gaming District",
        verified: true,
        instant: true,
        image: "gaming-bg",
        description: "Latest gaming console with lightning-fast loading and stunning graphics.",
        features: ["Custom SSD", "Ray Tracing", "4K Gaming", "DualSense Controller"],
        deposit: 250
    }
];

// DOM Elements
const toolsGrid = document.getElementById('tools-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const categoryCards = document.querySelectorAll('.category-card');
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');
const modal = document.getElementById('tool-modal');
const modalClose = document.querySelector('.modal-close');
const mobileNavItems = document.querySelectorAll('.mobile-bottom-nav .nav-item');
const navLinks = document.querySelectorAll('.nav-link');

// State
let currentFilter = 'all';
let favoriteTools = new Set();

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    renderTools();
    setupEventListeners();
    setupSmoothScrolling();
    setupAnimations();
});

// Render tools based on current filter
function renderTools(filter = 'all', searchTerm = '') {
    const filteredTools = sampleTools.filter(tool => {
        const matchesFilter = filter === 'all' || tool.category === filter;
        const matchesSearch = searchTerm === '' || 
            tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tool.category.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    toolsGrid.innerHTML = filteredTools.map(tool => createToolCard(tool)).join('');
    
    // Add event listeners to new tool cards
    addToolCardListeners();
}

// Create tool card HTML
function createToolCard(tool) {
    const isFavorite = favoriteTools.has(tool.id);
    return `
        <div class="tool-item" data-id="${tool.id}" data-category="${tool.category}">
            <div class="tool-item-image">
                <div class="image-placeholder ${tool.image}">
                </div>

                <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-id="${tool.id}">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
            <div class="tool-info">
                <div class="tool-header">
                    <div>
                        <h3 class="tool-title">${tool.title}</h3>
                        <p class="tool-owner">by ${tool.owner}</p>
                    </div>
                    <div class="tool-price">
                        <span class="price-amount">${tool.price}</span>
                        <span class="price-period">/${tool.period}</span>
                    </div>
                </div>
                <div class="tool-meta">
                    <div class="tool-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${tool.location}</span>
                    </div>
                    <div class="tool-rating">
                        <i class="fas fa-star"></i>
                        <span>${tool.rating}</span>
                    </div>
                </div>
                <div class="tool-badges">
                    ${tool.verified ? '<span class="badge verified">Verified</span>' : ''}
                    ${tool.instant ? '<span class="badge">Instant Book</span>' : ''}
                </div>
                <button class="rent-btn" data-id="${tool.id}">
                    Rent Now
                </button>
            </div>
        </div>
    `;
}

// Get icon for category
function getIconForCategory(category) {
    const icons = {
        cameras: 'camera',
        laptops: 'laptop',
        audio: 'microphone',
        lighting: 'lightbulb',
        projectors: 'video',
        gaming: 'gamepad'
    };
    return icons[category] || 'tools';
}

// Add event listeners to tool cards
function addToolCardListeners() {
    // Tool card clicks
    document.querySelectorAll('.tool-item').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.favorite-btn') && !e.target.closest('.rent-btn')) {
                const toolId = parseInt(card.dataset.id);
                showToolModal(toolId);
            }
        });
    });

    // Favorite buttons
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const toolId = parseInt(btn.dataset.id);
            toggleFavorite(toolId, btn);
        });
    });

    // Rent buttons
    document.querySelectorAll('.rent-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const toolId = parseInt(btn.dataset.id);
            startBookingFlow(toolId);
        });
    });
}

// Setup event listeners
function setupEventListeners() {
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTools(currentFilter, searchInput.value);
        });
    });

    // Category cards
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            document.querySelector(`[data-filter="${category}"]`).click();
            document.getElementById('browse').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Search functionality
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Modal close
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Mobile navigation
    mobileNavItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            mobileNavItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            const href = item.getAttribute('href');
            if (href.startsWith('#')) {
                document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Desktop navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Scroll to update active nav
    window.addEventListener('scroll', updateActiveNav);

    
}

// Perform search
function performSearch() {
    const searchTerm = searchInput.value.trim();
    renderTools(currentFilter, searchTerm);
    
    if (searchTerm) {
        document.getElementById('browse').scrollIntoView({ behavior: 'smooth' });
    }
}

// Toggle favorite
function toggleFavorite(toolId, btn) {
    if (favoriteTools.has(toolId)) {
        favoriteTools.delete(toolId);
        btn.classList.remove('active');
    } else {
        favoriteTools.add(toolId);
        btn.classList.add('active');
    }
    
    // Add animation
    btn.style.transform = 'scale(0.8)';
    setTimeout(() => {
        btn.style.transform = 'scale(1)';
    }, 150);
}

// Show tool modal
function showToolModal(toolId) {
    const tool = sampleTools.find(t => t.id === toolId);
    if (!tool) return;

    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    modalTitle.textContent = tool.title;
    modalBody.innerHTML = createToolModalContent(tool);

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Create tool modal content
function createToolModalContent(tool) {
    return `
        <div class="tool-detail">
            <div class="tool-detail-image">
                <div class="image-placeholder ${tool.image}" style="height: 300px; border-radius: 12px;">
                    <i class="fas fa-${getIconForCategory(tool.category)}" style="font-size: 60px;"></i>
                </div>
            </div>
            <div class="tool-detail-info" style="margin-top: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px;">
                    <div>
                        <h2 style="font-size: 28px; font-weight: 700; margin-bottom: 10px;">${tool.title}</h2>
                        <p style="color: #667eea; font-weight: 600;">by ${tool.owner}</p>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 32px; font-weight: 700; color: #667eea;">${tool.price}</div>
                        <div style="color: #999;">per ${tool.period}</div>
                    </div>
                </div>
                
                <div style="display: flex; gap: 20px; margin-bottom: 20px;">
                    <div style="display: flex; align-items: center; gap: 5px;">
                        <i class="fas fa-star" style="color: #ffd700;"></i>
                        <span>${tool.rating} rating</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 5px;">
                        <i class="fas fa-map-marker-alt" style="color: #999;"></i>
                        <span>${tool.location}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 5px;">
                        <i class="fas fa-shield-alt" style="color: #43e97b;"></i>
                        <span>${tool.deposit} deposit</span>
                    </div>
                </div>

                <div style="margin-bottom: 20px;">
                    <h4 style="font-weight: 700; margin-bottom: 10px;">Description</h4>
                    <p style="color: #666; line-height: 1.6;">${tool.description}</p>
                </div>

                <div style="margin-bottom: 30px;">
                    <h4 style="font-weight: 700; margin-bottom: 10px;">Features</h4>
                    <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                        ${tool.features.map(feature => `
                            <span style="background: rgba(102, 126, 234, 0.1); color: #667eea; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600;">
                                ${feature}
                            </span>
                        `).join('')}
                    </div>
                </div>

                <div style="display: flex; gap: 15px;">
                    <button class="btn-primary" style="flex: 1; padding: 15px;" onclick="startBookingFlow(${tool.id})">
                        Book Now
                    </button>
                    <button class="btn-secondary" onclick="messageOwner(${tool.id})">
                        Message Owner
                    </button>
                    <button class="favorite-btn ${favoriteTools.has(tool.id) ? 'active' : ''}" onclick="toggleFavorite(${tool.id}, this)" style="position: static; width: 50px; height: 50px;">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Close modal
function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Start booking flow
function startBookingFlow(toolId) {
    const tool = sampleTools.find(t => t.id === toolId);
    alert(`Starting booking process for ${tool.title}. This would open the booking calendar and payment flow.`);
    closeModal();
}

// Message owner
function messageOwner(toolId) {
    const tool = sampleTools.find(t => t.id === toolId);
    alert(`Opening message thread with ${tool.owner}. This would open the messaging interface.`);
}

// Setup smooth scrolling
function setupSmoothScrolling() {
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
}

// Update active navigation based on scroll
function updateActiveNav() {
    const sections = ['home', 'browse', 'how-it-works', 'community'];
    const scrollPos = window.scrollY + 100;

    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Update desktop nav
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) activeLink.classList.add('active');
                
                // Update mobile nav
                mobileNavItems.forEach(item => item.classList.remove('active'));
                const activeMobileItem = document.querySelector(`.mobile-bottom-nav .nav-item[href="#${sectionId}"]`);
                if (activeMobileItem) activeMobileItem.classList.add('active');
            }
        }
    });
}

// Setup animations
function setupAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.category-card, .tool-item, .step, .community-card').forEach(el => {
        observer.observe(el);
    });
}

// Utility functions
function showNotification(message, type = 'success') {
    // Create and show notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#43e97b' : '#ff6b6b'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 3000;
        transform: translateX(400px);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Load more functionality
document.querySelector('.load-more .btn-secondary').addEventListener('click', function() {
    showNotification('Loading more tools...', 'info');
    // Simulate loading more tools
    setTimeout(() => {
        showNotification('More tools loaded!');
    }, 1000);
});

// Mobile menu toggle
document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.querySelector(".mobile-menu-toggle");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-menu .nav-link");
    const userMenuButtons = document.querySelectorAll(".nav-menu .user-menu button");
    const listToolButton = document.querySelector(".nav-menu .btn-list-tool");

    // Function to close the mobile menu
    function closeMobileMenu() {
        if (navMenu && navMenu.classList.contains("show-menu")) {
            navMenu.classList.remove("show-menu");
            // Reset toggle icon
            if (toggle) {
                toggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
    }

    // Function to toggle the mobile menu
    function toggleMobileMenu() {
        if (navMenu) {
            navMenu.classList.toggle("show-menu");
            
            // Toggle icon
            if (toggle) {
                toggle.innerHTML = navMenu.classList.contains("show-menu") 
                    ? '<i class="fas fa-times"></i>' 
                    : '<i class="fas fa-bars"></i>';
            }
        }
    }

    // Toggle menu when hamburger is clicked
    if (toggle && navMenu) {
        toggle.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMobileMenu();
        });
    }

    // Close menu when navigation links are clicked
    navLinks.forEach(link => {
        link.addEventListener("click", function() {
            closeMobileMenu();
        });
    });

    // Close menu when user menu buttons are clicked
    userMenuButtons.forEach(button => {
        button.addEventListener("click", function() {
            closeMobileMenu();
        });
    });

    // Close menu when "List Your Tool" button is clicked
    if (listToolButton) {
        listToolButton.addEventListener("click", function() {
            closeMobileMenu();
        });
    }

    // Close menu when clicking outside of it
    document.addEventListener("click", function(e) {
        if (navMenu && navMenu.classList.contains("show-menu")) {
            // Check if click is outside the nav menu and toggle button
            if (!navMenu.contains(e.target) && !toggle.contains(e.target)) {
                closeMobileMenu();
            }
        }
    });

    // Close menu on window resize if screen becomes larger
    window.addEventListener("resize", function() {
        if (window.innerWidth > 768 && navMenu && navMenu.classList.contains("show-menu")) {
            closeMobileMenu();
        }
    });

    // Handle escape key to close menu
    document.addEventListener("keydown", function(e) {
        if (e.key === "Escape" && navMenu && navMenu.classList.contains("show-menu")) {
            closeMobileMenu();
        }
    });
});
