#
# This script will create the listings_ny index in ES.  It will delete the index
# if it already exists to avoid duplicate entries.
#
import os
import csv
import re
import logging
from logging.handlers import RotatingFileHandler #debug
from dotenv import load_dotenv
from elasticsearch.helpers import bulk, streaming_bulk
from elasticsearch import Elasticsearch, RequestsHttpConnection
import datetime
# 
load_dotenv()

logger = logging.getLogger('listings_abnb')
logger.setLevel(logging.INFO)
log_file = 'abnb_listings.log' #debug
file_handler = RotatingFileHandler(log_file, maxBytes=10485760, backupCount=5) #debug
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s') #debug
file_handler.setFormatter(formatter) #debug
ch = logging.StreamHandler()
logger.addHandler(ch)
logger.addHandler(file_handler) #debug

categories_map = {
    "TV": ["TV", "HDTV", "Netflix", "Roku", "Disney+", "Fire TV", "Amazon Prime Video", "Hulu", "premium cable", "Apple TV", "standard cable"],
    "Bathroom Essentials": ["shampoo", "conditioner", "body soap", "Moroccan Oil", "Malin+Goetz"],
    "Kitchen Appliances": ["oven", "Kitchenaid", "refrigerator", "Mar refrigerator"],
    "Laundry": ["Dryer", "Washer"],
    "Wifi": ["wifi", "Fast wifi", "Mbps"],
    "Sound Systems": ["Bluetooth speaker", "sound system", "Polk", "Bang&Olufsen"],
    "Exercise Equipment": ["Exercise equipment", "free weights"],
    "Cooking Appliances": ["stove", "induction stove", "gas stove", "electric stove"],
    "Pools And Spas": ["pool", "heated pool", "pool toys", "Private indoor pool"]
}

def categorize_amenity(amenity, categories_map):
    for category, keywords in categories_map.items():
        if any(keyword.lower() in amenity.lower() for keyword in keywords):
            return category
    return "Other"

def clean_and_normalize_neighborhood(neighborhood):
    cleaned_location = re.sub(r'\s*,\s*', ', ', neighborhood).title()
    return cleaned_location

def get_license_type(license):
    if not license:
        return "Unlicensed"
    if "exempt" in license.lower():
        return "Exempt"
    if "pending" in license.lower():
        return "Pending"
    return "Licensed"

def get_hotel_room_count(room_type, home_apt_count, private_room_count, shared_room_count, calculated_total):
    if room_type.lower() == "hotel room":
        hotel_rooms = int(float(calculated_total)) - int(float(home_apt_count)) - int(float(private_room_count)) - int(float(shared_room_count))
        return hotel_rooms if hotel_rooms > 0 else 0
    return 0

def create_index(client, index_name):
    doc = {
        "settings": {
            "number_of_shards": 1
        },
        "mappings": {
            "dynamic_templates": [
                {
                    "strings_as_keywords": {
                        "match_mapping_type": "string",
                        "mapping": {
                            "type": "keyword"
                        }
                    }
                }
            ],
            "properties":
 				{
				    "id": {
				        "type": "keyword",
                        "null_value": "null"
				    },
				    "listing_url": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "scrape_id": {
				        "type": "date",
				    },
				    "last_scraped": {
				        "type": "date",
				    },
				    "source": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "name": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "description": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "neighborhood_overview": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "picture_url": {
				        "type": "keyword",
                        "null_value": "null"
				    },
				    "host_id": {
				        "type": "keyword",
                        "null_value": "null"
				    },
				    "host_url": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "host_name": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "host_since": {
				        "type": "date",
				    },
				    "host_location": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "host_about": {
				        "type": "text",
				    },
				    "host_response_time": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "host_response_rate": {
				        "type": "keyword",
                        "null_value": "null"
				    },
				    "host_acceptance_rate": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "host_is_superhost": {
				        "type": "boolean"
				    },
				    "host_thumbnail_url": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "host_picture_url": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "host_neighbourhood": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "host_listings_count": {
				        "type": "integer"
				    },
				    "host_total_listings_count": {
				        "type": "integer"
				    },
				    "host_verifications": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "host_has_profile_pic": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "host_identity_verified": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "neighbourhood": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "neighbourhood_cleansed": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "neighbourhood_group_cleansed": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "latitude": {
				        "type": "float"
				    },
				    "longitude": {
				        "type": "float"
				    },
                    "location": {
                        "type": "geo_point"
					},
				    "property_type": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "room_type": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "accommodates": {
				        "type": "integer"
				    },
				    "bathrooms": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "bathrooms_text": {
				        "type": "keyword",
						"null_value": "null"
                    },
				    "bedrooms": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "beds": {
				        "type": "integer"
				    },
				    "amenities": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "price": {
				        "type": "integer"
				    },
				    "minimum_nights_str": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "minimum_nights": {
				        "type": "integer"
				    },
				    "maximum_nights": {
				        "type": "integer"
				    },
				    "minimum_minimum_nights": {
				        "type": "integer"
				    },
				    "maximum_minimum_nights": {
				        "type": "integer"
				    },
				    "minimum_maximum_nights": {
				        "type": "integer"
				    },
				    "maximum_maximum_nights": {
				        "type": "integer"
				    },
				    "minimum_nights_avg_ntm": {
				        "type": "float"
				    },
				    "maximum_nights_avg_ntm": {
				        "type": "float"
				    },
				    "calendar_updated": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "has_availability": {
				        "type": "boolean",
				    },
				    "availability_30": {
				        "type": "integer"
				    },
				    "availability_60": {
				        "type": "integer"
				    },
				    "availability_90": {
				        "type": "integer"
				    },
				    "availability_365": {
				        "type": "integer"
				    },
				    "calendar_last_scraped": {
				        "type": "date",
				    },
				    "number_of_reviews": {
				        "type": "integer"
				    },
				    "number_of_reviews_ltm": {
				        "type": "integer"
				    },
				    "number_of_reviews_l30d": {
				        "type": "integer"
				    },
				    "first_review": {
				        "type": "date",
				    },
				    "last_review": {
				        "type": "date",
				    },
				    "review_scores_rating": {
				        "type": "float"
				    },
				    "review_scores_accuracy": {
				        "type": "float"
				    },
				    "review_scores_cleanliness": {
				        "type": "float"
				    },
				    "review_scores_checkin": {
				        "type": "float"
				    },
				    "review_scores_communication": {
				        "type": "float"
				    },
				    "review_scores_location": {
				        "type": "float"
				    },
				    "review_scores_value": {
				        "type": "float"
				    },
				    "license": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "instant_bookable": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "calculated_host_listings_count": {
				        "type": "integer"
				    },
				    "calculated_host_listings_count_entire_homes": {
				        "type": "integer"
				    },
				    "calculated_host_listings_count_private_rooms": {
				        "type": "integer"
				    },
				    "calculated_host_listings_count_shared_rooms": {
				        "type": "integer"
				    },
				    "reviews_per_month": {
				        "type": "float"
				    },
                    "is_usa": {
				        "type": "boolean"
				    },
				    "estimated_occupied_time": {
				        "type": "integer"
				    },
				    "income_ltm": {
				        "type": "float"
				    },
				    "zipcode": {
				        "type": "keyword",
				        "null_value": "null"
				    },
                    "amenities_categorized": {
                    "type": "keyword"
                    },
                    "calculated_host_listings_count_hotel_rooms": {
                        "type": "integer"
					}
				}
        }
    }
    logger.info("creating %s ...", index_name)
    client.indices.delete(index=index_name, ignore=[400, 404])
    client.indices.create(index=index_name, body=doc)

def get_value(csv_file):
    with open(csv_file) as f:
        logger.info("*****")
        reader = csv.reader(f)
        header = next(reader)
        col = {name: idx for idx, name in enumerate(header)}
        logger.info(f"CSV columns ({len(header)}): {header}")
        for r in reader:
            logger.debug(r)
            if not r[col['id']].isdigit():
               logger.error(f"Row with incorrect id: {r}")
               continue
            if not r[col['latitude']] or not r[col['longitude']]:
                logger.error(f"Row with empty location: {r}")
                continue
            if r[col['host_about']] and len(r[col['host_about']].encode("utf-8")) >= 32765:
                r[col['host_about']] = r[col['host_about']][:-100]
            try:
                datetime.datetime.strptime(r[col['scrape_id']], "%Y-%m-%d").date()
            except ValueError:
                r[col['scrape_id']] = None
            try:
                datetime.datetime.strptime(r[col['last_scraped']], "%Y-%m-%d").date()
            except ValueError:
                r[col['last_scraped']] = None
            try:
                datetime.datetime.strptime(r[col['host_since']], "%Y-%m-%d").date()
            except ValueError:
                r[col['host_since']] = None

            def g(name):
                """Get column value, return None if empty or column missing."""
                if name not in col:
                    return None
                v = r[col[name]]
                return v if v != '' else None

            doc = {
                "id": g('id'),
                "listing_url": g('listing_url'),
                "scrape_id": g('scrape_id'),
                "last_scraped": g('last_scraped'),
                "source": g('source'),
                "name": g('name'),
                "description": g('description'),
                "neighborhood_overview": r[col['neighborhood_overview']],
                "picture_url": g('picture_url'),
                "host_id": str(r[col['host_id']]).split('.')[0],
                "host_url": g('host_url'),
                "host_name": g('host_name'),
                "host_since": g('host_since'),
                "host_location": g('host_location'),
                "host_about": r[col['host_about']],
                "host_response_time": g('host_response_time'),
                "host_response_rate": g('host_response_rate'),
                "host_acceptance_rate": r[col['host_acceptance_rate']],
                "host_is_superhost": r[col['host_is_superhost']] == "t",
                "host_thumbnail_url": g('host_thumbnail_url'),
                "host_picture_url": g('host_picture_url'),
                "host_neighbourhood": g('host_neighbourhood'),
                "host_listings_count": r[col['host_listings_count']],
                "host_total_listings_count": r[col['host_total_listings_count']],
                "host_verifications": g('host_verifications'),
                "host_has_profile_pic": g('host_has_profile_pic'),
                "host_identity_verified": g('host_identity_verified'),
                "neighbourhood": g('neighbourhood'),
                "neighbourhood_cleansed": g('neighbourhood_cleansed'),
                "neighbourhood_group_cleansed": g('neighbourhood_group_cleansed'),
                "latitude": r[col['latitude']],
                "longitude": r[col['longitude']],
                "location": {
                    "lat": r[col['latitude']],
                    "lon": r[col['longitude']]
                },
                "property_type": g('property_type'),
                "room_type": g('room_type'),
                "accommodates": r[col['accommodates']],
                "bathrooms": g('bathrooms'),
                "bathrooms_text": g('bathrooms_text'),
                "bedrooms": g('bedrooms'),
                "beds": r[col['beds']],
                "amenities": g('amenities'),
                "price": float(r[col['price']].replace("$", "").replace(",","")) if r[col['price']] != '' else 0.0,
                "minimum_nights": r[col['minimum_nights']],
                "maximum_nights": r[col['maximum_nights']],
                "minimum_minimum_nights": r[col['minimum_minimum_nights']],
                "maximum_minimum_nights": r[col['maximum_minimum_nights']],
                "minimum_maximum_nights": r[col['minimum_maximum_nights']],
                "maximum_maximum_nights": r[col['maximum_maximum_nights']],
                "minimum_nights_avg_ntm": r[col['minimum_nights_avg_ntm']],
                "maximum_nights_avg_ntm": r[col['maximum_nights_avg_ntm']],
                "calendar_updated": g('calendar_updated'),
                "has_availability": r[col['has_availability']] == "t",
                "availability_30": r[col['availability_30']],
                "availability_60": r[col['availability_60']],
                "availability_90": r[col['availability_90']],
                "availability_365": r[col['availability_365']],
                "calendar_last_scraped": g('calendar_last_scraped'),
                "number_of_reviews": r[col['number_of_reviews']],
                "number_of_reviews_ltm": r[col['number_of_reviews_ltm']],
                "number_of_reviews_l30d": r[col['number_of_reviews_l30d']],
                "first_review": g('first_review'),
                "last_review": g('last_review'),
                "review_scores_rating": r[col['review_scores_rating']],
                "review_scores_accuracy": r[col['review_scores_accuracy']],
                "review_scores_cleanliness": r[col['review_scores_cleanliness']],
                "review_scores_checkin": r[col['review_scores_checkin']],
                "review_scores_communication": r[col['review_scores_communication']],
                "review_scores_location": r[col['review_scores_location']],
                "review_scores_value": r[col['review_scores_value']],
                "license": get_license_type(r[col['license']]),
                "instant_bookable": g('instant_bookable'),
                "calculated_host_listings_count": r[col['calculated_host_listings_count']],
                "calculated_host_listings_count_entire_homes": r[col['calculated_host_listings_count_entire_homes']],
                "calculated_host_listings_count_private_rooms": r[col['calculated_host_listings_count_private_rooms']],
                "calculated_host_listings_count_shared_rooms": r[col['calculated_host_listings_count_shared_rooms']],
                "reviews_per_month": r[col['reviews_per_month']],
                "is_usa": r[col['is_usa']].lower(),
                "estimated_occupied_time": r[col['estimated_occupied_time']],
                "minimum_nights_str": r[col['minimum_nights_str']],
                "income_ltm": r[col['income_ltm']],
                "zipcode": g('zipcode'),
                "calculated_host_listings_count_hotel_rooms": get_hotel_room_count(
                    r[col['room_type']],
                    r[col['calculated_host_listings_count_entire_homes']],
                    r[col['calculated_host_listings_count_private_rooms']],
                    r[col['calculated_host_listings_count_shared_rooms']],
                    r[col['calculated_host_listings_count']])
            }

            # Categorize amenities
            amenities = r[col['amenities']].split(",")
            doc["amenities_categorized"] = list(set(map(lambda x: categorize_amenity(x, categories_map), amenities)))

            yield doc

def load_records(client, index_name, csv_file):
    logger.info('loading records for %s ...', index_name)
    for ok, result in streaming_bulk(
        client,
        get_value(csv_file),
        index=index_name,
        chunk_size=500  # batch size
    ):
        action, result = result.popitem()
        doc_id = '/%s/commits/%s' % (index_name, result['_id'])
        # process the information from ES whether the document has been
        # successfully indexed
        if not ok:
            logger.info('Failed to %s document %s: %r', action, doc_id, result)
    logger.info('Done')

def index(es, index_name, csv_file):
    if not os.path.exists(csv_file):
        logger.info('The %s file was not found', csv_file)
    else:
        try:
            create_index(es, index_name)
            load_records(es, index_name, csv_file)
            # Set the max_result_window variable
            es.indices.put_settings(index=index_name, body={
                                    "index": {"max_result_window": 25000}})
            return True
        except Exception as e:
            logger.exception('Error occured', e, True)
            return False

def obtainESClient():
    host = os.getenv("ES_HOST") or 'localhost'
    port = os.getenv("ES_PORT") or 9200
    user = os.getenv("ES_USER") or 'any'
    pwd = os.getenv("ES_PWD") or 'any'
    es = Elasticsearch(
        [{'host': host, 'port': port}], 
        http_auth=(user, pwd),
        timeout=60,  # Timeout for each API call (in seconds)
        max_retries=10,  # Maximum number of retries before an exception is propagated
        retry_on_timeout=True  # Retry on timeout?
    )
    return es

def main():
    es = obtainESClient()
    index(es, 'abnb_listings', '../data/abnb_listings.csv')

def index_data(csv_file_path):
	es = obtainESClient()
	index(es, 'abnb_listings', csv_file_path)

if __name__ == "__main__":
    main()
