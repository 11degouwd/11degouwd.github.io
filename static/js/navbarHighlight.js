/**
 * Navbar Active State Highlighting
 *
 * Features:
 * - Highlights navbar items based on scroll position (homepage sections)
 * - Highlights navbar items based on current page (company, portfolio)
 * - Handles Experience dropdown active states
 */

(function() {
  'use strict';

  // ==================== Configuration ====================
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // Trigger when section is ~20% from top
    threshold: 0
  };

  // ==================== Page Detection ====================
  function detectPageContext() {
    const pathname = window.location.pathname;

    // Normalize path by removing trailing slash (except for root)
    const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/$/, '');

    return {
      isHomePage: normalizedPath === '/' || normalizedPath === '/index.html',
      isCompanyPage: pathname.includes('/companies/'),
      isPortfolioPage: pathname.includes('/portfolio/'),
      currentPath: pathname
    };
  }

  // ==================== Navbar Link Management ====================
  function clearAllActiveLinks() {
    document.querySelectorAll('.nav-link.active').forEach(link => {
      link.classList.remove('active');
    });
  }

  function setActiveLink(selector) {
    clearAllActiveLinks();
    const link = document.querySelector(selector);
    if (link) {
      link.classList.add('active');
    }
  }

  function setActiveLinkBySection(sectionId) {
    const link = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
    if (link) {
      clearAllActiveLinks();
      link.classList.add('active');
    }
  }

  // ==================== Dropdown Item Management ====================
  function clearAllActiveDropdownItems() {
    document.querySelectorAll('.dropdown-item.active').forEach(item => {
      item.classList.remove('active');
    });
  }

  function setActiveDropdownItem(companyName) {
    const dropdownItem = document.querySelector(`.dropdown-item[data-company="${companyName.toLowerCase()}"]`);
    console.log("We in this function");
    console.log("name:",companyName);
    console.log(dropdownItem);
    if (dropdownItem) {
      console.log("Success");
      dropdownItem.classList.add('active');
    }
  }

  // ==================== Experience Dropdown Handling ====================
  function handleExperienceDropdown() {
    const pageContext = detectPageContext();

    if (!pageContext.isCompanyPage) {
      return;
    }

    // Extract company name from URL (e.g., /companies/kea-aerospace/ -> kea-aerospace)
    const pathParts = pageContext.currentPath.split('/').filter(part => part);
    const companySlug = pathParts[pathParts.indexOf('companies') + 1];

    if (!companySlug) {
      return;
    }
    console.log(companySlug);

    // Always highlight the Experience dropdown toggle when on a company page
    const experienceDropdown = document.querySelector('.nav-link[data-section="experience"]');
    if (experienceDropdown) {
      clearAllActiveLinks();
      experienceDropdown.classList.add('active');
    }

    // Get the dropdown element
    const dropdownElement = experienceDropdown?.closest('.dropdown');
    if (!dropdownElement) {
      console.log("failed");
      return;
    }

    // Listen to Bootstrap dropdown events
    dropdownElement.addEventListener('show.bs.dropdown', function() {
      setActiveDropdownItem(companySlug);
    });

    dropdownElement.addEventListener('hide.bs.dropdown', function() {
      clearAllActiveDropdownItems();
    });

    // Highlight dropdown item immediately on page load
    // (Don't wait for dropdown to be opened)
    setActiveDropdownItem(companySlug);
  }

  // ==================== Homepage Scroll Detection ====================
  function setupScrollObserver() {
    const pageContext = detectPageContext();

    if (!pageContext.isHomePage) {
      return;
    }

    // Get all sections to observe
    const sections = document.querySelectorAll('section[id]');
    if (sections.length === 0) {
      return;
    }

    let currentActiveSection = null;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;

          // Update active link if this is a new section
          if (currentActiveSection !== sectionId) {
            currentActiveSection = sectionId;
            setActiveLinkBySection(sectionId);
          }
        }
      });
    }, observerOptions);

    // Observe all sections
    sections.forEach(section => {
      observer.observe(section);
    });

    // Handle edge case: when at very top of page
    window.addEventListener('scroll', () => {
      if (window.scrollY < 100) {
        const heroSection = document.getElementById('hero');

        if (heroSection) {
          // Hero section exists - user is at top viewing hero
          // Clear all highlights since hero has no nav link
          clearAllActiveLinks();
        } else {
          // Hero section doesn't exist - find first section with nav link
          let foundActive = false;
          for (const section of sections) {
            const navLink = document.querySelector(`.nav-link[data-section="${section.id}"]`);
            if (navLink) {
              setActiveLinkBySection(section.id);
              foundActive = true;
              break;
            }
          }
          // If no nav links found, clear all active states
          if (!foundActive) {
            clearAllActiveLinks();
          }
        }
      }
    }, { passive: true });
  }

  // ==================== Portfolio Page Handling ====================
  function handlePortfolioPage() {
    const pageContext = detectPageContext();

    if (pageContext.isPortfolioPage) {
      // Highlight the Portfolio nav link
      setActiveLink('.nav-link[href*="/portfolio"]');
    }
  }

  // ==================== Custom Menu Handling ====================
  function handleCustomMenus() {
    const pageContext = detectPageContext();

    // Skip if we're on homepage, company, or portfolio (handled elsewhere)
    if (pageContext.isHomePage || pageContext.isCompanyPage || pageContext.isPortfolioPage) {
      return;
    }

    console.log('[CustomMenus] Checking custom menus for path:', pageContext.currentPath);

    // Strategy: Check dropdown items for href matches, then highlight parent by data-section
    const dropdownItems = document.querySelectorAll('.dropdown-menu .dropdown-item');
    let foundMatch = false;

    dropdownItems.forEach(item => {
      const href = item.getAttribute('href');
      const dataSection = item.getAttribute('data-section');

      console.log('[CustomMenus] Checking dropdown item:', href, 'data-section:', dataSection);

      // Skip invalid hrefs
      if (!href || href.startsWith('#')) {
        return;
      }

      // Check if this item's href matches current path
      if (pageContext.currentPath.includes(href)) {
        console.log('[CustomMenus] ✓ Match! Dropdown item matches current path');

        // If this item has a data-section, find and highlight parent dropdown toggle
        if (dataSection) {
          const dropdownToggle = document.querySelector(
            `.nav-item.dropdown > .dropdown-toggle[data-section="${dataSection}"]`
          );

          if (dropdownToggle) {
            console.log('[CustomMenus] ✓ Highlighting dropdown toggle with data-section:', dataSection);
            clearAllActiveLinks();
            dropdownToggle.classList.add('active');

            // Also highlight the dropdown item itself
            clearAllActiveDropdownItems();
            item.classList.add('active');
            console.log('[CustomMenus] ✓ Also highlighting dropdown item');

            foundMatch = true;
          } else {
            console.log('[CustomMenus] ✗ No dropdown toggle found with data-section:', dataSection);
          }
        } else {
          // No data-section, fall back to highlighting the item itself
          console.log('[CustomMenus] No data-section, highlighting item directly');
          clearAllActiveLinks();
          item.classList.add('active');
          foundMatch = true;
        }
      }
    });

    // If no dropdown match, try to match with regular nav links
    if (!foundMatch) {
      console.log('[CustomMenus] No dropdown match, checking regular nav links...');

      const allNavLinks = document.querySelectorAll('.navbar-nav .nav-link:not(.dropdown-toggle)');

      allNavLinks.forEach(link => {
        const href = link.getAttribute('href');

        // Skip hash links
        if (!href || href.startsWith('#')) {
          return;
        }

        console.log('[CustomMenus] Checking nav link:', href);

        // Check for match
        if (pageContext.currentPath.includes(href)) {
          console.log('[CustomMenus] ✓ Match! Highlighting nav link');
          clearAllActiveLinks();
          link.classList.add('active');
        }
      });
    }
  }

  // ==================== Initialize ====================
  function init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    const pageContext = detectPageContext();

    if (pageContext.isHomePage) {
      // Homepage: setup scroll-based section detection
      setupScrollObserver();
    } else if (pageContext.isCompanyPage) {
      // Company page: highlight Experience dropdown
      handleExperienceDropdown();
    } else if (pageContext.isPortfolioPage) {
      // Portfolio page: highlight Portfolio link
      handlePortfolioPage();
    } else {
      // Other pages: try to match with custom menus
      handleCustomMenus();
    }
  }

  // Start initialization
  init();
})();
