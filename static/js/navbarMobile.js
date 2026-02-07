// navbarMobile.js
// Handles mobile navbar behavior: dropdown toggles, collapse prevention, and click-outside closing

(function() {
  'use strict';

  // Smart dropdown handling for ALL dropdowns
  // Desktop: hover shows dropdown, click navigates (if href exists)
  // Mobile/touch: first click shows dropdown, second click navigates (if href exists)
  const dropdownToggles = document.querySelectorAll('.nav-item.dropdown > .dropdown-toggle');

  // Detect if device supports hover (desktop) vs touch-only (mobile)
  const isTouchDevice = !window.matchMedia('(hover: hover)').matches;

  dropdownToggles.forEach(function(toggle) {
    const dropdownMenu = toggle.nextElementSibling;
    if (!dropdownMenu) return;

    if (isTouchDevice) {
      // Mobile/touch: toggle dropdown on click
      toggle.addEventListener('click', function(e) {
        const isVisible = dropdownMenu.classList.contains('show');

        // Always prevent navbar collapse on mobile
        e.stopPropagation();
        e.stopImmediatePropagation(); // Stop ALL handlers including Bootstrap

        if (!isVisible) {
          // First click: show dropdown, prevent navigation
          e.preventDefault();

          // Close all other dropdowns first (both manual and Bootstrap-managed)
          document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
            if (menu !== dropdownMenu) {
              menu.classList.remove('show');
              // Also close Bootstrap-managed dropdowns
              const parentToggle = menu.previousElementSibling;
              if (parentToggle && parentToggle.hasAttribute('data-bs-toggle')) {
                const bsDropdown = bootstrap.Dropdown.getInstance(parentToggle);
                if (bsDropdown) {
                  bsDropdown.hide();
                }
              }
            }
          });

          dropdownMenu.classList.add('show');
        } else {
          // Second click: allow navigation and close navbar if anchor link
          const href = toggle.getAttribute('href');
          if (href && (href.startsWith('#') || href.startsWith('/#'))) {
            // It's an anchor link, close navbar after navigation
            setTimeout(() => {
              const navbarCollapse = document.getElementById('navbarContent');
              if (navbarCollapse._allowCollapseClose) {
                navbarCollapse._allowCollapseClose();
              }
              const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
              if (bsCollapse) {
                bsCollapse.hide();
              }
            }, 100);
          }
        }
      });
    }
  });

  // Prevent Bootstrap Collapse from closing when interacting with dropdowns
  // But allow it to close when we explicitly call hide() (e.g., after navigation)
  if (isTouchDevice) {
    const navbarCollapse = document.getElementById('navbarContent');
    let allowCollapseClose = false; // Flag to allow manual closing

    if (navbarCollapse) {
      // Store the flag setter on the navbar element for access from other handlers
      navbarCollapse._allowCollapseClose = function() {
        allowCollapseClose = true;
      };

      navbarCollapse.addEventListener('hide.bs.collapse', function(e) {
        // Allow closing if we explicitly set the flag
        if (allowCollapseClose) {
          allowCollapseClose = false; // Reset flag
          return;
        }

        // Check if a dropdown is currently being interacted with
        const dropdownOpen = document.querySelector('.dropdown-menu.show');
        if (dropdownOpen) {
          e.preventDefault();
          e.stopPropagation();
        }
      });
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.nav-item.dropdown')) {
        document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
          menu.classList.remove('show');
        });
      }
    });

    // Close navbar when clicking section links (especially when dropdown is open)
    const sectionLinks = document.querySelectorAll('.navbar-nav .nav-link:not(.dropdown-toggle)');

    sectionLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        const navbarCollapse = document.getElementById('navbarContent');

        // If it's an anchor link (section navigation), close navbar after navigation
        // Handle both /#contact and #contact formats
        if (href && (href.startsWith('#') || href.startsWith('/#'))) {
          // Close any open dropdowns first
          document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
            menu.classList.remove('show');
          });

          // Then close the navbar
          setTimeout(() => {
            if (navbarCollapse._allowCollapseClose) {
              navbarCollapse._allowCollapseClose();
            }
            const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
            if (bsCollapse) {
              bsCollapse.hide();
            }
          }, 100);
        }
      });
    });
  }
})();

// Prevent navbar collapse when clicking dropdown items on mobile
(function() {
  'use strict';

  const navbarCollapse = document.getElementById('navbarContent');
  if (!navbarCollapse) return;

  const isTouchDevice = !window.matchMedia('(hover: hover)').matches;

  if (isTouchDevice) {
    // Prevent clicks inside dropdown menus from closing navbar
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
      menu.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent navbar collapse

        const target = e.target.closest('.dropdown-item');
        if (target) {
          const href = target.getAttribute('href');
          // For anchor links, close navbar after navigation
          // Handle both /#contact and #contact formats
          if (href && (href.startsWith('#') || href.startsWith('/#'))) {
            setTimeout(() => {
              if (navbarCollapse._allowCollapseClose) {
                navbarCollapse._allowCollapseClose();
              }
              const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
              if (bsCollapse) {
                bsCollapse.hide();
              }
            }, 100);
          }
          // For external pages, navbar closes naturally on page navigation
        }
      });
    });
  }
})();

// Click-outside-to-close for mobile navbar
(function() {
  'use strict';

  const navbarCollapse = document.getElementById('navbarContent');
  const navbarToggler = document.querySelector('.navbar-toggler');

  if (!navbarCollapse || !navbarToggler) return;

  const isTouchDevice = !window.matchMedia('(hover: hover)').matches;

  if (isTouchDevice) {
    document.addEventListener('click', function(e) {
      // Check if navbar is currently open
      const isNavbarOpen = navbarCollapse.classList.contains('show');

      if (!isNavbarOpen) return;

      // Check if click is outside navbar content and toggler button
      const clickedInsideNavbar = navbarCollapse.contains(e.target);
      const clickedToggler = navbarToggler.contains(e.target);

      if (!clickedInsideNavbar && !clickedToggler) {
        // Close the navbar using Bootstrap's Collapse API
        if (navbarCollapse._allowCollapseClose) {
          navbarCollapse._allowCollapseClose();
        }
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) {
          bsCollapse.hide();
        } else {
          // Fallback: manually trigger the toggler
          navbarToggler.click();
        }
      }
    });
  }
})();
