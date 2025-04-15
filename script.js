// DOM Elements
const authSection = document.getElementById('auth-section');
const productGrid = document.getElementById('product-grid');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

// Initialize carousel
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function nextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}

// Start carousel
let carouselInterval = setInterval(nextSlide, 4000);

// Pause carousel on hover
document.querySelector('.carousel').addEventListener('mouseenter', () => {
    clearInterval(carouselInterval);
});

document.querySelector('.carousel').addEventListener('mouseleave', () => {
    carouselInterval = setInterval(nextSlide, 4000);
});

// Product Data
const products = [
    {
        id: '1', 
        name: 'Wireless Earbuds', 
        price: 19.99, 
        sales: 100, 
        image: 'img/product-1.jpg',
        description: 'High quality wireless earbuds with noise cancellation',
        angles: [
            'img/product-1.jpg',
            'img/product-1-angle.jpg',
            'img/product-1-back.jpg',
            'img/product-1-detail.jpg'
        ]
    },
    {
        id: '2', 
        name: 'Smart Watch', 
        price: 29.99, 
        sales: 50, 
        image: 'img/product-3.jpg',
        description: 'Feature-rich smart watch with health tracking',
        angles: [
            'img/product-3.jpg',
            'img/product-3-angle.jpg',
            'img/product-3-back.jpg',
            'img/product-3-detail.jpg'
        ]
    }
];

// Product Click Handler
window.showProductDetails = function(productId) {
    const product = products.find(p => p.id === productId);
    const modal = document.getElementById('product-modal');
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" style="cursor: pointer">&times;</span>
            <div class="product-images">
                <div class="main-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="thumbnail-container">
                    ${product.angles.map((img, i) => `
                        <img src="${img}" class="thumbnail ${i === 0 ? 'active' : ''}">
                    `).join('')}
                </div>
            </div>
            <div class="product-info">
                <h2>${product.name}</h2>
                <div class="product-price">$${product.price}</div>
                <div class="product-sales">${product.sales}+ sold</div>
                <p class="product-description">${product.description}</p>
                <button class="add-to-cart" onclick="addToCart('${productId}')">Add to Cart</button>
            </div>
        </div>
    `;
    modal.style.display = 'block';

    // Thumbnail click functionality
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.addEventListener('click', function() {
            document.querySelector('.main-image img').src = this.src;
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    document.querySelector('.close').addEventListener('click', () => {
        modal.style.display = 'none';
    });
};

// [Rest of the existing JavaScript content including categories menu, cart functions, etc.]
