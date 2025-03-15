document.getElementById('searchInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        handleSearch(); // Trigger search when Enter key is pressed
    }
});

async function handleSearch() {
    const query = document.getElementById('searchInput').value;

    if (!query) {
        alert("Please enter an artist, song, or genre!");
        return;
    }

    try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://web-production-6fde.up.railway.app";
 
        const response = await fetch(`${backendUrl}/search?q=${query}`);
        const data = await response.json();


        console.log(data);  

        if (data.songs.length === 0) {
            alert('No results found.');
        } else {
            displayResults(data.songs);
        }
    } catch (error) {
        console.error("Error fetching songs: ", error);
    }
}

function displayResults(songs) {
    const resultsGrid = document.getElementById('resultsGrid');
    resultsGrid.innerHTML = ''; // Clear previous results

    // Set resultsGrid to display as flex with wrapping and gap for spacing
    resultsGrid.style.display = 'flex';
    resultsGrid.style.flexWrap = 'wrap';
    resultsGrid.style.justifyContent = 'center'; // Center the cards
    resultsGrid.style.gap = '16px'; // Space between the cards

    songs.forEach(song => {
        const songCard = document.createElement('div');
        songCard.classList.add('music-card'); // Class for additional styling if needed
        songCard.style.border = '2px solid rgba(255, 0, 0, 0.6)'; // Adding red border
        songCard.style.borderRadius = '16px'; // Border radius for smooth corners
        songCard.style.padding = '1.5rem'; // Adding padding for spacing within the card
        songCard.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)'; // Optional shadow
        songCard.style.minWidth = '250px'; // Minimum width for responsiveness
        songCard.style.maxWidth = '280px'; // Max width for consistent sizing
        songCard.style.height = 'auto'; // Height will adjust based on content
        songCard.style.flex = '1 1 auto'; // Allow cards to fill the available space but stay fixed in size
        songCard.style.display = 'flex'; // Flexbox layout
        songCard.style.flexDirection = 'column'; // Stack content vertically
        songCard.style.justifyContent = 'space-between'; // Ensure button stays at the bottom
        songCard.style.alignItems = 'center'; // Center content

        let albumCoverContent;
        if (song.album_cover) {
            albumCoverContent = `<img src="${song.album_cover}" alt="${song.name}" class="card-image" style="width: 100%; height: 200px; object-fit: cover; border-radius: 12px;">`; // Updated class
        } else {
            albumCoverContent = `
                <div class="card-image" style="display: flex; align-items: center; justify-content: center; background: rgba(13, 255, 255, 0.05); width: 100%; height: 200px; border-radius: 12px;">
                    <div style="text-align: center; padding: 2rem;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto 1rem; opacity: 0.5; color: var(--neon-primary);">
                            <path d="M9 18V5l12-2v13"></path>
                            <circle cx="6" cy="18" r="3"></circle>
                            <circle cx="18" cy="16" r="3"></circle>
                        </svg>
                        <p style="font-size: 0.8rem; opacity: 0.7; font-family: 'Orbitron';">No Image Available</p>
                    </div>
                </div>`;
        }

        console.log("Song data:", song);

        const spotifyLink = song.spotify_url || '#'; 

        songCard.innerHTML = `
            ${albumCoverContent}
            <div class="card-content" style="text-align: center; flex-grow: 1;">
                <h3 class="card-title" style="font-size: 1.2rem; color: white; margin-top: 1rem;">${song.name}</h3>
                <p class="card-artist" style="font-size: 0.9rem; color: gray; margin-bottom: 1rem;">${song.artist}</p>
            </div>
            <button class="card-button" style="width: 100%; padding: 0.75rem; background-color: #1DB954; border: none; border-radius: 8px; color: white; cursor: pointer; margin-top: auto;"
                onclick="window.open('${spotifyLink}', '_blank')" ${spotifyLink === '#' ? 'disabled' : ''}>
                ${spotifyLink !== '#' ? 'Listen on Spotify' : 'Unavailable'}
            </button>
        `;

        resultsGrid.appendChild(songCard);
    });

    // If no results found
    if (songs.length === 0) {
        resultsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: rgba(16, 18, 35, 0.5); border-radius: 16px; backdrop-filter: blur(10px);">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto 1.5rem; opacity: 0.5; color: var(--neon-primary);">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <h3 style="font-family: 'Orbitron'; font-size: 1.5rem; margin-bottom: 1rem; color: var(--neon-primary);">No Results Found</h3>
                <p style="color: rgba(224, 224, 255, 0.8); max-width: 500px; margin: 0 auto;">Try searching for a different artist, song, or genre to discover new music.</p>
            </div>
        `;
    }
}
