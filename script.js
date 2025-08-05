// DOM elements
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const resultsContainer = document.getElementById('results-container');

document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("dark-mode-toggle");
    const body = document.body;

    // Check saved preference
    if (localStorage.getItem("darkMode") === "enabled") {
        body.classList.add("dark-mode");
        toggleButton.textContent = "Light Mode";
    }

    toggleButton.addEventListener("click", () => {
        body.classList.toggle("dark-mode");

        if (body.classList.contains("dark-mode")) {
            localStorage.setItem("darkMode", "enabled");
            toggleButton.textContent = "Light Mode";
        } else {
            localStorage.setItem("darkMode", "disabled");
            toggleButton.textContent = "Dark Mode";
        }
    });
});

function typeText(element, text, speed = 30) {
    element.innerHTML = ""; // Clear previous text
    let i = 0;

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Modify your function that displays search results
function displayResults(results) {
    let resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = ""; // Clear previous results

    results.forEach((result, index) => {
        let resultElement = document.createElement("p");
        resultElement.classList.add("result-text"); // Apply styles if needed
        resultsContainer.appendChild(resultElement);

        setTimeout(() => {
            typeText(resultElement, result);
        }, index * 500); // Delay each result slightly
    });
}

// Function to perform search using Wikipedia API
function performSearch() {
    const query = searchInput.value.trim();
    
    if (query === '') {
        hideResults();
        return;
    }
    
    // Show loading state
    resultsContainer.innerHTML = '<div class="loading">Searching...</div>';
    showResults();
    
    // Wikipedia API endpoint for searching
    const endpoint = 'https://en.wikipedia.org/w/api.php';
    
    // Parameters for the API request
    const params = {
        action: 'query',
        list: 'search',
        srsearch: query,
        format: 'json',
        origin: '*', // Needed for CORS
        srlimit: 5  // Number of results to return
    };
    
    // Build the URL with query parameters
    const url = endpoint + '?' + Object.entries(params)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');
    
    // Fetch results from Wikipedia API
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response had an error.');
            }
            return response.json();
        })
        .then(data => {
            displayWikipediaResults(data, query);
        })
        .catch(error => {
            resultsContainer.innerHTML = `
                <div class="error">
                    Error fetching results: ${error.message}. Please try again later.
                </div>
            `;
        });
}

// Function to display Wikipedia search results
function displayWikipediaResults(data, query) {
    resultsContainer.innerHTML = '';
    
    const results = data.query.search;
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                No results found for "${query}".
            </div>
        `;
        return;
    }
    
    // Add search statistics
    const searchStats = document.createElement('div');
    searchStats.className = 'search-stats';
    searchStats.textContent = `Found ${results.length} results for "${query}"`;
    resultsContainer.appendChild(searchStats);
    
    // Create and add result items with staggered animation
    results.forEach((result, index) => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        
        // Create Wikipedia page URL
        const pageUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(result.title.replace(/ /g, '_'))}`;
        
        // Create snippet with HTML tags preserved (Wikipedia API returns HTML in snippets)
        const snippet = result.snippet;
        
        resultItem.innerHTML = `
            <div class="result-title">${result.title}</div>
            <div class="result-url">${pageUrl}</div>
            <div class="result-description">${snippet}</div>
        `;

        resultsContainer.appendChild(resultItem);
        
        // Add click event to title to open Wikipedia page
        const titleElement = resultItem.querySelector('.result-title');
        titleElement.addEventListener('click', () => {
            window.open(pageUrl, '_blank');
        });
        
        resultsContainer.appendChild(resultItem);
        
        // Stagger the animations
        setTimeout(() => {
            resultItem.classList.add('visible');
        }, 50 * index); // Delay each item's animation by 50ms × its index
    });
}

// Function to show results container with animation
function showResults() {
    resultsContainer.style.display = 'block';
    // Use setTimeout to ensure the transition happens after display is set
    setTimeout(() => {
        resultsContainer.classList.add('visible');
    }, 10);
}

// Function to hide results container with animation
function hideResults() {
    resultsContainer.classList.remove('visible');
    // Wait for the transition to complete before hiding
    setTimeout(() => {
        resultsContainer.style.display = 'none';
    }, 400); // Match this duration with the CSS transition time
}

// Event listeners
searchBtn.addEventListener('click', performSearch);

searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        performSearch();
    }
});

// Initial focus on search input
window.addEventListener('load', function() {
    searchInput.focus();
});

document.addEventListener("DOMContentLoaded", function() {
    const numParticles = 275; // Adjust number of particles
    const container = document.body;

    for (let i = 0; i < numParticles; i++) {
        let particle = document.createElement("div");
        particle.classList.add("particle");

        // Random position and size
        particle.style.left = Math.random() * 100 + "vw";
        particle.style.top = Math.random() * 100 + "vh";
        particle.style.animationDuration = (Math.random() * 5 + 3) + "s";
        particle.style.width = particle.style.height = Math.random() * 8 + 5 + "px";

        container.appendChild(particle);
    }
});