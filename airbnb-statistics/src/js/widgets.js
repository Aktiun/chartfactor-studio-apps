const widgetsTitleId = [
  { title: "Filters", id: "im" },
  {
    title: "abnb ny, wdc, jersey",
    id: "cf-main-geomap"
  },
  { title: "roomType", id: "cf-roomType" },
  { title: "range filters", id: "vis8ee433d1-85a6-43bb-92da-ccde73f4f184" },
  {
    title: "licenses",
    id: "cf-licenses"
  },
  {
    title: "hostListings",
    id: "cf-host-listings"
  },
  {
    title: "realtor_new_listings",
    id: "cf-new-listing-by-zipcode"
  },
  {
    title: "nh-number_reviews-scores",
    id: "viscf186866-fc60-4eac-9b66-988d7c8a4ccb"
  },
  {
    title: "amenities price",
    id: "vis3a626fff-e50d-452b-b4cc-58379dc8ab64"
  },
  { title: "beds", id: "vis0b21efba-2d7f-432a-89d9-092b421e8b1d" }
];
const getId = (name, layerName = undefined) => {
  const widget = widgetsTitleId.find(w => w.title === name);
  const id = widget ? widget.id : false;

  if (id && layerName) return id + "-" + layerName;

  return id;
};

function loadInteractionManager() {
  const elementId = "im";
  try {
    let viz3 = getId("roomType");
    let viz2 = getId("licenses");
    let viz4 = getId("hostListings");
    let viz5 = getId("realtor_new_listings");
    let rules1 = {
      [viz3]: { clientFilters: true },
      [viz2]: { clientFilters: true },
      [viz5]: { clientFilters: true }
    };
    /* Configuration code for the Interaction Manager*/
    // Drill hierarchy and rule settings can be done like this:
    // let viz1 = getId("widget_title_1")
    // let viz2 = getId("widget_title_2")
    // let drill = { [viz1]: { group1: []}}
    // let rules = { [viz2]: { receive: false }}
    // NOTE: Drill hierarchy will change your code!
    // Define options
    let aktive = cf.create();
    let myChart = aktive
        .graph("Interaction Manager")
        //.set("rules", rules)
        //.set("drill", drill)
        .set("rules", rules1)
        .set("skin", {
          type: "modern",
          trash: {
            show: true,
            style: "color: red;font-size: 30px;"
          }
        })
        .element("im")
        .on("notification", e => {
          window.toast({
            message: e.message,
            type: e.type
          });
        })
        .execute()
        .catch(ex => {
          handleError(elementId, ex);
        });
  } catch (ex) {
    console.error(ex);
    handleError(elementId, ex);
  }
}

function showRating(rating) {
  let fullStars = Math.floor(rating);
  let halfStar = (rating % 1) !== 0 ? 1 : 0;
  let emptyStars = 5 - fullStars - halfStar;

  let stars = '';

  // Add the full stars
  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fas fa-star" style="color: #fbc02d"></i>';
  }

  // Add the half star, if there is one
  if (halfStar) {
    stars += '<i class="fas fa-star-half-alt" style="color: #fbc02d"></i>';
  }

  // Add the empty stars
  for (let i = 0; i < emptyStars; i++) {
    stars += '<i class="far fa-star" style="color: #B0B0B0"></i>'; // 'far fa-star' is the Font Awesome class for an empty star
  }

  document.getElementById('reviews-stars').innerHTML = stars;
}

function processGeomapClick(e) {
  let markerData = JSON.parse(e.features[0].properties.__cf_data__);

  $("#investors-modal-title > .listing-name").text(markerData.name);
  $("#investors-modal-title > .listing-name").attr("href", markerData.listing_url);
  $("#investors-modal-title > .host-name").text(markerData.host_name);
  $("#investors-modal-title > .host-name").attr("href", markerData.host_url);
  $("#listing-profile-picture").attr("src", markerData.host_picture_url);
  $("#listing-picture").attr("src", markerData.picture_url);
  $("#number-of-reviews").text(markerData.number_of_reviews);
  $("#modal-zipcode").text(markerData.zipcode);
  $("#realtor-zipcode").text(markerData.zipcode);
  $("#listing-neighbourhood").text(markerData.neighbourhood || 'N/A');
  $("#listing-neighborhood_overview").html(markerData.neighborhood_overview || '');
  $("#realtor-link").attr("href", `https://www.realtor.com/realestateandhomes-search/${markerData.zipcode}`);

  showRating(markerData.review_scores_value);

  $("#listing-price").text(`$${markerData.price}`);
  $("#min-nights").text(markerData.minimum_nights);
  $("#listing-beds").text(markerData.beds || 'N/A');
  $("#listing-bedrooms").text(markerData.bedrooms || 'N/A');

  const {
    price,
    bedrooms,
    number_of_reviews,
    minimum_nights,
  } = markerData;

  let cleanPrice = price > 0 ? `$${price.toFixed(2)} per night.` : "Price not available";
  let cleanBedrooms = bedrooms !== "" ? bedrooms : "Bedrooms not available";
  let avgNights = (Number(number_of_reviews) * Number(minimum_nights)).toFixed(0);
  let rawIncome = (avgNights * Number(price)).toFixed(2);
  let avgIncome = rawIncome > 0 ? rawIncome : "Not available";
  let cleanIncome = rawIncome > 0 ? `${formatCurrency(Number(avgIncome), true) }` : "Not available";

  $("#avgNights").text(`${Number(markerData.estimated_occupied_time).toFixed(0)} ${markerData.estimated_occupied_time > 1 ? 'nights' : 'night'}`);
  $("#avgIncome").text(cleanIncome);
  showInvestorModal();

  if (markerData.is_usa === "false") {
    $("#modal-charts-area").css("display", "none");
    $("#modal-zipcode-container").css("display", "none");
    $(".investors-modal-container").addClass('no-usa');
  } else {
    $("#modal-charts-area").css("display", "grid");
    $("#modal-zipcode-container").css("display", "flex");
    $(".investors-modal-container").removeClass('no-usa');

    kpiByZipcode(markerData.zipcode);
    trendsByZipcode(markerData.zipcode);
    trendsByZipcode2(markerData.zipcode);
    trendsByZipcode3(markerData.zipcode);
    trendsByZipcode4(markerData.zipcode);
  }
}

async function loadGeomap() {

  return new Promise((resolve, reject) => {
    const elementId = "cf-main-geomap"
    try {
      const myTooltip = data => {
        return getTooltipCardHtml(data);
      };

      cf.create()
          .graph("Geo Map GL")
          .set("layers", [
            {
              "name": "hosts",
              "priority": 2,
              "type": "heatmap",
              "provider": "local",
              "source": "abnb_listings",
              "properties": {
                "customTooltip": myTooltip,
                "limit": 20000,
                "location": "location",
                "visibilityZoomRange": [0, 24],
                "options": {
                  "heatmap-weight": ["interpolate", ["linear"], ["get", "__cf_cluster_count_percent__"], 1, 0.2, 80, 85],
                  "heatmap-radius": ["interpolate", ["linear"], ["get", "__cf_cluster_count_percent__"], 1, 3, 20, 5, 80, 10],
                  "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 5, 1, 18, 6],
                  "heatmap-color": ["interpolate", ["linear"], ["heatmap-density"], 0, "rgba(0, 0, 255, 0)", 0.1, "royalblue", 0.3, "cyan", 0.5, "lime", 0.7, "yellow", 1, "red"],
                  "switchToMarkersAtRaw": true,
                },
                "precisionLevels": {
                  "raw": {
                    "zoom": 13.5,
                    fields: [
                      "name", "estimated_occupied_time", "host_name", "bedrooms", "beds", "price",
                      "picture_url","number_of_reviews", "review_scores_value", "minimum_nights", "zipcode",
                      "is_usa", "host_name", "host_url", "listing_url", "host_picture_url", "neighbourhood",
                      "neighborhood_overview"
                    ]
                  },
                  "levels": [{ "zoom": 2, "precision": 4 }, { "zoom": 4, "precision": 5 }, { "zoom": 6, "precision": 6 }, { "zoom": 8, "precision": 7 }, { "zoom": 12.5, "precision": 8 }]
                },
                "color": cf.Color()
                    .palette(["#08519c", "#3182bd", "#6baed6", "#bdd7e7", "#eff3ff"])
                    .metric(cf.Metric()),
              },
            }, {
              type: "tile",
              name: "Tile",
              priority: 1,
              properties: {
                source: {
                  tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
                  scheme: "xyz",
                  attribution:
                      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
                }
              }
            }
          ])
          .set("zoom", 2.4)
          .set("center", [-56.83331908733828, 42.164016576305954])
          .set("drawControl", true)
          .set("enableZoomInfo", true)
          .set("layersControl", false)
          .set('minZoom', 2.4)
          .element(elementId)
          .on("notification", e => {
            window.toast({
              message: e.message,
              type: e.type
            });
          })
          .once("geo:layers-execution-stop", () => {
            window.mapLoaded = true;
            updateBnBBoundsFilter();
            resolve();
          })
          .on("geo:layers-execution-stop", e => {
            let aktiveMap = cf.getVisualization("cf-main-geomap");
            let geoMap = aktiveMap.get("map");
            geoMap.off("click", "hosts_image_layer", processGeomapClick);
            geoMap.on("click", "hosts_image_layer", processGeomapClick);

            geoMap.off("touchstart", "hosts_image_layer", processGeomapClick);
            geoMap.on("touchstart", "hosts_image_layer", processGeomapClick);
          })
          .on("execute:stop", e => {
            let aktiveMap = cf.getVisualization("cf-main-geomap");
            let geoMap = aktiveMap.get("map");
            geoMap.on("zoomend", (e) => {
              updateBnBBoundsFilter();
            });
            geoMap.on("moveend", () => {
              updateBnBBoundsFilter();
            });
            geoMap.on("dragend", () => {
              updateBnBBoundsFilter();
            });
          })
          .on("error", e => handleError(e.element, e.error))
          .execute()
          .catch(ex => {
            if (typeof provider !== "undefined") {
              const currentProvider = provider.getProvider();
              const providerName = currentProvider
                  ? currentProvider.get("provider")
                  : null;

              handleForbiddenError(ex, providerName);
            }
            handleError(elementId, ex);
            reject(ex);
          });
    } catch (ex) {
      console.error(ex);
      handleError(elementId, ex);
      reject(ex);
    }
  });
}

function loadPropertyType() {
  const elementId = "cf-roomType";
  try {
    let provider = cf.provider("local");
    let source = provider.source("abnb_listings");
    // Define metrics
    let metric0 = cf.Metric("count");
    let metric1 = cf.CompareMetric("count", "").rate().label("Rate");
    // Define attributes to group by
    let group1 = cf.Attribute("room_type")
        .limit(10)
        .sort("desc", cf.Metric());
    // Add metrics and groups to data source
    let myData = source.groupby(group1)
        .metrics(metric0, metric1);
    // --- Define chart options and static filters ---
    // Define Grid
    let grid = cf.Grid()
        .top(10)
        .right(10)
        .bottom(0)
        .left(5);
    // Define Color Palette
    let color = cf.Color()
        .theme({ background:'rgba(0,0,0,0)', font: 'black'})
        .palette(["#0095b7", "#a0b774", "#f4c658", "#fe8b3e"])
        .match({
          "Entire home/apt": "#0095b7",
          "Private room": "#a0b774",
          "Shared room": "#f4c658",
          "Hotel room": "#fe8b3e"
        });

    myData.staticFilters(window.boundaryFilter);

    myData.graph("Bars")
        .set("grid", grid)
        .set("color", color)
        .set("orientation", "vertical")
        .set("xAxis", { "show": true, "lines": false })
        .set("yAxis", { "text": "out", "lines": false })
        .set("dataZoom", false)
        .set("serieLabel", {
          "show": true,
          "fontWeight": "bold"
        })
        .on("execute:stop", () => {
          let chart = cf.getVisualization("cf-roomType");
          const clientFilter = chart.getCurrentAQL()._clientFilters[0];
          let data = chart.get("data");
          let element1 = data[0];
          let element2 = data.length > 1 ? data[1] : undefined;
          let element3 = data.length > 2 ? data[2] : undefined;
          let element4 = data.length > 3 ? data[3] : undefined;

          let element1Clean = element1 ? {
            count: element1.current.count,
            rate: element1.current.metrics.rate.count,
            description: element1.group[0],
            id: 'entire-home-apt-val'
          } : getZeroCleanedData();
          let element2Clean = element2 ? {
            count: element2.current.count,
            rate: element2.current.metrics.rate.count,
            description: element2.group[0],
            id: 'private-room-val'
          } : getZeroCleanedData();
          let element3Clean = element3 ? {
            count: element3.current.count,
            rate: element3.current.metrics.rate.count,
            description: element3.group[0],
            id: 'shared-room-val'
          } : getZeroCleanedData();
          let element4Clean = element4 ? {
            count: element4.current.count,
            rate: element4.current.metrics.rate.count,
            description: element4.group[0],
            id: 'hotel-room-val'
          } : getZeroCleanedData();

          document.getElementById('entire-home-apt-val').parentElement.style.fontWeight = 'normal';
          document.getElementById('entire-home-apt-val').parentElement.style.fontSize = '1em';

          document.getElementById('private-room-val').parentElement.style.fontWeight = 'normal';
          document.getElementById('private-room-val').parentElement.style.fontSize = '1em';

          document.getElementById('shared-room-val').parentElement.style.fontWeight = 'normal';
          document.getElementById('shared-room-val').parentElement.style.fontSize = '1em';

          document.getElementById('hotel-room-val').parentElement.style.fontWeight = 'normal';
          document.getElementById('hotel-room-val').parentElement.style.fontSize = '1em';

          let fontChange = null;
          if (clientFilter && clientFilter.value.some(v => v === element1Clean.description)) {
            fontChange = element1Clean.id;
          } else if (clientFilter && clientFilter.value.some(v => v === element2Clean.description)) {
            fontChange = element2Clean.id;
          } else if (clientFilter && clientFilter.value.some(v => v === element3Clean.description)) {
            fontChange = element3Clean.id;
          } else if (clientFilter && clientFilter.value.some(v => v === element4Clean.description)) {
            fontChange = element4Clean.id;
          }

          if (fontChange) {
            document.getElementById(fontChange).parentElement.style.fontWeight = 'bold';
            document.getElementById(fontChange).parentElement.style.fontSize = '1.5em';
          }

          animateBothValues(
              document.getElementById('entire-home-apt-val'),
              element1Clean.count,
              document.getElementById('entire-home-apt-prct'),
              element1Clean.rate,
          );
          animateBothValues(
              document.getElementById('private-room-val'),
              element2Clean.count,
              document.getElementById('private-room-prct'),
              element2Clean.rate,
          );
          animateBothValues(
              document.getElementById('shared-room-val'),
              element3Clean.count,
              document.getElementById('shared-room-prct'),
              element3Clean.rate,
              false,
              true
          );
          animateBothValues(
              document.getElementById('hotel-room-val'),
              element4Clean.count,
              document.getElementById('hotel-room-prct'),
              element4Clean.rate,
              false,
              true
          );
        })
        .element(elementId)
        .execute();

  } catch (ex) {
    console.error(ex);
    handleError(elementId, ex);
  }
}

function loadActivity() {
  const elementId = "cf-activity";
  try {
    /* Configuration code for this widget */
    let provider = cf.provider("local");
    let source = provider.source("abnb_listings");
    // Define metrics
    let metric0 = cf.Metric("estimated_occupied_time", "histogram").fixedBars(6)
        .offset(0)
        .showEmptyIntervals(false);
    // Add metrics and groups to data source
    let myData = source
        .metrics(metric0)
        .limit(100);

    let grid = cf.Grid()
        .top(50)
        .right(5)
        .bottom(15)
        .left(45);

    // Define Color Palette
    let color = cf.Color()
        .theme({ background:'rgba(0,0,0,0)', font: 'black' })
        .palette(["#0095b7"]);
    // --- Define chart options and static filters ---

    myData.staticFilters(window.boundaryFilter);
    myData.graph("Histogram")
        .set("color", color)
        .set("grid", grid)
        .set("yAxis", { "type": "log", "lines": false })
        .on("execute:stop", () => {
          let chart = cf.getVisualization("cf-activity");
          let data = chart.get("data");
          totalListings = data.reduce((acc, bar) => acc + bar.current.count, 0);
        })
        .element(elementId)
        .execute();
  } catch (ex) {
    console.error(ex);
    handleError(elementId, ex);
  }
}

let dataHandler = (result) => {
  result.keep = true;
  return result;
}

function loadAvgPrice() {
  const elementId = "cf-avg-price-inv";
  try {

    cf.create('Query1')
        .provider('local')
        .source('abnb_listings')
        .staticFilters(window.boundaryFilter)
        .filter(cf.Filter("host_total_listings_count")
            .label("host_total_listings_count")
            .operation("NOT IN")
            .value([0, 1]))
        .metrics(cf.Metric("estimated_occupied_time", "avg"), cf.Metric("availability_365", "avg"))
        .create('Query2')
        .provider('local')
        .source('abnb_listings')
        .staticFilters(window.boundaryFilter)
        .filter(cf.Filter("host_total_listings_count")
            .label("host_total_listings_count")
            .operation("NOT IN")
            .value([0, 1]))
        .metrics(cf.Metric("price", "avg"))
        .processWith(dataHandler)
        .on("execute:stop", (result) => {

          let nightsData = result.data.Query1;
          let avgNights = nightsData[0].current.metrics.estimated_occupied_time.avg;
          let avgAvailability = nightsData[0].current.metrics.availability_365.avg;
          avgNights = avgNights > avgAvailability ? avgAvailability : avgNights;

          let data = result.data.Query2;
          let avgPrice = data[0].current.metrics.price.avg;
          let avgIncome = avgPrice * avgNights;

          animateValue(document.getElementById('avg-nights-booked-val'), avgNights, formatCount, true);
          animateValue(document.getElementById('avg-income-val'), avgPrice, formatCurrency, true);
          animateValue(document.getElementById('avg-price-val'), avgIncome, formatCurrency, true);
        })
        .element(elementId)
        .execute()
  } catch (ex) {
    console.error(ex);
    handleError(elementId, ex);
  }
}

function loadLicenses() {
  const elementId = "cf-licenses";
  try {
    let provider = cf.provider("local");
    let source = provider.source("abnb_listings");
    // Define metrics
    let metric0 = cf.Metric("count");
    let metric1 = cf.CompareMetric("count").rate().label("Rate");
    // Define attributes to group by
    let group1 = cf.Attribute("license")
        .limit(10)
        .sort("desc", cf.Metric());
    // Add metrics and groups to data source
    let myData = source.groupby(group1)
        .metrics(metric0, metric1);
    // --- Define chart options and static filters ---
    // Define Grid
    let grid = cf.Grid()
        .top(-15)
        .right(-15)
        .bottom(-15)
        .left(-15);
    // Define Color Palette
    let color = cf.Color()
        .theme({ background:'rgba(0,0,0,0)', font: 'black'})
        .palette(["#0095b7", "#a0b774", "#f4c658", "#fe8b3e"])
        .match({
          "Unlicensed": "#0095b7",
          "Licensed": "#a0b774",
          "Exempt": "#f4c658",
          "Pending": "#fe8b3e"
        });

    myData.staticFilters(window.boundaryFilter);
    myData.graph("Pie")
        .set("grid", grid)
        .set("color", color)
        .set("metricValue", true)
        .set("labelPosition", "inside")
        .on("execute:stop", () => {
          let chart = cf.getVisualization("cf-licenses");
          let data = chart.get("data");
          let element1 = data.find(d => d.group[0] === "Unlicensed");
          let element2 = data.find(d => d.group[0] === "Exempt");
          let element3 = data.find(d => d.group[0] === "Licensed");
          let element4 = data.find(d => d.group[0] === "Pending");
          let element1Clean = element1 ? {
            count: element1.current.count,
            rate: element1.current.metrics.rate.count,
            description: element1.group[0],
            id: 'unlicensed-val'
          } : getZeroCleanedData();
          let element2Clean = element2 ? {
            count: element2.current.count,
            rate: element2.current.metrics.rate.count,
            description: element2.group[0],
            id: 'exempt-val'
          } : getZeroCleanedData();
          let element3Clean = element3 ? {
            count: element3.current.count,
            rate: element3.current.metrics.rate.count,
            description: element3.group[0],
            id: 'licensed-val'
          } : getZeroCleanedData();
          let element4Clean = element4 ? {
            count: element4.current.count,
            rate: element4.current.metrics.rate.count,
            description: element4.group[0],
            id: 'pending-val'
          } : getZeroCleanedData();

          animateValue(document.getElementById('unlicensed-val'), element1Clean.count, formatCount, true);
          animateValue(document.getElementById('unlicensed-prct-val'), element1Clean.rate, formatRate, true);

          animateValue(document.getElementById('exempt-val'), element2Clean.count, formatCount, true);
          animateValue(document.getElementById('exempt-prct-val'), element2Clean.rate, formatRate, true);

          animateValue(document.getElementById('licensed-val'), element3Clean.count, formatCount, true);
          animateValue(document.getElementById('licensed-prct-val'), element3Clean.rate, formatRate, true);

          animateValue(document.getElementById('pending-val'), element4Clean.count, formatCount, true);
          animateValue(document.getElementById('pending-prct-val'), element4Clean.rate, formatRate, true);

          document.getElementById('unlicensed-val').parentElement.style.fontWeight = 'normal';
          document.getElementById('unlicensed-val').parentElement.style.fontSize = '1em';

          document.getElementById('exempt-val').parentElement.style.fontWeight = 'normal';
          document.getElementById('exempt-val').parentElement.style.fontSize = '1em';

          document.getElementById('licensed-val').parentElement.style.fontWeight = 'normal';
          document.getElementById('licensed-val').parentElement.style.fontSize = '1em';

          document.getElementById('pending-val').parentElement.style.fontWeight = 'normal';
          document.getElementById('pending-val').parentElement.style.fontSize = '1em';

          const clientFilter = chart.getCurrentAQL()._clientFilters[0];

          let fontChange = null;
          if (clientFilter && clientFilter.value.some(v => v === element1Clean.description)) {
            fontChange = element1Clean.id;
          } else if (clientFilter && clientFilter.value.some(v => v === element2Clean.description)) {
            fontChange = element2Clean.id;
          } else if (clientFilter && clientFilter.value.some(v => v === element3Clean.description)) {
            fontChange = element3Clean.id;
          } else if (clientFilter && clientFilter.value.some(v => v === element4Clean.description)) {
            fontChange = element4Clean.id;
          }

          if (fontChange) {
            document.getElementById(fontChange).parentElement.style.fontWeight = 'bold';
            document.getElementById(fontChange).parentElement.style.fontSize = '1.5em';
          }


          let licenseTypes = ["Unlicensed", "Licensed", "Exempt", "Pending"];

          let notFirstElementClean = [element2Clean, element3Clean, element4Clean];
          let descriptionsAssigned = new Set();
          notFirstElementClean.map((element, index) => {
            if (element.description === "") {
              let availableDescriptions = licenseTypes.filter(type =>
                  !descriptionsAssigned.has(type) &&
                  type !== element1Clean.description &&
                  type !== element2Clean.description &&
                  type !== element3Clean.description &&
                  type !== element4Clean.description
              );

              if (availableDescriptions.length > 0) {
                element.description = availableDescriptions[0];
                descriptionsAssigned.add(availableDescriptions[0]);
              }
            }
          });

          animateValue(document.getElementById('unlicensed-val'), element1Clean.count, formatCount, true);
          animateValue(document.getElementById('unlicensed-prct-val'), element1Clean.rate, formatRate, true);

          animateValue(document.getElementById('exempt-val'), element2Clean.count, formatCount, true);
          animateValue(document.getElementById('exempt-prct-val'), element2Clean.rate, formatRate, true);

          animateValue(document.getElementById('licensed-val'), element3Clean.count, formatCount, true);
          animateValue(document.getElementById('licensed-prct-val'), element3Clean.rate, formatRate, true);

          animateValue(document.getElementById('pending-val'), element4Clean.count, formatCount, true);
          animateValue(document.getElementById('pending-prct-val'), element4Clean.rate, formatRate, true);
        })
        .element(elementId)
        .execute();
  } catch (ex) {
    console.error(ex);
    handleError(elementId, ex);
  }
}

function loadHostListings() {
  const elementId = "cf-host-listings";

  try {
    let provider = cf.provider("local");
    let source = provider.source("abnb_listings");
    // Define metrics
    let metric0 = cf.Metric("calculated_host_listings_count", "histogram").label('Listings per host').fixedBars(10)
        .offset(0)
        .showEmptyIntervals(false);
    // Add metrics and groups to data source
    let myData = source
        .metrics(metric0)
        .limit(100);

    let grid = cf.Grid()
        .top(20)
        .right(5)
        .bottom(25)
        .left(40);
    // Define Color Palette
    let color = cf.Color()
        .theme({ background:'rgba(0,0,0,0)', font: 'black'})
        .palette(["#1d91c0", "#1d91c0"]);
    // --- Define chart options and static filters ---
    myData.staticFilters(window.boundaryFilter);
    myData.graph("Histogram")
        .set("grid", grid)
        .set("color", color)
        .set("xAxis", { "show": true, "lines": false })
        .set("yAxis", { "lines": false, "type": "log" })
        .element(elementId)
        .execute();
  } catch (ex) {
    console.error(ex);
    handleError(elementId, ex);
  }
}

function loadHostListingsStatistics() {
  const elementId = "cf-host-single-listings";
  try {

    const hlQuery1 = cf.provider('local')
        .source('abnb_listings')
        .staticFilters(window.boundaryFilter, cf.Filter("host_total_listings_count")
            .operation("GT")
            .value([1]))
        .metrics(cf.Metric())
        .on("execute:stop", async (hlQuery1) => {
          const imFilters = cf.getIManager().get('api').getFilters();

          const mainAql = cf.getVisualization(hlQuery1.element).getCurrentAQL();
          const mainStaticFilters = mainAql._staticFilters
              .filter(sf => ['last_review', 'estimated_occupied_time'].includes(sf.path))
              .map(sf => cf.Filter().fromJSON(sf));

          const hlQuery2 = await cf.provider('local')
              .source('abnb_listings')
              .filters(imFilters)
              .staticFilters(...[window.boundaryFilter, ...mainStaticFilters, cf.Filter("host_total_listings_count")
                  .operation("LT")
                  .value([2])])
              .metrics(cf.Metric())
              .element('hlQuery2')
              .execute();

          let data = hlQuery2.data;
          let hostsWithOneListing = data[0].current.count;

          let dataMulti = hlQuery1.data;
          let hostsMultiListings = dataMulti[0].current.count;


          let element1 = hostsWithOneListing >= hostsMultiListings ? hostsWithOneListing : hostsMultiListings;
          let element2 = element1 === hostsWithOneListing ? hostsMultiListings : hostsWithOneListing;

          let listingsType = ["single listings", "multi-listings"]

          let statisticsObj1 = {
            count: element1,
            rate: element1 / (element1 + element2) * 100,
            description: element1 === hostsWithOneListing ? "single listings" : "multi-listings"
          }
          let statisticsObj2 = {
            count: element2,
            rate: element2 / (element1 + element2) * 100,
            description: listingsType.filter(type => type !== statisticsObj1.description)[0]
          }

          animateValue(document.getElementById('multi-listings-val'), statisticsObj1.count, formatCount, true);
          animateValue(document.getElementById('multi-listings-prct-val'), statisticsObj1.rate, formatRate, true);

          animateValue(document.getElementById('single-listings-val'), statisticsObj2.count, formatCount, true);
          animateValue(document.getElementById('single-listings-prct-val'), statisticsObj2.rate, formatRate, true);
          cf.remove('hlQuery2');
        })
        .element('hlQuery1')
        .execute();
  } catch (ex) {
    console.error(ex);
    handleError(elementId, ex);
  }
}

function makeTableSortable() {
  // Get the table element
  let table = document.getElementById('table-hosts');

  // Convert the HTMLCollection to an array
  let rows = Array.prototype.slice.call(table.rows, 1);

  // Create a variable to store the current sorting order
  let sortAscending = true;

  // Attach a click event listener to all th elements
  for (let i = 0; i < table.rows[0].cells.length; i++) {
    table.rows[0].cells[i].onclick = function() {
      // Remove the sorting icon from all headers
      for (let j = 0; j < table.rows[0].cells.length; j++) {
        let iconElement = table.rows[0].cells[j].querySelector('.sort-icon');
        iconElement.innerHTML = '';
      }

      // Sort the array of rows
      let sortedRows = rows.sort((a, b) => {
        if (i === 0) { // If first column, sort as string
          if (a.cells[i].innerHTML === b.cells[i].innerHTML) {
            return 0;
          }
          if (sortAscending) {
            return a.cells[i].innerHTML > b.cells[i].innerHTML ? 1 : -1;
          } else {
            return a.cells[i].innerHTML < b.cells[i].innerHTML ? 1 : -1;
          }
        } else { // For all other columns, sort as number
          let numA = parseInt(a.cells[i].innerHTML, 10);
          let numB = parseInt(b.cells[i].innerHTML, 10);
          if (sortAscending) {
            return numA - numB;
          } else {
            return numB - numA;
          }
        }
      });

      // Remove each row from the table
      while (table.rows.length > 1) {
        table.deleteRow(1);
      }

      // Add the sorted rows back to the table
      for (let i = 0; i < sortedRows.length; i++) {
        table.appendChild(sortedRows[i]);
      }

      // Add the sorting icon to the header
      let iconElement = this.querySelector('.sort-icon');
      iconElement.innerHTML = sortAscending ? '▲' : '▼';

      // Flip the sorting order for the next click
      sortAscending = !sortAscending;
    }
  }
}

function loadTopHosts() {
  const elementId = "cf-top-hosts";
  try {

    let provider = cf.provider("local");
    let source = provider.source("abnb_listings");

    let metric0 = cf.Metric("calculated_host_listings_count", "avg").hideFunction();
    let metric1 = cf.Metric("calculated_host_listings_count_entire_homes", "avg").hideFunction();
    let metric2 = cf.Metric("calculated_host_listings_count_private_rooms", "avg").hideFunction();
    let metric3 = cf.Metric("calculated_host_listings_count_shared_rooms", "avg").hideFunction();
    let metric4 = cf.Metric("calculated_host_listings_count_hotel_rooms", "avg").hideFunction();

    let group1 = cf.Attribute("host_name")
        .limit(10000)
        .sort("desc", cf.Metric("calculated_host_listings_count", "avg"));

    let myData = source.groupby(group1)
        .metrics(metric0, metric1, metric2, metric3, metric4);

    myData.graph("Slicer")
        .set("autoSizeColumns", true)
        .set("columnsWidth", [{"group":110},
          {"calculated_host_listings_count":80},
          {"calculated_host_listings_count_entire_homes":85},
          {"calculated_host_listings_count_private_rooms":75},
          {"calculated_host_listings_count_shared_rooms":75},
          {"calculated_host_listings_count_hotel_rooms":65}])
        .set('showSearch', false)
        .element(elementId)
        .execute();
  } catch (ex) {
    console.error(ex);
    handleError(elementId, ex);

  }
}

// Realtor metrics

function kpiByZipcode(zipcode) {

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  let filterZipcode = cf.Filter("postal_code")
      .label("Postal code")
      .operation("IN")
      .value([zipcode]);

  let monthName = undefined;
  let lastDate = undefined;

  let timestampGroup = cf.Attribute("@timestamp")
      .limit(1).func("MONTH")
      .sort("desc", "@timestamp");

  let metric0 = cf.Metric("active_listing_count", "sum");
  let timestampMetric = cf.Metric("@timestamp", "max");

  let timeFilter = cf.Filter("month_date_yyyymm")
      .label("Month date yyyymm")
      .operation("BETWEEN")
      .value(window.timeFilter.getValue());

  cf.provider("local")
      .source("realtor_monthly_inventory_zip_all")
      .groupby(timestampGroup)
      .metrics(metric0, timestampMetric)
      .staticFilters(filterZipcode)
      .clientFilters(timeFilter)
      .element("kpi-by-zipcode")
      .on("execute:stop", data => {
        if (_ && data) {
          const value = _.get(data, 'data[0].current.metrics.active_listing_count.sum');
          const fixedValue = value ? value.toFixed(2) : "0";
          const formatedValue = value ? value.toLocaleString("en-US") : "0";
          const values = formatedValue.includes(".") ?
              formatedValue.split(".")[0] + "." + fixedValue.split(".")[1] :
              formatedValue;


          let timestamp = data.data[0] ? data.data[0].current.metrics["@timestamp"].max : undefined;
          let utcDate = timestamp ? new Date(timestamp).toUTCString() : undefined;
          monthName = utcDate ? monthNames[new Date(utcDate).getUTCMonth()] : "";

          $("#month-name").text(monthName);
          $('#cf-active-listings-zipcode').html(values);
          $('#counter-info-zipcode').text(zipcode);
        }
      })
      .execute();
}

const tomMargin = 30


async function trendsByZipcode(zipcode) {
  let filterZipcode = cf.Filter("postal_code")
      .label("Postal code")
      .operation("IN")
      .value([zipcode]);
  const minmaxQuery = await cf.provider("local")
      .source("realtor_monthly_inventory_zip_all")
      .staticFilters(filterZipcode)
      .timeField(cf.Attribute("month_date_yyyymm").func('DAY'))
      .set('timeRangeVisual', true)
      .element(`mimmaxquery-1`)
      .execute();

  const { min, max } = await minmaxQuery.data[0];
  const { firstDay, lastDay } = window.getFirstLastDayMonth(max);
  let timeFilter = cf.Filter("month_date_yyyymm")
      .label("Month date yyyymm")
      .operation("BETWEEN")
      .value([`${firstDay} 00:00:00`, `${lastDay}- 23:59:59.999`]);

  // ************ Active Listings Trend by Zipcode ************ //
  let grid = cf.Grid()
      .top(tomMargin)
      .right(45)
      .bottom(35)
      .left(40);
  let color = cf.Color()
      .palette(["#0095b7", "#a0b774", "#f4c658", "#fe8b3e", "#cf2f23", "#756c56", "#007896", "#47a694", "#f9a94b", "#ff6b30", "#e94d29", "#005b76"]);
  color.theme({
    background: "#FFFFFF7F",
    font: "black"
  });
  let metric0 = cf.Metric("active_listing_count", "sum").hideFunction();
  let group1 = cf.Attribute("month_date_yyyymm")
      .limit(1000).func("MONTH")
      .sort("asc", "month_date_yyyymm");

  cf.provider("local")
      .source("realtor_monthly_inventory_zip_all")
      .groupby(group1)
      .metrics(metric0)
      .staticFilters(filterZipcode)
      .clientFilters(timeFilter)
      .graph("Trend")
      .set("grid", grid)
      .set("color", color)
      .set("axisLabels", false)
      .set("xAxis", { "labelGap": 30 })
      .set("dataZoom", false)
      .element("cf-active-listings-trend-by-zipcode")
      .execute();

  // ************ Median Listing Price Trend by Zipcode ************ //
  let metric1 = cf.Metric("median_listing_price", "avg").hideFunction();
  let grid2 = cf.Grid()
      .top(tomMargin)
      .right(45)
      .bottom(35)
      .left(40);

  cf.provider("local")
      .source("realtor_monthly_inventory_zip_all")
      .groupby(group1)
      .metrics(metric1)
      .staticFilters(filterZipcode)
      .clientFilters(timeFilter)
      .graph("Trend")
      .set("grid", grid2)
      .set("color", color)
      .set("axisLabels", false)
      .set("xAxis", { "labelGap": 30 })
      .set("dataZoom", false)
      .element("cf-median-listing-price-trend-by-zipcode")
      .execute();

  // ************ Median Days on Market Trend by Zipcode ************ //
  let metricMedianDaysOnMarket = cf.Metric("median_days_on_market", "avg");
  let groupMedianDaysOnMarket = cf.Attribute("month_date_yyyymm")
      .func("MONTH")
      .limit(1000)
      .sort("asc", "month_date_yyyymm");

  let gridMedianDaysOnMarket = cf.Grid()
      .top(tomMargin)
      .right(45)
      .bottom(35)
      .left(40);
  let colorMedianDaysOnMarket = cf.Color()
      .palette(["#0095b7", "#a0b774", "#f4c658", "#fe8b3e", "#cf2f23", "#756c56", "#007896", "#47a694", "#f9a94b", "#ff6b30", "#e94d29", "#005b76"]);

  cf.provider("local")
      .source("realtor_monthly_inventory_zip_all")
      .groupby(groupMedianDaysOnMarket)
      .metrics(metricMedianDaysOnMarket)
      .staticFilters(filterZipcode)
      .clientFilters(timeFilter)
      .graph("Trend")
      .set("grid", gridMedianDaysOnMarket)
      .set("color", colorMedianDaysOnMarket)
      .set("axisLabels", false)
      .set("xAxis", { "labelGap": 30 })
      .set("dataZoom", false)
      .element("cf-median-days-market-by-zipcode")
      .execute();
}

async function trendsByZipcode2(zipcode) {
  let provider = cf.provider("local");
  let source = provider.source("realtor_monthly_inventory_zip_all");
  let filterZipcode = cf.Filter("postal_code")
      .label("Postal code")
      .operation("IN")
      .value([zipcode]);
  const minmaxQuery = await cf.provider("local")
      .source("realtor_monthly_inventory_zip_all")
      .staticFilters(filterZipcode)
      .timeField(cf.Attribute("month_date_yyyymm").func('DAY'))
      .set('timeRangeVisual', true)
      .element(`mimmaxquery-2`)
      .execute();

  const { min, max } = await minmaxQuery.data[0];
  const { firstDay, lastDay } = window.getFirstLastDayMonth(max);
  let timeFilter = cf.Filter("month_date_yyyymm")
      .label("Month date yyyymm")
      .operation("BETWEEN")
      .value([`${firstDay} 00:00:00`, `${lastDay}- 23:59:59.999`]);

  // ************ Active Listings Count MM by Zipcode ************ //
  let metricCountMM = cf.Metric("active_listing_count_mm", "avg").hideFunction();
  // Define attributes to group by
  let groupCountMM = cf.Attribute("month_date_yyyymm")
      .func("MONTH")
      .limit(1000)
      .sort("asc", "month_date_yyyymm");
  let gridCountMM = cf.Grid()
      .top(tomMargin)
      .right(45)
      .bottom(35)
      .left(40);
  let colorCountMM = cf.Color()
      .palette(["#0095b7", "#a0b774", "#f4c658", "#fe8b3e", "#cf2f23", "#756c56", "#007896", "#47a694", "#f9a94b", "#ff6b30", "#e94d29", "#005b76"]);

  cf.provider("local")
      .source("realtor_monthly_inventory_zip_all")
      .groupby(groupCountMM)
      .metrics(metricCountMM)
      .staticFilters(filterZipcode)
      .clientFilters(timeFilter)
      .graph("Trend")
      .set("grid", gridCountMM)
      .set("color", colorCountMM)
      .set("axisLabels", false)
      .set("xAxis", { "labelGap": 30 })
      .set("dataZoom", false)
      .element("cf-listings-mm-by-zipcode")
      .execute();

  // ************ Active Listings Count YY by Zipcode ************ //
  let metricCountYy = cf.Metric("active_listing_count_yy", "avg").hideFunction();
  // Define attributes to group by
  let groupCountYy = cf.Attribute("month_date_yyyymm")
      .func("MONTH")
      .limit(1000)
      .sort("asc", "month_date_yyyymm");
  // Define Grid
  let gridCountYy = cf.Grid()
      .top(tomMargin)
      .right(45)
      .bottom(35)
      .left(40);
  // Define Color Palette
  let colorCountYy = cf.Color()
      .palette(["#0095b7", "#a0b774", "#f4c658", "#fe8b3e", "#cf2f23", "#756c56", "#007896", "#47a694", "#f9a94b", "#ff6b30", "#e94d29", "#005b76"]);
  cf.provider("local")
      .source("realtor_monthly_inventory_zip_all")
      .groupby(groupCountYy)
      .metrics(metricCountYy)
      .staticFilters(filterZipcode)
      .clientFilters(timeFilter)
      .graph("Trend")
      .set("grid", gridCountYy)
      .set("color", colorCountYy)
      .set("axisLabels", false)
      .set("xAxis", { "labelGap": 30 })
      .set("dataZoom", false)
      .element("cf-listings-yy-by-zipcode")
      .execute();

  // ************ Avg Listing Price by Zipcode ************ //
  let metricAvgPrice = cf.Metric("average_listing_price", "avg").hideFunction();
  // Define attributes to group by
  let groupAvgPrice = cf.Attribute("month_date_yyyymm")
      .func("MONTH")
      .limit(1000)
      .sort("asc", "month_date_yyyymm");
  // Define Grid
  let gridAvgPrice = cf.Grid()
      .top(tomMargin)
      .right(45)
      .bottom(35)
      .left(40);
  // Define Color Palette
  let colorAvgPrice = cf.Color()
      .palette(["#0095b7", "#a0b774", "#f4c658", "#fe8b3e", "#cf2f23", "#756c56", "#007896", "#47a694", "#f9a94b", "#ff6b30", "#e94d29", "#005b76"]);
  cf.provider("local")
      .source("realtor_monthly_inventory_zip_all")
      .groupby(groupAvgPrice)
      .metrics(metricAvgPrice)
      .staticFilters(filterZipcode)
      .clientFilters(timeFilter)
      .graph("Trend")
      .set("grid", gridAvgPrice)
      .set("color", colorAvgPrice)
      .set("axisLabels", false)
      .set("xAxis", { "labelGap": 30 })
      .set("dataZoom", false)
      .element("cf-avg-price-by-zipcode")
      .execute();
}

async function trendsByZipcode3(zipcode) {
  let provider = cf.provider("local");
  let source = provider.source("realtor_monthly_inventory_zip_all");
  let filterZipcode = cf.Filter("postal_code")
      .label("Postal code")
      .operation("IN")
      .value([zipcode]);
  const minmaxQuery = await cf.provider("local")
      .source("realtor_monthly_inventory_zip_all")
      .staticFilters(filterZipcode)
      .timeField(cf.Attribute("month_date_yyyymm").func('DAY'))
      .set('timeRangeVisual', true)
      .element(`mimmaxquery-3`)
      .execute();

  const { min, max } = await minmaxQuery.data[0];
  const { firstDay, lastDay } = window.getFirstLastDayMonth(max);
  let timeFilter = cf.Filter("month_date_yyyymm")
      .label("Month date yyyymm")
      .operation("BETWEEN")
      .value([`${firstDay} 00:00:00`, `${lastDay}- 23:59:59.999`]);

  // ************ Avg Listing Price MM by Zipcode ************ //
  let metricAvgMm = cf.Metric("average_listing_price_mm", "avg").hideFunction();
  // Define attributes to group by
  let groupAvgMm = cf.Attribute("month_date_yyyymm")
      .func("MONTH")
      .limit(1000)
      .sort("asc", "month_date_yyyymm");

  // Define Grid
  let gridAvgMm = cf.Grid()
      .top(tomMargin)
      .right(45)
      .bottom(35)
      .left(40);
  // Define Color Palette
  let colorAvgMm = cf.Color()
      .palette(["#0095b7", "#a0b774", "#f4c658", "#fe8b3e", "#cf2f23", "#756c56", "#007896", "#47a694", "#f9a94b", "#ff6b30", "#e94d29", "#005b76"]);

  cf.provider("local")
      .source("realtor_monthly_inventory_zip_all")
      .groupby(groupAvgMm)
      .metrics(metricAvgMm)
      .staticFilters(filterZipcode)
      .clientFilters(timeFilter)
      .graph("Trend")
      .set("grid", gridAvgMm)
      .set("color", colorAvgMm)
      .set("axisLabels", false)
      .set("xAxis", { "labelGap": 30 })
      .set("dataZoom", false)
      .element("cf-avg-price-mm-by-zipcode")
      .execute();

  // ************ Avg Listing Price YY by Zipcode ************ //
  let metricAvgYy = cf.Metric("average_listing_price_yy", "avg").hideFunction();
  // Define attributes to group by
  let groupAvgYy = cf.Attribute("month_date_yyyymm")
      .func("MONTH")
      .limit(1000)
      .sort("asc", "month_date_yyyymm");

  // Define Grid
  let gridAvgYy = cf.Grid()
      .top(tomMargin)
      .right(45)
      .bottom(35)
      .left(40);
  // Define Color Palette
  let colorAvgYy = cf.Color()
      .palette(["#0095b7", "#a0b774", "#f4c658", "#fe8b3e", "#cf2f23", "#756c56", "#007896", "#47a694", "#f9a94b", "#ff6b30", "#e94d29", "#005b76"]);

  cf.provider("local")
      .source("realtor_monthly_inventory_zip_all")
      .groupby(groupAvgYy)
      .metrics(metricAvgYy)
      .staticFilters(filterZipcode)
      .clientFilters(timeFilter)
      .graph("Trend")
      .set("grid", gridAvgYy)
      .set("color", colorAvgYy)
      .set("axisLabels", false)
      .set("xAxis", { "labelGap": 30 })
      .set("dataZoom", false)
      .element("cf-avg-price-yy-by-zipcode")
      .execute();

  // ************ Median Square Feet by Zipcode ************ //
  let metricMediansf = cf.Metric("median_square_feet", "avg").hideFunction();
  // Define attributes to group by
  let groupMediansf = cf.Attribute("month_date_yyyymm")
      .func("MONTH")
      .limit(1000)
      .sort("asc", "month_date_yyyymm");

  // Define Grid
  let gridMediansf = cf.Grid()
      .top(tomMargin)
      .right(45)
      .bottom(35)
      .left(40);
  // Define Color Palette
  let colorMediansf = cf.Color()
      .palette(["#0095b7", "#a0b774", "#f4c658", "#fe8b3e", "#cf2f23", "#756c56", "#007896", "#47a694", "#f9a94b", "#ff6b30", "#e94d29", "#005b76"]);

  cf.provider("local")
      .source("realtor_monthly_inventory_zip_all")
      .groupby(groupMediansf)
      .metrics(metricMediansf)
      .staticFilters(filterZipcode)
      .clientFilters(timeFilter)
      .graph("Trend")
      .set("grid", gridMediansf)
      .set("color", colorMediansf)
      .set("axisLabels", false)
      .set("xAxis", { "labelGap": 30 })
      .set("dataZoom", false)
      .element("cf-median-square-feet-by-zipcode")
      .execute();
}

async function trendsByZipcode4(zipcode) {
  let provider = cf.provider("local");
  let source = provider.source("realtor_monthly_inventory_zip_all");
  let filterZipcode = cf.Filter("postal_code")
      .label("Postal code")
      .operation("IN")
      .value([zipcode]);
  const minmaxQuery = await cf.provider("local")
      .source("realtor_monthly_inventory_zip_all")
      .staticFilters(filterZipcode)
      .timeField(cf.Attribute("month_date_yyyymm").func('DAY'))
      .set('timeRangeVisual', true)
      .element(`mimmaxquery-4`)
      .execute();

  const { min, max } = await minmaxQuery.data[0];
  const { firstDay, lastDay } = window.getFirstLastDayMonth(max);
  let timeFilter = cf.Filter("month_date_yyyymm")
      .label("Month date yyyymm")
      .operation("BETWEEN")
      .value([`${firstDay} 00:00:00`, `${lastDay}- 23:59:59.999`]);

  // ************ Median Days on Market MM by Zipcode ************ //
  let metricMedianDaysOnMarketMm = cf.Metric("median_days_on_market_mm", "avg");
  let groupMedianDaysOnMarketMm = cf.Attribute("month_date_yyyymm")
      .func("MONTH")
      .limit(1000)
      .sort("asc", "month_date_yyyymm");

  let gridMedianDaysOnMarketMm = cf.Grid()
      .top(tomMargin)
      .right(45)
      .bottom(35)
      .left(40);
  let colorMedianDaysOnMarketMm = cf.Color()
      .palette(["#0095b7", "#a0b774", "#f4c658", "#fe8b3e", "#cf2f23", "#756c56", "#007896", "#47a694", "#f9a94b", "#ff6b30", "#e94d29", "#005b76"]);

  cf.provider("local")
      .source("realtor_monthly_inventory_zip_all")
      .groupby(groupMedianDaysOnMarketMm)
      .metrics(metricMedianDaysOnMarketMm)
      .staticFilters(filterZipcode)
      .clientFilters(timeFilter)
      .graph("Trend")
      .set("grid", gridMedianDaysOnMarketMm)
      .set("color", colorMedianDaysOnMarketMm)
      .set("axisLabels", false)
      .set("xAxis", { "labelGap": 30 })
      .set("dataZoom", false)
      .element("cf-median-days-market-mm-by-zipcode")
      .execute();

  // ************ Median Days on Market MM by Zipcode ************ //
  let metricMedianDaysOnMarketYy = cf.Metric("median_days_on_market_yy", "avg");
  let groupMedianDaysOnMarketYy = cf.Attribute("month_date_yyyymm")
      .func("MONTH")
      .limit(1000)
      .sort("asc", "month_date_yyyymm");

  let gridMedianDaysOnMarketYy = cf.Grid()
      .top(tomMargin)
      .right(45)
      .bottom(35)
      .left(40);
  let colorMedianDaysOnMarketYy = cf.Color()
      .palette(["#0095b7", "#a0b774", "#f4c658", "#fe8b3e", "#cf2f23", "#756c56", "#007896", "#47a694", "#f9a94b", "#ff6b30", "#e94d29", "#005b76"]);

  cf.provider("local")
      .source("realtor_monthly_inventory_zip_all")
      .groupby(groupMedianDaysOnMarketYy)
      .metrics(metricMedianDaysOnMarketYy)
      .staticFilters(filterZipcode)
      .clientFilters(timeFilter)
      .graph("Trend")
      .set("grid", gridMedianDaysOnMarketYy)
      .set("color", colorMedianDaysOnMarketYy)
      .set("axisLabels", false)
      .set("xAxis", { "labelGap": 30 })
      .set("dataZoom", false)
      .element("cf-median-days-market-yy-by-zipcode")
      .execute();
}

function dataArrayToObject(data) {
  let result = data.reduce((acc, item) => {
    let element = item.definition.element;
    acc[element] = item.data.reduce((subAcc, subItem) => {
      subAcc[subItem.group[0]] = subItem.current.count;
      return subAcc;
    }, {});
    return acc;
  }, {});

  return result;
}

function loadTopHostsTable() {
  const elementId = "cf-top-hosts";
  cf.provider('local')
      .source('abnb_listings')
      .groupby(cf.Attribute("host_name").limit(50).sort("desc", cf.Metric()))
      .metrics(cf.Metric())
      .staticFilters(window.boundaryFilter)
      .on('execute:stop', async result => {
        const tableData = result.data.map(d => ({host: d.group[0], listings: d.current.count}))
        const hostsFilter = cf.Filter("host_name")
            .operation("IN")
            .value(tableData.map(td => td.host));

        let entireHomeFilter = cf.Filter("property_type")
            .operation("IN")
            .value(["Entire bungalow", "Entire cabin", "Entire condo", "Entire chalet", "Entire cottage", "Entire guest suite", "Entire guesthouse", "Entire home", "Entire home/apt", "Entire loft", "Entire place", "Entire rental unit", "Entire serviced apartment", "Entire townhouse", "Entire vacation home", "Entire villa"]);
        let privateRoomFilter = cf.Filter("property_type")
            .operation("IN")
            .value(["Private room", "Private room in barn", "Private room in bed and breakfast", "Private room in boat", "Private room in bungalow", "Private room in camper/rv", "Private room in casa particular", "Private room in castle", "Private room in chalet", "Private room in condo", "Private room in cottage", "Private room in dorm", "Private room in earthen home", "Private room in farm stay", "Private room in guest suite", "Private room in guesthouse", "Private room in hostel", "Private room in home", "Private room in in-law", "Private room in island", "Private room in kezhan", "Private room in lighthouse", "Private room in loft", "Private room in minsu", "Private room in ranch", "Private room in religious building", "Private room in rental unit", "Private room in resort", "Private room in serviced apartment", "Private room in tent", "Private room in tiny home", "Private room in townhouse", "Private room in train", "Private room in vacation home", "Private room in villa"]);
        let sharedRoomFilter = cf.Filter("property_type")
            .operation("IN")
            .value(["Shared room", "Shared room in bed and breakfast", "Shared room in bungalow", "Shared room in casa particular", "Shared room in condo", "Shared room in floor", "Shared room in guest suite", "Shared room in guesthouse", "Shared room in home", "Shared room in hostel", "Shared room in hotel", "Shared room in loft", "Shared room in rental unit", "Shared room in serviced apartment", "Shared room in townhouse", "Shared room in vacation home"]);
        let hoteRoomFilter = cf.Filter("property_type")
            .operation("IN")
            .value(["Room in aparthotel", "Room in boutique hotel", "Room in hotel"]);


        const entireHomeQuery = cf.provider('local')
            .source('abnb_listings')
            .groupby(cf.Attribute("host_name").limit(50).sort("desc", cf.Metric()))
            .staticFilters(window.boundaryFilter, hostsFilter, entireHomeFilter)
            .metrics(cf.Metric())
            .element('entireHomeQuery')
            .execute();
        const privateRoomQuery = cf.provider('local')
            .source('abnb_listings')
            .groupby(cf.Attribute("host_name").limit(50).sort("desc", cf.Metric()))
            .staticFilters(window.boundaryFilter, hostsFilter, privateRoomFilter)
            .metrics(cf.Metric())
            .element('privateRoomQuery')
            .execute();
        const sharedRoomQuery = cf.provider('local')
            .source('abnb_listings')
            .groupby(cf.Attribute("host_name").limit(50).sort("desc", cf.Metric()))
            .staticFilters(window.boundaryFilter, hostsFilter, sharedRoomFilter)
            .metrics(cf.Metric())
            .element('sharedRoomQuery')
            .execute();
        const hotelRoomQuery = cf.provider('local')
            .source('abnb_listings')
            .groupby(cf.Attribute("host_name").limit(50).sort("desc", cf.Metric()))
            .staticFilters(window.boundaryFilter, hostsFilter, hoteRoomFilter)
            .metrics(cf.Metric())
            .element('hotelRoomQuery')
            .execute();

        const allData = await Promise.all([entireHomeQuery, privateRoomQuery, sharedRoomQuery, hotelRoomQuery]);
        const objData = dataArrayToObject(allData);

        cf.remove('entireHomeQuery');
        cf.remove('privateRoomQuery');
        cf.remove('sharedRoomQuery');
        cf.remove('hotelRoomQuery');

        tableData.forEach(td => {
          td.entireHome = objData.entireHomeQuery[td.host] ? objData.entireHomeQuery[td.host] : 0;
          td.privateRoom = objData.privateRoomQuery[td.host] ? objData.privateRoomQuery[td.host] : 0;
          td.sharedRoom = objData.sharedRoomQuery[td.host] ? objData.sharedRoomQuery[td.host] : 0;
          td.hotelRoom = objData.hotelRoomQuery[td.host] ? objData.hotelRoomQuery[td.host] : 0;
        });

        const hostsTableHTML = createHostsTable(tableData);
        $(`#${elementId}`).html(hostsTableHTML);

        const dataCells = document.querySelectorAll('.data-row td');
        dataCells.forEach(cell => cell.addEventListener('click', onCellClick));
        makeTableSortable();
      })
      .element('top-host-queries')
      .execute();
}

function loadShortTermRentals() {
  const elementId = "cf-short-term-rentals";
  try {
    const elementId = 'cf-short-term-rentals';
    let provider = cf.provider("local");
    let source = provider.source("abnb_listings");

    let metric0 = cf.Metric("count");

    let group1 = cf.Attribute("minimum_nights_d")
        .limit(1000)
        .sort("asc", "minimum_nights_d");

    let myData = source.groupby(group1)
        .metrics(metric0);

    let grid = cf.Grid()
        .top(10)
        .right(15)
        .bottom(35)
        .left(65);

    let color = cf.Color()
        .theme({
          background: "rgba(0,0,0,0)",
          font: "black"
        })
        .palette(["#0095b7"]);
    myData.staticFilters(window.boundaryFilter);

    let lines = cf.MarkLine()
        .data([
          { "name": "Value", "xAxis": 28, "label": {formatter: () => "STR Threshold"}, "lineStyle": {type: 'dashed'} }
        ]);

    myData.graph("Bars")
        .set("grid", grid)
        .set("markline", lines)
        .set("xAxis", { "show": true, "lines": false })
        .set("yAxis", { "text": "out", "lines": false })
        .set('staticValues', ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '+35'])
        .set("color", color)
        .set("dataZoom", "dragFilter")
        .element(elementId)
        .execute();
  } catch (ex) {
    console.error(ex);
    handleError(elementId, ex);
  }
}

function loadShortTermRentalsStatistics() {
  try {
    cf.provider('local')
        .source('abnb_listings')
        .staticFilters(window.boundaryFilter, cf.Filter("minimum_nights")
            .operation("LT")
            .value([30]))
        .metrics(cf.Metric())
        .on("execute:stop", async (strQ) => {
          const imFilters = cf.getIManager().get('api').getFilters();
          const ltrQ = await cf.provider('local')
              .source('abnb_listings')
              .filters(imFilters)
              .staticFilters(window.boundaryFilter, cf.Filter("minimum_nights")
                  .operation("GT")
                  .value([29]))
              .metrics(cf.Metric())
              .element('long-term-rentals-statistics')
              .execute();

          let data = ltrQ.data;
          let longTermRentals = data[0].current.count;
          let dataShort = strQ.data;
          let shortTermRentals = dataShort[0].current.count;

          let statisticsObj1 = {
            count: shortTermRentals,
            rate: shortTermRentals / (shortTermRentals + longTermRentals) * 100,
          }
          let statisticsObj2 = {
            count: longTermRentals,
            rate: longTermRentals / (shortTermRentals + longTermRentals) * 100,
          }

          animateValue(document.getElementById('short-term-val'), statisticsObj1.count, formatCount, true);
          animateValue(document.getElementById('short-term-prct-val'), statisticsObj1.rate, formatRate, true);

          animateValue(document.getElementById('longer-term-val'), statisticsObj2.count, formatCount, true);
          animateValue(document.getElementById('longer-term-prct-val'), statisticsObj2.rate, formatRate, true);
          cf.remove('long-term-rentals-statistics');
        })
        .element('short-term-rentals-statistics')
        .execute();
  } catch (ex) {
    console.error(ex);
    handleError(elementId, ex);
  }
}

function loadTotalListingsCount() {
  cf.provider('local')
      .source('abnb_listings')
      .staticFilters(window.boundaryFilter)
      .metrics(cf.Metric())
      .element('total-listings-count')
      .on('execute:stop', data => {
        const count = data.data[0].current.count;

        animateValue(document.getElementById('total-rooms-val'), count, formatCount, true);
      })
      .execute();
}
