const resizeObserver = new ResizeObserver((entries) => {
    let currentHeight = entries[0].contentRect.height - 55;

    if (currentHeight > 0) {
        $(".main-layout").css("grid-template-rows", `${67 + currentHeight}px auto`);
        $(".left-menu").css("height", `calc(100% - ${87 + currentHeight}px)`);
        $(".left-menu").css("top", `${77 + currentHeight}px`);
    } else {
        $(".main-layout").css("grid-template-rows", "67px auto");
        $(".left-menu").css("height", "calc(100% - 87px)");
        $(".left-menu").css("top", "77px");
    }
});

resizeObserver.observe(document.querySelector(".cf-im"));

function toggleGlassPanel() {
    const panel = document.getElementById('glassPanel');
    const tab = document.getElementsByClassName('panel-tab')[0];
    if (panel.style.right === '0px' || panel.style.right === '') {
      panel.style.right = '-50%';
      tab.classList.remove('hidden');
    } else {
      panel.style.right = '0px';
      tab.classList.add('hidden');
    }
  }