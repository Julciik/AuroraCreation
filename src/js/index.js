const search = document.querySelector("[data-search-btn]");
const searchInput = document.querySelector("[data-search-input]");
const hamburger = document.querySelector("[data-hamburger]");
const navMenu = document.querySelector("[data-menu]");

search.addEventListener("click", () => {
  searchInput.classList.toggle("search__active");
});

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("hamburger__active");
  navMenu.classList.toggle("menu__active");
});
