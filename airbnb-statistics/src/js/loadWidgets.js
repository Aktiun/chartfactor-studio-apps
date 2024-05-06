window.mapLoaded = false;

let filterBoundaries = [
    [
        -88.72424295240008,
        52.06296322712356
    ],
    [
        -58.97326638990015,
        52.06296322712356
    ],
    [
        -58.97326638990015,
        27.191620320129786
    ],
    [
        -88.72424295240008,
        27.191620320129786
    ],
    [
        -88.72424295240008,
        52.06296322712356
    ]
];

window.boundaryFilter = cf.Filter("location").label("zoomFilter").type("POLYGON").operation("IN").value(filterBoundaries);
function handleError(elementId, error) {
    // const visualizationContainer = document.getElementById(elementId);
    // const htmlError = `<div class="cf-visualization-message"><b>Error</b>: ${error.message}</div>`;
    //
    // $(visualizationContainer).prepend(htmlError);
    // window.toggleIndicator(elementId, false);
}

loadProviders();
// Load charts
loadInteractionManager();
loadGeomap().then(() => {
    loadTotalListingsCount();
    loadPropertyType();
    loadActivity();
    loadAvgPrice();
    loadLicenses();
    loadHostListings();
    loadHostListingsStatistics();
    loadTopHostsTable();
    loadShortTermRentals();
    loadShortTermRentalsStatistics();
});
