let products = {}; // Initialize an empty object to store product data

// Fetch the products data from the external JSON file
fetch("../static/products.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    products = data; // Populate the products object with data from the JSON file

    // Initialize products after loading the JSON data
    initializeProducts();
  })
  .catch((error) => {
    console.error("Error loading products data:", error);
  });

/**
 * Initializes the product list and displays all products on page load.
 */
function initializeProducts() {
  const productList = document.getElementById("productList");
  productList.innerHTML = ""; // Clear existing content
  // Loop through each brand and add products to the list
  Object.keys(products).forEach((brand) => {
    products[brand].forEach((product) => {
      const productDiv = document.createElement("div");
      productDiv.className = "product";
      productDiv.onclick = () => openModal(product); // Click to open modal
      // Add product image, name, and price
      productDiv.innerHTML = `
                <img src="${
                  Array.isArray(product.image)
                    ? product.image[0]
                    : product.image
                }" alt="${product.name}">
                <div>
                    <h3>${product.name}</h3>
                </div>
            `;
      productList.appendChild(productDiv);
    });
  });
}

/**
 * Updates the car parts dropdown based on the selected car brand.
 */
function updateParts() {
  const brand = document.getElementById("carBrand").value;
  const partsSelect = document.getElementById("carParts");
  partsSelect.innerHTML = '<option value="">Select Car Part</option>'; // Reset dropdown
  if (brand && products[brand]) {
    // Populate dropdown with available parts for selected brand
    products[brand].forEach((product) => {
      const option = document.createElement("option");
      option.value = product.name;
      option.textContent = product.name;
      partsSelect.appendChild(option);
    });
    products['all'].forEach((product) => {
      const option = document.createElement("option");
      option.value = product.name;
      option.textContent = product.name;
      partsSelect.appendChild(option);
    });
  }
  filterProducts(); // Apply filtering after updating parts dropdown
}
/**
 * Filters and displays products based on selected brand and part.
 */
function filterProducts() {
  const brand = document.getElementById("carBrand").value;
  const part = document.getElementById("carParts").value;
  const productList = document.getElementById("productList");
  productList.innerHTML = ""; // Clear current product list

  let filteredProducts = [];

  // If a brand is selected and exists in the products list, add its products
  if (brand && products[brand]) {
    filteredProducts = [...filteredProducts, ...products[brand], ...products['all']];
  }

  // If a specific part is selected, filter products
  if (part) {
    filteredProducts = filteredProducts.filter(
      (product) => product.name === part
    );
  }

  // Display filtered products
  filteredProducts.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.className = "product";
    productDiv.onclick = () => openModal(product);
    productDiv.innerHTML = `
            <img src="${
              Array.isArray(product.image) ? product.image[0] : product.image
            }" alt="${product.name}">
            <div>
                <h3>${product.name}</h3>
            </div>
        `;
    productList.appendChild(productDiv);
  });
}

/**
 * Searches for products dynamically as the user types.
 */
function searchProducts() {
  const query = document.getElementById("searchBar").value.toLowerCase();
  const productsDivs = document.querySelectorAll(".product");
  // Show only products that match the search query
  productsDivs.forEach((productDiv) => {
    const productName = productDiv
      .querySelector("h3")
      .textContent.toLowerCase();
    productDiv.style.display = productName.includes(query) ? "flex" : "none";
  });
}
/**
 * Clears the search input and resets the product list to show all items.
 */
function clearSearch() {
  document.getElementById("searchBar").value = "";
  searchProducts(); // Reapply search function to reset results
}
/**
 * Resets all filters (brand, part selection, and search) to default and reloads products.
 */
function resetFilters() {
  document.getElementById("carBrand").value = ""; // Reset car brand dropdown
  document.getElementById("carParts").value = ""; // Reset car part dropdown
  document.getElementById("searchBar").value = ""; // Reset search bar
  initializeProducts(); // Reload all products
}
/**
 * Opens a modal displaying detailed product information.
 * @param {Object} product - The product object containing name, price, image, and description.
 */

// Updated
let currentIndex = 0;

function openModal(product) {
  const modalImageContainer = document.getElementById("modalImageContainer");
  modalImageContainer.innerHTML = ""; // Clear previous images

  if (Array.isArray(product.image)) {
    // Create carousel container
    const carousel = document.createElement("div");
    carousel.classList.add("carousel");

    // Add images to the carousel
    product.image.forEach((imgSrc, index) => {
      const img = document.createElement("img");
      img.src = imgSrc;
      img.classList.add("carousel-image");
      if (index === 0) img.classList.add("active"); // Show first image by default
      carousel.appendChild(img);
    });

    // Add navigation buttons
    const prevButton = document.createElement("button");
    prevButton.classList.add("carousel-prev");
    prevButton.innerHTML = "&#10094;"; // Left arrow
    prevButton.classList.add("vidbtn");
    prevButton.onclick = () => changeImage(-1);

    const nextButton = document.createElement("button");
    nextButton.classList.add("carousel-next");
    nextButton.innerHTML = "&#10095;"; // Right arrow
    nextButton.classList.add("vidbtn");
    nextButton.onclick = () => changeImage(1);

    carousel.appendChild(prevButton);
    carousel.appendChild(nextButton);

    modalImageContainer.appendChild(carousel);
  } else {
    const img = document.createElement("img");
    img.src = product.image;
    img.classList.add("normal-image");
    modalImageContainer.appendChild(img);
  }

  document.getElementById("modalDescription").innerHTML = `
        <h2>${product.name}</h2>
        <p>${product.description}</p>
    `;

  // Store product details for pre-filling the enquiry form
  document.getElementById("enquireNow").setAttribute("data-name", product.name);
  document.getElementById("productModal").style.display = "block";
}

function changeImage(step) {
  const images = document.querySelectorAll(".carousel-image");
  images[currentIndex].classList.remove("active");
  currentIndex = (currentIndex + step + images.length) % images.length;
  images[currentIndex].classList.add("active");
}

function closeModal() {
  document.getElementById("productModal").style.display = "none";
  currentIndex = 0; // Reset carousel index
}

function redirectToForm() {
  const productName = document
    .getElementById("enquireNow")
    .getAttribute("data-name");
  window.location.href = `/enquiry-form?product=${encodeURIComponent(
    productName
  )}`;
}

/**
 * Closes the product modal.
 */
function closeModal() {
  document.getElementById("productModal").style.display = "none";
}

// ================================================================================================================================form
/**
 * Redirects to the enquiry form with product details pre-filled.
 */
function redirectToForm() {
  let productName = document
    .getElementById("modalDescription")
    .querySelector("h2").textContent;

  // Loop through products to find the corresponding car brand (model)
  for (let brand in products) {
    for (let product of products[brand]) {
      if (product.name === productName) {
        if (brand === "all") {
          document.getElementById("productModel").value = "";
          document.getElementById("productModel").placeholder =
            "Please enter your car brand";
          document.getElementById("productModel").readOnly = false;
        } else {
          document.getElementById("productModel").value =
            "Your Model: " + brand.charAt(0).toUpperCase() + brand.slice(1);
          document.getElementById("productModel").readOnly = true;
        }
        break;
      }
    }
  }

  document.getElementById("productName").value = "Your Product: " + productName;
  document.getElementById("inquiryFormContainer").style.display = "block";
  document.getElementById("productModal").style.display = "none";
}

/**
 * Closes the enquiry form.
 */
function closeForm() {
  document.getElementById("inquiryFormContainer").style.display = "none";
}

// ====================================================================SEND TO WHATSAPP FUNCTION=============================================================

function validateForm() {
  // Get form elements
  const name = document.getElementById("name");
  const message = document.getElementById("message");
  const productName = document.getElementById("productName");
  const productModel = document.getElementById("productModel");

  // Reset error states
  [name, message, productName, productModel].forEach((field) =>
    field.classList.remove("error")
  );

  let isValid = true;

  // Name validation
  if (name.value.trim() === "") {
    name.classList.add("error");
    isValid = false;
  }

  if (isValid) {
    sendToWhatsApp();
  }

  return false; // Prevent default form submission
}

function sendToWhatsApp() {
  const name = document.getElementById("name").value;
  const productName = document.getElementById("productName").value;
  const productModel = document.getElementById("productModel").value;
  const message = document.getElementById("message").value;
  const phone = "+919831722767";

  // Extract text after ":" from productName
  const extractedProductName = productName.split(":").pop().trim();
  const extractedProductMode = productModel.split(":").pop().trim();

  // Use URL-safe encoding with %0A for new lines
  let whatsappMessage =
    `Name: ${encodeURIComponent(name)}%0A` +
    `Product: ${encodeURIComponent(extractedProductName)}%0A` +
    `Model: ${encodeURIComponent(extractedProductMode)}`;

  // Append message only if it's not empty
  if (message.length > 0) {
    whatsappMessage += `%0AMessage: ${encodeURIComponent(message)}`;
  }

  // iOS-compatible direct opening
  const whatsappURL = `https://api.whatsapp.com/send?phone=${phone}&text=${whatsappMessage}`;

  // Universal opening method
  window.open(whatsappURL, "blank");
}

// Initialize products when the page is fully loaded
document.addEventListener("DOMContentLoaded", initializeProducts);
