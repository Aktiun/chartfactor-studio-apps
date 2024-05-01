import os
import csv
from dotenv import load_dotenv
from datetime import datetime
from elasticsearch.helpers import bulk, streaming_bulk
from elasticsearch import Elasticsearch, RequestsHttpConnection

# 
load_dotenv()

state = {
    'AL' : 'Alabama',
	'AK' : 'Alaska',
	'AZ' : 'Arizona',
	'AR' : 'Arkansas',
	'CA' : 'California',
	'CO' : 'Colorado',
	'CT' : 'Connecticut',
	'DE' : 'Delaware',
	'DC' : 'District of Columbia',
	'FL' : 'Florida',
	'GA' : 'Georgia',
	'HI' : 'Hawaii',
	'ID' : 'Idaho',
	'IL' : 'Illinois',
	'IN' : 'Indiana',
	'IA' : 'Iowa',
	'KS' : 'Kansas',
	'KY' : 'Kentucky',
	'LA' : 'Louisiana',
	'ME' : 'Maine',
	'MD' : 'Maryland',
	'MA' : 'Massachusetts',
	'MI' : 'Michigan',
	'MN' : 'Minnesota',
	'MS' : 'Mississippi',
	'MO' : 'Missouri',
	'MT' : 'Montana',
	'NE' : 'Nebraska',
	'NV' : 'Nevada',
	'NH' : 'New Hampshire',
	'NJ' : 'New Jersey',
	'NM' : 'New Mexico',
	'NY' : 'New York',
	'NC' : 'North Carolina',
	'ND' : 'North Dakota',
	'OH' : 'Ohio',
	'OK' : 'Oklahoma',
	'OR' : 'Oregon',
	'PA' : 'Pennsylvania',
	'RI' : 'Rhode Island',
	'SC' : 'South Carolina',
	'SD' : 'South Dakota',
	'TN' : 'Tennessee',
	'TX' : 'Texas',
	'UT' : 'Utah',
	'VT' : 'Vermont',
	'VA' : 'Virginia',
	'WA' : 'Washington',
	'WV' : 'West Virginia',
	'WI' : 'Wisconsin',
	'WY' : 'Wyoming'
}

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
                    "@timestamp": {
                        "type": "date",
                        "format": "yyyyMM"
                    },
				    "active_listing_count": {
				        "type": "long"
				    },
				    "active_listing_count_mm": {
				        "type": "double"
				    },
				    "active_listing_count_yy": {
				        "type": "double"
				    },
				    "average_listing_price": {
				        "type": "long"
				    },
				    "average_listing_price_mm": {
				        "type": "double"
				    },
				    "average_listing_price_yy": {
				        "type": "double"
				    },
				    "median_days_on_market": {
				        "type": "long"
				    },
				    "median_days_on_market_mm": {
				        "type": "double"
				    },
				    "median_days_on_market_yy": {
				        "type": "double"
				    },
				    "median_listing_price": {
				        "type": "long"
				    },
				    "median_listing_price_mm": {
				        "type": "double"
				    },
				    "median_listing_price_per_square_feet": {
				        "type": "long"
				    },
				    "median_listing_price_per_square_feet_mm": {
				        "type": "double"
				    },
				    "median_listing_price_per_square_feet_yy": {
				        "type": "double"
				    },
				    "median_listing_price_yy": {
				        "type": "double"
				    },
				    "median_square_feet": {
				        "type": "long"
				    },
				    "median_square_feet_mm": {
				        "type": "double"
				    },
				    "median_square_feet_yy": {
				        "type": "double"
				    },
                    "month_date_yyyymm": {
                        "type": "date",
                        "format": "yyyyMM"
                    },
				    "new_listing_count": {
				        "type": "long"
				    },
				    "new_listing_count_mm": {
				        "type": "double"
				    },
				    "new_listing_count_yy": {
				        "type": "double"
				    },
				    "pending_listing_count": {
				        "type": "long"
				    },
				    "pending_listing_count_mm": {
				        "type": "double"
				    },
				    "pending_listing_count_yy": {
				        "type": "double"
				    },
				    "pending_ratio": {
				        "type": "double"
				    },
				    "pending_ratio_mm": {
				        "type": "double"
				    },
				    "pending_ratio_yy": {
				        "type": "double"
				    },
				    "postal_code": {
				        "type": "keyword",
				        "null_value": "null"
				    },
				    "price_increased_count": {
				        "type": "long"
				    },
				    "price_increased_count_mm": {
				        "type": "double"
				    },
				    "price_increased_count_yy": {
				        "type": "double"
				    },
				    "price_reduced_count": {
				        "type": "long"
				    },
				    "price_reduced_count_mm": {
				        "type": "double"
				    },
				    "price_reduced_count_yy": {
				        "type": "double"
				    },
				    "quality_flag": {
				        "type": "long"
				    },
				    "total_listing_count": {
				        "type": "long"
				    },
				    "total_listing_count_mm": {
				        "type": "double"
				    },
				    "total_listing_count_yy": {
				        "type": "double"
				    },
				    "zip_name": {
				        "type": "keyword",
				        "null_value": "null"
				    },
 				    "state_code": {
				        "type": "keyword",
				        "null_value": "null"
				    },
                    "state_name": {
                        "type": "text",
                        "fields": {
                            "keyword": {
                                "type": "keyword",
                                "ignore_above": 256
                            }
                        }
                    }             
				}
        }
    }
    print(f'creating {index_name} ...')
    client.indices.delete(index=index_name, ignore=[400, 404])
    client.indices.create(index=index_name, body=doc)

def obtainStateCode(input):
    arr = input.split(",")
    if len(arr) > 1:
        return arr[1].strip().upper() if arr[1] != '' else None
    else:
        return None

def stateName(zipNameStr):
    zipStateArr = zipNameStr.split(', ')
    return state[zipStateArr[1].upper()]

def fixPostalCode(postalCode):
    result = postalCode
    if len(result)== 4:
        result = "0" + result
    return result

def isValid(r):
    valid = True
    try:
        yearmonth = r[0]
        int(yearmonth)
    except ValueError:
        print(f'First column is not a number as yyyyMM. We need to skip this record. Row is \n {r}')
        valid = False
    try:
        stateName(r[2]) if r[2] != '' else None
    except IndexError:
        print(f'Zip name value does not include state. We need to skip this record. Row is \n {r}')
        valid = False
    return valid

def get_value(csv_file):
    with open(csv_file) as f:
        print("*****")
        reader = csv.reader(f)
        next(reader)  # skip header
        for r in reader:
            if isValid(r):
                doc = {
                    "month_date_yyyymm": r[0],
                    "postal_code": fixPostalCode(r[1]) if r[1] != '' else None,
                    "state_code": obtainStateCode(r[2]) if r[2] != '' else None,
                    "state_name": stateName(r[2]) if r[2] != '' else None,
                    "zip_name": r[2] if r[2] != '' else None,
                    "median_listing_price": r[3],
                    "median_listing_price_mm": r[4],
                    "median_listing_price_yy": r[5],
                    "active_listing_count": r[6],
                    "active_listing_count_mm": r[7],
                    "active_listing_count_yy": r[8],
                    "median_days_on_market": r[9],
                    "median_days_on_market_mm": r[10],
                    "median_days_on_market_yy": r[11],
                    "new_listing_count": r[12],
                    "new_listing_count_mm": r[13],
                    "new_listing_count_yy": r[14],
                    "price_increased_count": r[15],
                    "price_increased_count_mm": r[16],
                    "price_increased_count_yy": r[17],
                    "price_reduced_count": r[18],
                    "price_reduced_count_mm": r[19],
                    "price_reduced_count_yy": r[20],
                    "pending_listing_count": r[21],
                    "pending_listing_count_mm": r[22],
                    "pending_listing_count_yy": r[23],
                    "median_listing_price_per_square_feet": r[24],
                    "median_listing_price_per_square_feet_mm": r[25],
                    "median_listing_price_per_square_feet_yy": r[26],
                    "median_square_feet": r[27],
                    "median_square_feet_mm": r[28],
                    "median_square_feet_yy": r[29],
                    "average_listing_price": r[30],
                    "average_listing_price_mm": r[31],
                    "average_listing_price_yy": r[32],
                    "total_listing_count": r[33],
                    "total_listing_count_mm": r[34],
                    "total_listing_count_yy": r[35],
                    "pending_ratio": r[36],
                    "pending_ratio_mm": r[37],
                    "pending_ratio_yy": r[38],
                    "quality_flag": r[39],
                    "@timestamp": r[0]
                }

                yield doc

def load_records(client, index_name, csv_file):
    print(f'loading records for {index_name}')
    for ok, result in streaming_bulk(
        client,
        get_value(csv_file),
        index=index_name,
        chunk_size=20000  # batch size
    ):
        action, result = result.popitem()
        doc_id = '/%s/commits/%s' % (index_name, result['_id'])
        # process the information from ES whether the document has been
        # successfully indexed
        if not ok:
            print(f'Failed to {action} document {doc_id}: {result}')
    print('Done')

def index(es, index_name, csv_file):
    if not os.path.exists(csv_file):
        print(f'The {csv_file} file was not found')
    else:
        try:
            create_index(es, index_name)
            load_records(es, index_name, csv_file)
            # Set the max_result_window variable
            es.indices.put_settings(index=index_name, body={
                                    "index": {"max_result_window": 25000}})
            return True
        except Exception as e:
            print(f'Error occured.  Error: \n {e}')
            return False

def obtainESClient():
    host = os.getenv("ES_HOST") or 'localhost'
    port = os.getenv("ES_PORT") or 9200
    user = os.getenv("ES_USER") or 'any'
    pwd = os.getenv("ES_PWD") or 'any'
    es = Elasticsearch([{'host': host, 'port': port}], http_auth=(user, pwd))
    return es

def main():
    es = obtainESClient()
    index(es, 'realtor_monthly_inventory_zip_all', '../data/realtors_zip_data.csv')

if __name__ == "__main__":
    main()