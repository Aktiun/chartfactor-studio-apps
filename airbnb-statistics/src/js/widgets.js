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
      [viz4]: { clientFilters: true },
      [viz5]: { clientFilters: true }
    };
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

function loadGeomap() {
  // const elementId = "vis08e89f59-a0f3-4a17-9a6e-92fdbc6d92ee";
  const elementId = "cf-main-geomap"
  try {
    // Interaction Manager uses filter(), filters(), clientFilter(),
    // and clientFilters() to manage filters. To apply additional
    // filters, use staticFilters() or your code could be overwritten.
    //
    /* Configuration code for this widget */
    const myTooltip = data => {
      return getTooltipCardHtml(data);
      // return `<img style="width: 200px" src=${data[6].value} alt="picture" />`;
    };

    let myChart = cf
      .create()
      .graph("Geo Map GL")
      .set("layers", [
        {
          name: "hosts",
          priority: 3,
          type: "marker",
          provider: "local",
          source: "abnb_listings",
          properties: {
            limit: 10000,
            color: cf
              .Color()
              .palette([
                "#253494",
                "#2c7fb8",
                "#41b6c4",
                "#7fcdbb",
                "#c7e9b4",
                "#ffffcc"
              ])
              .metric(cf.Metric()),
            ignoreCoords: [0, 0],
            showLocation: false,
            disableMarkerEvents: false,
            maxSpiderifyMarkers: 100,
            allowClickInRawMarker: false,
            location: "location",
            visibilityZoomRange: [11, 24],
            precisionLevels: null,
            fields: ["name", "host_name", "bedrooms", "beds", "price", "picture_url", "number_of_reviews", "review_scores_value", "minimum_nights", "zipcode", "is_usa", "host_name", "host_url", "listing_url"],
            "customTooltip": myTooltip,
          }
        },
        {
          name: "heatmap",
          priority: 2,
          type: "heatmap",
          provider: "local",
          source: "abnb_listings",
          properties: {
            limit: 10000,
            location: "location",
            visibilityZoomRange: [0, 11],
            options: {
              "heatmap-weight": [
                "interpolate",
                ["linear"],
                ["get", "__cf_cluster_count_percent__"],
                1,
                0.2,
                80,
                85
              ],
              "heatmap-radius": [
                "interpolate",
                ["linear"],
                ["get", "__cf_cluster_count_percent__"],
                1,
                3,
                20,
                5,
                80,
                10
              ],
              "heatmap-intensity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                5,
                1,
                18,
                6
              ],
              "heatmap-color": [
                "interpolate",
                ["linear"],
                ["heatmap-density"],
                0,
                "rgba(0, 0, 255, 0)",
                0.1,
                "royalblue",
                0.3,
                "cyan",
                0.5,
                "lime",
                0.7,
                "yellow",
                1,
                "red"
              ],
              switchToMarkersAtRaw: true
            },
            precisionLevels: {
              raw: { zoom: 18, fields: [] },
              levels: [
                { zoom: 2, precision: 3 },
                { zoom: 4, precision: 5 },
                { zoom: 6, precision: 6 },
                { zoom: 10, precision: 7 },
                { zoom: 14, precision: 8 },
                { zoom: 17, precision: 9 }
              ]
            },
            color: cf
              .Color()
              .palette([
                "#a50026",
                "#d73027",
                "#f46d43",
                "#fdae61",
                "#fee090"
              ])
              .metric(cf.Metric())
          }
        },
        {
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
      .set("zoom", 15)
      .set("center", [-73.84875467114972, 40.77680058764247])
      .set("drawControl", true)
      .set("enableZoomInfo", true)
      .set("layersControl", false)
      .set('minZoom', 2.5)
      .element(elementId)
      .on("notification", e => {
        window.toast({
          message: e.message,
          type: e.type
        });
      })
      .on("geo:layers-execution-start", e =>
        window.toggleIndicator(e.element, true)
      )
      .on("geo:layers-execution-stop", e =>
        window.toggleIndicator(e.element, false)
      )
      .on("execute:start", e => window.toggleIndicator(e.element, true))
      .on("execute:stop", e => {
        window.toggleIndicator(e.element, false);
        let aktiveMap = cf.getVisualization("cf-main-geomap");
        let geoMap = aktiveMap.get("map");
        geoMap.on("zoomend", (e) => {
          // console.log("zoomend **********");
          updateBnBBoundsFilter();
        });
        geoMap.on("moveend", () => {
          // console.log("moveend **********");
          updateBnBBoundsFilter();
        });
        geoMap.on("dragend", () => {
          // console.log("dragend **********");
          updateBnBBoundsFilter();
        });
        //let hostsLayer = cf.getVisualization("cf-main-geomap-hosts");
        geoMap.on("click", "hosts_image_layer", (e) => {
          let markerData = JSON.parse(e.features[0].properties.__cf_data__);
          if (markerData.is_usa === "false") return;
          showInvestorModal();
          kpiByZipcode(markerData.zipcode);
          trendsByZipcode(markerData.zipcode);
          trendsByZipcode2(markerData.zipcode);
          trendsByZipcode3(markerData.zipcode);
          trendsByZipcode4(markerData.zipcode);
          trendsByZipcode5(markerData.zipcode);

          let propertyTitle = `<a href="${markerData.host_url}" target="_blank">${markerData.host_name}'s</a> Place`;
          let propertyDetails = createListingCard(markerData);
          $("#property-name").html(propertyTitle);
          $("#cf-property-details-features").html(propertyDetails);
          $("#trends-zipcode").text(markerData.zipcode);

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
      });
  } catch (ex) {
    console.error(ex);
    handleError(elementId, ex);
  }
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
      .top(0)
      .right(5)
      .bottom(0)
      .left(0);
    // Define Color Palette
    let color = cf.Color()
      // .theme({ background:'rgb(255 255 255 / 80%)', font: 'black' })
      .palette(["#ff0000", "#ff8000", "#6437db", "#478509", "#00ff00", "#00ff80", "#00ffff", "#0080ff", "#0000ff", "#8000ff", "#ff00ff", "#ff0080"]);
    let myChart = myData.graph("Bars")
      .set("grid", grid)
      .set("color", color)
      .set("orientation", "horizontal")
      .set("axisLabels", false)
      .set("xAxis", { "show": true, "lines": false })
      .set("yAxis", { "text": "out", "lines": false })
      .set("dataZoom", false)
      .set("serieLabel", {
        "show": true,
        "fontWeight": "bold"
      })
      .on("execute:stop", () => {

        let chart = cf.getVisualization("cf-roomType");
        let data = chart.get("data");

        let roomTypes = ["Entire home/apt", "Private room", "Shared room", "Hotel room"];

        let element1 = data[0];
        let element2 = data.length > 1 ? data[1] : undefined;
        let element3 = data.length > 2 ? data[2] : undefined;
        let element4 = data.length > 3 ? data[3] : undefined;

        let element1Clean = element1 ? {
          count: element1.current.count,
          rate: element1.current.metrics.rate.count,
          description: element1.group[0]
        } : getZeroCleanedData();
        let element2Clean = element2 ? {
          count: element2.current.count,
          rate: element2.current.metrics.rate.count,
          description: element2.group[0]
        } : getZeroCleanedData();
        let element3Clean = element3 ? {
          count: element3.current.count,
          rate: element3.current.metrics.rate.count,
          description: element3.group[0]
        } : getZeroCleanedData();
        let element4Clean = element4 ? {
          count: element4.current.count,
          rate: element4.current.metrics.rate.count,
          description: element4.group[0]
        } : getZeroCleanedData();

        let notFirstElementClean = [element2Clean, element3Clean, element4Clean];
        let descriptionsAssigned = new Set();
        notFirstElementClean.map((element, index) => {
          if (element.description === "") {
            let availableDescriptions = roomTypes.filter(type =>
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

        var htmlString = buildHtmlStringRoomtype(element1Clean, element2Clean, element3Clean, element4Clean);
        document.getElementById("cf-roomType-statistics").innerHTML = htmlString;
        animateValue(document.getElementById('element1Percentage'), element1Clean.rate, formatRate);
        animateBothValues(
          document.getElementById('element1Count'),
          element1Clean.count,
          document.getElementById('element1Rate'),
          element1Clean.rate
        );
        animateBothValues(
          document.getElementById('element2Count'),
          element2Clean.count,
          document.getElementById('element2Rate'),
          element2Clean.rate
        );
        animateBothValues(
          document.getElementById('element3Count'),
          element3Clean.count,
          document.getElementById('element3Rate'),
          element3Clean.rate
        );
        animateBothValues(
          document.getElementById('element4Count'),
          element4Clean.count,
          document.getElementById('element4Rate'),
          element4Clean.rate
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
    let staticFilter1 = cf.Filter("income_ltm")
      .label("income_ltm")
      .operation("GE,LT")
      .value([0, 46278]); // Interaction Manager uses filter(), filters(), clientFilter(),
    // and clientFilters() to manage filters. To apply additional
    // filters, use staticFilters() or your code could be overwritten.
    //
    /* Configuration code for this widget */
    let provider = cf.provider("local");
    let source = provider.source("abnb_listings");
    // Define metrics
    let metric0 = cf.Metric("income_ltm", "histogram").fixedBars(6)
      .offset(0)
      .showEmptyIntervals(false);
    // Add metrics and groups to data source
    let myData = source
      .metrics(metric0)
      .limit(100);
    // Define Color Palette
    let color = cf.Color()
      .palette(["#0095b7", "#a0b774", "#f4c658", "#fe8b3e", "#cf2f23", "#756c56", "#007896", "#47a694", "#f9a94b", "#ff6b30", "#e94d29", "#005b76"]);
    myData.staticFilters(staticFilter1);
    // --- Define chart options and static filters ---
    let myChart = myData.graph("Histogram")
      .set("color", color)
      .set("yAxis", { "type": "log", "lines": false })
      .on("execute:stop", () => {
        let chart = cf.getVisualization("cf-activity");
        let data = chart.get("data");
        let element1 = data[0];

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
      .filter(cf.Filter("host_total_listings_count")
        .label("host_total_listings_count")
        .operation("NOT IN")
        .value([0, 1]))
      .metrics(cf.Metric("estimated_occupied_time", "avg"), cf.Metric("availability_365", "avg"))
      .create('Query2')
      .provider('local')
      .source('abnb_listings')
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
        let avgPriceHtmlString = buildHtmlStringAvgPrice(avgPrice);

        let avgNightsHtmlString = buildHtmlStringAvgNights(avgNights);
        document.getElementById("cf-avg-nights").innerHTML = avgNightsHtmlString;
        animateValue(document.getElementById('avgNights'), avgNights, formatCount);

        let avgIncome = avgPrice * avgNights;
        let avgIncomeHtmlString = buildHtmlStringAvgIncome(avgIncome);

        document.getElementById("cf-avg-price").innerHTML = avgPriceHtmlString;
        document.getElementById("cf-avg-income").innerHTML = avgIncomeHtmlString;
        animateValue(document.getElementById('avgPrice'), avgPrice, formatCurrency);
        animateValue(document.getElementById('avgIncome'), avgIncome, formatCurrency);
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
    let metric1 = cf.CompareMetric("count", "").rate().label("Rate");
    // Define attributes to group by
    let group1 = cf.Attribute("license")
      .limit(10)
      .sort("desc", cf.Metric());
    // Add metrics and groups to data source
    let myData = source.groupby(group1)
      .metrics(metric0, metric1);
    // --- Define chart options and static filters ---
    let legend = cf.Legend()
      .position("right")
      .width(100)
      .height(150)
      .sort("none");
    // Define Grid
    let grid = cf.Grid()
      .top(0)
      .right(0)
      .bottom(0)
      .left(0);
    // Define Color Palette
    let color = cf.Color()
      .palette(["#0095b7", "#a0b774", "#f4c658", "#fe8b3e", "#cf2f23", "#756c56", "#007896", "#47a694", "#f9a94b", "#ff6b30", "#e94d29", "#005b76"]); let myChart = myData.graph("Donut")
        .set("legend", legend)
        .set("grid", grid)
        .set("color", color)
        .set("orientation", "horizontal")
        .set("xAxis", { "show": true, "lines": true })
        .set("yAxis", { "text": "out" })
        .set("labelPosition", "inside")
        .set("metricValue", false)
        .on("execute:stop", () => {
          let chart = cf.getVisualization("cf-licenses");
          let data = chart.get("data");
          let element1 = data[0];
          let element2 = data.length > 1 ? data[1] : undefined;
          let element3 = data.length > 2 ? data[2] : undefined;
          let element4 = data.length > 3 ? data[3] : undefined;
          let element1Clean = element1 ? {
            count: element1.current.count,
            rate: element1.current.metrics.rate.count,
            description: element1.group[0]
          } : getZeroCleanedData();
          let element2Clean = element2 ? {
            count: element2.current.count,
            rate: element2.current.metrics.rate.count,
            description: element2.group[0]
          } : getZeroCleanedData();
          let element3Clean = element3 ? {
            count: element3.current.count,
            rate: element3.current.metrics.rate.count,
            description: element3.group[0]
          } : getZeroCleanedData();
          let element4Clean = element4 ? {
            count: element4.current.count,
            rate: element4.current.metrics.rate.count,
            description: element4.group[0]
          } : getZeroCleanedData();

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

          var htmlString = buildHtmlStringLicenses(element1Clean, element2Clean, element3Clean, element4Clean);
          document.getElementById("cf-licenses-statistics").innerHTML = htmlString;
          animateValue(document.getElementById('element1LicensePercentage'), element1Clean.rate, formatRate);
          animateBothValues(
            document.getElementById('element1LicenseCount'),
            element1Clean.count,
            document.getElementById('element1LicenseRate'),
            element1Clean.rate
          );
          animateBothValues(
            document.getElementById('element2LicenseCount'),
            element2Clean.count,
            document.getElementById('element2LicenseRate'),
            element2Clean.rate
          );
          animateBothValues(
            document.getElementById('element3LicenseCount'),
            element3Clean.count,
            document.getElementById('element3LicenseRate'),
            element3Clean.rate
          );
          animateBothValues(
            document.getElementById('element4LicenseCount'),
            element4Clean.count,
            document.getElementById('element4LicenseRate'),
            element4Clean.rate
          );
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
    let metric0 = cf.Metric("calculated_host_listings_count", "histogram").fixedBars(10)
      .offset(0)
      .showEmptyIntervals(false);
    // Add metrics and groups to data source
    let myData = source
      .metrics(metric0)
      .limit(100);
    // Define Color Palette
    let color = cf.Color()
      .palette(["#1d91c0", "#1d91c0"]);
    // --- Define chart options and static filters ---
    let myChart = myData.graph("Histogram")
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
    cf.create('Query1')
      .provider('local')
      .source('abnb_listings')
      .filter(cf.Filter("host_total_listings_count")
        .label("host_total_listings_count")
        .operation("NOT IN")
        .value([0, 1]))
      .metrics(cf.Metric("host_id", "unique"))
      .create('Query2')
      .provider('local')
      .source('abnb_listings')
      .filter(cf.Filter("host_total_listings_count")
        .label("host_total_listings_count")
        .operation("IN")
        .value([1]))
      .metrics(cf.Metric("host_id", "unique"))
      .processWith(dataHandler)
      .on("execute:stop", (result) => {

        let data = result.data.Query2;
        let hostsWithOneListing = data[0].current.metrics.host_id.unique;

        let dataMulti = result.data.Query1;
        let hostsMultiListings = dataMulti[0].current.metrics.host_id.unique;


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

        var htmlString = buildHtmlStringHostListings(statisticsObj1, statisticsObj2);
        document.getElementById("cf-host-listings-statistics").innerHTML = htmlString;
        animateValue(document.getElementById('element1HostListingsPercentage'), statisticsObj1.rate, formatRate);
        animateBothValues(
          document.getElementById('element1HostListingsCount'),
          statisticsObj1.count,
          document.getElementById('element1HostListingsRate'),
          statisticsObj1.rate
        );
        animateBothValues(
          document.getElementById('element2HostListingsCount'),
          statisticsObj2.count,
          document.getElementById('element2HostListingsRate'),
          statisticsObj2.rate
        );
      })
      .element(elementId)
      .execute()
  } catch (ex) {
    console.error(ex);
    handleError(elementId, ex);
  }
}

function loadTopHosts() {
  const elementId = "cf-top-hosts";
  try {

    // Define metrics
    let metric = new cf.Metric("calculated_host_listings_count_entire_homes", "sum");
    let metric2 = new cf.Metric("calculated_host_listings_count_private_rooms", "sum");
    let metric3 = new cf.Metric("calculated_host_listings_count_shared_rooms", "sum");
    let metric4 = new cf.Metric("calculated_host_listings_count_hotel_rooms", "sum");
    let metric5 = new cf.Metric("calculated_host_listings_count", "sum");

    let group = cf.Attribute("host_name").limit(50).sort("desc", metric5);

    cf.provider("local")
      .source("abnb_listings")
      .groupby(group)
      .metrics(metric, metric2, metric3, metric4, metric5)
      .element("cf-top-hosts-dummy")
      .on("execute:stop", (e) => {
        let data = e.data;
        let topHosts = data.map((host) => {
          return {
            host_name: host.group[0],
            entire_homes: host.current.metrics.calculated_host_listings_count_entire_homes.sum,
            private_rooms: host.current.metrics.calculated_host_listings_count_private_rooms.sum,
            shared_rooms: host.current.metrics.calculated_host_listings_count_shared_rooms.sum,
            hotel_rooms: host.current.metrics.calculated_host_listings_count_hotel_rooms.sum,
            total_listings: host.current.metrics.calculated_host_listings_count.sum
          }
        });
        let topHostsCount = topHosts.length;

        const tableTitle = `Top ${topHostsCount} Hosts in this area`;
        const hostsTableHTML = createHostsTable(topHosts);
        $("#top-hosts-title").text(tableTitle);
        $(`#${elementId}`).html(hostsTableHTML);

        const dataCells = document.querySelectorAll('.data-row td');
        dataCells.forEach(cell => cell.addEventListener('click', onCellClick));
      })
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

        const realtorHtmlLink = ` <a href="https://www.realtor.com/realestateandhomes-search/${zipcode}" target="_blank" class="footer-button"> <span class="button-top-text">REALTOR.COM</span> Go to listings in ${zipcode}</a>`;

        let timestamp = data.data[0] ? data.data[0].current.metrics["@timestamp"].max : undefined;
        let utcDate = timestamp ? new Date(timestamp).toUTCString() : undefined;
        monthName = utcDate ? monthNames[new Date(utcDate).getUTCMonth()] : "";

        $("#month-name").text(monthName);
        $('#cf-active-listings-zipcode').html(values);
        $('#counter-info-zipcode').text(zipcode);
        $('#realtor-link').html(realtorHtmlLink);
      }
    })
    .execute();
}


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
    .top(35)
    .right(15)
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
    .top(50)
    .right(15)
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
    .top(10)
    .right(15)
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
    .top(10)
    .right(15)
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
    .top(10)
    .right(15)
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
    .top(10)
    .right(15)
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
    .top(10)
    .right(15)
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
    .top(10)
    .right(15)
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
    .top(10)
    .right(15)
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
    .top(10)
    .right(15)
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
    .top(10)
    .right(15)
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

async function trendsByZipcode5(zipcode) {
  let filterZipcode = cf.Filter("postal_code")
    .label("Postal code")
    .operation("IN")
    .value([zipcode]);
  const minmaxQuery = await cf.provider("local")
    .source("realtor_monthly_inventory_zip_all")
    .staticFilters(filterZipcode)
    .timeField(cf.Attribute("month_date_yyyymm").func('DAY'))
    .set('timeRangeVisual', true)
    .element(`mimmaxquery-5`)
    .execute();

  const { min, max } = await minmaxQuery.data[0];
  const { firstDay, lastDay } = window.getFirstLastDayMonth(max);
  let timeFilter = cf.Filter("month_date_yyyymm")
    .label("Month date yyyymm")
    .operation("BETWEEN")
    .value([`${firstDay} 00:00:00`, `${lastDay}- 23:59:59.999`]);

  // ************ Median Days on Market MM by Zipcode ************ //
let provider = cf.provider("local");
let source = provider.source("realtor_monthly_inventory_zip_all");
// Define metrics
let metric0 = cf.Metric("active_listing_count_mm", "avg").hideFunction();
// Define attributes to group by
let group1 = cf.Attribute("month_date_yyyymm")
    .func("MONTH")
    .limit(1000)
    .sort("asc", "month_date_yyyymm");
// Add metrics and groups to data source
let myData = source.groupby(group1)
    .metrics(metric0);
// --- Define chart options and static filters ---
// Define Grid
let grid = cf.Grid()
    .top(10)
    .right(25)
    .bottom(35)
    .left(45);
// Define Color Palette
let color = cf.Color()
    .palette(["#0095b7", "#a0b774", "#f4c658", "#fe8b3e", "#cf2f23", "#756c56", "#007896", "#47a694", "#f9a94b", "#ff6b30", "#e94d29", "#005b76"]);
myData.staticFilters(filterZipcode);
myData.clientFilter(timeFilter);
let myChart = myData.graph("Trend")
    .set("grid", grid)
    .set("color", color)
    .set("xAxis", { "labelGap": 30 })
    .set("dataZoom", false)
    .element("cf-listings-mm-by-zipcode2")
    .execute();

let metric1 = cf.Metric("active_listing_count_yy", "avg").hideFunction();
let myData2 = source.groupby(group1)
    .metrics(metric1);
    myData2.staticFilters(filterZipcode);
    myData2.clientFilter(timeFilter);
let myChart2 = myData2.graph("Trend")
    .set("grid", grid)
    .set("color", color)
    .set("xAxis", { "labelGap": 30 })
    .set("dataZoom", false)
    .element("cf-listings-yy-by-zipcode2")
    .execute();

}