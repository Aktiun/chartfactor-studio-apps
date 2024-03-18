function loadProviders() {
    function getProviderMetadata() {
        let _META_ = {
            abnb_listings: {
                count: { label: "Properties" },
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
                        label: "Calculated host listings count"
                    },
                    calculated_host_listings_count_entire_homes: {
                        label: "Calculated host listings count entire homes"
                    },
                    calculated_host_listings_count_private_rooms: {
                        label: "Calculated host listings count private rooms"
                    },
                    calculated_host_listings_count_shared_rooms: {
                        label: "Calculated host listings count shared rooms"
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
                        label: "Estimated booked time (last 12 months)"
                    },
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