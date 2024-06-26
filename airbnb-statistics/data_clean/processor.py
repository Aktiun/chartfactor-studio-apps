import pandas as pd
import numpy as np
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
        print(f"Processing batch from {start} to {end}...")
        
        batch = df[start:end]
        batch_results = batch.apply(lambda x: function(*x[input_columns]), axis=1)
        results.extend(batch_results)
        
        # Pause between batches to avoid exceeding API limits
        #time.sleep(1)
        
    df[output_column] = results


def clean_data(is_whole_world=False):
    # Paths to the input and output CSV files
    input_path = '../tmp_joined/joined.csv'
    output_path = '../data/abnb_listings.csv'

    # zipcode file
    zipcode_path = '../data/abnb_zipcode.parquet'

    is_zipcode_file = False
    # Check if zipcode file exists
    try:
        with open(zipcode_path):
            is_zipcode_file = True
    except IOError:
        logger.error(f"File {zipcode_path} not found.")
        print(f"File {zipcode_path} not found.")

    # Read the CSV file
    print(f"Reading joined file from {input_path}")
    df = pd.read_csv(input_path, dtype={'id': str})

    if is_zipcode_file:
        # read zipcode file
        print(f"Reading zipcodes from {zipcode_path}")
        df_zipcode = pd.read_parquet(zipcode_path)
        if 'zipcode' in df_zipcode.columns:
            # If it exists, convert it to string type
            df_zipcode['zipcode'] = df_zipcode['zipcode'].astype(str)
        print(f"Total records in zipcode file: {len(df_zipcode)}")

    df['price'] = df['price'].replace('[\$,]', '', regex=True).astype(float)
    df['number_of_reviews'] = pd.to_numeric(df['number_of_reviews'], errors='coerce').fillna(0).astype(int)
    df['minimum_nights'] = pd.to_numeric(df['minimum_nights'], errors='coerce').fillna(0).astype(int)
    df['minimum_nights_str'] = df['minimum_nights'].apply(lambda x: str(x) if x <= 35 else '+35')
    df['income_ltm'] = df['estimated_occupied_time'] * df['price']

    logger.info(f"Total records: {len(df)}")

    if is_zipcode_file:
        # join dataframes to get zipcode
        df = df.merge(df_zipcode, left_on='id', right_on='id', how='left')
        print(f"Total records after join: {len(df)}")

        df_geocoded = df[df['zipcode'].notnull()]
        print(f"Total records geocoded: {len(df_geocoded)}")

    # Apply geocoding in batches for records with no zipcode
    logger.info("Applying geocoding in batches...")

    # Filter records with no zipcode
    df_no_zipcode = df[(df['zipcode'].isnull()) & (df['is_usa'] == True)] if is_zipcode_file else df

    logger.info(f"Total records to geocode: {len(df_no_zipcode)}")
    print(f"Total records to geocode: {len(df_no_zipcode)}")

    # Apply geocoding in batches for records with no zipcode
    process_in_batches(df_no_zipcode, get_zipcode, ['latitude', 'longitude'], 'zipcode', batch_size=10000)

    if is_zipcode_file:
        # merge df and df_no_zipcode
        df = pd.concat([df, df_no_zipcode])
    else:
        df = df_no_zipcode

    if is_whole_world:
        df['zipcode'] = df['zipcode'].replace('', np.nan)
        df = df[~((df['zipcode'].isnull()) & (df['is_usa'] == True))]
    else:
        # Remove records with no zipcode fro usa indexing
        df = df[df['zipcode'].notnull()]

    # remove duplicates of id
    df = df.drop_duplicates(subset='id')

    # Save the modified DataFrame to a new CSV file
    df.to_csv(output_path, index=False)

    logger.info(f"File successfully saved to {output_path}")
    print(f"File successfully saved to {output_path}")


def get_days_occupied(listing_id):
    # Read the CSV file into a DataFrame
    df = pd.read_csv("../tmp_joined/joined.csv")

    # Filter rows where "available" column is "t"
    available_t_df = df[df["available"] == "t"]

    # Group by "listing_id" and count the records
    count_by_listing_id = available_t_df.groupby("listing_id").size()

    # Print the result
    listingOccupancy = count_by_listing_id.loc[listing_id]

    return listingOccupancy


if __name__ == "__main__":
    clean_data()