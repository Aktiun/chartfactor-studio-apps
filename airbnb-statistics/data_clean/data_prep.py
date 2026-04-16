import logging
import os

from dotenv import load_dotenv
load_dotenv()

import scrapper
import unzipper
import joiner
import processor
import indexer
import sys

is_whole_world = False
base_dir = os.environ.get("ABNB_DATA_DIR", "..")

if "all" in sys.argv:
    print("Whole world indexation selected")
    is_whole_world = True
else:
    print("Only USA listings indexation selected")

# Resolve paths relative to base_dir
tmp_downloaded = os.path.join(base_dir, "tmp_downloaded")
tmp_unzipped = os.path.join(base_dir, "tmp_unzipped")
tmp_joined = os.path.join(base_dir, "tmp_joined")
data_dir = os.path.join(base_dir, "data")
output_csv = os.path.join(data_dir, "abnb_listings.csv")
calendars_csv = os.path.join(tmp_joined, "calendars.csv")
joined_csv = os.path.join(tmp_joined, "joined.csv")

# Ensure directories exist
for d in [tmp_downloaded, tmp_unzipped, tmp_joined, data_dir]:
    os.makedirs(d, exist_ok=True)

print(f"Using base directory: {os.path.abspath(base_dir)}")

logger = logging.getLogger('listings_ny')
# Scrape data
logger.info("Scraping data...")
scrapper.get_listings_files(is_whole_world, tmp_downloaded)
logger.info("Listing and calendar files downloaded successfully")

# Unzip files
logger.info("Unzipping files...")
unzipper.process_directory(tmp_downloaded, tmp_unzipped)
logger.info("Files unzipped successfully")

# Join calendar files
logger.info("Joining calendar files...")
joiner.join_calendar_listings(tmp_unzipped, calendars_csv)
logger.info("Calendar files joined successfully")

# Join files
logger.info("Joining listing files...")
joiner.combine_csv_files(tmp_unzipped, joined_csv, calendars_csv)
logger.info("Listing files joined successfully")

# Preprocess data
logger.info("Preprocessing data...")
processor.clean_data(is_whole_world, joined_csv, output_csv, os.path.join(data_dir, "abnb_zipcode.parquet"))
logger.info("Data preprocessed successfully")

# Index data
logger.info("Indexing data...")
indexer.index_data(output_csv)
logger.info("Data indexed successfully")
