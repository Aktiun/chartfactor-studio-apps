

const updateBoundsFilter = () => {
    let aktiveInstance = cf.getVisualization("cf-main-geomap")
    let map = aktiveInstance.get("map")
    let bounds = map.getBounds()
    let nw = bounds.getNorthWest();
    let se = bounds.getSouthEast();
    let ne = {"lng":se.lng, "lat":nw.lat};
    let sw = {"lng":nw.lng, "lat":se.lat};
    let center = bounds.getCenter();

    console.log(`NW: ${nw.lat}, ${nw.lng}`);
    console.log(`NE: ${ne.lat}, ${ne.lng}`);
    console.log(`SE: ${se.lat}, ${se.lng}`);
    console.log(`SW: ${sw.lat}, ${sw.lng}`);
    console.log(`Center: ${center.lat}, ${center.lng}`);

    let filterBoundaries = [[nw.lng, nw.lat], [ne.lng, ne.lat], [se.lng, se.lat], [sw.lng, sw.lat], [nw.lng, nw.lat]];

    let boundaryFilter = cf.Filter("location").label("bound").type("POLYGON").operation("IN").value(filterBoundaries);

    let manager = cf.getIManager();
    let api = manager.get("api");
    api.updateFilters([boundaryFilter]);
}