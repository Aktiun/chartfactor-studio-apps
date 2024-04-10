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
loadTopHosts();
loadPropertyType();
