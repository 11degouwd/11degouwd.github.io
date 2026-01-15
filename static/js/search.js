function encodeHTML(str) {
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
}

function isValidUrl(url) {
  try {
    const parsedUrl = new URL(url, window.location.origin);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch (e) {
    return false;
  }
}

let debounceTimeout;
function searchOnChange(evt) {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    performSearch(evt);
  }, 300); // Debounce delay of 300ms
}

async function performSearch(evt) {
  let searchQuery = evt.target.value.trim().toLowerCase();
  const searchInput = document.getElementById("navbar-search");
  const showDescriptions = searchInput.dataset.showDescriptions === "true";
  const searchContent = document.getElementById("search-content");
  const searchResultsContainer = document.getElementById("search-results");

  if (!searchInput || !searchContent || !searchResultsContainer) return;

  if (searchQuery !== "") {
    // Position search results
    const rect = searchInput.getBoundingClientRect();
    searchContent.style.top = rect.bottom + 8 + "px";

    const desiredWidth = window.innerWidth > 768 ? 500 : 300;

    // Grow box to the left from the right edge of the input
    let left = rect.right - desiredWidth;

    // Prevent going off the left side of the screen
    if (left < 16) left = 16;

    searchContent.style.width = desiredWidth + "px";
    searchContent.style.left = left + "px";

    try {
      let response = await fetch("/index.json");
      if (!response.ok) throw new Error("Failed to fetch search data");

      let searchJson = await response.json();

      // --- Filter search results ---
      const searchResults = searchJson.filter(item => {
        if (!item || typeof item !== "object") return false;
        return (
          (item.title && item.title.toLowerCase().includes(searchQuery)) ||
          (item.description && item.description.toLowerCase().includes(searchQuery)) ||
          (item.content && item.content.toLowerCase().includes(searchQuery))
        );
      });

      searchResultsContainer.innerHTML = "";

      if (searchResults.length > 0) {
        searchResults.forEach(item => {
          if (!item.permalink || !isValidUrl(item.permalink)) return;

          const card = document.createElement("div");
          card.className = "card";

          const link = document.createElement("a");
          link.href = item.permalink;

          const contentDiv = document.createElement("div");
          contentDiv.className = "p-3";

          const title = document.createElement("h5");
          title.textContent = item.title || "Untitled";

          const description = document.createElement("div");
          description.textContent = item.description || "";

          contentDiv.appendChild(title);
          if (showDescriptions && item.description) {
              contentDiv.appendChild(description);
          }
          link.appendChild(contentDiv);
          card.appendChild(link);
          searchResultsContainer.appendChild(card);
        });
        positionSearchContent();
      } else {
        const noResultsMessage = document.createElement("p");
        noResultsMessage.className = "text-center py-3";
        noResultsMessage.style.maxWidth = searchContent.style.width;
        noResultsMessage.style.margin = "0 auto";
        noResultsMessage.textContent = `No results found for "${searchQuery}"`;
        searchResultsContainer.appendChild(noResultsMessage);
        positionSearchContent();
      }

      searchContent.style.display = "block";
    } catch (error) {
      console.error("Error fetching search data:", error);
    }
  } else {
    searchContent.style.display = "none";
    searchResultsContainer.innerHTML = "";
  }
}

// --- Close search on outside click ---
document.addEventListener("click", function (e) {
  const searchInput = document.getElementById("navbar-search");
  const toggle = document.getElementById("search-toggle");
  const searchContent = document.getElementById("search-content");

  if (!searchInput || !searchContent) return;

  // Ignore clicks inside search results
  if (e.target.closest("#search-results a")) return;

  // Ignore clicks on the toggle button
  if (toggle && toggle.contains(e.target)) return;

  // Ignore clicks inside the input itself
  if (searchInput.contains(e.target)) return;

  // Otherwise, close everything
  searchInput.style.display = "none";
  searchInput.classList.remove("active");
  searchContent.style.display = "none"; 
});

// --- Close search on Escape ---
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    const searchInput = document.getElementById("navbar-search");
    const searchContent = document.getElementById("search-content");
    if (searchInput) {
      searchInput.style.display = "none";
      searchInput.classList.remove("active");
    }
    if (searchContent) searchContent.style.display = "none";
  }
});

// --- Repositioning the search results box ---
function positionSearchContent() {
  const searchInput = document.getElementById("navbar-search");
  const searchContent = document.getElementById("search-content");
  if (!searchInput || !searchContent) return;

  const rect = searchInput.getBoundingClientRect();
  const scrollY = window.scrollY || window.pageYOffset;
  const scrollX = window.scrollX || window.pageXOffset;

  const desiredWidth = window.innerWidth > 768 ? 500 : 300;
  let left = rect.right + scrollX - desiredWidth;
  if (left < 16) left = 16;

  searchContent.style.top = rect.bottom + scrollY + 8 + "px";
  searchContent.style.left = left + "px";
  searchContent.style.width = desiredWidth + "px";
}

let ticking = false;

function onScrollOrResize() {
  if (!ticking) {
    requestAnimationFrame(() => {
      positionSearchContent();
      ticking = false;
    });
    ticking = true;
  }
}

window.addEventListener("scroll", onScrollOrResize);
window.addEventListener("resize", onScrollOrResize);
// let positionTimeout;
// function throttledPosition() {
//   if (positionTimeout) return;
//   positionTimeout = setTimeout(() => {
//     positionSearchContent();
//     positionTimeout = null;
//   }, 16); // run at most every 16ms (~60Hz)
// }
// window.addEventListener("scroll", throttledPosition);
// window.addEventListener("resize", throttledPosition);