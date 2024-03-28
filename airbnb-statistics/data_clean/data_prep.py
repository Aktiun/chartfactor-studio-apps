import logging

import scrapper
import unzipper
import joiner
import processor
import indexer
import sys

is_whole_world = False
if len(sys.argv) > 1 and sys.argv[1] == "all":
    print("Whole world indexation selected")
    is_whole_world = True

else:
    print("Only USA listings indexation selected")

logger = logging.getLogger('listings_ny')
# # Scrape data
logger.info("Scraping data...")
scrapper.get_listings_files(is_whole_world)
logger.info("Listing files downloaded successfully")

# # Unzip files
logger.info("Unzipping files...")
unzipper.process_directory("../tmp_downloaded", "../tmp_unzipped")
logger.info("Files unzipped successfully")

# Join files
logger.info("Joining files...")
joiner.combine_csv_files("../tmp_unzipped", "../tmp_joined/joined.csv")
logger.info("Files joined successfully")

# Preprocess data
logger.info("Preprocessing data...")
processor.clean_data(is_whole_world)
logger.info("Data preprocessed successfully")

# Index data
logger.info("Indexing data...")
indexer.index_data("../data/abnb_listings.csv")
logger.info("Data indexed successfully")
