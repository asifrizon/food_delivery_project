const API_URL = "http://localhost:3000/api/restaurants";

// Fake data (TEMPORARY)
const mockRestaurants = [
    {
        name: "Kacchi Bhai",
        image: "food_14.png",
        category: "Bangladeshi • Biryani",
        rating: 4.5,
        delivery_time: "30-40 min",
        discount: "20% OFF"
    },
    {
        name: "Sultan's Dine",
        image: "food_1.png",
        category: "Mughlai • Kacchi",
        rating: 4.7,
        delivery_time: "25-35 min",
        discount: "15% OFF"
    },
    {
        name: "Pizza Hut",
        image: "food_12.png",
        category: "Pizza • Fast Food",
        rating: 4.2,
        delivery_time: "20-30 min",
        discount: "10% OFF"
    },
    {
        name: "Kacchi Bhai",
        image: "food_14.png",
        category: "Bangladeshi • Biryani",
        rating: 4.5,
        delivery_time: "30-40 min",
        discount: "20% OFF"
    },
    {
        name: "Sultan's Dine",
        image: "food_1.png",
        category: "Mughlai • Kacchi",
        rating: 4.7,
        delivery_time: "25-35 min",
        discount: "15% OFF"
    },
    {
        name: "Pizza Hut",
        image: "food_12.png",
        category: "Pizza • Fast Food",
        rating: 4.2,
        delivery_time: "20-30 min",
        discount: "10% OFF"
    },
    {
        name: "Kacchi Bhai",
        image: "food_14.png",
        category: "Bangladeshi • Biryani",
        rating: 4.5,
        delivery_time: "30-40 min",
        discount: "20% OFF"
    },
    {
        name: "Sultan's Dine",
        image: "food_1.png",
        category: "Mughlai • Kacchi",
        rating: 4.7,
        delivery_time: "25-35 min",
        discount: "15% OFF"
    },
    {
        name: "Pizza Hut",
        image: "food_12.png",
        category: "Pizza • Fast Food",
        rating: 4.2,
        delivery_time: "20-30 min",
        discount: "10% OFF"
    },
    {
        name: "Kacchi Bhai",
        image: "food_14.png",
        category: "Bangladeshi • Biryani",
        rating: 4.5,
        delivery_time: "30-40 min",
        discount: "20% OFF"
    },
    {
        name: "Sultan's Dine",
        image: "food_1.png",
        category: "Mughlai • Kacchi",
        rating: 4.7,
        delivery_time: "25-35 min",
        discount: "15% OFF"
    },
    {
        name: "Pizza Hut",
        image: "food_12.png",
        category: "Pizza • Fast Food",
        rating: 4.2,
        delivery_time: "20-30 min",
        discount: "10% OFF"
    },
    {
        name: "Kacchi Bhai",
        image: "food_14.png",
        category: "Bangladeshi • Biryani",
        rating: 4.5,
        delivery_time: "30-40 min",
        discount: "20% OFF"
    },
    {
        name: "Sultan's Dine",
        image: "food_1.png",
        category: "Mughlai • Kacchi",
        rating: 4.7,
        delivery_time: "25-35 min",
        discount: "15% OFF"
    },
    {
        name: "Pizza Hut",
        image: "food_12.png",
        category: "Pizza • Fast Food",
        rating: 4.2,
        delivery_time: "20-30 min",
        discount: "10% OFF"
    },
    {
        name: "Kacchi Bhai",
        image: "food_14.png",
        category: "Bangladeshi • Biryani",
        rating: 4.5,
        delivery_time: "30-40 min",
        discount: "20% OFF"
    },
    {
        name: "Sultan's Dine",
        image: "food_1.png",
        category: "Mughlai • Kacchi",
        rating: 4.7,
        delivery_time: "25-35 min",
        discount: "15% OFF"
    },
    {
        name: "Pizza Hut",
        image: "food_12.png",
        category: "Pizza • Fast Food",
        rating: 4.2,
        delivery_time: "20-30 min",
        discount: "10% OFF"
    },
    {
        name: "Pizza Hut",
        image: "food_12.png",
        category: "Pizza • Fast Food",
        rating: 4.2,
        delivery_time: "20-30 min",
        discount: "10% OFF"
    }
];

// Render function (REUSABLE)
function renderRestaurants(restaurants) {
    const grid = document.getElementById("restaurantGrid");
    if (!grid) return; // Safety check
    
    grid.innerHTML = "";

    restaurants.forEach((r, index) => {
        const card = document.createElement('div');
        card.className = 'restaurant-card';
        card.innerHTML = `
            <div class="image-wrapper">
                ${r.discount ? `<span class="discount-badge">${r.discount}</span>` : ""}
                <img src="image/${r.image}" alt="${r.name}">
            </div>
            <div class="card-body">
                <h3>${r.name}</h3>
                <p>${r.category}</p>
                <span>⭐ ${r.rating} • ${r.delivery_time}</span>
            </div>
        `;
        
        // Add click event listener instead of inline onclick
        card.addEventListener('click', () => onRestaurantCardClick(r.name));
        
        grid.appendChild(card);
    });
}

function onRestaurantCardClick(restaurantName) {
    console.log("Restaurant clicked:", restaurantName);

    // Find the restaurant data from mock data
    const restaurant = mockRestaurants.find(r => r.name === restaurantName);

    if (restaurant) {
        // Save restaurant data in sessionStorage
        sessionStorage.setItem('selectedRestaurant', JSON.stringify(restaurant));

        // Redirect to the menu page
        window.location.href = 'menu.html';
    }
}

// Initialize modals
function initializeModals() {
    const profileIcon = document.getElementById('profile-icon');
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    
    if (!profileIcon || !loginModal || !signupModal) return;

    // Open modal for Login
    profileIcon.addEventListener('click', function () {
        loginModal.style.display = 'block';
    });

    // Close the modal when the user clicks on the close button
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function () {
            loginModal.style.display = 'none';
            signupModal.style.display = 'none';
        });
    });

    // Switch to Signup form
    const switchToSignup = document.getElementById('switchToSignup');
    if (switchToSignup) {
        switchToSignup.addEventListener('click', function () {
            loginModal.style.display = 'none';
            signupModal.style.display = 'block';
        });
    }

    // Switch to Login form
    const switchToLogin = document.getElementById('switchToLogin');
    if (switchToLogin) {
        switchToLogin.addEventListener('click', function () {
            signupModal.style.display = 'none';
            loginModal.style.display = 'block';
        });
    }

    // Close the modal when clicking outside of it
    window.onclick = function (event) {
        if (event.target === loginModal || event.target === signupModal) {
            loginModal.style.display = 'none';
            signupModal.style.display = 'none';
        }
    };
}

// Main initialization function
function init() {
    // Initialize modals
    initializeModals();

    // Check if cached restaurant data exists, else fetch from API
    const cachedRestaurants = sessionStorage.getItem('restaurants');

    if (cachedRestaurants) {
        // If cached data exists, render it immediately
        console.log("Using cached data");
        renderRestaurants(JSON.parse(cachedRestaurants));
    } else {
        // If no cached data, fetch from the API
        console.log("Fetching from API");
        fetch(API_URL)
            .then(res => res.json())
            .then(data => {
                sessionStorage.setItem('restaurants', JSON.stringify(data));
                renderRestaurants(data);
            })
            .catch(error => {
                console.warn("API fetch failed, using mock data:", error);
                renderRestaurants(mockRestaurants);
                // Optionally cache mock data too
                sessionStorage.setItem('restaurants', JSON.stringify(mockRestaurants));
            });
    }
}

// Wait for DOM to be fully loaded before initializing
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // DOM is already loaded
    init();
}