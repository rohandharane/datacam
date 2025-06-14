const FILTERS = [
    'HISTORICAL',
    'CULTURAL',
    'INFRASTRUCTURE',
    'NATURAL',
    'ADMINISTRATIVE',
    'ECONOMIC'
];

let currentFilterIndex = 0;
let sessionCount = 1;
let capturedData = [];

// Mock geospatial data (in real implementation, this would come from an API)
const MOCK_DATA = {
    '48.8584, 2.2945': {
        historical: 'MONASTERY, HOSPITAL\nTURNED INFRASTRUCTURE\nIn the 1800s, this was converted into a psychiatric hospital and\nwas designated as a residential institution. Later it was a\nstructure run by the mental-ill Jehovah\'s witnesses.',
        cultural: 'MUSEUM, ART GALLERY\nFORMER PALACE\nBuilt in the 17th century as a royal residence, now houses\nimportant art collections including works from the Renaissance\nand Baroque periods.',
        infrastructure: 'TRANSPORTATION HUB\nSUBWAY STATION\nConnects multiple subway lines and serves as a major\ntransfer point for the city\'s public transportation system.',
        natural: 'URBAN PARK\nECOLOGY ZONE\nDesignated green space with diverse flora and fauna,\nimportant for urban biodiversity.',
        administrative: 'GOVERNMENT DISTRICT\nCITY HALL\nMain administrative center for city operations and governance.',
        economic: 'BUSINESS DISTRICT\nFINANCIAL CENTER\nHome to major financial institutions and corporate headquarters.'
    }
};

// DOM Elements
const filterName = document.querySelector('.filter-name');
const captureBtn = document.getElementById('capture-btn');
const sessionCountEl = document.querySelector('.session-count');
const dataContent = document.querySelector('.data-content');
const coordinates = document.querySelector('.coordinates');

// Initialize
filterName.textContent = FILTERS[currentFilterIndex];

// Update session count display
function updateSessionCount() {
    sessionCountEl.textContent = `SESSION: ${sessionCount}`;
}

// Update filter display
function updateFilterDisplay() {
    filterName.textContent = FILTERS[currentFilterIndex];
}

// Update data content
function updateDataContent() {
    const currentCoords = coordinates.textContent;
    const filterKey = FILTERS[currentFilterIndex].toLowerCase();
    const data = MOCK_DATA[currentCoords]?.[filterKey] || 'No data available';
    
    const [header, subheader, ...text] = data.split('\n');
    dataContent.innerHTML = `
        <div class="data-header">${header}</div>
        <div class="data-subheader">${subheader}</div>
        <div class="data-text">${text.join('<br>')}</div>
    `;
}

// Handle capture
async function handleCapture() {
    const timestamp = new Date().toISOString();
    const coords = coordinates.textContent;
    const filter = FILTERS[currentFilterIndex];
    
    // In real implementation, this would send data to the Arduino
    // For now, we'll just store it locally
    capturedData.push({
        timestamp,
        coordinates: coords,
        filter,
        data: MOCK_DATA[coords]?.[filter.toLowerCase()] || 'No data available'
    });
    
    sessionCount++;
    updateSessionCount();
    
    // Add visual feedback
    captureBtn.style.backgroundColor = '#ff5200';
    setTimeout(() => {
        captureBtn.style.backgroundColor = '#ff6b00';
    }, 200);
}

// Initialize socket connection
const socket = io('http://10.35.30.34:3000');

// Listen for encoder events from Arduino
socket.on('encoder-change', (direction) => {
    if (direction === 'up') {
        currentFilterIndex = (currentFilterIndex + 1) % FILTERS.length;
    } else {
        currentFilterIndex = (currentFilterIndex - 1 + FILTERS.length) % FILTERS.length;
    }
    updateFilterDisplay();
    updateDataContent();
});

// Listen for capture button press from Arduino
socket.on('capture', handleCapture);

// Export captured data
function exportData() {
    const dataStr = JSON.stringify(capturedData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `capture_session_${sessionCount}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Add event listeners
captureBtn.addEventListener('click', handleCapture);
