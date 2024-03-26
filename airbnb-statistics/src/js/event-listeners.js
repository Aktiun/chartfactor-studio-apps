const resizeObserver = new ResizeObserver((entries) => {
    let currentHeight = entries[0].contentRect.height - 55;

    if (currentHeight > 0) {
        $(".main-layout").css("grid-template-rows", `${67 + currentHeight}px auto`);
        // $(".left-menu").css("height", `calc(100% - ${87 + currentHeight}px)`);
        // $(".left-menu").css("top", `${77 + currentHeight}px`);
    } else {
        $(".main-layout").css("grid-template-rows", "67px auto");
        // $(".left-menu").css("height", "calc(100% - 87px)");
        // $(".left-menu").css("top", "77px");
    }
});

resizeObserver.observe(document.querySelector(".cf-im"));

window.addEventListener("resize", function(event) {
  cf.getAllVisualizations().forEach(c => {
      c.resize();
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
    cf.getVisualization("kpi-by-zipcode").remove();
    cf.getVisualization("cf-active-listings-trend-by-zipcode").remove();
    cf.getVisualization("cf-median-listing-price-trend-by-zipcode").remove();
    cf.getVisualization("cf-new-listing-by-zipcode").remove();
}

$("#modal-close").click(function() {
    hideInvestorsModal();
    removeInvestorsModalVisualizations();
});