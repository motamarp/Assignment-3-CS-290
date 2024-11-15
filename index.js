/*
 * Write your client-side JS code in this file.  Don't forget to include your
 * name and @oregonstate.edu email address below.
 *
 * Name: Paolo Mota Marques
 * Email: motamarp@oregonstate.edu
 */

// DOM Elements -- constants
const sellButton = document.getElementById("sell-something-button");
const modalBackdrop = document.getElementById("modal-backdrop");
const sellModal = document.getElementById("sell-something-modal");
const modalClose = document.getElementById("modal-close");
const modalCancel = document.getElementById("modal-cancel");
const modalAccept = document.getElementById("modal-accept");
const filterButton = document.getElementById("filter-update-button");
const postsContainer = document.getElementById("posts");

// Form Inputs -- basically the fields in the post creation
const postTextInput = document.getElementById("post-text-input");
const postPhotoInput = document.getElementById("post-photo-input");
const postPriceInput = document.getElementById("post-price-input");
const postCityInput = document.getElementById("post-city-input");
const postConditionInputs = document.getElementsByName("post-condition");

// Filter Inputs -- used to match filtered selection with the shown items 
const filterTextInput = document.getElementById("filter-text");
const filterMinPriceInput = document.getElementById("filter-min-price");
const filterMaxPriceInput = document.getElementById("filter-max-price");
const filterCitySelect = document.getElementById("filter-city");
const filterConditionInputs = document.querySelectorAll("#filter-condition input");

// Creates a new post element -- with the following info
function createPostElement(description, photoURL, price, city, condition) {
  const post = document.createElement("div");
  post.classList.add("post");
  post.setAttribute("data-price", price);
  post.setAttribute("data-city", city);
  post.setAttribute("data-condition", condition);

// Post formatting -- personal note: the back-tick is a template indicator
  post.innerHTML = `
    <div class="post-contents">
      <div class="post-image-container">
        <img src="${photoURL}" alt="${description}">
      </div>
      <div class="post-info-container">
        <a href="#" class="post-title">${description}</a> <span class="post-price">$${price}</span> <span class="post-city">(${city})</span>
      </div>
    </div>
  `;
  return post;
}

// Show Modal -- makes the form pop up
sellButton.addEventListener("click", () => {
  modalBackdrop.classList.remove("hidden");
  sellModal.classList.remove("hidden");
});

// Close Modal (cancel/close button)
function closeModal() {
  modalBackdrop.classList.add("hidden");
  sellModal.classList.add("hidden");
  clearModalFields();
}

modalClose.addEventListener("click", closeModal);
modalCancel.addEventListener("click", closeModal);

// Clear Modal Fields -- resets the inputs when opening again
function clearModalFields() {
  postTextInput.value = "";
  postPhotoInput.value = "";
  postPriceInput.value = "";
  postCityInput.value = "";
  postConditionInputs.forEach(input => input.checked = false); // Reset radio buttons
}

// Create Post -- checks if all fields are valid before posting after hitting "Accept"
modalAccept.addEventListener("click", () => {
  const description = postTextInput.value.trim();
  const photoURL = postPhotoInput.value.trim();
  const price = postPriceInput.value.trim();
  const city = postCityInput.value.trim();
  const condition = [...postConditionInputs].find(input => input.checked)?.value;

  // Validating portion
  if (!description || !photoURL || !price || !city || !condition) {
    alert("Please fill in all fields.");
    return; // Doesn't create the post if a field is missing (or if invalid input)
  }

  // Create the post & append it -- adds post to the page
  const newPost = createPostElement(description, photoURL, price, city, condition);
  postsContainer.appendChild(newPost);

  // Checks if the city is new -- and if it is, it adds it to the selection choices
  if (![...filterCitySelect.options].some(option => option.value.toLowerCase() === city.toLowerCase())) {
    const newCityOption = document.createElement("option");
    newCityOption.textContent = city;
    newCityOption.value = city;
    filterCitySelect.appendChild(newCityOption);
  }

  closeModal(); // Closes the modal after post creation
});

// Filters -- makes sure that the selected filters are applied
filterButton.addEventListener("click", () => {
  const filterText = filterTextInput.value.trim().toLowerCase();
  const filterMinPrice = parseFloat(filterMinPriceInput.value.trim()) || 0; // Lowest possible price 
  const filterMaxPrice = parseFloat(filterMaxPriceInput.value.trim()) || Infinity; // For when there's no maximum price set
  const filterCity = filterCitySelect.value.toLowerCase(); // Selected city name becomes lowercase (removes case sensitivity for filtering) 
  const selectedConditions = [...filterConditionInputs]
    .filter(input => input.checked)
    .map(input => input.value);

  const posts = [...postsContainer.getElementsByClassName("post")]; // Gathers all posts on page into array (easier to filter)

  posts.forEach(post => {
    const description = post.querySelector(".post-title").textContent.toLowerCase();
    const price = parseFloat(post.getAttribute("data-price"));
    const city = post.getAttribute("data-city").toLowerCase();
    const condition = post.getAttribute("data-condition");

    const matchesText = filterText === "" || description.includes(filterText);
    const matchesPrice = price >= filterMinPrice && price <= filterMaxPrice;
    const matchesCity = filterCity === "" || city === filterCity;
    const matchesCondition = selectedConditions.length === 0 || selectedConditions.includes(condition);

    if (matchesText && matchesPrice && matchesCity && matchesCondition) {
      post.style.display = "inline-block"; // Show post
    } else {
      post.style.display = "none"; // Hide post
    }
  });
});
