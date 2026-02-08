// portfolioList.js
// Portfolio filtering and pagination functionality
// Expects global config: window.portfolioConfig = { paginationEnabled, itemsPerPage, maxCardHeight }

(function() {
  'use strict';

  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');
  const paginationEnabled = window.portfolioConfig?.paginationEnabled || false;
  const itemsPerPage = window.portfolioConfig?.itemsPerPage || 8;
  const maxCardHeight = window.portfolioConfig?.maxCardHeight || 550;

  let currentTag = 'All';
  let currentPage = 1;
  let filteredCards = Array.from(cards);

  // Filter projects by tag
  function filterProjects(tag) {
    currentTag = tag;
    currentPage = 1; // Reset to first page when filter changes

    filteredCards = Array.from(cards).filter(card => {
      const tags = card.dataset.tags.split(' ');
      return tag === 'All' || tags.includes(tag);
    });

    if (paginationEnabled) {
      setGridMinHeight(); // Recalculate grid height for filtered results
      updatePagination();
      showPage(1);
    } else {
      // Show/hide without pagination (current behavior)
      cards.forEach(card => {
        const tags = card.dataset.tags.split(' ');
        card.style.display = tag === 'All' || tags.includes(tag) ? 'flex' : 'none';
      });
    }
  }

  // Show specific page of filtered projects
  function showPage(pageNum) {
    currentPage = pageNum;
    const start = (pageNum - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    // Hide all cards first
    cards.forEach(card => card.style.display = 'none');

    // Show only cards for current page
    filteredCards.slice(start, end).forEach(card => {
      card.style.display = 'flex';
    });

    updatePaginationButtons();
  }

  // Update pagination controls
  function updatePagination() {
    if (!paginationEnabled) return;

    const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
    const pagination = document.getElementById('portfolio-pagination');

    if (!pagination) return;

    // Clear existing pagination
    pagination.innerHTML = '';

    // Don't show pagination if only one page
    if (totalPages <= 1) return;

    // Previous button
    const prevLi = document.createElement('li');
    prevLi.className = 'page-item' + (currentPage === 1 ? ' disabled' : '');
    prevLi.innerHTML = `<a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a>`;
    pagination.appendChild(prevLi);

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      const li = document.createElement('li');
      li.className = 'page-item' + (i === currentPage ? ' active' : '');
      li.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
      pagination.appendChild(li);
    }

    // Next button
    const nextLi = document.createElement('li');
    nextLi.className = 'page-item' + (currentPage === totalPages ? ' disabled' : '');
    nextLi.innerHTML = `<a class="page-link" href="#" data-page="${currentPage + 1}">Next</a>`;
    pagination.appendChild(nextLi);

    // Add click handlers
    pagination.querySelectorAll('a.page-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();

        // Don't process clicks on disabled buttons
        if (link.parentElement.classList.contains('disabled')) {
          return;
        }

        const page = parseInt(link.dataset.page);
        if (page >= 1 && page <= totalPages) {
          showPage(page);
        }
      });
    });
  }

  // Update active state of pagination buttons
  function updatePaginationButtons() {
    const pagination = document.getElementById('portfolio-pagination');
    if (!pagination) return;

    const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
    const items = pagination.querySelectorAll('.page-item');

    // Update active states and data-page attributes
    items.forEach((item, index) => {
      item.classList.remove('active', 'disabled');
      const link = item.querySelector('.page-link');

      // Previous button (first item)
      if (index === 0) {
        link.dataset.page = currentPage - 1;
        if (currentPage === 1) {
          item.classList.add('disabled');
        }
      }
      // Next button (last item)
      else if (index === items.length - 1) {
        link.dataset.page = currentPage + 1;
        if (currentPage === totalPages) {
          item.classList.add('disabled');
        }
      }
      // Page numbers (middle items)
      else {
        if (index === currentPage) {
          item.classList.add('active');
        }
      }
    });
  }

  // Tag filter button handlers
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterProjects(btn.dataset.tag);
    });
  });

  // Make project tag pills clickable (existing functionality)
  const tagButtons = document.querySelectorAll('.tag-btn');
  tagButtons.forEach(tagBtn => {
    tagBtn.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      const tag = tagBtn.dataset.tag;
      const filterBtn = Array.from(buttons).find(b => b.dataset.tag === tag);
      if (filterBtn) {
        filterBtn.click();

        // Scroll to top of portfolio section
        if (paginationEnabled) {
          document.querySelector('#portfolio h1').scrollIntoView({ behavior: 'smooth' });
        } else {
          document.querySelector('div[style*="grid-template-columns"]').scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // Check URL for tag query param (existing functionality)
  const urlParams = new URLSearchParams(window.location.search);
  const initialTag = urlParams.get("tag");
  if (initialTag) {
    const filterBtn = Array.from(buttons).find(b => b.dataset.tag === initialTag);
    if (filterBtn) filterBtn.click();
  }

  // Set fixed grid height for consistent pagination position
  function setGridMinHeight() {
    if (!paginationEnabled) return;

    const grid = document.querySelector('.project-cards-grid');
    if (!grid) return;

    // Ensure grid rows don't stretch - cards should remain auto-height
    grid.style.gridAutoRows = 'auto';
    grid.style.alignContent = 'start';

    // Calculate grid layout based on items per page (not total filtered cards)
    // This ensures pagination stays at same position even with fewer cards on last page
    const maxColumns = 4;
    const cardsToShow = Math.min(filteredCards.length, itemsPerPage);
    const columns = Math.min(maxColumns, cardsToShow);
    const rows = Math.ceil(cardsToShow / columns);

    const rowGap = 24; // 1.5rem gap between rows

    // Calculate minimum height: rows * (card height + gap) - one gap
    const minHeight = rows > 0 ? (rows * (maxCardHeight + rowGap)) - rowGap : 0;

    grid.style.minHeight = minHeight + 'px';
  }

  // Initialize pagination if enabled
  if (paginationEnabled) {
    filteredCards = Array.from(cards);
    setGridMinHeight();
    updatePagination();
    showPage(1);
  }
})();
