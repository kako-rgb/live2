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
        price: 2499.99,
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
        price: 3499.99,
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
        price: 24999.99,
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
        price: 12999.99,
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
        price: 39999.99,
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
                <div class="product-price">KES ${product.price.toFixed(2)}</div>
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

    // Calculate position relative to the viewport
    categoriesMenu.style.top = rect.bottom + 'px';
    categoriesMenu.style.left = rect.left + 'px';

    // Ensure the menu is visible on screen
    const menuRect = categoriesMenu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    // Adjust if menu goes off-screen to the right
    if (rect.left + menuRect.width > viewportWidth) {
        categoriesMenu.style.left = (viewportWidth - menuRect.width - 10) + 'px';
    }
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
    const vendorModal = document.getElementById('vendor-registration');
    vendorModal.style.display = 'block';

    // Set up tab switching
    setupVendorTabs();

    // Check if user is logged in and is a vendor
    checkVendorStatus();

    // Load categories for product form
    loadCategories();

    // Close modal when clicking on X
    vendorModal.querySelector('.close').addEventListener('click', () => {
        vendorModal.style.display = 'none';
    });

    // Close modal when clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target === vendorModal) {
            vendorModal.style.display = 'none';
        }
    });

    // Set up vendor registration form submission
    document.getElementById('vendor-register-form').addEventListener('submit', registerVendor);

    // Set up product form submission
    document.getElementById('product-form').addEventListener('submit', addProduct);
};

// Function to set up vendor tabs
function setupVendorTabs() {
    const tabs = document.querySelectorAll('.vendor-tab');
    const tabContents = document.querySelectorAll('.vendor-tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));

            // Add active class to clicked tab
            tab.classList.add('active');

            // Hide all tab contents
            tabContents.forEach(content => content.classList.remove('active'));

            // Show the corresponding tab content
            const tabName = tab.getAttribute('data-tab');
            if (tabName === 'register') {
                document.getElementById('vendor-register').classList.add('active');
            } else if (tabName === 'dashboard') {
                document.getElementById('vendor-dashboard').classList.add('active');
            }
        });
    });
}

// Function to check vendor status
function checkVendorStatus() {
    const token = localStorage.getItem('token');

    if (token) {
        // Get user data
        fetch('http://localhost:5000/api/auth/user', {
            headers: {
                'x-auth-token': token
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.isVendor) {
                // User is a vendor, show dashboard
                document.getElementById('vendor-not-logged-in').style.display = 'none';
                document.getElementById('vendor-logged-in').style.display = 'block';

                // Load vendor products
                loadVendorProducts(data._id);
            } else {
                // User is logged in but not a vendor
                document.getElementById('vendor-not-logged-in').innerHTML = `
                    <p>You are logged in as ${data.name}, but you are not registered as a vendor.</p>
                    <p>Please register as a vendor to access the dashboard.</p>
                    <button class="primary-btn" onclick="switchToVendorRegister()">Register as Vendor</button>
                `;
            }
        })
        .catch(error => {
            console.error('Error checking vendor status:', error);
        });
    }
}

// Function to switch to vendor register tab
function switchToVendorRegister() {
    document.querySelector('.vendor-tab[data-tab="register"]').click();
}

// Function to register as a vendor
function registerVendor(e) {
    e.preventDefault();

    const token = localStorage.getItem('token');

    if (!token) {
        alert('Please log in to register as a vendor');
        return;
    }

    const shopName = document.getElementById('shop-name').value;
    const shopDescription = document.getElementById('shop-description').value;
    const phone = document.getElementById('vendor-phone').value;
    const street = document.getElementById('vendor-street').value;
    const city = document.getElementById('vendor-city').value;
    const state = document.getElementById('vendor-state').value;
    const zipCode = document.getElementById('vendor-zip').value;
    const country = document.getElementById('vendor-country').value;

    const vendorData = {
        shopName,
        shopDescription,
        phone,
        address: {
            street,
            city,
            state,
            zipCode,
            country
        },
        isVendor: true
    };

    // Update user to become a vendor
    fetch('http://localhost:5000/api/users/update', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
        },
        body: JSON.stringify(vendorData)
    })
    .then(response => response.json())
    .then(data => {
        alert('You are now registered as a vendor!');
        // Switch to dashboard tab
        document.querySelector('.vendor-tab[data-tab="dashboard"]').click();
        // Refresh vendor status
        checkVendorStatus();
    })
    .catch(error => {
        console.error('Error registering as vendor:', error);
        alert('Failed to register as vendor. Please try again.');
    });
}

// Function to load categories
function loadCategories() {
    fetch('http://localhost:5000/api/categories')
    .then(response => response.json())
    .then(categories => {
        const categorySelect = document.getElementById('product-category');
        categorySelect.innerHTML = '';

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category._id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error loading categories:', error);
    });
}

// Function to load vendor products
function loadVendorProducts(vendorId) {
    fetch(`http://localhost:5000/api/products/vendor/${vendorId}`)
    .then(response => response.json())
    .then(products => {
        const productCount = document.getElementById('vendor-product-count');
        productCount.textContent = products.length;

        // Calculate revenue (in a real app, this would come from orders)
        let revenue = 0;
        products.forEach(product => {
            revenue += product.price * 10; // Assuming 10 sales per product for demo
        });

        const revenueElement = document.getElementById('vendor-revenue');
        revenueElement.textContent = `KES ${revenue.toFixed(2)}`;

        // Set order count (mock data for demo)
        const orderCount = document.getElementById('vendor-order-count');
        orderCount.textContent = products.length * 10; // Assuming 10 orders per product for demo
    })
    .catch(error => {
        console.error('Error loading vendor products:', error);
    });
}

// Function to show vendor products
function showVendorProducts() {
    const token = localStorage.getItem('token');

    if (!token) {
        return;
    }

    // Get user data to get vendor ID
    fetch('http://localhost:5000/api/auth/user', {
        headers: {
            'x-auth-token': token
        }
    })
    .then(response => response.json())
    .then(userData => {
        // Get vendor products
        return fetch(`http://localhost:5000/api/products/vendor/${userData._id}`);
    })
    .then(response => response.json())
    .then(products => {
        const productsList = document.getElementById('vendor-products-list');
        productsList.style.display = 'block';

        // Hide add product form
        document.getElementById('add-product-form').style.display = 'none';

        const productListContainer = productsList.querySelector('.product-list-container');
        productListContainer.innerHTML = '';

        if (products.length === 0) {
            productListContainer.innerHTML = '<p>You have no products yet. Add your first product!</p>';
            return;
        }

        products.forEach(product => {
            const productItem = document.createElement('div');
            productItem.className = 'vendor-product-item';
            productItem.innerHTML = `
                <img src="${product.images[0] || 'img/placeholder.jpg'}" alt="${product.name}" class="vendor-product-image">
                <div class="vendor-product-info">
                    <div class="vendor-product-name">${product.name}</div>
                    <div class="vendor-product-price">KES ${product.price.toFixed(2)}</div>
                    <div class="vendor-product-stock">In Stock: ${product.quantity}</div>
                    <div class="vendor-product-actions">
                        <button class="edit-product-btn" onclick="editProduct('${product._id}')">Edit</button>
                        <button class="delete-product-btn" onclick="deleteProduct('${product._id}')">Delete</button>
                    </div>
                </div>
            `;

            productListContainer.appendChild(productItem);
        });
    })
    .catch(error => {
        console.error('Error showing vendor products:', error);
    });
}

// Function to show add product form
function showAddProductForm() {
    // Hide products list
    document.getElementById('vendor-products-list').style.display = 'none';

    // Show add product form
    document.getElementById('add-product-form').style.display = 'block';

    // Reset form
    document.getElementById('product-form').reset();
}

// Function to cancel adding product
function cancelAddProduct() {
    // Hide add product form
    document.getElementById('add-product-form').style.display = 'none';

    // Show products list
    showVendorProducts();
}

// Function to add a product
function addProduct(e) {
    e.preventDefault();

    const token = localStorage.getItem('token');

    if (!token) {
        alert('Please log in to add a product');
        return;
    }

    const name = document.getElementById('product-name').value;
    const description = document.getElementById('product-description').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const category = document.getElementById('product-category').value;
    const quantity = parseInt(document.getElementById('product-quantity').value);

    // Get image URLs
    const images = [];
    const image1 = document.getElementById('product-image-1').value;
    const image2 = document.getElementById('product-image-2').value;
    const image3 = document.getElementById('product-image-3').value;

    if (image1) images.push(image1);
    if (image2) images.push(image2);
    if (image3) images.push(image3);

    const productData = {
        name,
        description,
        price,
        category,
        quantity,
        images
    };

    // Create product
    fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
        },
        body: JSON.stringify(productData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Product added successfully!');
        // Show products list
        showVendorProducts();
    })
    .catch(error => {
        console.error('Error adding product:', error);
        alert('Failed to add product. Please try again.');
    });
}

// Function to edit a product
function editProduct(productId) {
    // Get product data
    fetch(`http://localhost:5000/api/products/${productId}`)
    .then(response => response.json())
    .then(product => {
        // Show add product form
        showAddProductForm();

        // Fill form with product data
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-category').value = product.category._id;
        document.getElementById('product-quantity').value = product.quantity;

        // Fill image URLs
        if (product.images.length > 0) document.getElementById('product-image-1').value = product.images[0];
        if (product.images.length > 1) document.getElementById('product-image-2').value = product.images[1];
        if (product.images.length > 2) document.getElementById('product-image-3').value = product.images[2];

        // Change form submission to update product
        const form = document.getElementById('product-form');
        form.removeEventListener('submit', addProduct);
        form.addEventListener('submit', (e) => updateProduct(e, productId));

        // Change button text
        form.querySelector('button[type="submit"]').textContent = 'Update Product';
    })
    .catch(error => {
        console.error('Error getting product for edit:', error);
    });
}

// Function to update a product
function updateProduct(e, productId) {
    e.preventDefault();

    const token = localStorage.getItem('token');

    if (!token) {
        alert('Please log in to update a product');
        return;
    }

    const name = document.getElementById('product-name').value;
    const description = document.getElementById('product-description').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const category = document.getElementById('product-category').value;
    const quantity = parseInt(document.getElementById('product-quantity').value);

    // Get image URLs
    const images = [];
    const image1 = document.getElementById('product-image-1').value;
    const image2 = document.getElementById('product-image-2').value;
    const image3 = document.getElementById('product-image-3').value;

    if (image1) images.push(image1);
    if (image2) images.push(image2);
    if (image3) images.push(image3);

    const productData = {
        name,
        description,
        price,
        category,
        quantity,
        images
    };

    // Update product
    fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
        },
        body: JSON.stringify(productData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Product updated successfully!');
        // Show products list
        showVendorProducts();
    })
    .catch(error => {
        console.error('Error updating product:', error);
        alert('Failed to update product. Please try again.');
    });
}

// Function to delete a product
function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
        alert('Please log in to delete a product');
        return;
    }

    // Delete product
    fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
            'x-auth-token': token
        }
    })
    .then(response => response.json())
    .then(data => {
        alert('Product deleted successfully!');
        // Refresh products list
        showVendorProducts();
    })
    .catch(error => {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
    });
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
                    <td>KES ${item.price.toFixed(2)}</td>
                    <td>
                        <div class="quantity-control">
                            <button onclick="updateCartItemQuantity('${item.id}', ${item.quantity - 1})">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="updateCartItemQuantity('${item.id}', ${item.quantity + 1})">+</button>
                        </div>
                    </td>
                    <td>KES ${itemTotal.toFixed(2)}</td>
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
                <span>Total: KES ${total.toFixed(2)}</span>
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
                <p>${cart.length} item(s) - Total: KES ${total.toFixed(2)}</p>
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

// Function to show live stream modal
window.showLiveStream = function() {
    const livestreamModal = document.getElementById('livestream-modal');

    // Show the modal
    livestreamModal.style.display = 'block';

    // Load mock streams
    loadMockStreams();

    // Set up tab switching
    setupLivestreamTabs();

    // Set up camera preview if on create tab
    if (document.querySelector('.livestream-tab[data-tab="create"]').classList.contains('active')) {
        setupCameraPreview();
    }

    // Close modal when clicking on X
    livestreamModal.querySelector('.close').addEventListener('click', () => {
        livestreamModal.style.display = 'none';
        stopCameraPreview();
    });

    // Close modal when clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target === livestreamModal) {
            livestreamModal.style.display = 'none';
            stopCameraPreview();
        }
    });
};

// Function to set up livestream tabs
function setupLivestreamTabs() {
    const tabs = document.querySelectorAll('.livestream-tab');
    const tabContents = document.querySelectorAll('.livestream-tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));

            // Add active class to clicked tab
            tab.classList.add('active');

            // Hide all tab contents
            tabContents.forEach(content => content.classList.remove('active'));

            // Show the corresponding tab content
            const tabName = tab.getAttribute('data-tab');
            if (tabName === 'view') {
                document.getElementById('view-streams').classList.add('active');
                stopCameraPreview();
            } else if (tabName === 'create') {
                document.getElementById('create-stream').classList.add('active');
                setupCameraPreview();
            }
        });
    });
}

// Function to load mock streams
function loadMockStreams() {
    const streamList = document.querySelector('.stream-list');
    const noStreamsMessage = document.querySelector('.no-streams-message');

    // Mock stream data
    const mockStreams = [
        {
            id: 1,
            title: 'New Electronics Showcase',
            host: 'TechVendor',
            thumbnail: 'img/product-1.jpg',
            viewers: 42,
            description: 'Exploring the latest electronics and gadgets available in our store.'
        },
        {
            id: 2,
            title: 'Fashion Trends 2025',
            host: 'StyleGuru',
            thumbnail: 'img/product-3.jpg',
            viewers: 78,
            description: 'Check out the upcoming fashion trends for 2025.'
        },
        {
            id: 3,
            title: 'Home Appliance Tutorial',
            host: 'HomeExpert',
            thumbnail: 'img/fridge.jpg',
            viewers: 15,
            description: 'Learn how to make the most of your home appliances.'
        }
    ];

    // If there are streams, hide the no streams message and show the streams
    if (mockStreams.length > 0) {
        noStreamsMessage.style.display = 'none';

        // Clear existing streams
        streamList.innerHTML = '';

        // Add mock streams
        mockStreams.forEach(stream => {
            const streamItem = document.createElement('div');
            streamItem.className = 'stream-item';
            streamItem.setAttribute('data-stream-id', stream.id);
            streamItem.innerHTML = `
                <div class="stream-thumbnail">
                    <img src="${stream.thumbnail}" alt="${stream.title}">
                    <div class="live-badge">LIVE</div>
                    <div class="stream-viewers">
                        <i class="fas fa-eye"></i> ${stream.viewers}
                    </div>
                </div>
                <div class="stream-info">
                    <div class="stream-title">${stream.title}</div>
                    <div class="stream-host">Hosted by: ${stream.host}</div>
                </div>
            `;

            // Add click event to view the stream
            streamItem.addEventListener('click', () => {
                viewStream(stream);
            });

            streamList.appendChild(streamItem);
        });
    } else {
        noStreamsMessage.style.display = 'block';
    }
}

// Function to view a stream
function viewStream(stream) {
    const activeStreamModal = document.getElementById('active-stream-modal');
    const livestreamModal = document.getElementById('livestream-modal');

    // Hide the livestream modal
    livestreamModal.style.display = 'none';

    // Set stream details
    document.getElementById('active-stream-title').textContent = stream.title;
    document.getElementById('active-stream-host').textContent = `Hosted by: ${stream.host}`;
    document.getElementById('active-stream-description').textContent = stream.description;
    document.getElementById('active-stream-viewers').textContent = `${stream.viewers} viewers`;

    // Show a placeholder video
    const videoPlayer = document.getElementById('active-stream-player');
    videoPlayer.poster = stream.thumbnail;

    // Show the active stream modal
    activeStreamModal.style.display = 'block';

    // Set up back button
    document.getElementById('back-to-streams-btn').addEventListener('click', () => {
        activeStreamModal.style.display = 'none';
        livestreamModal.style.display = 'block';
    });

    // Close modal when clicking on X
    activeStreamModal.querySelector('.close').addEventListener('click', () => {
        activeStreamModal.style.display = 'none';
    });

    // Close modal when clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target === activeStreamModal) {
            activeStreamModal.style.display = 'none';
        }
    });

    // Set up chat functionality
    setupChat();
}

// Function to set up chat
function setupChat() {
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-message');
    const sendButton = document.getElementById('send-chat-btn');

    // Clear existing messages
    chatMessages.innerHTML = '';

    // Add some mock messages
    addChatMessage('System', 'Welcome to the live stream! Please be respectful in the chat.');
    addChatMessage('Viewer1', 'Hello everyone! Excited to be here.');
    addChatMessage('Viewer2', 'Can you show that product again?');

    // Send message when clicking send button
    sendButton.addEventListener('click', sendChatMessage);

    // Send message when pressing Enter
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
}

// Function to add a chat message
function addChatMessage(user, message) {
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.className = 'chat-message';
    messageElement.innerHTML = `<span class="chat-user">${user}:</span> ${message}`;
    chatMessages.appendChild(messageElement);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to send a chat message
function sendChatMessage() {
    const chatInput = document.getElementById('chat-message');
    const message = chatInput.value.trim();

    if (message) {
        // Add the message to the chat
        addChatMessage('You', message);

        // Clear the input
        chatInput.value = '';
    }
}

// Function to set up camera preview
function setupCameraPreview() {
    const videoPreview = document.getElementById('stream-preview');
    const startButton = document.getElementById('start-stream-btn');
    const stopButton = document.getElementById('stop-stream-btn');

    // Check if browser supports getUserMedia
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                // Show the stream in the video element
                videoPreview.srcObject = stream;

                // Enable start button
                startButton.disabled = false;

                // Set up start streaming button
                startButton.addEventListener('click', () => {
                    // In a real app, this would start the actual streaming
                    startButton.disabled = true;
                    stopButton.disabled = false;
                    alert('Streaming started! In a real implementation, this would connect to a streaming service.');
                });

                // Set up stop streaming button
                stopButton.addEventListener('click', () => {
                    stopButton.disabled = true;
                    startButton.disabled = false;
                    alert('Stream ended. Thank you for streaming!');
                });
            })
            .catch(error => {
                console.error('Error accessing camera:', error);
                videoPreview.parentElement.innerHTML = `
                    <div class="camera-error">
                        <p>Could not access camera. Please make sure you have granted camera permissions.</p>
                        <p>Error: ${error.message}</p>
                    </div>
                `;
            });
    } else {
        videoPreview.parentElement.innerHTML = `
            <div class="camera-error">
                <p>Your browser does not support camera access.</p>
                <p>Please use a modern browser like Chrome, Firefox, or Edge.</p>
            </div>
        `;
    }
}

// Function to stop camera preview
function stopCameraPreview() {
    const videoPreview = document.getElementById('stream-preview');

    if (videoPreview && videoPreview.srcObject) {
        const tracks = videoPreview.srcObject.getTracks();

        tracks.forEach(track => track.stop());
        videoPreview.srcObject = null;
    }
}

// Function to show page content in modal
window.showPageContent = function(pageType) {
    const pageModal = document.getElementById('page-modal');
    const pageContent = document.getElementById('page-content');
    let title = '';
    let content = '';

    // Set content based on page type
    switch(pageType) {
        case 'contact':
            title = 'Contact Us';
            content = '<p>This page will contain contact information and a contact form. You can add your own content here.</p>';
            break;
        case 'return-policy':
            title = 'Return Policy';
            content = '<p>This page will contain the return policy details. You can add your own content here.</p>';
            break;
        case 'terms':
            title = 'Terms & Conditions';
            content = '<p>This page will contain the terms and conditions. You can add your own content here.</p>';
            break;
        case 'shipping':
            title = 'Shipping & Delivery';
            content = '<p>This page will contain shipping and delivery information. You can add your own content here.</p>';
            break;
        default:
            title = 'Page Not Found';
            content = '<p>The requested page could not be found.</p>';
    }

    // Set modal content
    pageContent.innerHTML = `
        <h1 class="page-title">${title}</h1>
        ${content}
    `;

    // Show modal
    pageModal.style.display = 'block';

    // Close modal when clicking on X
    pageModal.querySelector('.close').addEventListener('click', () => {
        pageModal.style.display = 'none';
    });

    // Close modal when clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target === pageModal) {
            pageModal.style.display = 'none';
        }
    });
};

// Search functionality
const quickResults = document.getElementById('quick-results');

// Show random products when search is clicked
searchInput.addEventListener('click', () => {
    // Show quick results with 4 random products
    showRandomProducts();
});

// Use event delegation for close buttons
document.addEventListener('click', function(e) {
    // Check if the clicked element is a close button
    if (e.target.classList.contains('close-results')) {
        // Prevent the click from propagating to parent elements
        e.stopPropagation();

        // Find the parent container
        const container = e.target.closest('#search-results, #quick-results');
        if (container) {
            container.style.display = 'none';
        }
    }
});

// Function to show random products
function showRandomProducts() {
    // Get 4 random products
    const randomProducts = getRandomProducts(4);

    // Display them in quick results
    let resultsHTML = '<div class="close-results" onclick="document.getElementById(\'quick-results\').style.display=\'none\'">×</div>';
    randomProducts.forEach(product => {
        resultsHTML += `
            <div class="search-item" onclick="showProductDetails('${product.id}')">
                <img src="${product.image}" alt="${product.name}">
                <div class="search-item-details">
                    <div class="search-item-name">${product.name}</div>
                    <div class="search-item-price">KES ${product.price.toFixed(2)}</div>
                    <div class="search-item-description">${product.description || 'No description available'}</div>
                </div>
            </div>
        `;
    });

    quickResults.innerHTML = resultsHTML;
    quickResults.style.display = 'block';

    // Close button is handled by event delegation
}

// Get random products
function getRandomProducts(count) {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Search input functionality
searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();

    // Hide quick results when typing
    quickResults.style.display = 'none';

    if (query.length < 2) {
        searchResults.innerHTML = '';
        searchResults.style.display = 'none';
        return;
    }

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        (product.description && product.description.toLowerCase().includes(query))
    );

    if (filteredProducts.length === 0) {
        searchResults.innerHTML = '<div class="close-results" onclick="document.getElementById(\'search-results\').style.display=\'none\'">×</div><div class="search-item">No products found</div>';
    } else {
        let resultsHTML = '<div class="close-results" onclick="document.getElementById(\'search-results\').style.display=\'none\'">×</div>';
        filteredProducts.forEach(product => {
            resultsHTML += `
                <div class="search-item" onclick="showProductDetails('${product.id}')">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="search-item-details">
                        <div class="search-item-name">${product.name}</div>
                        <div class="search-item-price">KES ${product.price.toFixed(2)}</div>
                        <div class="search-item-description">${product.description || 'No description available'}</div>
                    </div>
                </div>
            `;
        });
        searchResults.innerHTML = resultsHTML;
    }

    searchResults.style.display = 'block';

    // Close button is handled by event delegation
});

// Hide search results when clicking outside
document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target) && !quickResults.contains(e.target)) {
        searchResults.style.display = 'none';
        quickResults.style.display = 'none';
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
