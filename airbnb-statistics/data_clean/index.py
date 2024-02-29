#
# This script will create the listings_ny index in ES.  It will delete the index
# if it already exists to avoid duplicate entries.
#
import os
import csv
import re
import logging
from logging.handlers import RotatingFileHandler #debug
from elasticsearch.helpers import bulk, streaming_bulk
from elasticsearch import Elasticsearch, RequestsHttpConnection

logger = logging.getLogger('listings_ny')
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
				    "accommodates": {
				        "type": "long"
				    },
				    "amenities": {
				        "type": "keyword",
				        "null_value": "null"
				    },
                    "amenities_categorized": {
                    "type": "keyword"
					},
				    "availability_30": {
				        "type": "long"
				    },
				    "availability_365": {
				        "type": "long"
				    },
				    "availability_60": {
				        "type": "long"
				    },
				    "availability_90": {
				        "type": "long"
				    },
				    "bathrooms": {
				        "type": "double"
				    },
				    "bathrooms_text": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "bedrooms": {
				        "type": "long"
				    },
				    "beds": {
				        "type": "long"
				    },
				    "calculated_host_listings_count": {
				        "type": "long"
				    },
				    "calculated_host_listings_count_entire_homes": {
				        "type": "long"
				    },
				    "calculated_host_listings_count_private_rooms": {
				        "type": "long"
				    },
				    "calculated_host_listings_count_shared_rooms": {
				        "type": "long"
				    },
				    "calendar_last_scraped": {
				        "type": "date",
				    },
				    "description": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "first_review": {
				        "type": "date",
				    },
				    "has_availability": {
				        "type": "boolean",
				    },
				    "host_about": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "host_acceptance_rate": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "host_has_profile_pic": {
				        "type": "boolean",
				    },
				    "host_id": {
				        "type": "long"
				    },
				    "host_identity_verified": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "host_is_superhost": {
				        "type": "boolean",
				    },
				    "host_listings_count": {
				        "type": "long"
				    },
				    "host_location": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "host_name": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "host_neighbourhood": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "host_picture_url": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "host_response_rate": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "host_response_time": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "host_since": {
				        "type": "date",
				    },
				    "host_thumbnail_url": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "host_total_listings_count": {
				        "type": "long"
				    },
				    "host_url": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "host_verifications": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "id": {
				        "type": "keyword",
                        "null_value": "null"
				    },
				    "instant_bookable": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "last_review": {
				        "type": "date",
				    },
				    "last_scraped": {
				        "type": "date",
				    },
				    "latitude": {
				        "type": "double"
				    },
				    "license": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "listing_url": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "longitude": {
				        "type": "double"
				    },
                    "location": {
                        "type": "geo_point"
					},
				    "maximum_maximum_nights": {
				        "type": "long"
				    },
				    "maximum_minimum_nights": {
				        "type": "long"
				    },
				    "maximum_nights": {
				        "type": "long"
				    },
				    "maximum_nights_avg_ntm": {
				        "type": "double"
				    },
				    "minimum_maximum_nights": {
				        "type": "long"
				    },
				    "minimum_minimum_nights": {
				        "type": "long"
				    },
				    "minimum_nights": {
				        "type": "long"
				    },
				    "minimum_nights_avg_ntm": {
				        "type": "double"
				    },
				    "name": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "neighborhood_overview": {
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
				    "number_of_reviews": {
				        "type": "long"
				    },
				    "number_of_reviews_l30d": {
				        "type": "long"
				    },
				    "number_of_reviews_ltm": {
				        "type": "long"
				    },
				    "picture_url": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "price": {
				        "type": "double",
				    },
				    "property_type": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "review_scores_accuracy": {
				        "type": "double"
				    },
				    "review_scores_checkin": {
				        "type": "double"
				    },
				    "review_scores_cleanliness": {
				        "type": "double"
				    },
				    "review_scores_communication": {
				        "type": "double"
				    },
				    "review_scores_location": {
				        "type": "double"
				    },
				    "review_scores_rating": {
				        "type": "double"
				    },
				    "review_scores_value": {
				        "type": "double"
				    },
				    "reviews_per_month": {
				        "type": "double"
				    },
				    "room_type": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "scrape_id": {
				        "type": "date",
				    },
				    "source": {
				        "type": "keyword",
				        "null_value": "null"
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
        next(reader)  # skip header
        for r in reader:
            logger.debug(r)
            if len(r) < 75:  # Expected columns length for listings files IMPORTANT
                logger.error(f"Row with incorrect columns number: {r}")
                continue
            doc = {
                "id": r[0],
				"listing_url": r[1] if r[1] != '' else None,
				"scrape_id": r[2] if r[2] != '' else None,
				"last_scraped": r[3] if r[3] != '' else None,
				"source": r[4] if r[4] != '' else None,
				"name": r[5] if r[5] != '' else None,
				"description": r[6] if r[6] != '' else None,
				"neighborhood_overview": r[7] if r[7] != '' else None,
				"picture_url": r[8] if r[8] != '' else None,
				"host_id": r[9],
				"host_url": r[10] if r[10] != '' else None,
				"host_name": r[11] if r[11] != '' else None,
				"host_since": r[12] if r[12] != '' else None,
				"host_location": r[13] if r[13] != '' else None,
				"host_about": r[14] if r[14] != '' else None,
				"host_response_time": r[15] if r[15] != '' else None,
				"host_response_rate": r[16] if r[16] != '' else None,
				"host_acceptance_rate": r[17] if r[17] != '' else None,
				"host_is_superhost": r[18] == "t",
				"host_thumbnail_url": r[19] if r[19] != '' else None,
				"host_picture_url": r[20] if r[20] != '' else None,
				"host_neighbourhood": r[21] if r[21] != '' else None,
				"host_listings_count": r[22],
				"host_total_listings_count": r[23],
				"host_verifications": r[24] if r[24] != '' else None,
				"host_has_profile_pic": r[25] == "t",
				"host_identity_verified": r[26] if r[26] != '' else None,
				# "neighbourhood": clean_and_normalize_neighborhood(r[27]) if r[27] != '' else None,
				"neighbourhood": r[27] if r[27] != '' else None,
				"neighbourhood_cleansed": r[28] if r[28] != '' else None,
				"neighbourhood_group_cleansed": r[29] if r[29] != '' else None,
				"latitude": r[30],
				"longitude": r[31],
                "location": {
                    "lat": r[30],
                    "lon": r[31]
				},
				"property_type": r[32] if r[32] != '' else None,
				"room_type": r[33] if r[33] != '' else None,
				"accommodates": r[34],
				"bathrooms": r[35],
				"bathrooms_text": r[36] if r[36] != '' else None,
				"bedrooms": r[37],
				"beds": r[38],
				"amenities": r[39] if r[39] != '' else None,
				"price": float(r[40].replace("$", "").replace(",","")) if r[40] != '' else 0.0,
				"minimum_nights": r[41],
				"maximum_nights": r[42],
				"minimum_minimum_nights": r[43],
				"maximum_minimum_nights": r[44],
				"minimum_maximum_nights": r[45],
				"maximum_maximum_nights": r[46],
				"minimum_nights_avg_ntm": r[47],
				"maximum_nights_avg_ntm": r[48],
				"has_availability": r[50] == "t",
				"availability_30": r[51],
				"availability_60": r[52],
				"availability_90": r[53],
				"availability_365": r[54],
				"calendar_last_scraped": r[55] if r[55] != '' else None,
				"number_of_reviews": r[56],
				"number_of_reviews_ltm": r[57],
				"number_of_reviews_l30d": r[58],
				"first_review": r[59] if r[59] != '' else None,
				"last_review": r[60] if r[60] != '' else None,
				"review_scores_rating": r[61],
				"review_scores_accuracy": r[62],
				"review_scores_cleanliness": r[63],
				"review_scores_checkin": r[64],
				"review_scores_communication": r[65],
				"review_scores_location": r[66],
				"review_scores_value": r[67],
				"license": r[68] if r[68] != '' else None,
				"instant_bookable": r[69] if r[69] != '' else None,
				"calculated_host_listings_count": r[70],
				"calculated_host_listings_count_entire_homes": r[71],
				"calculated_host_listings_count_private_rooms": r[72],
				"calculated_host_listings_count_shared_rooms": r[73],
				"reviews_per_month": r[74],
            }
            
			# Categorize amenities
            amenities = r[39].split(",")
            doc["amenities_categorized"] = list(
				map(lambda x: categorize_amenity(x, categories_map), amenities))

            yield doc

def load_records(client, index_name, csv_file):
    logger.info('loading records for %s ...', index_name)
    for ok, result in streaming_bulk(
        client,
        get_value(csv_file),
        index=index_name,
        chunk_size=5000  # batch size
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

def main():
    es = Elasticsearch()
    index(es, 'abnb_listings', '../data/abnb_listings.csv')

if __name__ == "__main__":
    main()