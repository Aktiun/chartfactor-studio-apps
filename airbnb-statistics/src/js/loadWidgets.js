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
loadGeomap().then(() => {
    const bbox = cf.getVisualization('cf-main-geomap')._visualization.getBBox();

    loadTotalListingsCount(bbox);
    loadPropertyType(bbox);
    loadActivity(bbox);
    loadAvgPrice(bbox);
    loadLicenses(bbox);
    loadHostListings(bbox);
    loadHostListingsStatistics(bbox);
    loadTopHostsTable(bbox);
    loadShortTermRentals(bbox);
    loadShortTermRentalsStatistics(bbox);
});
