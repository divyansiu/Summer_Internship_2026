/**
 * ==============================================================================
 * NETFLIX CLONE - CORE JAVASCRIPT
 * Architecture: ES6 Module Pattern / Vanilla JS
 * Features: Lazy Loading, Intersection Observers, LocalStorage, Event Delegation
 * ==============================================================================
 */

const NetflixApp = (function () {
    // ==========================================
    // 1. STATE & STORAGE MANAGEMENT
    // ==========================================
    const State = {
        myList: JSON.parse(localStorage.getItem('netflix_myList')) || [],
        watchProgress: JSON.parse(localStorage.getItem('netflix_progress')) || {},
        searchQuery: ''
    };

    const saveState = (key, data) => {
        localStorage.setItem(`netflix_${key}`, JSON.stringify(data));
    };

    // ==========================================
    // 2. DOM CACHE
    // ==========================================
    const DOM = {};
    const cacheDOM = () => {
        DOM.navbar = document.querySelector('.navbar');
        DOM.movieRows = document.querySelectorAll('.movie-row');
        DOM.posters = document.querySelectorAll('.row-poster, .row-poster-landscape');
        DOM.playButtons = document.querySelectorAll('.btn-play');
        DOM.myListButtons = document.querySelectorAll('.btn-more-info'); // Reused as 'My List' / Info
        DOM.searchIcon = document.querySelector('.nav-right .icon:first-child');
        DOM.mainContent = document.querySelector('.main-content');
    };

    // ==========================================
    // 3. UTILITY FUNCTIONS
    // ==========================================
    const debounce = (func, delay = 300) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, delay);
        };
    };

    const generateIdFromUrl = (url) => {
        // Creates a unique ID based on the image URL for tracking purposes
        return btoa(url).substring(0, 15);
    };

    // ==========================================
    // 4. UI CONTROLLERS
    // ==========================================
    
    // --> 4A. Navbar Scroll Effect
    const initNavbarController = () => {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                DOM.navbar.classList.add('navbar-scrolled');
            } else {
                DOM.navbar.classList.remove('navbar-scrolled');
            }
        });
    };

    // --> 4B. Horizontal Row Scroll Injector & Logic
    const initRowScrollController = () => {
        DOM.movieRows.forEach(row => {
            const posterContainer = row.querySelector('.row-posters');
            if (!posterContainer) return;

            // Inject Scroll Buttons
            const btnLeft = document.createElement('button');
            btnLeft.className = 'row-scroll-btn left';
            btnLeft.innerHTML = '&#10094;'; // Left Arrow

            const btnRight = document.createElement('button');
            btnRight.className = 'row-scroll-btn right';
            btnRight.innerHTML = '&#10095;'; // Right Arrow

            row.style.position = 'relative'; // Ensure absolute positioning works
            row.insertBefore(btnLeft, posterContainer);
            row.appendChild(btnRight);

            // Scroll Event Listeners
            const scrollAmount = window.innerWidth * 0.7; // Scroll 70% of viewport width

            btnLeft.addEventListener('click', () => {
                posterContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });

            btnRight.addEventListener('click', () => {
                posterContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });
            
            // Hide/Show logic based on scroll position
            posterContainer.addEventListener('scroll', () => {
                btnLeft.style.opacity = posterContainer.scrollLeft > 0 ? '1' : '0';
                btnLeft.style.pointerEvents = posterContainer.scrollLeft > 0 ? 'all' : 'none';
            });
            
            // Trigger scroll event to set initial button state
            posterContainer.dispatchEvent(new Event('scroll'));
        });
    };

    // --> 4C. Cinematic Intersection Observer (Fade-in on scroll)
    const initCinematicAnimations = () => {
        const observerOptions = {
            root: null,
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        };

        const rowObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('row-visible');
                    observer.unobserve(entry.target); // Only animate once
                }
            });
        }, observerOptions);

        DOM.movieRows.forEach(row => {
            row.classList.add('row-hidden'); // Prepare for animation
            rowObserver.observe(row);
        });

        // Native Lazy Loading for performance
        DOM.posters.forEach(img => img.setAttribute('loading', 'lazy'));
    };

    // --> 4D. Search Component & Filtering
    const initSearchController = () => {
        // Transform the search icon into an interactive input
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-box';
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Titles, people, genres...';
        searchInput.className = 'search-input';

        searchContainer.appendChild(DOM.searchIcon.cloneNode(true)); // keep icon
        searchContainer.appendChild(searchInput);
        
        DOM.searchIcon.replaceWith(searchContainer);

        // Filter Logic
        const handleSearch = debounce((e) => {
            const query = e.target.value.toLowerCase();
            State.searchQuery = query;

            DOM.posters.forEach(poster => {
                // If we had a real data attribute like data-title, we'd use that.
                // For now, checking the 'alt' tag or assuming URL string contains clues.
                const titleMatch = poster.alt.toLowerCase().includes(query) || poster.src.toLowerCase().includes(query);
                
                if (query === '' || titleMatch) {
                    poster.style.display = 'block';
                    poster.style.opacity = '1';
                } else {
                    poster.style.display = 'none';
                    poster.style.opacity = '0';
                }
            });
        }, 300);

        searchInput.addEventListener('input', handleSearch);
    };

    // --> 4E. 'My List' and Interactive Elements
    const initInteractions = () => {
        // Handle "Play" button clicks (Mock)
        DOM.playButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                alert("Playing cinematic intro... 🍿");
            });
        });

        // Handle "My List" / More Info
        DOM.myListButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const title = "Selected Movie/Show"; // In reality, fetch from nearest DOM node
                
                if (State.myList.includes(title)) {
                    State.myList = State.myList.filter(item => item !== title);
                    btn.innerHTML = `<span class="icon">+</span> My List`;
                } else {
                    State.myList.push(title);
                    btn.innerHTML = `<span class="icon">✓</span> Added`;
                }
                saveState('myList', State.myList);
            });
        });
    };

    // ==========================================
    // 5. INITIALIZATION
    // ==========================================
    const init = () => {
        cacheDOM();
        initNavbarController();
        initRowScrollController();
        initCinematicAnimations();
        initSearchController();
        initInteractions();
        
        console.log("Netflix Clone Engine successfully initialized. 🚀");
    };

    return {
        init // Expose public method
    };
})();

// Boot up the application when DOM is ready
document.addEventListener('DOMContentLoaded', NetflixApp.init);