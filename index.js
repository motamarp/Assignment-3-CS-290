/*
 * Write your client-side JS code in this file.  Don't forget to include your
 * name and @oregonstate.edu email address below.
 *
 * Name: Paolo Mota Marques
 * Email: motamarp@oregonstate.edu
 */

/*
 * Name: Paolo Mota Marques
 * Email: motamarp@oregonstate.edu
 */

// DOM Elements
const sellButton = document.getElementById("sell-something-button");
const modalBackdrop = document.getElementById("modal-backdrop");
const sellModal = document.getElementById("sell-something-modal");
const modalClose = document.getElementById("modal-close");
const modalCancel = document.getElementById("modal-cancel");
const modalAccept = document.getElementById("modal-accept");
const filterButton = document.getElementById("filter-update-button");
const postsContainer = document.getElementById("posts");

// Form Inputs
const postTextInput = document.getElementById("post-text-input");
const postPhotoInput = document.getElementById("post-photo-input");
const postPriceInput = document.getElementById("post-price-input");
const postCityInput = document.getElementById("post-city-input");
const postConditionInputs = document.getElementsByName("post-condition");

// Filter Inputs
const filterTextInput = document.getElementById("filter-text");
const filterMinPriceInput = document.getElementById("filter-min-price");
const filterMaxPriceInput = document.getElementById("filter-max-price");
const filterCitySelect = document.getElementById("filter-city");
const filterConditionInputs = document.querySelectorAll("#filter-condition input");

// Helper function to create a new post element
function createPostElement(description, photoURL, price, city, condition) {
  const post = document.createElement("div");
  post.classList.add("post");
  post.setAttribute("data-price", price);
  post.setAttribute("data-city", city);
  post.setAttribute("data-condition", condition);

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

// Show Modal
sellButton.addEventListener("click", () => {
  modalBackdrop.classList.remove("hidden");
  sellModal.classList.remove("hidden");
});

// Close Modal (Cancel or Close Button)
function closeModal() {
  modalBackdrop.classList.add("hidden");
  sellModal.classList.add("hidden");
  clearModalFields();
}

modalClose.addEventListener("click", closeModal);
modalCancel.addEventListener("click", closeModal);

// Clear Modal Fields
function clearModalFields() {
  postTextInput.value = "";
  postPhotoInput.value = "";
  postPriceInput.value = "";
  postCityInput.value = "";
  postConditionInputs.forEach(input => input.checked = false); // Reset radio buttons
}

// Create Post (Accept Button)
modalAccept.addEventListener("click", () => {
  const description = postTextInput.value.trim();
  const photoURL = postPhotoInput.value.trim();
  const price = postPriceInput.value.trim();
  const city = postCityInput.value.trim();
  const condition = [...postConditionInputs].find(input => input.checked)?.value;

  // Validate the input fields
  if (!description || !photoURL || !price || !city || !condition) {
    alert("Please fill in all fields.");
    return; // Don't create the post if any field is missing
  }

  // Create the post and append it to the DOM
  const newPost = createPostElement(description, photoURL, price, city, condition);
  postsContainer.appendChild(newPost);

  // Check if the city is new and add it to the filter dropdown
  if (![...filterCitySelect.options].some(option => option.value.toLowerCase() === city.toLowerCase())) {
    const newCityOption = document.createElement("option");
    newCityOption.textContent = city;
    newCityOption.value = city;
    filterCitySelect.appendChild(newCityOption);
  }

  closeModal(); // Close the modal after creating the post
});

// Apply Filters
filterButton.addEventListener("click", () => {
  const filterText = filterTextInput.value.trim().toLowerCase();
  const filterMinPrice = parseFloat(filterMinPriceInput.value.trim()) || 0;
  const filterMaxPrice = parseFloat(filterMaxPriceInput.value.trim()) || Infinity;
  const filterCity = filterCitySelect.value.toLowerCase();
  const selectedConditions = [...filterConditionInputs]
    .filter(input => input.checked)
    .map(input => input.value);

  const posts = [...postsContainer.getElementsByClassName("post")];

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
