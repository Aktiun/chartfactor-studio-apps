const widgetsTitleId = [
    { title: "Filters", id: "im" },
    {
      title: "abnb ny, wdc, jersey",
      id: "cf-main-geomap"
    },
    { title: "bathrooms", id: "visba6d179c-94cb-4f0f-848a-e884f2253c8a" },
    { title: "range filters", id: "vis8ee433d1-85a6-43bb-92da-ccde73f4f184" },
    {
      title: "most popular neighborhoods",
      id: "vis55a44820-f5e8-4a0e-a21a-bd603f05f4dd"
    },
    {
      title: "amenities filter",
      id: "vis0d7f4c9f-e908-4815-941d-2b40d1eafd84"
    },
    {
      title: "price-property",
      id: "visb25d9a87-275a-4adb-ba08-822272131d18"
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

function loadInteractionManager(){
    const elementId = "im";
      try {
        let viz3 = getId("beds");
        let viz2 = getId("amenities price");
        let viz5 = getId("amenities filter");
        let viz1 = getId("most popular neighborhoods");
        let rules1 = {
          [viz3]: { clientFilters: false },
          [viz2]: { clientFilters: false },
          [viz5]: { clientFilters: false },
          [viz1]: { clientFilters: false }
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
            type:"modern",
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

function loadGeomap(){
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
                allowClickInRawMarker: true,
                location: "location",
                visibilityZoomRange: [11, 24],
                precisionLevels: null,
                fields: ["name", "host_name", "bedrooms", "beds", "price", "picture_url", "number_of_reviews", "review_scores_value"],
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
          .set("zoom", 11.05618467083821)
          .set("center", [-73.84875467114972, 40.77680058764247])
          .set("layersControl", {
            collapsed: false,
            position: "bottom-left"
          })
          .set("drawControl", true)
          .set("enableZoomInfo", true)

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
            geoMap.on("zoomend", updateBoundsFilter);
            geoMap.on("moveend", updateBoundsFilter);
            geoMap.on("dragend", updateBoundsFilter);
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

function loadBathroomsHistogram(){
    const elementId = "cf-histo-bathrooms";
      try {
        // Interaction Manager uses filter(), filters(), clientFilter(),
        // and clientFilters() to manage filters. To apply additional
        // filters, use staticFilters() or your code could be overwritten.
        //
        /* Configuration code for this widget */
        let provider = cf.provider("local");
        let source = provider.source("abnb_listings");
        // Define metrics
        let metric0 = cf
          .Metric("bathrooms", "histogram")
          .fixedBars(6)
          .offset(0)
          .showEmptyIntervals(false);
        // Add metrics and groups to data source
        let myData = source.metrics(metric0).limit(100);
        // Define Grid
        let grid = cf
          .Grid()
          .top(10)
          .right(0)
          .bottom(0)
          .left(0);
        // Define Color Palette
        let color = cf
          .Color()
          .palette([
            "#0095b7",
            "#a0b774",
            "#f4c658",
            "#fe8b3e",
            "#cf2f23",
            "#756c56",
            "#007896",
            "#47a694",
            "#f9a94b",
            "#ff6b30",
            "#e94d29",
            "#005b76"
          ]);
        // --- Define chart options and static filters ---
        let myChart = myData
          .graph("Histogram")
          .set("grid", grid)
          .set("color", color)
          .set("xAxis", { position: "bottom" })
          .set("yAxis", { type: "log" })
          .set("serieLabel", {
            show: false
          })

          .element(elementId)
          .on("notification", e => {
            window.toast({
              message: e.message,
              type: e.type
            });
          })
          .on("execute:start", e => window.toggleIndicator(e.element, true))
          .on("execute:stop", e => window.toggleIndicator(e.element, false))
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

function loadRangeFilters(){
    const elementId = "cf-range-filters";
      try {
        // Interaction Manager uses filter(), filters(), clientFilter(),
        // and clientFilters() to manage filters. To apply additional
        // filters, use staticFilters() or your code could be overwritten.
        //
        /* Configuration code for this widget */
        let provider = cf.provider("local");
        let source = provider.source("abnb_listings");
        // Define metrics
        let metrics = [
          cf.Metric("price"),
          cf.Metric("bathrooms"),
          cf.Metric("bedrooms"),
          cf.Metric("beds"),
          cf.Metric("review_scores_value"),
          cf.Metric("reviews_per_month")
        ];
        // Add metrics and groups to data source
        let myData = source.metrics(...metrics);
        // --- Define chart options and static filters ---
        let myChart = myData
          .graph("Range Filter")

          .element(elementId)
          .on("notification", e => {
            window.toast({
              message: e.message,
              type: e.type
            });
          })
          .on("execute:start", e => window.toggleIndicator(e.element, true))
          .on("execute:stop", e => window.toggleIndicator(e.element, false))
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

function loadPopularNeighborhoods(){
    const elementId = "cf-treemap-neighborhoods";
      try {
        let staticFilter1 = cf
          .Filter("neighbourhood")
          .label("neighbourhood")
          .operation("NOT IN")
          .value(["null"]);
        /* Configuration code for this widget */
        let provider = cf.provider("local");
        let source = provider.source("abnb_listings");
        // Define metrics
        let metric0 = cf.Metric("count");
        // Define attributes to group by
        let group1 = cf
          .Attribute("neighbourhood")
          .limit(10)
          .sort("desc", cf.Metric());
        // Add metrics and groups to data source
        let myData = source.groupby(group1).metrics(metric0);
        // --- Define chart options and static filters ---
        // Define Color Palette
        let color = cf
          .Color()
          .palette([
            "#0095b7",
            "#a0b774",
            "#f4c658",
            "#fe8b3e",
            "#cf2f23",
            "#756c56",
            "#007896",
            "#47a694",
            "#f9a94b",
            "#ff6b30",
            "#e94d29",
            "#005b76"
          ]);
        myData.staticFilters(staticFilter1);
        let myChart = myData
          .graph("Tree Map")
          .set("color", color)
          .staticFilters(staticFilter1)

          .element(elementId)
          .on("notification", e => {
            window.toast({
              message: e.message,
              type: e.type
            });
          })
          .on("execute:start", e => window.toggleIndicator(e.element, true))
          .on("execute:stop", e => window.toggleIndicator(e.element, false))
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

function loadAmenitiesFilter(){
    const elementId = "cf-slicer-amenities";
      try {
        // Interaction Manager uses filter(), filters(), clientFilter(),
        // and clientFilters() to manage filters. To apply additional
        // filters, use staticFilters() or your code could be overwritten.
        //
        /* Configuration code for this widget */
        let provider = cf.provider("local");
        let source = provider.source("abnb_listings");
        // Define metrics
        let metric0 = cf.Metric("amenities", "unique");
        // Define attributes to group by
        let group1 = cf.Attribute("amenities_categorized").limit(10000);
        // Add metrics and groups to data source
        let myData = source.groupby(group1).metrics(metric0);
        // --- Define chart options and static filters ---
        let myChart = myData
          .graph("Slicer")

          .element(elementId)
          .on("notification", e => {
            window.toast({
              message: e.message,
              type: e.type
            });
          })
          .on("execute:start", e => window.toggleIndicator(e.element, true))
          .on("execute:stop", e => window.toggleIndicator(e.element, false))
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

function loadPropertiesPerPriceHistogram(){
    const elementId = "cf-histo-price-property";
      try {
        let staticFilter1 = cf
          .Filter("price")
          .label("price")
          .operation("GT")
          .value([0]);
        /* Configuration code for this widget */
        let provider = cf.provider("local");
        let source = provider.source("abnb_listings");
        // Define metrics
        let metric0 = cf
          .Metric("price", "histogram")
          .fixedBars(100)
          .offset(0)
          .showEmptyIntervals(false);
        // Add metrics and groups to data source
        let myData = source.metrics(metric0).limit(100);
        // Define Grid
        let grid = cf
          .Grid()
          .top(10)
          .right(0)
          .bottom(0)
          .left(0);
        // Define Color Palette
        let color = cf
          .Color()
          .palette([
            "#0095b7",
            "#a0b774",
            "#f4c658",
            "#fe8b3e",
            "#cf2f23",
            "#756c56",
            "#007896",
            "#47a694",
            "#f9a94b",
            "#ff6b30",
            "#e94d29",
            "#005b76"
          ]);
        myData.staticFilters(staticFilter1);
        // --- Define chart options and static filters ---
        let myChart = myData
          .graph("Histogram")
          .set("grid", grid)
          .set("color", color)
          .set("xAxis", { position: "bottom" })
          .set("yAxis", { type: "log" })
          .set("serieLabel", {
            show: false
          })
          .staticFilters(staticFilter1)

          .element(elementId)
          .on("notification", e => {
            window.toast({
              message: e.message,
              type: e.type
            });
          })
          .on("execute:start", e => window.toggleIndicator(e.element, true))
          .on("execute:stop", e => window.toggleIndicator(e.element, false))
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

function loadNeighborhoodsByReviewsBubbleChart(){
    const elementId = "cf-bubble-nh-reviews-scores";
      try {
        let staticFilter1 = cf
          .Filter("price")
          .label("price")
          .operation("GT")
          .value([0]); // Interaction Manager uses filter(), filters(), clientFilter(),
        // and clientFilters() to manage filters. To apply additional
        // filters, use staticFilters() or your code could be overwritten.
        //
        /* Configuration code for this widget */
        let provider = cf.provider("local");
        let source = provider.source("abnb_listings");
        // Define metrics
        let metrics = [cf.Metric("review_scores_value", "avg")];
        // Define attributes to group by
        let group = cf
          .Attribute("neighbourhood")
          .limit(40)
          .sort("desc", cf.Metric("review_scores_value", "avg"));
        let group2 = cf
          .Attribute("number_of_reviews")
          .limit(10)
          .sort("desc", cf.Metric("review_scores_value", "avg"));
        // Add metrics and groups to data source
        let myData = source.groupby(group, group2).metrics(...metrics);
        // --- Define chart options and static filters ---
        // Define Legend
        let legend = cf
          .Legend()
          .position("right")
          .width(150)
          .height("95%")
          .sort("none");
        // Define Grid
        let grid = cf
          .Grid()
          .top(10)
          .right(15)
          .bottom(35)
          .left(65);
        // Define Color Palette
        let color = cf
          .Color()
          .palette([
            "#0095b7",
            "#a0b774",
            "#f4c658",
            "#fe8b3e",
            "#cf2f23",
            "#756c56",
            "#007896",
            "#47a694",
            "#f9a94b",
            "#ff6b30",
            "#e94d29",
            "#005b76"
          ]);
        myData.staticFilters(staticFilter1);
        let myChart = myData
          .graph("Floating Bubbles")
          .set("legend", legend)
          .set("grid", grid)
          .set("color", color)
          .set("yAxis", { type: "value" })

          .element(elementId)
          .on("notification", e => {
            window.toast({
              message: e.message,
              type: e.type
            });
          })
          .on("execute:start", e => window.toggleIndicator(e.element, true))
          .on("execute:stop", e => window.toggleIndicator(e.element, false))
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
function loadPriceByAmenitiesPieChart(){
      const elementId = "cf-pie-price-by-amenities";
      try {
        // Interaction Manager uses filter(), filters(), clientFilter(),
        // and clientFilters() to manage filters. To apply additional
        // filters, use staticFilters() or your code could be overwritten.
        //
        /* Configuration code for this widget */
        let provider = cf.provider("local");
        let source = provider.source("abnb_listings");
        // Define metrics
        let metric0 = cf.Metric("price", "avg");
        // Define attributes to group by
        let group1 = cf
          .Attribute("amenities_categorized")
          .limit(9)
          .sort("asc", cf.Metric());
        // Add metrics and groups to data source
        let myData = source.groupby(group1).metrics(metric0);
        // --- Define chart options and static filters ---
        // Define Color Palette
        let color = cf
          .Color()
          .palette([
            "#0095b7",
            "#a0b774",
            "#f4c658",
            "#fe8b3e",
            "#cf2f23",
            "#756c56",
            "#007896",
            "#47a694",
            "#f9a94b",
            "#ff6b30",
            "#e94d29",
            "#005b76"
          ]);
        let myChart = myData
          .graph("Pie")
          .set("color", color)

          .element(elementId)
          .on("notification", e => {
            window.toast({
              message: e.message,
              type: e.type
            });
          })
          .on("execute:start", e => window.toggleIndicator(e.element, true))
          .on("execute:stop", e => window.toggleIndicator(e.element, false))
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


function loadBedsByProperty() {
      const elementId = "cf-bars-beds";
      try {
        let staticFilter1 = cf
          .Filter("beds")
          .label("beds")
          .operation("GT")
          .value([0]);
        let provider = cf.provider("local");
        let source = provider.source("abnb_listings");
        // Define metrics
        let metric0 = cf.Metric("count");
        // Define attributes to group by
        let group1 = cf
          .Attribute("beds")
          .limit(13)
          .sort("asc", "beds");
        // Add metrics and groups to data source
        let myData = source.groupby(group1).metrics(metric0);
        // --- Define chart options and static filters ---
        // Define Grid
        let grid = cf
          .Grid()
          .top(10)
          .right(15)
          .bottom(35)
          .left(65);
        // Define Color Palette
        let color = cf
          .Color()
          .palette([
            "#0095b7",
            "#a0b774",
            "#f4c658",
            "#fe8b3e",
            "#cf2f23",
            "#756c56",
            "#007896",
            "#47a694",
            "#f9a94b",
            "#ff6b30",
            "#e94d29",
            "#005b76"
          ]);
        myData.staticFilters(staticFilter1);
        let myChart = myData
          .graph("Bars")
          .set("grid", grid)
          .set("color", color)
          .set("yAxis", { type: "log" })
          .set("dataZoom", "dragFilter")
          .staticFilters(staticFilter1)

          .element(elementId)
          .on("notification", e => {
            window.toast({
              message: e.message,
              type: e.type
            });
          })
          .on("execute:start", e => window.toggleIndicator(e.element, true))
          .on("execute:stop", e => window.toggleIndicator(e.element, false))
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