window.toast = function(config) {
  const TOAST_ID = "cf-toast-message";
  const STYLE_ID = "cf-toast-styles";
  const BTN_ID = "cf-toast-close";
  const prevToast = document.getElementById(TOAST_ID);
  const prevStyle = document.getElementById(STYLE_ID);

  if (prevToast) prevToast.remove();
  if (prevStyle) prevStyle.remove();

  const message = config.message;
  const type = config.type || "info";

  const container = document.createElement("div");
  const styleTag = document.createElement("style");
  const colors = {
    info: "#29b6f6",
    warning: "#f57c00",
    error: "#d32f2f",
    success: "#00c853"
  };

  container.id = TOAST_ID;
  styleTag.id = STYLE_ID;
  container.innerHTML = `
        <div style="display:flex; justify-content:space-between">
            <div id="toast-message" style="margin-right:30px"></div>
            <button id='cf-toast-close'>&times;</button>
        </div>`;
  styleTag.innerHTML = `
        #cf-toast-close {
            background: transparent; 
            border: none; 
            outline: none;
        }

        #cf-toast-close:hover { color: #323232; }

        #cf-toast-message {
            min-width: 250px;
            margin-right: 45px;
            color: #fff;
            text-align: center;
            border-radius: 2px;
            padding: 16px;
            position: fixed;
            z-index: 1000;
            left: 20px;
            bottom: 30px;
            font-size: 15px;
            -webkit-box-shadow: 11px 14px 31px -16px rgba(0,0,0,0.46);
            -moz-box-shadow: 11px 14px 31px -16px rgba(0,0,0,0.46);
            box-shadow: 11px 14px 31px -16px rgba(0,0,0,0.46);
        }

        #cf-toast-message.show {
            -webkit-animation: fadein 0.5s;
            animation: fadein 0.5s;
        }

        #cf-toast-message.hide {
            visibility: hidden;
            opacity: 0;
            bottom:0px;
            transition: visibility .5s, opacity .5s, bottom .5s linear;
        }

        @-webkit-keyframes fadein {
            = require({bottom: 0; opacity: 0;} 
            to {bottom: 30px; opacity: 1;}
        }

        @keyframes fadein {
            = require({bottom: 0; opacity: 0;}
            to {bottom: 30px; opacity: 1;}
        }`;

  document.getElementsByTagName("body")[0].appendChild(styleTag);
  document.getElementsByTagName("body")[0].appendChild(container);
  const messageDiv = document.getElementById("toast-message");

  messageDiv.innerText = message;
  container.style.backgroundColor = colors[type];
  container.className = "show";

  const button = document.getElementById(BTN_ID);
  const hideToast = () => {
    container.className = "hide";
  };
  const timeout = setTimeout(() => hideToast(), 3000);

  button.onclick = () => {
    clearTimeout(timeout);
    hideToast();
  };
};

window.toggleIndicator = function(element, show) {
  var container = document.querySelector("#" + element);
  var loader = container
    ? container.parentElement.querySelector(".loader")
    : false;
  var fullView = container
    ? container.parentElement.querySelector(".fullViewIcon")
    : false;

  if (fullView) {
    if (show) {
      fullView.classList.add("fade-indicator");
    } else {
      fullView.classList.remove("fade-indicator");
    }
  }

  if (loader) {
    if (show) {
      loader.classList.remove("fade-indicator");
      loader.style.display = "block";
    } else {
      loader.classList.add("fade-indicator");
      loader.style.display = "none";
    }
  }
};

window.onscroll = () => {
  if (window.scrollY > 36) {
    const element = document.querySelector(".header-im-container");
    if (element) element.classList.add("im-top-fixed");
  } else {
    const element = document.querySelector(".header-im-container");
    if (element) element.classList.remove("im-top-fixed");
  }
};

window.addEventListener("load", function() {
  $(".grid-stack").gridstack({
    verticalMargin: 3,
    handle: ".title-container"
  });

  // Handle forbidden error
  function handleForbiddenError(error, provider) {
    if (
      error &&
      error.response &&
      error.response.status === 403 &&
      typeof window.securityConfig === "object" &&
      window.securityConfig.hasOwnProperty("applyHeadersTo") &&
      Array.isArray(window.securityConfig.applyHeadersTo) &&
      window.securityConfig.applyHeadersTo.includes(provider)
    ) {
      localStorage.removeItem("cfs.providerAuth");
      history.pushState({ page: -1 }, "origin", window.location.href);
      window.location.href = window.securityConfig.authentication.loginPage;
    }
  }

  function handleError(elementId, error) {
    const visualizationContainer = document.getElementById(elementId);
    const htmlError = `<div class="cf-visualization-message"><b>Error</b>: ${error.message}</div>`;

    $(visualizationContainer).prepend(htmlError);
    window.toggleIndicator(elementId, false);
  }

  loadProviders();
  // Load charts
  loadInteractionManager();
  loadGeomap();
  loadPropertyType();
  loadActivity();
  loadAvgNights();
  loadAvgPrice();
  loadLicenses();
  loadHostListings();
  loadHostMultiListings();
  loadHostListingsStatistics();
  // loadBathroomsHistogram();
  // loadRangeFilters();
  // loadPopularNeighborhoods();
  // loadAmenitiesFilter();
  // loadPropertiesPerPriceHistogram();
  // loadNeighborhoodsByReviewsBubbleChart();
  // loadPriceByAmenitiesPieChart();
  // loadBedsByProperty();

  (function() {
    const IM = cf.getIManager();
    const skin = IM.get("skin");
    if (skin) {
      const skinType = skin && typeof skin === "string" ? skin : skin.type;
      if (skinType === "modern") {
        $(".header-im-container").css("min-height", "60px");
        $(".container").css("top", "94px");
      }
    }
  })();

  $(".grid-stack").on("gsresizestop", function(event, elem) {
    const id = elem
      .getElementsByClassName("grid-stack-item-content-override")[0]
      .getAttribute("id");
    cf.getVisualization(id).resize();
  });

  cf.getAllVisualizations().forEach(widget => widget.resize());
});
