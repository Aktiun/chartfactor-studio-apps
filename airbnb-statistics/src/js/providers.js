function loadProviders() {
    function getProviderMetadata() {
        let _META_ = {
            abnb_listings: {
                count: { label: "Listings" },
                fields: {
                    accommodates: {
                        label: "Accommodates"
                    },
                    amenities: {
                        label: "Amenities"
                    },
                    availability_30: {
                        label: "Availability 30"
                    },
                    availability_365: {
                        label: "Availability 365"
                    },
                    availability_60: {
                        label: "Availability 60"
                    },
                    availability_90: {
                        label: "Availability 90"
                    },
                    bathrooms: {
                        label: "Bathrooms"
                    },
                    bathrooms_text: {
                        label: "Bathrooms text"
                    },
                    bedrooms: {
                        label: "Bedrooms"
                    },
                    beds: {
                        label: "Beds"
                    },
                    calculated_host_listings_count: {
                        label: "#Listings"
                    },
                    calculated_host_listings_count_entire_homes: {
                        label: "#Entire homes/apt"
                    },
                    calculated_host_listings_count_private_rooms: {
                        label: "#Private rooms"
                    },
                    calculated_host_listings_count_shared_rooms: {
                        label: "#Shared rooms"
                    },
                    calculated_host_listings_count_hotel_rooms: {
                        label: "#Hotel rooms"
                    },
                    calendar_last_scraped: {
                        label: "Calendar last scraped"
                    },
                    description: {
                        label: "Description"
                    },
                    first_review: {
                        label: "First review"
                    },
                    has_availability: {
                        label: "Has availability"
                    },
                    host_about: {
                        label: "Host about"
                    },
                    host_acceptance_rate: {
                        label: "Host acceptance rate"
                    },
                    host_has_profile_pic: {
                        label: "Host has profile pic"
                    },
                    host_id: {
                        label: "Host id"
                    },
                    host_identity_verified: {
                        label: "Host identity verified"
                    },
                    host_is_superhost: {
                        label: "Host is superhost"
                    },
                    host_listings_count: {
                        label: "Host listings count"
                    },
                    host_location: {
                        label: "Host location"
                    },
                    host_name: {
                        label: "Host name"
                    },
                    host_neighbourhood: {
                        label: "Host neighbourhood"
                    },
                    host_picture_url: {
                        label: "Host picture url"
                    },
                    host_response_rate: {
                        label: "Host response rate"
                    },
                    host_response_time: {
                        label: "Host response time"
                    },
                    host_since: {
                        label: "Host since"
                    },
                    host_thumbnail_url: {
                        label: "Host thumbnail url"
                    },
                    host_total_listings_count: {
                        label: "Host total listings count"
                    },
                    host_url: {
                        label: "Host url"
                    },
                    host_verifications: {
                        label: "Host verifications"
                    },
                    id: {
                        label: "Id"
                    },
                    instant_bookable: {
                        label: "Instant bookable"
                    },
                    last_review: {
                        label: "Last review"
                    },
                    last_scraped: {
                        label: "Last scraped"
                    },
                    latitude: {
                        label: "Latitude"
                    },
                    license: {
                        label: "License"
                    },
                    listing_url: {
                        label: "Listing url"
                    },
                    location: {
                        label: "Location"
                    },
                    longitude: {
                        label: "Longitude"
                    },
                    maximum_maximum_nights: {
                        label: "Maximum maximum nights"
                    },
                    maximum_minimum_nights: {
                        label: "Maximum minimum nights"
                    },
                    maximum_nights: {
                        label: "Maximum nights"
                    },
                    maximum_nights_avg_ntm: {
                        label: "Maximum nights avg ntm"
                    },
                    minimum_maximum_nights: {
                        label: "Minimum maximum nights"
                    },
                    minimum_minimum_nights: {
                        label: "Minimum minimum nights"
                    },
                    minimum_nights: {
                        label: "Minimum nights"
                    },
                    minimum_nights_avg_ntm: {
                        label: "Minimum nights avg ntm"
                    },
                    name: {
                        label: "Name"
                    },
                    neighborhood_overview: {
                        label: "Neighborhood overview"
                    },
                    neighbourhood: {
                        label: "Neighbourhood"
                    },
                    neighbourhood_cleansed: {
                        label: "Neighbourhood cleansed"
                    },
                    neighbourhood_group_cleansed: {
                        label: "Neighbourhood group cleansed"
                    },
                    number_of_reviews: {
                        label: "Number of reviews"
                    },
                    number_of_reviews_l30d: {
                        label: "Number of reviews l30d"
                    },
                    number_of_reviews_ltm: {
                        label: "Number of reviews ltm"
                    },
                    picture_url: {
                        label: "Picture url"
                    },
                    price: {
                        label: "Price"
                    },
                    property_type: {
                        label: "Property type"
                    },
                    review_scores_accuracy: {
                        label: "Review scores accuracy"
                    },
                    review_scores_checkin: {
                        label: "Review scores checkin"
                    },
                    review_scores_cleanliness: {
                        label: "Review scores cleanliness"
                    },
                    review_scores_communication: {
                        label: "Review scores communication"
                    },
                    review_scores_location: {
                        label: "Review scores location"
                    },
                    review_scores_rating: {
                        label: "Review scores rating"
                    },
                    review_scores_value: {
                        label: "Review scores value"
                    },
                    reviews_per_month: {
                        label: "Reviews per month"
                    },
                    room_type: {
                        label: "Room type"
                    },
                    scrape_id: {
                        label: "Scrape id"
                    },
                    source: {
                        label: "Source"
                    },
                    income_ltm: {
                        label: "Income (last 12 months)"
                    },
                    estimated_occupied_time: {
                        label: "Occupancy (last 12 months)"
                    },
                }
            },
            "realtor_monthly_inventory_zip_all": {
                "fields": {
                    "median_listing_price": {
                        "label": "Median listing price"
                    },
                    "new_listing_count": {
                        "label": "New listing count"
                    },
                    "active_listing_count": {
                        "label": "Active listing count"
                    },
                    "active_listing_count_mm": {
                        "label": "Active listing count mm"
                    },
                    "active_listing_count_yy": {
                        "label": "Active listing count yy"
                    },
                    "average_listing_price": {
                        "label": "Average listing price"
                    },
                    "average_listing_price_mm": {
                        "label": "Average listing price mm"
                    },
                    "average_listing_price_yy": {
                        "label": "Average listing price yy"
                    },
                    "median_days_on_market": {
                        "label": "Median days on market"
                    },
                    "median_days_on_market_mm": {
                        "label": "Median days on market mm"
                    },
                    "median_days_on_market_yy": {
                        "label": "Median days on market yy"
                    },
                    "median_listing_price_mm": {
                        "label": "Median listing price mm"
                    },
                    "median_listing_price_per_square_feet": {
                        "label": "Median listing price per square feet"
                    },
                    "median_listing_price_per_square_feet_mm": {
                        "label": "Median listing price per square feet mm"
                    },
                    "median_listing_price_per_square_feet_yy": {
                        "label": "Median listing price per square feet yy"
                    },
                    "median_listing_price_yy": {
                        "label": "Median listing price yy"
                    },
                    "median_square_feet": {
                        "label": "Median square feet"
                    },
                    "median_square_feet_mm": {
                        "label": "Median square feet mm"
                    },
                    "median_square_feet_yy": {
                        "label": "Median square feet yy"
                    },
                    "month_date_yyyymm": {
                        "label": "Month date yyyymm"
                    },
                    "new_listing_count_mm": {
                        "label": "New listing count mm"
                    },
                    "new_listing_count_yy": {
                        "label": "New listing count yy"
                    },
                    "pending_listing_count": {
                        "label": "Pending listing count"
                    },
                    "pending_listing_count_mm": {
                        "label": "Pending listing count mm"
                    },
                    "pending_listing_count_yy": {
                        "label": "Pending listing count yy"
                    },
                    "pending_ratio": {
                        "label": "Pending ratio"
                    },
                    "pending_ratio_mm": {
                        "label": "Pending ratio mm"
                    },
                    "pending_ratio_yy": {
                        "label": "Pending ratio yy"
                    },
                    "postal_code": {
                        "label": "Postal code"
                    },
                    "price_increased_count": {
                        "label": "Price increased count"
                    },
                    "price_increased_count_mm": {
                        "label": "Price increased count mm"
                    },
                    "price_increased_count_yy": {
                        "label": "Price increased count yy"
                    },
                    "price_reduced_count": {
                        "label": "Price reduced count"
                    },
                    "price_reduced_count_mm": {
                        "label": "Price reduced count mm"
                    },
                    "price_reduced_count_yy": {
                        "label": "Price reduced count yy"
                    },
                    "quality_flag": {
                        "label": "Quality flag"
                    },
                    "state_code": {
                        "label": "State code"
                    },
                    "state_name.keyword": {
                        "label": "State name"
                    },
                    "total_listing_count": {
                        "label": "Total listing count"
                    },
                    "total_listing_count_mm": {
                        "label": "Total listing count mm"
                    },
                    "total_listing_count_yy": {
                        "label": "Total listing count yy"
                    },
                    "zip_name": {
                        "label": "Zip name"
                    }
                }
            }
        };
        return _META_;
    }

    const providers = [
        {
            name: "local",
            url: "http://localhost:9200/",
            active: true,
            provider: "elasticsearch",
            isLocal: true,
            id: "2597f78e-815b-47bf-82f3-c042691dae62",
            metadata: getProviderMetadata()
        }
    ];

    cf.setProviders(providers);
}
