// DOM Elements
const authSection = document.getElementById('auth-section');
const productGrid = document.getElementById('product-grid');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const hamburger = document.getElementById('hamburger-menu');
const mobileMenu = document.getElementById('mobile-menu');
const categoriesMenu = document.querySelector('.categories-menu');

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
        image: 'img/earbuds.jpg',
        description: 'High quality wireless earbuds with noise cancellation',
        angles: [
            'img/earbuds2.jpg',
            'img/earbuds3.jpg',
            'img/earbuds4.jpg',
            'img/earbuds.jpg',
        ]
    },
    {
        id: '2',
        name: 'Smart Watch',
        price: 29.99,
        sales: 50,
        image: 'img/smartwatch.jpeg',
        description: 'Feature-rich smart watch with health tracking',
        angles: [
            'img/smartwatch2.jpeg',
            'img/smartwatch3.jpeg',
            'img/smartwatch.jpeg',
            'img/smartwatch4.jpeg',
        ]
    },
    {
        id: '3',
        name: 'Smart TV',
        price: 29.99,
        sales: 50,
        image: 'img/tv.jpg',
        description: 'Feature-rich smart TV with clear pictures',
        angles: [
            'img/tv2.jpeg',
            'img/tv3.jpeg',
            'img/tv.jpg',
            'img/tv4.jpeg',
        ]
    },
    {
        id: '4',
        name: 'Samsung HIFI',
        price: 129.99,
        sales: 50,
        image: 'img/sound.jpg',
        description: 'great sound experience',
        angles: [
            'img/sound2.jpeg',
            'img/sound3.jpeg',
            'img/sound.jpg',
            'img/sound2.jpeg',
        ]
    },
    {
        id: '5',
        name: 'Samsung Fridge',
        price: 129.99,
        sales: 50,
        image: 'img/fridge.jpeg',
        description: 'Freezing everyday',
        angles: [
            'img/fridge2.jpeg',
            'img/fridge3.jpeg',
            'img/fridge4.jpeg',
            'img/fridge2.jpeg',
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

// Hamburger menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
});

// Categories functionality
const categories = [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Clothing' },
    { id: 3, name: 'Home & Kitchen' },
    { id: 4, name: 'Beauty & Personal Care' },
    { id: 5, name: 'Sports & Outdoors' }
];

// Show categories menu
window.showCategories = function() {
    // Populate categories menu if empty
    if (categoriesMenu.children.length === 0) {
        let menuContent = '';
        categories.forEach(category => {
            menuContent += `<div class="category-item" onclick="filterByCategory(${category.id})">${category.name}</div>`;
        });
        categoriesMenu.innerHTML = menuContent;
    }

    // Toggle menu visibility
    categoriesMenu.classList.toggle('active');

    // Position menu under the categories link
    const categoriesLink = document.querySelector('a[href="#categories"]');
    const rect = categoriesLink.getBoundingClientRect();
    categoriesMenu.style.top = rect.bottom + 'px';
    categoriesMenu.style.left = rect.left + 'px';
};

// Filter products by category
window.filterByCategory = function(categoryId) {
    console.log('Filtering by category:', categoryId);
    // This would typically fetch products from the database
    // For now, just log the action

    // Hide categories menu
    categoriesMenu.classList.remove('active');
};

// Vendor options
window.showVendorOptions = function() {
    const user = firebase.auth().currentUser;

    if (user) {
        // Check if user is a vendor
        firebase.firestore().collection('users').doc(user.uid).get()
            .then(doc => {
                if (doc.exists && doc.data().role === 'vendor') {
                    // Show vendor dashboard
                    alert('Vendor dashboard coming soon!');
                } else {
                    // Show vendor registration
                    showVendorRegistration();
                }
            })
            .catch(error => {
                console.error('Error checking vendor status:', error);
                alert('Error checking vendor status. Please try again.');
            });
    } else {
        // Show login modal
        alert('Please login to access vendor features');
        showAuthModal();
    }
};

// Add to cart function
window.addToCart = function(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update cart count
    updateCartCount();

    // Show confirmation
    alert(`${product.name} added to cart!`);
};

// Update cart count
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
}

// Show cart
window.showCart = function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const modal = document.getElementById('cart-modal');

    let cartContent = '';
    let total = 0;

    if (cart.length === 0) {
        cartContent = '<p>Your cart is empty</p>';
    } else {
        cartContent = `
            <table class="cart-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
        `;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            cartContent += `
                <tr>
                    <td>
                        <div class="cart-product">
                            <img src="${item.image}" alt="${item.name}">
                            <span>${item.name}</span>
                        </div>
                    </td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>
                        <div class="quantity-control">
                            <button onclick="updateCartItemQuantity('${item.id}', ${item.quantity - 1})">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="updateCartItemQuantity('${item.id}', ${item.quantity + 1})">+</button>
                        </div>
                    </td>
                    <td>$${itemTotal.toFixed(2)}</td>
                    <td>
                        <button onclick="removeFromCart('${item.id}')">Remove</button>
                    </td>
                </tr>
            `;
        });

        cartContent += `
                </tbody>
            </table>
            <div class="cart-total">
                <span>Total: $${total.toFixed(2)}</span>
            </div>
            <div class="cart-actions">
                <button onclick="clearCart()">Clear Cart</button>
                <button onclick="checkout()">Checkout</button>
            </div>
        `;
    }

    modal.innerHTML = `
        <div class="modal-content cart-modal">
            <span class="close">&times;</span>
            <h2>Your Cart</h2>
            <div class="cart-items">
                ${cartContent}
            </div>
        </div>
    `;

    modal.style.display = 'block';

    // Close modal when clicking on X
    modal.querySelector('.close').addEventListener('click', () => {
        modal.style.display = 'none';
    });
};

// Update cart item quantity
window.updateCartItemQuantity = function(productId, newQuantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (newQuantity <= 0) {
        // Remove item if quantity is 0 or less
        cart = cart.filter(item => item.id !== productId);
    } else {
        // Update quantity
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
        }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();

    // Refresh cart modal
    showCart();
};

// Remove from cart
window.removeFromCart = function(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();

    // Refresh cart modal
    showCart();
};

// Clear cart
window.clearCart = function() {
    localStorage.setItem('cart', JSON.stringify([]));
    updateCartCount();

    // Refresh cart modal
    showCart();
};

// Checkout function
window.checkout = function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }

    // Check if user is logged in
    const user = firebase.auth().currentUser;
    if (!user) {
        alert('Please login to checkout');
        document.getElementById('cart-modal').style.display = 'none';
        showAuthModal();
        return;
    }

    // Close cart modal
    document.getElementById('cart-modal').style.display = 'none';

    // Show checkout modal
    const modal = document.getElementById('checkout-modal');
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    modal.innerHTML = `
        <div class="modal-content checkout-modal">
            <span class="close">&times;</span>
            <h2>Checkout</h2>

            <div class="checkout-summary">
                <h3>Order Summary</h3>
                <p>${cart.length} item(s) - Total: $${total.toFixed(2)}</p>
            </div>

            <div class="checkout-form">
                <h3>Shipping Information</h3>
                <div class="form-group">
                    <label for="checkout-name">Full Name</label>
                    <input type="text" id="checkout-name" required>
                </div>
                <div class="form-group">
                    <label for="checkout-address">Address</label>
                    <input type="text" id="checkout-address" required>
                </div>
                <div class="form-group">
                    <label for="checkout-city">City</label>
                    <input type="text" id="checkout-city" required>
                </div>
                <div class="form-group">
                    <label for="checkout-phone">Phone Number</label>
                    <input type="tel" id="checkout-phone" required>
                </div>

                <h3>Payment Method</h3>
                <div class="payment-methods">
                    <div class="payment-method">
                        <input type="radio" id="payment-card" name="payment-method" value="card" checked>
                        <label for="payment-card">Credit/Debit Card</label>

                        <div class="payment-details card-details">
                            <div class="form-group">
                                <label for="card-number">Card Number</label>
                                <input type="text" id="card-number" placeholder="1234 5678 9012 3456">
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="card-expiry">Expiry Date</label>
                                    <input type="text" id="card-expiry" placeholder="MM/YY">
                                </div>
                                <div class="form-group">
                                    <label for="card-cvv">CVV</label>
                                    <input type="text" id="card-cvv" placeholder="123">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="payment-method">
                        <input type="radio" id="payment-mobile" name="payment-method" value="mobile">
                        <label for="payment-mobile">Mobile Money</label>

                        <div class="payment-details mobile-details" style="display: none;">
                            <div class="form-group">
                                <label for="mobile-number">Mobile Number</label>
                                <input type="tel" id="mobile-number">
                            </div>
                            <div class="form-group">
                                <label for="mobile-provider">Provider</label>
                                <select id="mobile-provider">
                                    <option value="mtn">MTN Mobile Money</option>
                                    <option value="airtel">Airtel Money</option>
                                    <option value="vodafone">Vodafone Cash</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="checkout-actions">
                    <button id="place-order-btn">Place Order</button>
                </div>
            </div>
        </div>
    `;

    modal.style.display = 'block';

    // Close modal when clicking on X
    modal.querySelector('.close').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Toggle payment details based on selected method
    modal.querySelectorAll('input[name="payment-method"]').forEach(radio => {
        radio.addEventListener('change', () => {
            // Hide all payment details
            modal.querySelectorAll('.payment-details').forEach(details => {
                details.style.display = 'none';
            });

            // Show selected payment details
            const method = radio.value;
            modal.querySelector(`.${method}-details`).style.display = 'block';
        });
    });

    // Place order button
    modal.querySelector('#place-order-btn').addEventListener('click', () => {
        // Validate form
        const name = modal.querySelector('#checkout-name').value;
        const address = modal.querySelector('#checkout-address').value;
        const city = modal.querySelector('#checkout-city').value;
        const phone = modal.querySelector('#checkout-phone').value;

        if (!name || !address || !city || !phone) {
            alert('Please fill in all required fields');
            return;
        }

        // Get selected payment method
        const paymentMethod = modal.querySelector('input[name="payment-method"]:checked').value;

        // Validate payment details
        if (paymentMethod === 'card') {
            const cardNumber = modal.querySelector('#card-number').value;
            const cardExpiry = modal.querySelector('#card-expiry').value;
            const cardCvv = modal.querySelector('#card-cvv').value;

            if (!cardNumber || !cardExpiry || !cardCvv) {
                alert('Please fill in all card details');
                return;
            }
        } else if (paymentMethod === 'mobile') {
            const mobileNumber = modal.querySelector('#mobile-number').value;

            if (!mobileNumber) {
                alert('Please enter your mobile number');
                return;
            }
        }

        // Create order in Firestore
        const orderData = {
            userId: user.uid,
            items: cart,
            total: total,
            shipping: {
                name,
                address,
                city,
                phone
            },
            payment: {
                method: paymentMethod
            },
            status: 'pending',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        firebase.firestore().collection('orders').add(orderData)
            .then(docRef => {
                // Clear cart
                localStorage.setItem('cart', JSON.stringify([]));
                updateCartCount();

                // Show confirmation
                alert(`Order placed successfully! Your order ID is ${docRef.id}`);

                // Close modal
                modal.style.display = 'none';
            })
            .catch(error => {
                console.error('Error placing order:', error);
                alert('Error placing order: ' + error.message);
            });
    });
};

// Initialize cart count
updateCartCount();

// Initialize product image rotators
initializeProductImageRotators();

// Search functionality
searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();

    if (query.length < 2) {
        searchResults.innerHTML = '';
        return;
    }

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(query)
    );

    if (filteredProducts.length === 0) {
        searchResults.innerHTML = '<div class="search-item">No products found</div>';
    } else {
        let resultsHTML = '';
        filteredProducts.forEach(product => {
            resultsHTML += `
                <div class="search-item" onclick="showProductDetails('${product.id}')">
                    <img src="${product.image}" alt="${product.name}" width="30">
                    <span>${product.name}</span>
                    <span>$${product.price}</span>
                </div>
            `;
        });
        searchResults.innerHTML = resultsHTML;
    }
});

// Hide search results when clicking outside
document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.innerHTML = '';
    }
});

// GIS Functionality
let map;
let markers = [];

// Sample store locations
const storeLocations = [
    {
        id: 1,
        name: 'DIDI Main Store',
        lat: 5.6037,
        lng: -0.1870,  // Accra coordinates
        address: '123 Main Street, Accra',
        phone: '+233 20 123 4567',
        image: 'img/store-1.svg'
    },
    {
        id: 2,
        name: 'DIDI Electronics',
        lat: 5.6142,
        lng: -0.2073,
        address: '456 Tech Avenue, Accra',
        phone: '+233 20 987 6543',
        image: 'img/store-2.svg'
    },
    {
        id: 3,
        name: 'DIDI Fashion',
        lat: 5.5913,
        lng: -0.1973,
        address: '789 Fashion Street, Accra',
        phone: '+233 20 456 7890',
        image: 'img/store-3.svg'
    }
];

// Initialize map
function initMap() {
    // Create map centered on Accra
    map = L.map('map').setView([5.6037, -0.1870], 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add store markers
    storeLocations.forEach(store => {
        addStoreMarker(store);
    });
}

// Add store marker to map
function addStoreMarker(store) {
    const marker = L.marker([store.lat, store.lng]).addTo(map);

    // Create popup content
    const popupContent = `
        <div class="location-popup">
            <img src="${store.image}" alt="${store.name}">
            <h3>${store.name}</h3>
            <p>${store.address}</p>
            <p>${store.phone}</p>
            <div class="location-actions">
                <button onclick="getDirections(${store.lat}, ${store.lng})">Get Directions</button>
                <button onclick="showStoreProducts(${store.id})">View Products</button>
            </div>
        </div>
    `;

    // Bind popup to marker
    marker.bindPopup(popupContent);

    // Add marker to array
    markers.push(marker);
}

// Show map view
window.showMapView = function() {
    const mapView = document.getElementById('map-view');

    if (mapView.style.display === 'none') {
        mapView.style.display = 'block';

        // Initialize map if not already initialized
        if (!map) {
            initMap();
        }
    } else {
        mapView.style.display = 'none';
    }
};

// Get directions to store
window.getDirections = function(lat, lng) {
    // Open Google Maps directions in a new tab
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
};

// Show store products
window.showStoreProducts = function(storeId) {
    console.log(`Showing products for store ${storeId}`);
    // This would typically filter products by store
    // For now, just log the action

    // Hide map view
    document.getElementById('map-view').style.display = 'none';
};

// Initialize product image rotators
function initializeProductImageRotators() {
    // Get all product items
    const productItems = document.querySelectorAll('.product-item');

    // Loop through each product item
    productItems.forEach(item => {
        // Get product ID from onclick attribute
        const onclickAttr = item.getAttribute('onclick');
        if (!onclickAttr) return;

        const productId = onclickAttr.match(/showProductDetails\('([^']*)'\)/)[1];
        const product = products.find(p => p.id === productId);

        if (!product || !product.angles || product.angles.length === 0) return;

        // Get or create image container
        let imageContainer = item.querySelector('.product-image-container');
        if (!imageContainer) {
            // If the product item doesn't have the new structure, create it
            const oldImg = item.querySelector('img');
            if (oldImg) {
                oldImg.remove();

                imageContainer = document.createElement('div');
                imageContainer.className = 'product-image-container';

                const rotator = document.createElement('div');
                rotator.className = 'product-image-rotator';

                imageContainer.appendChild(rotator);
                item.insertBefore(imageContainer, item.firstChild);
            } else {
                return; // Skip if no image found
            }
        }

        // Get or create rotator
        let rotator = imageContainer.querySelector('.product-image-rotator');
        if (!rotator) {
            rotator = document.createElement('div');
            rotator.className = 'product-image-rotator';
            imageContainer.appendChild(rotator);
        }

        // Clear existing images
        rotator.innerHTML = '';

        // Add all product angles to the rotator
        const images = [];
        product.angles.forEach((imgSrc, index) => {
            const img = document.createElement('img');
            img.src = imgSrc;
            img.alt = product.name;
            img.dataset.index = index;

            // Make the first image active
            if (index === 0) {
                img.classList.add('active');
            }

            rotator.appendChild(img);
            images.push(img);
        });

        // Set up the fade animation
        if (images.length > 1) {
            // Store the current active index
            let currentIndex = 0;

            // Create an interval for this product item
            const intervalId = setInterval(() => {
                // Skip animation if user is hovering over the product
                if (item.matches(':hover')) return;

                // Fade out current image
                images[currentIndex].classList.remove('active');

                // Move to next image
                currentIndex = (currentIndex + 1) % images.length;

                // Fade in next image
                images[currentIndex].classList.add('active');
            }, 3000); // Change image every 3 seconds

            // Store the interval ID on the element to clear it if needed
            rotator.dataset.intervalId = intervalId;

            // Clear interval when the element is removed from DOM
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.removedNodes.forEach((node) => {
                        if (node === item || node.contains(item)) {
                            clearInterval(intervalId);
                            observer.disconnect();
                        }
                    });
                });
            });

            observer.observe(document.body, { childList: true, subtree: true });
        }
    });
}
