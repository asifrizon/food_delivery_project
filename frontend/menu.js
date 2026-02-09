// Fetch the selected restaurant from sessionStorage
const selectedRestaurant = JSON.parse(sessionStorage.getItem('selectedRestaurant'));

// Check if the data exists
if (selectedRestaurant) {
    console.log("Selected Restaurant Data:", selectedRestaurant);

    // Get the DOM elements for the restaurant name, image, and menu grid
    const restaurantImage = document.getElementById("restaurantImage");
    const restaurantNameHeader = document.getElementById("restaurantNameHeader");
    const category  = document.getElementById("category");
    const deliveryTime = document.getElementById("delivery_time");
    const rating = document.getElementById("rating");
    const foodGrid = document.getElementById("foodGrid");
    const dealsGrid = document.getElementById('deals_grid');

    // Set restaurant image and name in the header
    if (restaurantImage) {
        restaurantImage.src = "image/" + selectedRestaurant.image;
    }
    if(category)
    {
        category.textContent = selectedRestaurant.category;
    }
    if (restaurantNameHeader) {
        restaurantNameHeader.textContent = selectedRestaurant.name;
    }
    if(rating)
    {
       rating.innerHTML = `<i class="fas fa-star"></i> ${selectedRestaurant.rating}`;
    }
    if(deliveryTime)
    {
       deliveryTime.innerHTML = `<i class="fas fa-bicycle"></i> ${selectedRestaurant.delivery_time}`;
    }
   

    const mockMenu = [
        {
            restaurantName: "Kacchi Bhai",
            items: [
                {
                    name: "Chicken Momo",
                    category: "Momos",
                    price: "৳250",
                    image: "food_1.png",
                    rating: 4.5,
                    reviews: 100
                },
                {
                    name: "Beef Momo",
                    category: "Momos",
                    price: "৳300",
                    image: "food_2.png",
                    rating: 4.7,
                    reviews: 85
                },
                {
                    name: "Fried Momo",
                    category: "Momos",
                    price: "৳280",
                    image: "food_3.png",
                    rating: 4.6,
                    reviews: 120
                },
            ],
            deals: [  // Add deals for Kacchi Bhai
                {
                    name: "Buy 1 Get 1 Free",
                    description: "Enjoy a free item with every purchase of Chicken Momo",
                    price: "৳250"
                },
                {
                    name: "10% off on orders above ৳500",
                    description: "Save 10% on your next order above ৳500",
                    price: "Discount"
                }
            ]
        },
        {
            restaurantName: "Sultan's Dine",
            items: [
                {
                    name: "Chicken Kacchi",
                    category: "Kacchi",
                    price: "৳350",
                    image: "food_1.png",
                    rating: 4.8,
                    reviews: 200
                },
                {
                    name: "Beef Kacchi",
                    category: "Kacchi",
                    price: "৳400",
                    image: "food_22.png",
                    rating: 4.9,
                    reviews: 180
                },
                {
                    name: "Chicken Kacchi",
                    category: "Kacchi",
                    price: "৳350",
                    image: "food_1.png",
                    rating: 4.8,
                    reviews: 200
                },
                {
                    name: "Beef Kacchi",
                    category: "Kacchi",
                    price: "৳400",
                    image: "food_22.png",
                    rating: 4.9,
                    reviews: 180
                },
                {
                    name: "Chicken Kacchi",
                    category: "Kacchi",
                    price: "৳350",
                    image: "food_1.png",
                    rating: 4.8,
                    reviews: 200
                },
                {
                    name: "Beef Kacchi",
                    category: "Kacchi",
                    price: "৳400",
                    image: "food_22.png",
                    rating: 4.9,
                    reviews: 180
                },
                {
                    name: "Chicken Kacchi",
                    category: "Kacchi",
                    price: "৳350",
                    image: "food_1.png",
                    rating: 4.8,
                    reviews: 200
                },
                {
                    name: "Beef Kacchi",
                    category: "Kacchi",
                    price: "৳400",
                    image: "food_22.png",
                    rating: 4.9,
                    reviews: 180
                },
            ],
            deals: [  // Add deals for Sultan's Dine
                {
                    name: "Free Drink with Any Kacchi",
                    description: "Enjoy a free drink with any Kacchi order",
                    price: "Free"
                },
                {
                    name: "15% off on Orders Above ৳1000",
                    description: "Get a 15% discount on orders above ৳1000",
                    price: "Discount"
                }
            ]
        },
        {
            restaurantName: "Pizza Hut",
            items: [
                {
                    name: "Margherita Pizza",
                    category: "Pizza",
                    price: "৳450",
                    image: "food_12.png",
                    rating: 4.3,
                    reviews: 150
                },
                {
                    name: "Pepperoni Pizza",
                    category: "Pizza",
                    price: "৳500",
                    image: "food_12.png",
                    rating: 4.5,
                    reviews: 175
                },
            ],
            deals: [  // Add deals for Pizza Hut
                {
                    name: "Buy 1 Pizza, Get 1 Free",
                    description: "Order any pizza and get another pizza for free",
                    price: "Free"
                },
                {
                    name: "20% off on Pizza Orders",
                    description: "Get a 20% discount on all pizza orders",
                    price: "Discount"
                }
            ]
        }
    ];

    // Find the selected restaurant menu from mock data
    const menu = mockMenu.find(m => m.restaurantName === selectedRestaurant.name);

    if (menu && foodGrid) {
        // Clear previous menu content
        foodGrid.innerHTML = '';

     menu.items.forEach(item => {
    // Create the food-large-card div
    const foodLargeCard = document.createElement('div');
    foodLargeCard.className = 'food-large-card';

    // Create the food-card div (will be inside food-large-card)
    const card = document.createElement('div');
    card.className = 'food-card';

    // Add the image directly inside the food-large-card
    foodLargeCard.innerHTML = `
        <div class="image-wrapper">
            <img src="image/${item.image}" alt="${item.name}">
        </div>
    `;

    // Add the food details inside the food-card
    card.innerHTML = `
        <div class="food-details">
            <h4>${item.name}</h4>
            <div class="rating"></div> <!-- Empty div for rating -->
            <div class="price_add">
                <span>${item.price}</span>
                <button id="buy_btn">Buy Now </button>
            </div>
        </div>
    `;

    // Append the food-card inside the food-large-card
    foodLargeCard.appendChild(card);

    // Finally append the food-large-card to the foodGrid
    foodGrid.appendChild(foodLargeCard);

    // Get the rating div for the current food item (inside the card)
    const ratingDiv = card.querySelector('.rating');

    // Function to generate the star rating
    function generateRating(rating) {
        const fullStar = `<i class="fas fa-star"></i>`; // Full star
        const halfStar = `<i class="fas fa-star-half-alt"></i>`; // Half star
        const emptyStar = `<i class="far fa-star"></i>`; // Empty star

        let starsHTML = '';

        // Calculate the number of full, half, and empty stars
        const fullStars = Math.floor(rating); // Full stars
        const hasHalfStar = rating % 1 !== 0; // Check if there's a half star
        const emptyStars = 5 - Math.ceil(rating); // Empty stars to fill the total 5 stars

        // Add the full stars
        for (let i = 0; i < fullStars; i++) {
            starsHTML += fullStar;
        }

        // Add the half star if there is one
        if (hasHalfStar) {
            starsHTML += halfStar;
        }

        // Add the empty stars
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += emptyStar;
        }

        return starsHTML;
    }

    // Set the rating for the current food item
    ratingDiv.innerHTML = generateRating(item.rating); // Populate stars in the rating div
});

    }

    // If the restaurant has deals, render the deals
    if (menu && menu.deals && dealsGrid) {
        menu.deals.forEach(deal => {
            const dealCard = document.createElement('div');
            dealCard.className = 'deals-card';

            // Add content to the deal card
            dealCard.innerHTML = `
                <h5>${deal.name}</h5>
                <p>${deal.description}</p>
                <span>${deal.price}</span>
            `;

            // Append the deal card to the deals grid
            dealsGrid.appendChild(dealCard);
        });
    }

} else {
    console.log("No restaurant data found in sessionStorage");
    // Optionally redirect back to restaurant list
    // window.location.href = 'index.html';
}

// Function to go back to the restaurant list page
function closeMenu() {
    window.history.back();
}
