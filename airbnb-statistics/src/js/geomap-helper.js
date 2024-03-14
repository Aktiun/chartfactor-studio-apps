
const updateBoundsFilter = () => {
    let aktiveInstance = cf.getVisualization("cf-main-geomap")
    let map = aktiveInstance.get("map")
    let bounds = map.getBounds()
    let nw = bounds.getNorthWest();
    let se = bounds.getSouthEast();
    let ne = {"lng":se.lng, "lat":nw.lat};
    let sw = {"lng":nw.lng, "lat":se.lat};
    let center = bounds.getCenter();

    let filterBoundaries = [[nw.lng, nw.lat], [ne.lng, ne.lat], [se.lng, se.lat], [sw.lng, sw.lat], [nw.lng, nw.lat]];

    let boundaryFilter = cf.Filter("location").label("bound").type("POLYGON").operation("IN").value(filterBoundaries);

    cf.getAllVisualizations().filter(c => {
        return !c._isAktiveLayer && !["im", "cf-main-geomap"].includes(c._elementId);
    }).forEach(c => {
        c.staticFilters(boundaryFilter).execute();
    });
}