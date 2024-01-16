# ChartFactor Studio Applications

This is the public collection of ChartFactor Studio applications in the form of CFS files, ready to be imported into ChartFactor Studio.

## Instructions to load CFS files in ChartFactor Studio

1. Clone this project

    `git clone https://github.com/Aktiun/chartfactor-studio-apps.git`

2. Open [ChartFactor Studio](https://chartfactor.com/studio/) and use the "Import" function on the top right of the ChartFactor Studio home page to select CFS file(s) from the `cfs` folder in this project

3. Click on any of the imported applications to visually interact with the data

Note that BigQuery dashboards require Google Cloud Platform credentials.  Please allow the Google authentication pop-up in your browser if blocked.

## Application descriptions

The following is a description of some of the available applications.

### China - Air Pollution 2015

This ChartFactor Studio interactive dashboard visualizes air polution variations and main pollutants across different cities during 2105. Use the time slider to play the data month by month. 

This application was created using ChartFactor Studio. The data is sourced from [chinapower.csis.org](https://chinapower.csis.org/data/daily-air-pollution-statistics/). A published application is available online at https://chartfactor.com/china-pollution-2015/.

### COVID-19 Infections in the United States

This ChartFactor Studio interactive dashboard visualizes COVID-19 infections and deaths in the United States since pandemic data started in January 2020. Use the time slider to replay history. Select your State to visualize its Counties and select a county to visualize total cases, death rates, and other KPIs. Also, check out the scatter plot to see where your State stands in the infections vs deaths cuadrant.  

This application was created using ChartFactor Studio. The data is sourced from [chinapower.csis.org](https://chinapower.csis.org/data/daily-air-pollution-statistics/). A published application is available online at https://chartfactor.com/covid-19-us/. 

### London Fire Brigade Calls

This ChartFactor Studio interactive application visualizes London Fire Brigade calls that occurred during the first quarter of 2017. You can click on any visualization to further analyze the data. For example, you can select a day and/or an hour of the day using the Trend charts and then analyze call distribution. Or you can select a shape in the vector map to filter down calls by the selected Borough.

This application was created using ChartFactor Studio.

### Netflix Titles

This ChartFactor Studio application visualizes the [Netflix Movies and TV Shows dataset](https://www.kaggle.com/datasets/shivamb/netflix-shows) provided by Shivam Bansal in Kaggle, allowing you to interact with multiple search-enabled visualizations. A published application is available online at https://chartfactor.com/netflix-titles-app/.

### US Airlines Customer Experience

This ChartFactor Studio streaming and interactive application visualizes US Airline customer experience at any time, day or night. You can visualize currently streaming tweets as well as historical tweets. You can identify top entities and phrases, analyze specific categories and sentiments, narrow down negative sentiment to specific themes and airlines, and see volume trend and KPI comparisions! Data streamed from May 11 2021 through April 30 2022.

This application was created using ChartFactor Studio.  A published application is available online at https://chartfactor.com/cx-analytics/. 

### Residential Real Estate Inventory - State and ZIP Codes

This application visualizes monthly residential real estate inventory at the state and ZIP code levels.

It was generated using ChartFactor Studio and styled for a special look/feel. It includes drill-ins for state and ZIP codes, a search widget, trends for active listings and median listing prices, and range filtering, between many other features:

* Drill-in across tables: the data published by realtor.com resides in separate tables: the country table for country level metrics, the state table for state-level metrics and the ZIP code table for ZIP-code-level metrics. ChartFactor allows you to configure drill-ins that span multiple tables in addition to geojson shapes, zoom levels, map centers between other visualization properties.
* An interaction manager's "required" restriction rule prevents users from removing the month filter. Users can select different months using the trend charts.
* An interaction manager's "depends on" restriction removes ZIP code filters when users remove state filters. ChartFactor enables you to easily declare a “depends on” restriction for these scenarios, no imperative programming needed.

A published application is available online at https://chartfactor.com/residential-real-estate/. 

### Residential Real Estate Inventory - State and County

This application visualizes monthly residential real estate inventory at the state and county levels.

It was created using ChartFactor Studio and converted into a web application using its "Generate web app" feature. It includes the following features:

* Drill-in across tables: the data published by realtor.com resides in separate tables: the state table for state-level metrics and the county table for county-level metrics. ChartFactor allows you to configure drill-ins that span multiple tables in addition to geojson shapes, zoom levels, map centers between other visualization properties.
* End-users can easily switch between metrics such as Active Listings, Median Days on the Market, Median Listing Price, and many more metrics available in these datasets. The ChartFactor Field Selector component enables metric selection for individual charts or for a group of charts.
* Maintain the same colors for states and counties across trend lines, bars, and word cloud visualizations. ChartFactor allows you to assign colors to attribute values for color consistency across the charts you choose. 
* End-users can filter by any month without being allowed to remove the month filter. ChartFactor enables you to easily declare “required” filter restrictions, no imperative programming needed.
* End users can select a county only after selecting a state. If users select a county, for example using the “County Name” table column filter, before selecting a state, they get an error message. ChartFactor enables you to easily declare a “depends on” filter restriction for these scenarios, no imperative programming needed.

A published application is available online at https://chartfactor.com/residential-real-estate-inventory/. 

## NCHS Drug Poisoning Mortality by County

This application visualizes the National Center for Health Statistics (NCHS) drug poisoning mortality rates by county. We are using a time slider to replay the data over time. A tab on the right side opens a trend chart to compare county trends for counties you select on the map. And the tab below visualizes a heat map for the top 20 counties by drug poisoning mortality across years.

You can access this app live at https://chartfactor.com/NCHS-drug-poisoning-app/. 

Data provided by the NCHS and available at https://data.cdc.gov/NCHS/NCHS-Drug-Poisoning-Mortality-by-County-United-Sta/rpvx-m2md

Data engine is OpenSearch, base map tiles provided by OpenStreetMap.

## Medicare Inpatient Hospitals by Provider

This application visualizes the use, payment, and hospital charges for more than 3,000 U.S. hospitals that received IPPS (Inpatient Prospective Payment System) payments in the United States. You can select any hospital and see how its metrics compare to their the national and state frequency distribution.

You can access this app live at https://chartfactor.com/medicare-ip-prov-2021/.

Data provided by the [Centers for Medicare & Medicaid Services](https://data.cms.gov/search?keywords=Medicare%20Inpatient%20Hospitals%20-%20by%20Provider&sort=Relevancy).

Data engine is OpenSearch, base map tiles provided by OpenStreetMap.
