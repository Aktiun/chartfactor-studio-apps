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

$("#modal-close").click(function() {
    $("#provider-modal").css("visibility", "hidden");
    $("#glassPanel").css("visibility", "visible");
});