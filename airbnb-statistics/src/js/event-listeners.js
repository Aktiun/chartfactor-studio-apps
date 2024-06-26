// const resizeObserver = new ResizeObserver((entries) => {
//     let currentHeight = entries[0].contentRect.height - 55;
//
//     if (currentHeight > 0) {
//         $(".main-layout").css("grid-template-rows", `${67 + currentHeight}px auto`);
//         // $(".left-menu").css("height", `calc(100% - ${87 + currentHeight}px)`);
//         // $(".left-menu").css("top", `${77 + currentHeight}px`);
//     } else {
//         $(".main-layout").css("grid-template-rows", "67px auto");
//         // $(".left-menu").css("height", "calc(100% - 87px)");
//         // $(".left-menu").css("top", "77px");
//     }
// });
//
// resizeObserver.observe(document.querySelector(".cf-im"));

window.addEventListener("resize", function(event) {
  cf.getAllVisualizations().forEach(c => {
      const notAllowed = ["im", "cf-main-geomap"];

      if (!notAllowed.includes(c._elementId)) {
            c.resize();
      }
  });
});

function showInvestorModal() {
    $("#investors-modal").css("visibility", "visible");
    $("#glassPanel").css("visibility", "hidden");
    $(".cf-main-geomap-collapse-draw-control").css("visibility", "hidden");
    $(".collapsible-draw-control").css("visibility", "hidden");
    $(".cf-main-geomap-collapse-layers-control").css("visibility", "hidden");
    $(".collapsible-layers-control").css("visibility", "hidden");
}

function hideInvestorsModal(){
    $("#investors-modal").css("visibility", "hidden");
    $("#glassPanel").css("visibility", "visible");
    $(".cf-main-geomap-collapse-draw-control").css("visibility", "visible");
    $(".collapsible-draw-control").css("visibility", "visible");
    $(".cf-main-geomap-collapse-layers-control").css("visibility", "visible");
    $(".collapsible-layers-control").css("visibility", "visible");
}

function removeInvestorsModalVisualizations(){

    const visualizationListingIds = [
        "kpi-by-zipcode",
        "cf-active-listings-trend-by-zipcode",
        "cf-median-listing-price-trend-by-zipcode",
        "cf-median-days-market-by-zipcode",
        "cf-listings-yy-by-zipcode",
        "cf-listings-mm-by-zipcode",
        "mimmaxquery-1",
        "mimmaxquery-2",
        "mimmaxquery-3",
        "mimmaxquery-4",
        "cf-avg-price-by-zipcode",
        "cf-avg-price-mm-by-zipcode",
        "cf-avg-price-yy-by-zipcode",
        "cf-median-square-feet-by-zipcode",
        "cf-median-days-market-mm-by-zipcode",
        "cf-median-days-market-yy-by-zipcode"
    ];
    visualizationListingIds.forEach(id => {
        if (cf.getVisualization(id)){
            cf.getVisualization(id).remove();
        }
    });

    while(cf.getVisualization("")){
        cf.getVisualization("").remove();
    }
}

$("#modal-close").click(function() {
    removeInvestorsModalVisualizations();
    hideInvestorsModal();
    modalReset();
});

function modalReset() {
    $("#investors-modal-title > .listing-name").text('');
    $("#investors-modal-title > .listing-name").attr("href", '');
    $("#investors-modal-title > .host-name").text('');
    $("#investors-modal-title > .host-name").attr("href", '');
    $("#listing-profile-picture").attr("src", '');
    $("#listing-picture").attr("src", '');
    $("#number-of-reviews").text('');
    $("#modal-zipcode").text('');
    $("#realtor-zipcode").text('');
    $("#realtor-link").attr("href", '');
    $("#listing-price").text('');
    $("#min-nights").text('');
    $("#listing-beds").text('N/A');
    $("#listing-bedrooms").text('N/A');
    $("#avgNights").text('');
    $("#avgIncome").text('');
    $('.modal-charts').scrollTop(0);
}

function onCellClick(event) {
    if (event.target.tagName.toLowerCase() === 'td') {
        const row = event.target.parentNode;
        const cells = row.getElementsByTagName('td');
        const rowData = Array.from(cells).map(cell => cell.textContent);

        const hostFilter = cf.Filter("host_name").label("Host name").operation("IN").value([rowData[0]]);
        let manager = cf.getIManager();
        let api = manager.get("api");

        api.updateFilters([hostFilter]);

    }
}

window.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        removeInvestorsModalVisualizations();
        hideInvestorsModal();
        modalReset();
    }
});

$("#frequent-filter").change(function(event) {
    const applicableVisuals = cf.getAllVisualizations().filter(i => !["Interaction Manager", "Geo Map GL"].includes(i._chartType));

    const moment = cf.getDependency("moment");
    const currentDate = moment(new Date());
    const endDate = currentDate.format("YYYY-MM-DD");
    const startDate = currentDate.subtract(1, "year").format("YYYY-MM-DD");
    const lastReviewFilter = cf.Filter("last_review")
        .operation("BETWEEN")
        .value([startDate, endDate]);
    const occupancyFilter = cf.Filter("estimated_occupied_time")
        .operation("GT")
        .value([60]);

    applicableVisuals.forEach(v => {
        if (event.currentTarget.checked) {
            if (!v._isAktiveLayer) {
                const vStaticFilters = v.getCurrentAQL()._staticFilters
                    .filter(f => !['location', 'last_review', 'estimated_occupied_time'].includes(f.path))
                    .map(sf => cf.Filter().fromJSON(sf));

                v.staticFilters([window.boundaryFilter, lastReviewFilter, occupancyFilter, ...vStaticFilters]);
            } else {
                v.staticFilters(lastReviewFilter, occupancyFilter);
            }
            v.execute();
        } else {
            const vStaticFilters = v.getCurrentAQL()._staticFilters;
            const newStaticFilters = vStaticFilters.filter(f => !["last_review", "estimated_occupied_time"].includes(f.path));

            v.staticFilters(newStaticFilters.map(f => cf.Filter().fromJSON(f)));
            v.execute();
        }
    });

});
