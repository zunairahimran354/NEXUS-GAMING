
const games = [
    {
        id: 1,
        name: "Cyberpunk World",
        category: "Action",
        price: 49.99,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600",
        description: "Explore a futuristic world filled with action, technology and exciting adventures."
    },
    {
        id: 2,
        name: "Space Adventure",
        category: "Adventure",
        price: 39.99,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600",
        description: "Travel across mysterious galaxies and discover amazing new worlds."
    },
    {
        id: 3,
        name: "Speed Legends",
        category: "Racing",
        price: 29.99,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600",
        description: "Experience exciting racing challenges and discover your need for speed."
    },
    {
        id: 4,
        name: "Football Champions",
        category: "Sports",
        price: 34.99,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600",
        description: "Enjoy the excitement of football and compete in thrilling matches."
    },
    {
        id: 5,
        name: "Dark Warriors",
        category: "Action",
        price: 44.99,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600",
        description: "Enter a mysterious world of adventure and challenging missions."
    },
    {
        id: 6,
        name: "Lost Galaxy",
        category: "Adventure",
        price: 24.99,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600",
        description: "Explore beautiful space environments and uncover hidden secrets."
    },
    {
        id: 7,
        name: "Street Racing",
        category: "Racing",
        price: 54.99,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600",
        description: "Take on exciting driving challenges and race through city streets."
    },
    {
        id: 8,
        name: "Basketball Stars",
        category: "Sports",
        price: 19.99,
        rating: 4.4,
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600",
        description: "Experience the excitement of basketball and compete for victory."
    }
];

// Variables

let cart = [];
let favorites = [];

let selectedCategory = "All";
let searchTerm = "";
let favoritesOnly = false;

// Elements

const gameGrid = document.getElementById("gameGrid");
const cartSidebar = document.getElementById("cartSidebar");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const favoriteCount = document.getElementById("favoriteCount");
const overlay = document.getElementById("overlay");
const toast = document.getElementById("toast");

const modalOverlay = document.getElementById("modalOverlay");

// Display Games

function displayGames() {

    let filteredGames = games.filter(game => {

        const matchesCategory =
            selectedCategory === "All" ||
            game.category === selectedCategory;

        const matchesSearch =
            game.name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFavorites =
            !favoritesOnly || favorites.includes(game.id);

        return matchesCategory && matchesSearch && matchesFavorites;
    });

    const sortValue = document.getElementById("sortSelect").value;

    if (sortValue === "low") {
        filteredGames.sort((a, b) => a.price - b.price);
    }

    if (sortValue === "high") {
        filteredGames.sort((a, b) => b.price - a.price);
    }

    if (sortValue === "rating") {
        filteredGames.sort((a, b) => b.rating - a.rating);
    }

    gameGrid.innerHTML = "";

    if (filteredGames.length === 0) {

        gameGrid.innerHTML =
            `<p class="no-games">No games found. Try another search!</p>`;

        return;
    }

    filteredGames.forEach(game => {

        const isFavorite = favorites.includes(game.id);

        const gameCard = document.createElement("div");

        gameCard.className = "game-card";

        gameCard.innerHTML = `

            <div class="game-image">

                <img src="${game.image}" alt="${game.name}" loading="lazy">

                <span class="game-category">${game.category}</span>

                <button
                    class="favorite-btn ${isFavorite ? "active" : ""}"
                    data-id="${game.id}"
                    aria-label="Add to favorites">
                    ${isFavorite ? "♥" : "♡"}
                </button>

            </div>

            <div class="game-info">

                <h3>${game.name}</h3>

                <p class="game-rating">★ ${game.rating} / 5</p>

                <div class="game-bottom">

                    <span class="game-price">$${game.price.toFixed(2)}</span>

                    <button class="details-btn" data-id="${game.id}">
                        DETAILS
                    </button>

                </div>

                <button class="add-game" data-id="${game.id}">
                    ADD TO CART +
                </button>

            </div>
        `;

        gameGrid.appendChild(gameCard);

    });

}

// Notification

function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);

}

// Add To Cart

function addToCart(id) {

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            id: id,
            quantity: 1
        });

    }

    updateCart();

    showToast("Game added to your cart!");

}

// Update Cart

function updateCart() {

    cartItems.innerHTML = "";

    let total = 0;
    let count = 0;

    if (cart.length === 0) {

        cartItems.innerHTML =
            `<p class="empty-cart">Your cart is empty.</p>`;

    }

    cart.forEach(item => {

        const game = games.find(game => game.id === item.id);

        if (!game) return;

        total += game.price * item.quantity;

        count += item.quantity;

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `

            <img src="${game.image}" alt="${game.name}">

            <div class="cart-item-info">

                <h4>${game.name}</h4>

                <p>$${game.price.toFixed(2)}</p>

                <div class="quantity">

                    <button class="decrease" data-id="${game.id}">−</button>

                    <span>${item.quantity}</span>

                    <button class="increase" data-id="${game.id}">+</button>

                </div>

                <button class="remove-item" data-id="${game.id}">
                    Remove
                </button>

            </div>

        `;

        cartItems.appendChild(cartItem);

    });

    cartCount.textContent = count;

    cartTotal.textContent = "$" + total.toFixed(2);

}

// Cart Quantity and Remove

cartItems.addEventListener("click", function(event) {

    const id = Number(event.target.dataset.id);

    if (!id) return;

    const item = cart.find(item => item.id === id);

    if (!item) return;

    if (event.target.classList.contains("increase")) {

        item.quantity++;

    }

    if (event.target.classList.contains("decrease")) {

        item.quantity--;

        if (item.quantity <= 0) {

            cart = cart.filter(item => item.id !== id);

        }

    }

    if (event.target.classList.contains("remove-item")) {

        cart = cart.filter(item => item.id !== id);

        showToast("Game removed from cart.");

    }

    updateCart();

});

// Game Card Buttons

gameGrid.addEventListener("click", function(event) {

    const id = Number(event.target.dataset.id);

    if (!id) return;

    if (event.target.classList.contains("add-game")) {

        addToCart(id);

    }

    if (event.target.classList.contains("favorite-btn")) {

        if (favorites.includes(id)) {

            favorites = favorites.filter(item => item !== id);

            showToast("Removed from favorites.");

        } else {

            favorites.push(id);

            showToast("Added to favorites!");

        }

        updateFavorites();

    }

    if (event.target.classList.contains("details-btn")) {

        openGameDetails(id);

    }

});

// Update Favorites

function updateFavorites() {

    favoriteCount.textContent = favorites.length;

    displayGames();

}

// Open Game Details

function openGameDetails(id) {

    const game = games.find(game => game.id === id);

    if (!game) return;

    document.getElementById("modalImage").src = game.image;

    document.getElementById("modalImage").alt = game.name;

    document.getElementById("modalCategory").textContent = game.category;

    document.getElementById("modalTitle").textContent = game.name;

    document.getElementById("modalDescription").textContent = game.description;

    document.getElementById("modalPrice").textContent =
        "$" + game.price.toFixed(2);

    document.getElementById("modalAddCart").dataset.id = game.id;

    modalOverlay.classList.add("show");

}

// Close Game Details

document.getElementById("closeModal").addEventListener("click", () => {

    modalOverlay.classList.remove("show");

});

modalOverlay.addEventListener("click", event => {

    if (event.target === modalOverlay) {

        modalOverlay.classList.remove("show");

    }

});

// Add Game From Modal

document.getElementById("modalAddCart").addEventListener("click", function() {

    const id = Number(this.dataset.id);

    if (id) {

        addToCart(id);

        modalOverlay.classList.remove("show");

    }

});

// Category Filters

function selectCategory(category) {

    selectedCategory = category;

    favoritesOnly = false;

    document.querySelectorAll(".filter-btn").forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.category === category
        );

    });

    displayGames();

}

document.querySelectorAll(".filter-btn").forEach(button => {

    button.addEventListener("click", function() {

        selectCategory(this.dataset.category);

    });

});

// Category Cards

document.querySelectorAll(".category-card").forEach(button => {

    button.addEventListener("click", function() {

        selectCategory(this.dataset.category);

        document.getElementById("games").scrollIntoView({
            behavior: "smooth"
        });

    });

});

// Search

const searchBar = document.getElementById("searchBar");

const searchInput = document.getElementById("searchInput");

document.getElementById("searchBtn").addEventListener("click", () => {

    searchBar.classList.toggle("show");

    searchInput.focus();

});

document.getElementById("closeSearch").addEventListener("click", () => {

    searchBar.classList.remove("show");

    searchInput.value = "";

    searchTerm = "";

    displayGames();

});

searchInput.addEventListener("input", function() {

    searchTerm = this.value;

    favoritesOnly = false;

    displayGames();

});

// Sort Games

document.getElementById("sortSelect").addEventListener("change", displayGames);

// Favorites Button

document.getElementById("favoritesBtn").addEventListener("click", () => {

    favoritesOnly = !favoritesOnly;

    selectedCategory = "All";

    document.querySelectorAll(".filter-btn").forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.category === "All" && !favoritesOnly
        );

    });

    if (favoritesOnly) {

        showToast("Showing your favorite games.");

    }

    displayGames();

    document.getElementById("games").scrollIntoView({
        behavior: "smooth"
    });

});

// Open Cart

function openCart() {

    cartSidebar.classList.add("show");

    overlay.classList.add("show");

}

// Close Cart

function closeCart() {

    cartSidebar.classList.remove("show");

    overlay.classList.remove("show");

}

document.getElementById("cartBtn").addEventListener("click", openCart);

document.getElementById("closeCart").addEventListener("click", closeCart);

overlay.addEventListener("click", closeCart);

// Mobile Menu

document.getElementById("menuBtn").addEventListener("click", () => {

    document.getElementById("navLinks").classList.toggle("show");

});

document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

        document.getElementById("navLinks").classList.remove("show");

    });

});

// Checkout Demo

document.getElementById("checkoutBtn").addEventListener("click", () => {

    if (cart.length === 0) {

        showToast("Your cart is empty!");

        return;

    }

    showToast("Demo checkout! No payment was processed.");

});

// Newsletter

document.getElementById("newsletterForm").addEventListener("submit", function(event) {

    event.preventDefault();

    showToast("Welcome to the NEXUS community!");

    this.reset();

});

// Initial Display

displayGames();

updateCart();

updateFavorites();
