import pandas as pd
import time
import logging
from uszipcode import SearchEngine

logger = logging.getLogger("listings_abnb")

# Function to get the zipcode given coordinates
def get_zipcode(latitude, longitude):
    search = SearchEngine()
    result = search.by_coordinates(lat=latitude, lng=longitude, returns=1)
    if result:
        return result[0].zipcode
    else:
        return None

def process_in_batches(df, function, input_columns, output_column, batch_size=100):
    results = []
    for start in range(0, len(df), batch_size):
        end = start + batch_size
        logger.info(f"Processing batch from {start} to {end}...")
        
        batch = df[start:end]
        batch_results = batch.apply(lambda x: function(*x[input_columns]), axis=1)
        results.extend(batch_results)
        
        # Pause between batches to avoid exceeding API limits
        time.sleep(1)
        
    df[output_column] = results

def clean_data():
    # Paths to the input and output CSV files
    input_path = '../tmp_joined/joined.csv'
    output_path = '../data/abnb_listings.csv'

    # Read the CSV file
    df = pd.read_csv(input_path)

    df['price'] = df['price'].replace('[\$,]', '', regex=True).astype(float)
    df['number_of_reviews'] = pd.to_numeric(df['number_of_reviews'], errors='coerce').fillna(0).astype(int)
    df['minimum_nights'] = pd.to_numeric(df['minimum_nights'], errors='coerce').fillna(0).astype(int)

    # Calculate estimated occupied time and income in the last twelve months
    df['estimated_occupied_time'] = df['number_of_reviews'] * df['minimum_nights']
    df['income_ltm'] = df['estimated_occupied_time'] * df['price']

    logger.info(f"Total records: {len(df)}")

    # Apply geocoding in batches
    process_in_batches(df, get_zipcode, ['latitude', 'longitude'], 'zipcode', batch_size=10000)

    # Save the modified DataFrame to a new CSV file
    df.to_csv(output_path, index=False)

    logger.info(f"File successfully saved to {output_path}")

if __name__ == "__main__":
    clean_data()