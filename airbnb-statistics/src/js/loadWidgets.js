window.mapLoaded = false;
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
loadGeomap();
loadPropertyType();
loadActivity();
loadAvgPrice();
loadLicenses();
loadHostListings();
loadHostListingsStatistics();
// loadTopHosts();
loadTopHostsTable();
