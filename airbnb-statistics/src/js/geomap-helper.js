
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

    let boundaryFilter = cf.Filter("location").label("zoomFilter").type("POLYGON").operation("IN").value(filterBoundaries);

    cf.getAllVisualizations().filter(c => {
        return !c._isAktiveLayer && !["im", "cf-main-geomap"].includes(c._elementId);
    }).forEach(c => {
        c.staticFilters(boundaryFilter).execute();
    });
}

// move to another file

function createInfoHtmlString(entireHomes, privateRooms, sharedRooms, hotelRooms) {
    return `
      <div style="font-family: sans-serif; color: #333;">
        <div style="margin-bottom: 8px;">
          <div style="font-size: 1.5em; font-weight: bold; text-align: center;">${entireHomes.percentage}%</div>
          <div style="font-size: x-small; text-align: center;">entire homes/apartments</div>
        </div>
        <div style="margin-bottom: 4px;">
          <div style="font-size: 1em; font-weight: bold; text-align: center;">${entireHomes.count} (${entireHomes.percentage}%)</div>
          <div style="font-size: x-small; text-align: center;">entire home/apartments</div>
        </div>
        <div style="margin-bottom: 4px;">
          <div style="font-size: 1em; font-weight: bold; text-align: center;">${privateRooms.count}(${privateRooms.percentage}%)</div>
          <div style="font-size: x-small; text-align: center;">private rooms</div>
        </div>
        <div style="margin-bottom: 4px;">
          <div style="font-size: 1em; font-weight: bold; text-align: center;">${sharedRooms.count} (${sharedRooms.percentage}%)</div>
          <div style="font-size: x-small; text-align: center;">shared rooms</div>
        </div>
        <div>
          <div style="font-size: 1em; font-weight: bold; text-align: center;">${hotelRooms.count} (${hotelRooms.percentage}%)</div>
          <div style="font-size: x-small; text-align: center;">hotel rooms</div>
        </div>
      </div>
    `;
  }
