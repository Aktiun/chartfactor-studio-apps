
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

function getZeroCleanedData(){
  return {
    count: 0,
    rate: 0,
    description: ""
  }
}

function animateValue(obj, end, formatFunction) {
  let startTimestamp = null;
  let duration = 800;
  let start = 0;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = progress * (end - start) + start;
    obj.innerHTML = formatFunction(value, progress === 1);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

function formatCount(value, isFinal) {
  return isFinal ? `${Number(value.toFixed(0)).toLocaleString("us-US")}` : `${Math.round(value).toLocaleString("us-US")}`;
}

function formatRate(value, isFinal) {
  return `${value.toFixed(2)}%`;
}

function formatCurrency(value, isFinal) {
  return isFinal ? `$${Number(value.toFixed(2)).toLocaleString("us-US")}` : `$${Math.round(value).toLocaleString("us-US")}`;
}

function animateBothValues(countObj, countEnd, rateObj, rateEnd) {
  animateValue(countObj, countEnd, formatCount);
  animateValue(rateObj, rateEnd, formatRate);
}

function buildHtmlStringRoomtype(element1, element2, element3, element4){
  return `
  <div style="font-family: sans-serif; color: #333;">
      <div style="margin-bottom: 8px;">
        <div id="element1Percentage" style="font-size: 1.5em; font-weight: bold; text-align: center;">${element1.rate}%</div>
        <div style="font-size: small; text-align: center;">${element1.description}</div>
      </div>
      <div style="margin-bottom: 8px;">
      <div style="text-align: center;">
        <span id="element1Count" style="font-size: 1em; font-weight: bold; text-align: center;">${element1.count.toLocaleString("us-US")}</span>
        (<span id="element1Rate" style="font-size: 1em; text-align: center; font-weight: bold;"> (${element1.rate}%)</span>)
      </div>
        <div style="font-size: small; text-align: center;">${element1.description}</div>
      </div>
      <div style="margin-bottom: 8px;">
      <div style="text-align: center;">
        <span id="element2Count" style="font-size: 1em; font-weight: bold; text-align: center;">${element2.count.toLocaleString("us-US")}</span>
        (<span id="element2Rate" style="font-size: 1em; text-align: center; font-weight: bold;"> (${element2.rate}%)</span>)
      </div>
        <div style="font-size: small; text-align: center;">${element2.description}</div>
      </div>
      <div style="margin-bottom: 8px;">
      <div style="text-align: center;">
        <span id="element3Count" style="font-size: 1em; font-weight: bold; text-align: center;">${element3.count.toLocaleString("us-US")}</span>
        (<span id="element3Rate" style="font-size: 1em; text-align: center; font-weight: bold;"> (${element3.rate}%)</span>)
        <div style="font-size: small; text-align: center;">${element3.description}</div>
      </div>
      </div>
      <div style="text-align: center;">
        <span id="element4Count" style="font-size: 1em; font-weight: bold; text-align: center;">${element4.count.toLocaleString("us-US")}</span>
        (<span id="element4Rate" style="font-size: 1em; text-align: center; font-weight: bold;"> (${element4.rate}%)</span>)
        <div style="font-size: small; text-align: center;">${element4.description}</div>
      </div>
    </div>
  `
}

function buildHtmlStringAvgNights(nights){
  return `
  <div style="font-family: sans-serif; color: #333;">
    <div style="text-align: center;">
      <span id="avgNights" style="font-size: 1.5em; font-weight: bold; text-align: center;">${nights}</span>
      <div style="font-size: small; text-align: center;">Average nights booked</div>
    </div>
    <div style="margin-bottom: 12px;">
  </div>
  `
}

function buildHtmlStringAvgPrice(price){
  return `
  <div style="font-family: sans-serif; color: #333;">
    <div style="text-align: center;">
      <span id="avgPrice" style="font-size: 1em; font-weight: bold; text-align: center;">${price}</span>
      <div style="font-size: small; text-align: center;">Average price/night</div>
    </div>
  </div>
  `
}

function buildHtmlStringAvgIncome(income){
  return `
  <div style="font-family: sans-serif; color: #333;">
    <div style="text-align: center;">
      <span id="avgIncome" style="font-size: 1em; font-weight: bold; text-align: center;">${income}</span>
      <div style="font-size: small; text-align: center;">Average income</div>
    </div>
    <div style="margin-bottom: 12px;">
  </div>
  `
}

function buildHtmlStringLicenses(element1, element2, element3, element4) {
  return `
  <div style="font-family: sans-serif; color: #333;">
  <div style="margin-bottom: 8px;">
    <div id="element1LicensePercentage" style="font-size: 1.5em; font-weight: bold; text-align: center;">${element1.rate}%</div>
    <div style="font-size: small; text-align: center;">${element1.description}</div>
  </div>
  <div style="margin-bottom: 8px;">
  <div style="text-align: center;">
    <span id="element1LicenseCount" style="font-size: 1em; font-weight: bold; text-align: center;">${element1.count.toLocaleString("us-US")}</span>
    (<span id="element1LicenseRate" style="font-size: 1em; text-align: center; font-weight: bold;"> (${element1.rate}%)</span>)
  </div>
    <div style="font-size: small; text-align: center;">${element1.description}</div>
  </div>
  <div style="margin-bottom: 8px;">
  <div style="text-align: center;">
    <span id="element2LicenseCount" style="font-size: 1em; font-weight: bold; text-align: center;">${element2.count.toLocaleString("us-US")}</span>
    (<span id="element2LicenseRate" style="font-size: 1em; text-align: center; font-weight: bold;"> (${element2.rate}%)</span>)
  </div>
    <div style="font-size: small; text-align: center;">${element2.description}</div>
  </div>
  <div style="margin-bottom: 8px;">
  <div style="text-align: center;">
    <span id="element3LicenseCount" style="font-size: 1em; font-weight: bold; text-align: center;">${element3.count.toLocaleString("us-US")}</span>
    (<span id="element3LicenseRate" style="font-size: 1em; text-align: center; font-weight: bold;"> (${element3.rate}%)</span>)
    <div style="font-size: small; text-align: center;">${element3.description}</div>
  </div>
  </div>
  <div style="text-align: center;">
    <span id="element4LicenseCount" style="font-size: 1em; font-weight: bold; text-align: center;">${element4.count.toLocaleString("us-US")}</span>
    (<span id="element4LicenseRate" style="font-size: 1em; text-align: center; font-weight: bold;"> (${element4.rate}%)</span>)
    <div style="font-size: small; text-align: center;">${element4.description}</div>
  </div>
</div>
  `
}

function buildHtmlStringHostListings(element1, element2){
  return `
  <div style="font-family: sans-serif; color: #333;">
  <div style="margin-bottom: 8px;">
    <div id="element1HostListingsPercentage" style="font-size: 1.5em; font-weight: bold; text-align: center;">${element1.rate}%</div>
    <div style="font-size: small; text-align: center;">${element1.description}</div>
  </div>
  <div style="margin-bottom: 8px;">
  <div style="text-align: center;">
    <span id="element1HostListingsCount" style="font-size: 1em; font-weight: bold; text-align: center;">${element1.count.toLocaleString("us-US")}</span>
    (<span id="element1HostListingsRate" style="font-size: 1em; text-align: center; font-weight: bold;"> (${element1.rate}%)</span>)
  </div>
    <div style="font-size: small; text-align: center;">${element1.description}</div>
  </div>
  <div style="text-align: center;">
    <span id="element2HostListingsCount" style="font-size: 1em; font-weight: bold; text-align: center;">${element2.count.toLocaleString("us-US")}</span>
    (<span id="element2HostListingsRate" style="font-size: 1em; text-align: center; font-weight: bold;"> (${element2.rate}%)</span>)
    <div style="font-size: small; text-align: center;">${element2.description}</div>
  </div>
  `
}