import products from './data.js'
import { get } from './utils.js'

// Get references to DOM elements for toggle, product display, and navigation
const navToggle = get('.toggle-nav')
const productsWrapper = get('.products-wrapper')
const linksContainer = get('.links-container')
const links = get('.links')

// Toggle navigation menu visibility
navToggle.addEventListener('click', () => {
  const linksContainerHeight = linksContainer.getBoundingClientRect().height
  const linksHeight = links.getBoundingClientRect().height

  // If the container is collapsed (height = 0), expand it; otherwise, collapse it
  if (linksContainerHeight === 0) {
    linksContainer.style.height = linksHeight + 'px'
  } else {
    linksContainer.style.height = 0
  }
})

/**
 * Dynamically displays a list of products on the page.
 * @param {Array} trips - Array of product objects to display.
 */
const display = (trips) => {
  const displayData = trips
    .map((trip) => {
      const { productName, url, offer } = trip
      return `
    <article class="product">
    <div class="img-wrap">
      <img
        class="img"
        src="${url}"
        alt=""
      />
    </div>
    <div class="product-info">
      <p class="title-text"><span>${productName} </span></p>
      <p class="info">
        <span
          >12 Days of amazing fun and adventure for you and your friends to
          enjoy</span
        >
      </p>
      <div class="btn-container">
        <p class="price"><span>£4000</span></p>
        <button class="btn">Enquire Now</button>
      </div>
    </div>
   ${offer === true ? '<div class="offer-div">50% off</div>' : ''}
  </article>`
    })
    .join(' ') // Combine all product cards into a single string

  // Add the generated HTML to the products wrapper
  productsWrapper.innerHTML = displayData
  return displayData
}

// Initialize the index for the current page and an array to store paginated pages
let index = 0
let pages = []

/**
 * Splits the products array into pages with a fixed number of items per page.
 * @param {Array} productsArr - Array of products to paginate.
 * @returns {Array} - An array where each element is a page containing product items.
 */
const paginate = (productsArr) => {
  const itemsPerPage = 3
  const numberOfPages = Math.ceil(productsArr.length / itemsPerPage)

  // Create an array of pages, each containing itemsPerPage products
  const productPages = Array.from({ length: numberOfPages }, (_, index) => {
    const start = index * itemsPerPage
    return productsArr.slice(start, start + itemsPerPage)
  })

  return productPages
}

// Get the pagination container element
const paginationContainer = get('.pagination-btn-container')

/**
 * Dynamically generates and displays pagination buttons.
 * @param {number} activIndex - The current active page index.
 * @param {Array} pages - The array of pages.
 */
const displayBtns = (activIndex, pages) => {
  // Generate buttons for each page
  let btns = pages.map((_, pageIndex) => {
    return `<button data-index="${pageIndex}" class="pagination-btn ${
      pageIndex === activIndex && 'active-btn'
    }">${pageIndex + 1}</button>`
  })

  // Add "Next" and "Previous" buttons
  btns.push('<button class="next-btn">next</button>')
  btns.unshift('<button class="prev-btn">prev</button>')

  // Add the buttons to the pagination container
  paginationContainer.innerHTML = btns.join('')
}

/**
 * Sets up the initial UI by paginating products, displaying the first page, and generating pagination buttons.
 */
const setUpUI = () => {
  pages = paginate(products) // Paginate the products
  display(paginate(products)[index]) // Display the products for the current page
  displayBtns(index, pages) // Display pagination buttons
}

// Add an event listener for pagination button clicks
paginationContainer.addEventListener('click', (e) => {
  const targetIndex = e.target.dataset.index
  const target = e.target

  // Ignore clicks outside pagination buttons
  if (e.target.classList.contains('pagination-btn-container')) return

  // Update the current page index based on the clicked button
  if (e.target.classList.contains('pagination-btn')) {
    index = parseInt(targetIndex)
  }

  // Handle "Next" button click
  if (target.classList.contains('next-btn')) {
    index++
    if (index > pages.length - 1) {
      index = 0 // Wrap around to the first page
    }
  }

  // Handle "Previous" button click
  if (target.classList.contains('prev-btn')) {
    index--
    if (index < 0) {
      index = pages.length - 1 // Wrap around to the last page
    }
  }

  setUpUI() // Refresh the UI with the updated page
})

// Add keyboard navigation for pagination
window.addEventListener('keydown', (e) => {
  const keyCode = e.key

  // Navigate to the previous page on "ArrowLeft"
  if (keyCode === 'ArrowLeft') {
    index--
    if (index < 0) {
      index = pages.length - 1 // Wrap around to the last page
    }
    setUpUI()
  }

  // Navigate to the next page on "ArrowRight"
  if (keyCode === 'ArrowRight') {
    index++
    if (index > pages.length - 1) {
      index = 0 // Wrap around to the first page
    }
    setUpUI()
  }
})

// Initialize the UI when the page loads
setUpUI()

// **** leave for reference ****
// Example of hover functionality for product cards (currently commented out)
// productAtrticle.forEach((product) => {
//   product.addEventListener('mouseover', (e) =>
//   console.log(e.currentTarget)
//   Add hover styles here
//   );
// });
